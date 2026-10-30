// Ventanas de proyecto con ruta propia (/proyectos/:slug). Se abren desde la tarjeta con un recorte que crece
// hasta ocupar la pantalla y se cierran de vuelta a ella. Esc cierra; ← y → cambian de proyecto.
import { gsap } from 'gsap';
import { projects, type Lang, type Project, type Shot } from './content';

const INK: Record<string, string> = { sky: 'var(--ocean)', warm: '#2A0E07', 'ace-field': '#FFFFFF', 'kora-field': 'var(--kora-text)', 'cloud-field': 'var(--cloud-ink)', 'hg-field': '#FFFFFF' };
// Color sólido de cada campo (los hay en degradado) y su acento, para botones y detalles con contraste.
const BASE: Record<string, string> = { sky: 'var(--sky)', 'ace-field': 'var(--ace)', 'kora-field': 'var(--kora)', 'cloud-field': 'var(--cloud)', 'hg-field': 'var(--hg)' };
const ACCENT: Record<string, string> = { sky: 'var(--cold)', 'ace-field': 'var(--ace-red)', 'kora-field': 'var(--kora-pink)', 'cloud-field': 'var(--cloud-blue)', 'hg-field': 'var(--hg-green)' };
const ui = {
  next: { es: 'Siguiente proyecto', en: 'Next project' },
  stack: { es: 'Tecnologías', en: 'Technologies' },
  gallery: { es: 'Capturas', en: 'Screenshots' },
  how: { es: 'Cómo está hecho', en: 'How it’s built' },
  real: { es: 'Real', en: 'Real' },
  inGame: { es: 'En el juego', en: 'In the game' },
  title: { es: '— Fernando Montelongo', en: '— Fernando Montelongo' },
};

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
const route = (slug: string) => `/proyectos/${slug}/`;
const slugFrom = (path: string) => path.match(/^\/proyectos\/([\w-]+)\/?$/)?.[1] ?? null;

export class Windows {
  private el = document.getElementById('win')!;
  private sheet = this.el.querySelector<HTMLElement>('[data-win-sheet]')!;
  private scroller = this.el.querySelector<HTMLElement>('[data-win-scroll]')!;
  private page = this.el.querySelector<HTMLElement>('[data-win-page]')!;
  private current: Project | null = null;
  private origin: Element | null = null;
  private lastFocus: HTMLElement | null = null;
  private pushed = false;
  private baseTitle = document.title;
  private io?: IntersectionObserver;

  constructor(private lang: () => Lang, private pause: (on: boolean) => void, private motion: () => boolean) {
    document.addEventListener('click', (e) => {
      const a = (e.target as Element).closest<HTMLAnchorElement>('[data-open]');
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      this.open(a.dataset.open!, a.closest('[data-clip], .kora__intro') ?? a);
    });
    this.el.querySelector('[data-win-close]')!.addEventListener('click', () => this.close());
    this.el.addEventListener('click', (e) => {
      const a = (e.target as Element).closest<HTMLAnchorElement>('[data-win-go]');
      if (!a) return;
      e.preventDefault();
      this.step(a.dataset.winGo === 'prev' ? -1 : 1);
    });
    for (const dir of ['prev', 'next'] as const) {
      this.el.querySelector(`[data-win-${dir}]`)!.setAttribute('data-win-go', dir);
    }
    addEventListener('popstate', () => this.sync(true));
    addEventListener('keydown', (e) => {
      if (this.el.hidden) return;
      if (e.key === 'Escape') this.close();
      else if (e.key === 'ArrowRight' && !(e.target as Element).closest('input, textarea')) this.step(1);
      else if (e.key === 'ArrowLeft' && !(e.target as Element).closest('input, textarea')) this.step(-1);
      else if (e.key === 'Tab') this.trap(e);
    });
    this.sync(false);
  }

  get isOpen() { return !this.el.hidden; }

  /** Vuelve a pintar la ventana abierta en el idioma actual. */
  relabel() { if (this.current) this.render(this.current); }

  private sync(animate: boolean) {
    const slug = slugFrom(location.pathname);
    const p = projects.find((x) => x.slug === slug);
    if (p) this.show(p, null, animate);
    else if (this.isOpen) this.hide(animate);
  }

  open(slug: string, from: Element | null) {
    const p = projects.find((x) => x.slug === slug);
    if (!p) return;
    history.pushState({ win: slug }, '', route(slug));
    this.pushed = true;
    this.show(p, from, true);
  }

  close() {
    if (this.pushed) { this.pushed = false; history.back(); return; }
    history.replaceState(null, '', '/');
    this.hide(true);
  }

  private step(dir: 1 | -1) {
    if (!this.current) return;
    const i = projects.indexOf(this.current);
    const p = projects[(i + dir + projects.length) % projects.length];
    history.replaceState({ win: p.slug }, '', route(p.slug));
    this.origin = document.querySelector(`[data-open="${p.slug}"]`)?.closest('[data-clip], .kora__intro') ?? null;
    this.show(p, null, true);
  }

  private show(p: Project, from: Element | null, animate: boolean) {
    const wasOpen = this.isOpen;
    const switching = wasOpen && this.current !== p;
    this.current = p;
    if (from) this.origin = from;
    else if (!wasOpen) this.origin = document.querySelector(`[data-open="${p.slug}"]`)?.closest('[data-clip], .kora__intro') ?? null;
    this.render(p);
    document.title = `${p.name} ${ui.title[this.lang()]}`;
    const anim = animate && this.motion();

    if (!wasOpen) {
      this.lastFocus = document.activeElement as HTMLElement;
      this.el.hidden = false;
      document.documentElement.classList.add('win-open');
      this.pause(true);
      if (anim) {
        gsap.fromTo(this.sheet, { clipPath: this.clipFor(this.origin) }, {
          clipPath: 'inset(0px 0px 0px 0px round 0px)', duration: 0.95, ease: 'expo.inOut', clearProps: 'clipPath',
        });
        gsap.from(this.page.querySelectorAll('[data-in]'), { y: 48, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.07, delay: 0.5 });
      }
    } else if (switching && anim) {
      gsap.fromTo(this.page, { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' });
    }
    this.scroller.scrollTop = 0;
    this.scroller.focus({ preventScroll: true });
  }

  private hide(animate: boolean) {
    const done = () => {
      this.el.hidden = true;
      document.documentElement.classList.remove('win-open');
      this.pause(false);
      this.current = null;
      document.title = this.baseTitle;
      this.lastFocus?.focus({ preventScroll: true });
    };
    if (!(animate && this.motion())) return done();
    gsap.to(this.sheet, { clipPath: this.clipFor(this.origin, true), duration: 0.8, ease: 'expo.inOut', onComplete: () => { gsap.set(this.sheet, { clearProps: 'clipPath' }); done(); } });
  }

  /** Recorte equivalente a la caja de la tarjeta de origen, o una franja abajo si no hay tarjeta visible. */
  private clipFor(el: Element | null, closing = false) {
    const r = el?.getBoundingClientRect();
    const vw = innerWidth, vh = innerHeight;
    if (r && r.bottom > 0 && r.top < vh && r.width > 0) {
      const rad = parseFloat(getComputedStyle(el!).borderRadius) || 28;
      return `inset(${Math.max(0, r.top)}px ${Math.max(0, vw - r.right)}px ${Math.max(0, vh - r.bottom)}px ${Math.max(0, r.left)}px round ${rad}px)`;
    }
    return closing ? `inset(${vh}px 0px 0px 0px round 0px)` : `inset(${vh * 0.6}px 6% 0px 6% round 28px)`;
  }

  private trap(e: KeyboardEvent) {
    const f = [...this.el.querySelectorAll<HTMLElement>('a[href], button, [tabindex="-1"]')].filter((x) => x.offsetParent !== null || x === this.scroller);
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  private render(p: Project) {
    const L = this.lang();
    const i = projects.indexOf(p);
    const next = projects[(i + 1) % projects.length];
    const prev = projects[(i - 1 + projects.length) % projects.length];
    this.el.querySelector('[data-win-slug]')!.textContent = p.slug;
    this.el.querySelector<HTMLAnchorElement>('[data-win-prev]')!.href = route(prev.slug);
    this.el.querySelector<HTMLAnchorElement>('[data-win-next]')!.href = route(next.slug);
    const field = (f: string) => `--field: var(--${f}); --field-ink: ${INK[f]}; --field-base: ${BASE[f]}; --field-accent: ${ACCENT[f]}`;

    // Cada imagen va en el soporte de lo que es: pantalla (navegador o juego), teléfono, vista previa o documento.
    const img = (s: Shot, sizes: string, eager = false) =>
      `<img src="${s.src}"${s.srcset ? ` srcset="${s.srcset}" sizes="${sizes}"` : ''} width="${s.w}" height="${s.h}" alt="${esc(s.alt[L])}"${eager ? '' : ' loading="lazy"'} decoding="async">`;
    const kind = (s: Shot) => (s.sq ? 'sq' : s.h / s.w > 1.6 ? 'phone' : s.w / s.h > 1.3 ? 'desk' : 'doc');
    const desks = p.shots.filter((s) => kind(s) === 'desk');
    const phones = p.shots.filter((s) => kind(s) === 'phone');
    const squares = p.shots.filter((s) => kind(s) === 'sq');
    const screen = (s: Shot, sizes: string, eager = false) => `
      <div class="cs-screen" data-tilt="4">
        ${p.game ? '' : `<div class="cs-screen__bar" aria-hidden="true"><i></i><i></i><i></i><span>${esc(p.site ?? p.name)}</span></div>`}
        ${img(s, sizes, eager)}
      </div>`;
    const phone = (s: Shot, sizes = '220px') => `<div class="cs-phone" data-tilt="7">${img(s, sizes)}</div>`;
    const square = (s: Shot) => `<div class="cs-square" data-tilt="6">${img(s, '(max-width: 900px) 45vw, 280px')}</div>`;

    // Escena de la cabecera: la mejor composición posible con el material del proyecto.
    const used = new Set<Shot>();
    const take = (s: Shot | undefined) => { if (s) used.add(s); return s; };
    let stage = '';
    if (desks.length && phones.length) {
      const d = take(desks[0])!, ph = take(phones[1] ?? phones[0])!;
      stage = `<div class="cs-stage cs-stage--duo">${screen(d, '(max-width: 900px) 90vw, 920px', true)}${phone(ph, '240px')}</div>`;
    } else if (desks.length > 1) {
      const a = take(desks[0])!, b = take(desks[1])!;
      stage = `<div class="cs-stage cs-stage--pair"><div class="cs-stage__main">${screen(a, '(max-width: 900px) 90vw, 920px', true)}</div><div class="cs-stage__side">${screen(b, '(max-width: 900px) 50vw, 420px')}</div></div>`;
    } else if (phones.length >= 3) {
      const trio = [take(phones[1])!, take(phones[2])!, take(phones[3] ?? phones[0])!];
      stage = `<div class="cs-stage cs-stage--trio">${trio.map((s) => phone(s, '260px')).join('')}</div>`;
    } else if (squares.length >= 4) {
      const four = squares.slice(0, 4).map((s) => take(s)!);
      stage = `<div class="cs-stage cs-stage--mosaic">${four.map(square).join('')}</div>`;
    }

    // Galería compacta en mosaico con lo que no ha salido en la escena (o todo, si es una rejilla de vistas previas).
    const rest = p.shots.filter((s) => !used.has(s) || kind(s) === 'sq');
    const tile = (s: Shot) => {
      const k = kind(s);
      const body = k === 'desk' ? screen(s, '(max-width: 900px) 90vw, 440px') : k === 'phone' ? phone(s) : k === 'sq' ? square(s) : `<div class="cs-doc" data-tilt="4">${img(s, '(max-width: 900px) 90vw, 440px')}</div>`;
      return `<figure class="cs-tile cs-tile--${k}" data-reveal>${body}<figcaption>${esc((s.cap ?? s.alt)[L])}</figcaption></figure>`;
    };
    const gallery = rest.length
      ? `<section class="cs-block" aria-label="${ui.gallery[L]}"><h3 class="cs-h">${ui.gallery[L]}</h3><div class="cs-gallery">${rest.map(tile).join('')}</div></section>`
      : '';

    const features = `<section class="cs-block"><h3 class="cs-h">${ui.how[L]}</h3><div class="cs-features">${p.sections.map((s) => `<article class="cs-feature" data-reveal><h4>${esc(s.title[L])}</h4><p>${esc(s.body[L])}</p></article>`).join('')}</div></section>`;
    const compare = p.compare
      ? `<section class="cs-block"><h3 class="cs-h">${esc(p.compare.title[L])}</h3><div class="cs-compare">${p.compare.pairs.map((c) => `
          <figure class="cs-pair" data-reveal>
            <div class="cs-pair__imgs">
              <div class="cs-pair__img"><img src="/img/hg-cmp-real-${c.name}-960.webp" srcset="/img/hg-cmp-real-${c.name}-600.webp 600w, /img/hg-cmp-real-${c.name}-960.webp 960w" sizes="(max-width: 900px) 46vw, 420px" width="960" height="540" alt="${ui.real[L]}: ${esc(c.cap[L])}" loading="lazy"><span>${ui.real[L]}</span></div>
              <div class="cs-pair__img"><img src="/img/hg-cmp-juego-${c.name}-960.webp" srcset="/img/hg-cmp-juego-${c.name}-600.webp 600w, /img/hg-cmp-juego-${c.name}-960.webp 960w" sizes="(max-width: 900px) 46vw, 420px" width="960" height="540" alt="${ui.inGame[L]}: ${esc(c.cap[L])}" loading="lazy"><span>${ui.inGame[L]}</span></div>
            </div>
            <figcaption>${esc(c.cap[L])}</figcaption>
          </figure>`).join('')}</div></section>`
      : '';
    const list = p.list
      ? `<section class="cs-block"><h3 class="cs-h">${esc(p.list.title[L])}</h3><ul class="cs-list" data-reveal>${p.list.items.map((x) => `<li>${esc(x[L])}</li>`).join('')}</ul></section>`
      : '';
    const links = p.links.map((l, k) => `<a class="btn ${k ? 'btn--line cs-btn-line' : 'cs-btn'}" href="${l.href}" target="_blank" rel="noopener"><span>${esc(l.label[L])}</span><svg aria-hidden="true"><use href="#i-out"/></svg></a>`).join('');
    const nextShot = next.shots[0];
    // Logotipo real con su punto (KORA): el punto es parte de la marca, no del SVG.
    const logo = (q: Project, cls: string) => `<span class="kora-mark ${cls}"><img src="${q.logo}" alt="${esc(q.name)}" width="470" height="139"><i class="kora-dot" aria-hidden="true"></i></span>`;

    this.page.innerHTML = `
      <div class="cs" style="${field(p.field)}">
        <header class="cs-hero${stage ? '' : ' cs-hero--plain'}">
          <div class="cs-hero__in wrap">
            <div class="cs-hero__id">
              <h2 class="cs-name" id="win-title" data-in>${p.logo ? logo(p, 'cs-mark') : esc(p.name)}</h2>
              <p class="cs-kind" data-in>${esc(p.kind[L])}</p>
              <p class="cs-claim" data-in>${esc(p.claim[L])}</p>
              <div class="cs-cta" data-in>${links}</div>
            </div>
            <dl class="cs-facts" data-in>${p.facts.map(([k, v]) => `<div><dt>${esc(k[L])}</dt><dd>${esc(v[L])}</dd></div>`).join('')}</dl>
          </div>
          ${stage ? `<div class="cs-stage-wrap wrap" data-in>${stage}</div>` : ''}
        </header>
        <div class="cs-body wrap">
          <aside class="cs-aside">
            <p class="cs-intro">${esc(p.intro[L])}</p>
            ${p.stack.length ? `<div class="cs-aside__block"><h3 class="cs-h">${ui.stack[L]}</h3><ul class="cs-chips">${p.stack.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>` : ''}
            ${p.note ? `<p class="cs-note">${esc(p.note[L])}</p>` : ''}
          </aside>
          <div class="cs-main">
            ${features}
            ${compare}
            ${gallery}
            ${list}
          </div>
        </div>
        <a class="cs-next" href="${route(next.slug)}" data-win-go="next" style="${field(next.field)}">
          <span class="cs-next__text"><small>${ui.next[L]}</small><b>${next.logo ? logo(next, 'cs-mark cs-mark--next') : esc(next.name)}<svg aria-hidden="true"><use href="#i-arrow"/></svg></b><em>${esc(next.claim[L])}</em></span>
          ${nextShot ? `<span class="cs-next__thumb" aria-hidden="true"><img src="${nextShot.src}" alt="" width="${nextShot.w}" height="${nextShot.h}" loading="lazy"></span>` : ''}
        </a>
      </div>`;
    this.reveal();
  }

  private reveal() {
    this.io?.disconnect();
    const items = this.page.querySelectorAll('[data-reveal]');
    if (!this.motion()) { items.forEach((x) => x.classList.add('is-in')); return; }
    this.io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); this.io!.unobserve(e.target); }
    }, { root: this.scroller, rootMargin: '0px 0px -8% 0px' });
    items.forEach((x) => this.io!.observe(x));
  }
}

// Ventanas de proyecto con ruta propia (/proyectos/:slug). Se abren desde la tarjeta con un recorte que crece
// hasta ocupar la pantalla y se cierran de vuelta a ella. Esc cierra; ← y → cambian de proyecto.
import { gsap } from 'gsap';
import { projects, type Lang, type Project, type Shot } from './content';

const INK: Record<string, string> = { sky: 'var(--ocean)', warm: '#2A0E07', 'ace-field': '#FFFFFF', kora: 'var(--kora-text)', 'cloud-field': 'var(--cloud-ink)' };
const ui = {
  next: { es: 'Siguiente proyecto', en: 'Next project' },
  stack: { es: 'Tecnologías', en: 'Technologies' },
  gallery: { es: 'Capturas', en: 'Screenshots' },
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
    const field = (f: string) => `--field: var(--${f}); --field-ink: ${INK[f]}`;
    const deco = p.shots.length
      ? '<div class="wp__deco-rings" aria-hidden="true"></div>'
      : '<div class="wp__deco-rings" aria-hidden="true"></div><div class="wp__deco isle" aria-hidden="true"></div>';

    // Galería: cada imagen se presenta según lo que es. Escritorio en marco de navegador, móvil en marco de
    // teléfono sobre una banda del color del proyecto, vistas previas en cuadrícula y documentos en tarjeta.
    const img = (s: Shot, sizes: string, eager = false) =>
      `<img src="${s.src}"${s.srcset ? ` srcset="${s.srcset}" sizes="${sizes}"` : ''} width="${s.w}" height="${s.h}" alt="${esc(s.alt[L])}"${eager ? '' : ' loading="lazy"'} decoding="async">`;
    const cap = (s: Shot) => `<figcaption>${esc((s.cap ?? s.alt)[L])}</figcaption>`;
    const kind = (s: Shot) => (s.sq ? 'sq' : s.h / s.w > 1.6 ? 'phone' : s.w / s.h > 1.3 ? 'desk' : 'doc');
    const desks = p.shots.filter((s) => kind(s) === 'desk');
    const phones = p.shots.filter((s) => kind(s) === 'phone');
    const squares = p.shots.filter((s) => kind(s) === 'sq');
    const docs = p.shots.filter((s) => kind(s) === 'doc');
    const browser = (s: Shot, lead: boolean) => `
      <figure class="wg-browser${lead ? ' wg-browser--lead' : ''}" data-reveal>
        <div class="wg-browser__frame" data-tilt="4">
          <div class="wg-browser__bar" aria-hidden="true"><i></i><i></i><i></i><span>${esc(p.site ?? p.name)}</span></div>
          ${img(s, lead ? '(max-width: 900px) 92vw, 1200px' : '(max-width: 900px) 92vw, 640px', lead)}
        </div>
        ${cap(s)}
      </figure>`;
    // Un único móvil no llena una banda: se empareja con la segunda captura de escritorio.
    const duo = phones.length === 1 && desks.length > 1;
    const phone = (s: Shot) => `<figure class="wg-phone" data-reveal><div class="wg-phone__frame" data-tilt="8">${img(s, '240px')}</div>${cap(s)}</figure>`;
    const lead = desks[0] ? `<div class="wg-lead wrap">${browser(desks[0], true)}</div>` : '';
    const band = phones.length || squares.length
      ? `<section class="wg-band" style="${field(p.field)}" aria-label="${ui.gallery[L]}">
          ${duo ? `<div class="wg-duo wrap">${browser(desks[1], false)}${phone(phones[0])}</div>` : phones.length ? `<div class="wg-phones">${phones.map(phone).join('')}</div>` : ''}
          ${squares.length ? `<div class="wg-squares wrap">${squares.map((s) => `<figure class="wg-square" data-reveal><div class="wg-square__frame" data-tilt="7">${img(s, '(max-width: 900px) 45vw, 320px')}</div>${cap(s)}</figure>`).join('')}</div>` : ''}
        </section>`
      : '';
    const restDesks = desks.slice(duo ? 2 : 1);
    const rest = restDesks.length || docs.length
      ? `<div class="wg-rest wrap">${restDesks.map((s) => browser(s, false)).join('')}${docs.map((s) => `<figure class="wg-doc" data-reveal><div class="wg-doc__frame" data-tilt="4">${img(s, '(max-width: 900px) 92vw, 640px')}</div>${cap(s)}</figure>`).join('')}</div>`
      : '';
    const rows = p.sections.map((s) => `<div class="wp__row" data-reveal><h3>${esc(s.title[L])}</h3><p>${esc(s.body[L])}</p></div>`).join('');
    const list = p.list ? `<div class="wp__row" data-reveal><h3>${esc(p.list.title[L])}</h3><ul class="wp__list">${p.list.items.map((x) => `<li>${esc(x[L])}</li>`).join('')}</ul></div>` : '';
    const stack = p.stack.length ? `<div class="wp__row" data-reveal><h3>${ui.stack[L]}</h3><ul class="chips chips--solid">${p.stack.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>` : '';
    const links = p.links.map((l, k) => `<a class="btn ${k ? 'btn--line' : 'btn--ink'}" href="${l.href}" target="_blank" rel="noopener"><span>${esc(l.label[L])}</span><svg aria-hidden="true"><use href="#i-out"/></svg></a>`).join('');

    this.page.innerHTML = `
      <header class="wp__head" style="${field(p.field)}">
        ${deco}
        <div class="wp__head-in wrap">
          <h2 class="wp__name" id="win-title" data-in>${p.logo ? `<img class="wp__logo" src="${p.logo}" alt="${esc(p.name)}" width="470" height="139">` : esc(p.name)}</h2>
          <p class="wp__kind" data-in>${esc(p.kind[L])}</p>
          <p class="wp__claim" data-in>${esc(p.claim[L])}</p>
          <dl class="wp__facts" data-in>${p.facts.map(([k, v]) => `<div><dt>${esc(k[L])}</dt><dd>${esc(v[L])}</dd></div>`).join('')}</dl>
        </div>
      </header>
      <div class="wrap">
        <p class="wp__intro" data-reveal>${esc(p.intro[L])}</p>
      </div>
      ${lead}
      ${band}
      ${rest}
      <div class="wrap">
        <div class="wp__rows">${rows}${list}${stack}</div>
        <div class="wp__end" data-reveal>${links}${p.note ? `<p class="wp__note">${esc(p.note[L])}</p>` : ''}</div>
      </div>
      <a class="wp__next" href="${route(next.slug)}" data-win-go="next" style="${field(next.field)}">
        <b>${esc(next.name)}<svg aria-hidden="true"><use href="#i-arrow"/></svg></b>
        <small>${ui.next[L]}</small>
      </a>`;
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

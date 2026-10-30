import './styles.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { Field, type Centre } from './field';
import { Windows } from './windows';
import { applyLang, initLang } from './i18n';
import type { Lang } from './content';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, DrawSVGPlugin);

const root = document.documentElement;
const $ = <T extends Element = HTMLElement>(s: string, el: ParentNode = document) => el.querySelector<T>(s)!;
const $$ = <T extends Element = HTMLElement>(s: string, el: ParentNode = document) => [...el.querySelectorAll<T>(s)];
const motion = matchMedia('(prefers-reduced-motion: no-preference)').matches;
const finePointer = matchMedia('(pointer: fine) and (hover: hover)').matches;
const wide = () => innerWidth >= 900;
const EASE = 'expo.out';
// Parámetros de diagnóstico, solo en desarrollo: ?nosmooth y ?nofield.
const dev = (k: string) => import.meta.env.DEV && new URLSearchParams(location.search).has(k);

/* ── Idioma ─────────────────────────────────────────────── */
let lang: Lang = initLang();
let windows: Windows;
applyLang(lang);
$$('[data-lang]').forEach((b) => b.addEventListener('click', () => {
  lang = b.dataset.lang as Lang;
  applyLang(lang);
  windows.relabel();
  setupWords();
  ScrollTrigger.refresh();
}));

/* ── Desplazamiento suave (solo escritorio con ratón y movimiento) ─ */
const smoother = motion && finePointer && !dev('nosmooth')
  ? ScrollSmoother.create({ wrapper: '#smooth-wrapper', content: '#smooth-content', smooth: 1.05, effects: true, smoothTouch: false })
  : null;
windows = new Windows(() => lang, (on) => pause(on), () => motion);
function pause(on: boolean) {
  if (smoother) smoother.paused(on);
  root.style.overflow = on ? 'hidden' : '';
}
function scrollToTarget(target: Element) {
  if (smoother) smoother.scrollTo(target, true, 'top top');
  else target.scrollIntoView({ behavior: motion ? 'smooth' : 'auto' });
}
document.addEventListener('click', (e) => {
  const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
  if (!a) return;
  const t = document.querySelector(a.getAttribute('href')!);
  if (!t) return;
  e.preventDefault();
  closeMenu();
  scrollToTarget(t);
  if (t instanceof HTMLElement) { t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); }
});

/* ── Barra: leyenda de la carta ────────────────────────── */
const bar = $('[data-bar]');
const menuBtn = $('.bar__menu');
const menu = $('#menu');
function closeMenu() { menu.classList.remove('is-open'); menuBtn.setAttribute('aria-expanded', 'false'); }
menuBtn.addEventListener('click', () => {
  const open = !menu.classList.contains('is-open');
  menu.classList.toggle('is-open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
});
// La barra siempre está visible; solo gana fondo al dejar el inicio y se oscurece sobre las secciones oscuras.
ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (self) => bar.classList.toggle('is-solid', self.scroll() > 40) });
for (const [sel, cls] of [['.kora', 'is-dark'], ['.kora', 'is-kora'], ['.contact', 'is-dark']]) {
  ScrollTrigger.create({ trigger: sel, start: `top ${68 / 2}px`, end: `bottom ${68 / 2}px`, toggleClass: { targets: bar, className: cls }, refreshPriority: -1 });
}

// Enlace de la sección en curso.
const navLinks = $$<HTMLAnchorElement>('.bar__nav > a');
const sections: [string, string?][] = [
  ['#inicio'], ['#parte'], ['#proyectos', '#proyectos'], ['#kora', '#kora'],
  ['.work--b', '#proyectos'], ['#stack'], ['#trayectoria', '#trayectoria'], ['#contacto', '#contacto'],
];
for (const [sel, nav] of sections) {
  ScrollTrigger.create({
    trigger: sel, start: 'top 55%', end: 'bottom 55%', refreshPriority: -1,
    onToggle: (self) => {
      if (self.isActive) navLinks.forEach((a) => a.classList.toggle('is-current', a.getAttribute('href') === nav));
    },
  });
}

/* ── Campos de presión ─────────────────────────────────── */
const narrow = innerWidth < 760;
const heroCentres: Centre[] = [
  narrow ? { x: 0.36, y: 0.15, hpa: 15, r: 0.5 } : { x: 0.42, y: 0.24, hpa: 15, r: 0.55 }, // A: anticiclón
  narrow ? { x: 0.13, y: 0.36, hpa: -14, r: 0.3 } : { x: 0.92, y: 0.86, hpa: -14, r: 0.36 }, // B: borrasca
  { x: 0.06, y: 0.92, hpa: 8, r: 0.5 },
  { x: 0.74, y: 0.06, hpa: -6, r: 0.3 },
  { x: 1.25, y: 0.48, hpa: 7, r: 0.6 },
  { x: 0.22, y: 0.52, hpa: -5, r: 0.28 },
];
const heroField = dev('nofield') ? null : Field.create($<HTMLCanvasElement>('[data-field="light"]'), {
  // Carta clara en la presión media; la calima solo en el núcleo del anticiclón.
  palette: ['#C3DDED', '#D9EDE8', '#EEF2F0', '#EEF2F0', '#F5DFAF'],
  line: [16 / 255, 34 / 255, 44 / 255, 0.2],
  centres: heroCentres,
});
const high = $('.hero__high'), low = $('.hero__low');
if (heroField) {
  // Las letras A y B siguen a sus centros: la leyenda queda quieta, el campo se mueve.
  // Tamaños medidos fuera del bucle: leerlos tras escribir transformaciones forzaría un layout por frame.
  const size = new Map<HTMLElement, [number, number]>();
  const measure = () => [high, low].forEach((el) => size.set(el, [el.offsetWidth, el.offsetHeight]));
  measure();
  addEventListener('resize', measure);
  document.fonts.ready.then(measure);
  const place = (el: HTMLElement, c: Centre, w: number, h: number) => {
    const [ew, eh] = size.get(el)!;
    el.style.transform = `translate(${c.x * w - ew / 2}px, ${c.y * h - eh / 2}px)`;
  };
  heroField.onFrame = (cs, w, h) => { place(high, cs[0], w, h); place(low, cs[1], w, h); };
  if (!motion) heroField.still();
} else {
  high.style.transform = 'translate(38vw, 18vh)';
  low.style.transform = 'translate(86vw, 80vh)';
}
const darkField = dev('nofield') ? null : Field.create($<HTMLCanvasElement>('[data-field="dark"]'), {
  palette: ['#0A2433', '#0D3043', '#103A4F', '#15465B', '#1C566A'],
  line: [191 / 255, 227 / 255, 234 / 255, 0.17],
  centres: [
    { x: 0.8, y: 0.2, hpa: 15, r: 0.5 }, { x: 0.15, y: 0.85, hpa: -10, r: 0.4 }, { x: 1.3, y: 0.9, hpa: 8, r: 0.6 },
    { x: 0.45, y: 0.5, hpa: -4, r: 0.3 }, { x: -0.2, y: 0.1, hpa: 6, r: 0.5 }, { x: 0.6, y: 1.1, hpa: 5, r: 0.4 },
  ],
});
if (darkField && !motion) darkField.still();

/* ── Frentes dibujados ─────────────────────────────────── */
function buildFront(svg: SVGSVGElement) {
  const w = svg.clientWidth || innerWidth, h = 56, mid = 30;
  const warm = svg.dataset.front === 'warm';
  const y = (x: number) => mid + Math.sin((x / w) * Math.PI * 2.2 + 0.6) * 9;
  let d = `M0 ${y(0).toFixed(1)}`;
  for (let x = 8; x <= w; x += 8) d += ` L${x} ${y(x).toFixed(1)}`;
  const marks: string[] = [];
  const gap = w < 700 ? 54 : 74;
  for (let x = gap * 0.6; x < w - 20; x += gap) {
    const a = Math.atan2(y(x + 1) - y(x - 1), 2) * (180 / Math.PI);
    const shape = warm ? 'M-10 0 A10 10 0 0 1 10 0 Z' : 'M-10 0 L0 -15 L10 0 Z';
    marks.push(`<path class="f-mark" d="${shape}" transform="translate(${x.toFixed(1)} ${y(x).toFixed(1)}) rotate(${a.toFixed(1)})"/>`);
  }
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.innerHTML = `<path class="f-line" d="${d}"/>${marks.join('')}`;
}
const fronts = $$<SVGSVGElement>('[data-front]');
fronts.forEach(buildFront);

/* ── Utilidades de texto ───────────────────────────────── */
const splits: SplitText[] = [];
function splitChars(el: HTMLElement, mask = true) {
  const s = SplitText.create(el, mask ? { type: 'lines,words,chars', mask: 'lines', linesClass: 'ln', charsClass: 'ch' } : { type: 'words,chars', charsClass: 'ch' });
  splits.push(s);
  return s.chars as HTMLElement[];
}

let wordsST: ScrollTrigger[] = [];
let wordSplits: SplitText[] = [];
function setupWords() {
  wordsST.forEach((t) => t.kill());
  wordSplits.forEach((s) => s.revert());
  wordsST = []; wordSplits = [];
  if (!motion) return;
  for (const el of $$('[data-words]')) {
    const s = SplitText.create(el, { type: 'words', wordsClass: 'w' });
    wordSplits.push(s);
    // El texto se lee siempre: cada palabra pasa de un gris legible (AA) a tinta mientras se avanza.
    const tw = gsap.fromTo(s.words, { color: '#5A6C77' }, {
      color: '#10222C', ease: 'none', stagger: 0.12,
      scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 52%', scrub: true },
    });
    wordsST.push(tw.scrollTrigger!);
  }
}

/* ── Coreografía ───────────────────────────────────────── */
if (motion) {
  // Entrada: la carta aparece, las isobaras se asientan y el nombre sube línea a línea.
  const lines = $$('.hero__line');
  const chars = lines.flatMap((l) => splitChars(l, false));
  gsap.set(chars, { yPercent: 115 });
  gsap.set('[data-intro]', { opacity: 0 });
  root.classList.remove('intro');
  const intro = gsap.timeline({ defaults: { ease: EASE }, delay: 0.1 });
  intro
    .from('.hero .field', { opacity: 0, duration: 1.6, ease: 'power2.out' }, 0)
    .to(chars, { yPercent: 0, duration: 1.25, stagger: 0.028 }, 0.15)
    .fromTo('.hero__island', { opacity: 0, scale: 0.94, rotate: -4 }, { opacity: 1, scale: 1, rotate: 0, duration: 1.6 }, 0.25)
    .fromTo('.hero__intro', { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 1.1 }, 0.7)
    .fromTo([high, low], { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 1, stagger: 0.15, ease: 'back.out(2)' }, 0.9)
    .fromTo('.hero__barb', { opacity: 0, rotate: '-=40' }, { opacity: 0.55, rotate: '+=40', duration: 1.4, stagger: 0.12 }, 1);

  // Al salir del hero, el frente pasa: el campo se desplaza, el nombre se queda atrás y la isla gira.
  gsap.timeline({
    scrollTrigger: {
      trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true,
      onUpdate: (self) => { if (heroField) heroField.shift = self.progress; },
    },
  })
    .to('.hero__name', { yPercent: -38, ease: 'none' }, 0)
    .to('.hero__intro', { y: -60, opacity: 0, ease: 'none' }, 0)
    .to('.hero__island', { y: '-12vh', rotate: -6, scale: 0.92, ease: 'none' }, 0);

  // Frentes: la línea se dibuja con el scroll y los triángulos o semicírculos brotan a su paso.
  ScrollTrigger.addEventListener('refreshInit', () => fronts.forEach(buildFront));
  fronts.forEach((svg) => {
    ScrollTrigger.create({
      trigger: svg, start: 'top 92%', end: 'top 30%', scrub: 0.6,
      onUpdate: (self) => {
        const line = svg.querySelector('.f-line');
        if (line) gsap.set(line, { drawSVG: `0% ${self.progress * 100}%` });
        const marks = svg.querySelectorAll<SVGPathElement>('.f-mark');
        marks.forEach((m, i) => {
          const on = self.progress * marks.length > i + 0.3;
          if (m.dataset.on !== String(on)) {
            m.dataset.on = String(on);
            gsap.to(m, { scale: on ? 1 : 0, svgOrigin: undefined, transformOrigin: '50% 100%', duration: 0.5, ease: on ? 'back.out(3)' : 'power2.in', overwrite: true });
          }
        });
      },
      onRefresh: (self) => {
        const marks = svg.querySelectorAll<SVGPathElement>('.f-mark');
        marks.forEach((m, i) => { const on = self.progress * marks.length > i + 0.3; m.dataset.on = String(on); gsap.set(m, { scale: on ? 1 : 0, transformOrigin: '50% 100%' }); });
        gsap.set(svg.querySelector('.f-line'), { drawSVG: `0% ${self.progress * 100}%` });
      },
    });
  });

  // Retrato: el marco crece hasta su sitio y la foto se asienta (solo transformaciones).
  gsap.timeline({ scrollTrigger: { trigger: '.parte__photo', start: 'top 85%', end: 'top 25%', scrub: 0.8 } })
    .fromTo('.parte__frame', { scale: 0.84, yPercent: 6 }, { scale: 1, yPercent: 0, ease: 'none' }, 0)
    .fromTo('.portrait', { scale: 1.18, yPercent: 6 }, { scale: 1, yPercent: 0, ease: 'none' }, 0);
  gsap.from('.parte__title', { y: 40, duration: 1.2, ease: EASE, scrollTrigger: { trigger: '.parte__title', start: 'top 85%' } });
  gsap.from('.station-card > div', {
    x: -24, duration: 0.9, ease: EASE, stagger: 0.08,
    scrollTrigger: { trigger: '.station-card', start: 'top 85%' },
  });

  // Titulares de sección: los caracteres suben desde su línea.
  for (const el of $$('[data-split]:not(.hero__line)')) {
    const chars = splitChars(el);
    gsap.from(chars, { yPercent: 115, duration: 1.1, ease: EASE, stagger: 0.025, scrollTrigger: { trigger: el, start: 'top 88%' } });
  }

  // Tarjetas de proyecto: crecen hasta su sitio con el scroll (solo transformaciones) y el titular sube.
  for (const card of $$('.case__card')) {
    gsap.fromTo(card, { scale: 0.9, yPercent: 4 }, {
      scale: 1, yPercent: 0, ease: 'none',
      scrollTrigger: { trigger: card, start: 'top 98%', end: 'top 30%', scrub: 0.8 },
    });
    const chars = splitChars($('.case__title', card));
    gsap.from(chars, { yPercent: 115, duration: 1.1, ease: EASE, stagger: 0.03, scrollTrigger: { trigger: card, start: 'top 62%' } });
    gsap.from($$('.case__claim, .case__kind, .case__body, .case__text .chips, .case__actions', card), {
      y: 26, duration: 1, ease: EASE, stagger: 0.07, scrollTrigger: { trigger: card, start: 'top 55%' },
    });
  }
  // LanzaMet: las 9 estaciones se encienden por orden.
  gsap.from('.zones li', { scale: 0, opacity: 0, duration: 0.6, ease: 'back.out(3)', stagger: 0.07, scrollTrigger: { trigger: '.lm-media', start: 'top 60%' } });

  // Archivo y tecnologías: entradas distintas para que cada tramo tenga su gesto.
  gsap.from('.archive__list li', { clipPath: 'inset(0 100% 0 0)', duration: 1.1, ease: 'expo.inOut', stagger: 0.06, scrollTrigger: { trigger: '.archive__list', start: 'top 80%' } });
  for (const list of $$('[data-chips]')) {
    gsap.from(list.children, {
      y: 40, rotate: () => gsap.utils.random(-10, 10), duration: 0.9, ease: 'back.out(1.6)',
      stagger: { each: 0.03, from: 'random' }, scrollTrigger: { trigger: list, start: 'top 85%' },
    });
  }

  // Contacto: el titular sube y el correo se acerca al cursor.
  if (finePointer) {
    for (const el of $$('[data-magnetic]')) {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.18);
        yTo((e.clientY - r.top - r.height / 2) * 0.3);
      });
      el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    }

    // Retrato: los iris miran hacia el cursor mientras está sobre la foto. Cada iris se desplaza dentro de su
    // ojo (máscara de la apertura real) un máximo del 20 % de su tamaño en horizontal y del 9 % en vertical.
    const portrait = $('[data-eyes]');
    const eyes = $$<HTMLImageElement>('.eye img', portrait).map((img) => ({
      img,
      x: gsap.quickTo(img, 'xPercent', { duration: 0.45, ease: 'power3.out' }),
      y: gsap.quickTo(img, 'yPercent', { duration: 0.45, ease: 'power3.out' }),
      cx: 0, cy: 0,
    }));
    const measureEyes = () => eyes.forEach((e) => {
      const r = e.img.parentElement!.getBoundingClientRect();
      e.cx = r.left + r.width / 2; e.cy = r.top + r.height / 2;
    });
    let eyesStale = true;
    document.addEventListener('scroll', () => { eyesStale = true; }, { passive: true, capture: true });
    portrait.addEventListener('pointerenter', () => { eyesStale = true; });
    portrait.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      if (eyesStale) { measureEyes(); eyesStale = false; }
      for (const eye of eyes) {
        const dx = e.clientX - eye.cx, dy = e.clientY - eye.cy;
        const dist = Math.hypot(dx, dy) || 1;
        const reach = Math.min(1, dist / 180); // cerca del ojo, giro proporcional; a partir de 180 px, al tope
        eye.x((dx / dist) * reach * 20);
        eye.y((dy / dist) * reach * 9);
      }
    }, { passive: true });
    portrait.addEventListener('pointerleave', () => eyes.forEach((e) => { e.x(0); e.y(0); }));

    // Perspectiva al pasar el ratón por las imágenes de proyecto ([data-tilt] = grados máximos).
    // Un solo listener delegado (sirve también para las ventanas, que se pintan después), solo transformaciones,
    // la caja se mide al entrar y no en cada movimiento, y la capa (will-change) existe solo mientras dura el gesto.
    type Tilt = { rx: (v: number) => void; ry: (v: number) => void; box: DOMRect; max: number; timer: number };
    const tilts = new WeakMap<HTMLElement, Tilt>();
    let active: HTMLElement | null = null;
    let stale = false;
    let scrollingUntil = 0;
    const tiltOf = (el: HTMLElement) => {
      let t = tilts.get(el);
      if (!t) {
        gsap.set(el, { transformPerspective: 1000 });
        t = {
          rx: gsap.quickTo(el, 'rotationX', { duration: 0.7, ease: 'power3.out' }),
          ry: gsap.quickTo(el, 'rotationY', { duration: 0.7, ease: 'power3.out' }),
          box: el.getBoundingClientRect(), max: Number(el.dataset.tilt) || 5, timer: 0,
        };
        tilts.set(el, t);
      }
      return t;
    };
    const release = (el: HTMLElement) => {
      const t = tiltOf(el);
      t.rx(0); t.ry(0);
      t.timer = window.setTimeout(() => { if (active !== el) el.style.willChange = ''; }, 800);
    };
    document.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      // Mientras la página se desplaza, Chrome emite movimientos sintéticos: no se inclina nada hasta que pare.
      if (performance.now() < scrollingUntil) {
        if (active) { release(active); active = null; }
        return;
      }
      const el = (e.target as Element).closest<HTMLElement>('[data-tilt]');
      if (el !== active) {
        if (active) release(active);
        active = el;
        if (el) {
          const t = tiltOf(el);
          clearTimeout(t.timer);
          t.box = el.getBoundingClientRect();
          el.style.willChange = 'transform';
        }
      }
      if (!el) return;
      const t = tilts.get(el)!;
      if (stale) { t.box = el.getBoundingClientRect(); stale = false; }
      const x = (e.clientX - t.box.left) / t.box.width - 0.5;
      const y = (e.clientY - t.box.top) / t.box.height - 0.5;
      t.ry(gsap.utils.clamp(-1, 1, x * 2) * t.max);
      t.rx(gsap.utils.clamp(-1, 1, -y * 2) * t.max);
    }, { passive: true });
    // Con el scroll (de la página o de una ventana) la caja se mueve: se vuelve a medir en el siguiente movimiento.
    document.addEventListener('scroll', () => { stale = true; scrollingUntil = performance.now() + 180; }, { passive: true, capture: true });
    document.addEventListener('pointerleave', () => { if (active) { release(active); active = null; } });
  }
}
setupWords();

/* ── Tramos horizontales ───────────────────────────────── */
const mm = gsap.matchMedia();
mm.add('(max-width: 899px), (prefers-reduced-motion: reduce)', () => {
  root.classList.add('no-hpin');
  return () => root.classList.remove('no-hpin');
});
mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {

  // KORA: las 8 webs pasan en horizontal mientras la sección queda anclada.
  const kTrack = $('.kora__track');
  const kDist = () => kTrack.scrollWidth - innerWidth;
  const kora = gsap.to(kTrack, {
    x: () => -kDist(), ease: 'none',
    scrollTrigger: {
      trigger: '.kora', pin: '.kora__pin', start: 'top top', end: () => `+=${kDist()}`, scrub: 1, invalidateOnRefresh: true,
      onUpdate: (self) => gsap.set('.kora [data-hbar]', { scaleX: self.progress }),
    },
  });
  for (const site of $$('.site')) {
    gsap.fromTo(site, { y: 90, rotate: 5 }, {
      y: 0, rotate: 0, ease: 'none',
      scrollTrigger: { trigger: site, containerAnimation: kora, start: 'left 100%', end: 'left 62%', scrub: true },
    });
  }

  // Trayectoria: barograma que se traza a medida que avanzan los años.
  const rTrack = $('.route__track');
  const trace = $<SVGSVGElement>('.route__trace');
  const path = $<SVGPathElement>('[data-trace]');
  const dots = $$('.route__list li');
  const drawTrace = () => {
    const W = rTrack.scrollWidth, H = rTrack.offsetHeight;
    trace.setAttribute('viewBox', `0 0 ${W} ${H}`);
    trace.style.width = `${W}px`;
    const pts = dots.map((li) => [li.offsetLeft + 8 + ($('.route__list').offsetLeft), li.offsetTop + 8]);
    pts.unshift([0, pts[0][1] + 30]);
    pts.push([W, pts[pts.length - 1][1] - 20]);
    // Curva suave (Catmull-Rom a Bézier) por los puntos de cada hito.
    let d = `M${pts[0][0]} ${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2;
      d += ` C${p1[0] + (p2[0] - p0[0]) / 6} ${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6} ${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]} ${p2[1]}`;
    }
    path.setAttribute('d', d);
  };
  drawTrace();
  const rDist = () => rTrack.scrollWidth - innerWidth;
  const route = gsap.to(rTrack, {
    x: () => -rDist(), ease: 'none',
    scrollTrigger: {
      trigger: '.route__pin', pin: true, start: 'top top', end: () => `+=${rDist()}`, scrub: 1, invalidateOnRefresh: true,
      onRefreshInit: drawTrace,
      onUpdate: (self) => {
        gsap.set('.route [data-hbar]', { scaleX: self.progress });
        const front = (self.progress * rDist() + innerWidth * 0.72) / rTrack.scrollWidth;
        gsap.set(path, { drawSVG: `0% ${Math.min(100, front * 100)}%` });
      },
    },
  });
  gsap.set(path, { drawSVG: `0% ${(innerWidth * 0.72 / rTrack.scrollWidth) * 100}%` });
  for (const li of dots) {
    gsap.from(li, {
      y: 40, ease: 'none',
      scrollTrigger: { trigger: li, containerAnimation: route, start: 'left 92%', end: 'left 70%', scrub: true },
    });
  }

  // Anclajes que con ScrollSmoother sustituyen a position: sticky.
  const sticky = [
    ScrollTrigger.create({ trigger: '.parte__grid', start: `top ${68 + 24}px`, end: () => `bottom ${68 + 24 + $('.parte__photo').offsetHeight}px`, pin: '.parte__photo', pinSpacing: false }),
    ScrollTrigger.create({ trigger: '.stack__grid', start: `top ${68 + 24}px`, end: () => `bottom ${68 + 24 + $('.stack__grid .h2').offsetHeight}px`, pin: '.stack__grid .h2', pinSpacing: false }),
  ];
  return () => sticky.forEach((s) => s.kill());
});

/* ── Puesta a punto ────────────────────────────────────── */
// Las animaciones CSS en bucle se pausan fuera de pantalla para no recalcular estilos en cada frame.
const off = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle('is-off', !e.isIntersecting)));
$$('.hero, .kora').forEach((el) => off.observe(el));
// Los disparadores se crearon fuera del orden de la página; se ordenan para que cuenten con los anclajes.
ScrollTrigger.sort();
document.fonts.ready.then(() => ScrollTrigger.refresh());
addEventListener('load', () => ScrollTrigger.refresh());
if (windows.isOpen) pause(true);

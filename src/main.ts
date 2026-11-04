import './styles.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { Field, type Centre } from './field';
import { Windows } from './windows';
import { Lightbox } from './lightbox';
import { applyLang, initLang } from './i18n';
import { mountBlobs } from './blobs';
import { nameLockup, namePressure, techReadout, lanzametViews, acePush } from './details';
import type { Lang } from './content';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, DrawSVGPlugin);
// Sin el recálculo automático en DOMContentLoaded: ScrollSmoother pide el suyo en ese mismo momento y el de «load»
// llega después con las imágenes ya colocadas. Cada recálculo completo cuesta unos 45 ms en escritorio.
ScrollTrigger.config({ autoRefreshEvents: 'visibilitychange,load,resize' });

const root = document.documentElement;
const $ = <T extends Element = HTMLElement>(s: string, el: ParentNode = document) => el.querySelector<T>(s)!;
const $$ = <T extends Element = HTMLElement>(s: string, el: ParentNode = document) => [...el.querySelectorAll<T>(s)];
const motion = matchMedia('(prefers-reduced-motion: no-preference)').matches;
const finePointer = matchMedia('(pointer: fine) and (hover: hover)').matches;
const wide = () => innerWidth >= 900;
// La barra pasa a menú hamburguesa antes que el resto de la página (styles.css, max-width: 1199px).
const barWide = () => innerWidth >= 1200;
const EASE = 'expo.out';
// Parámetros de diagnóstico, solo en desarrollo: ?nosmooth y ?nofield.
const dev = (k: string) => import.meta.env.DEV && new URLSearchParams(location.search).has(k);

// Formas irregulares de la presentación y de las tecnologías.
mountBlobs();

/* ── Idioma ─────────────────────────────────────────────── */
let lang: Lang = initLang();
let windows: Windows;
applyLang(lang);
$$('[data-lang]').forEach((b) => b.addEventListener('click', () => {
  const next = b.dataset.lang as Lang;
  if (next === lang) return;
  lang = next;
  applyLang(lang);
  windows.relabel();
  onLang.forEach((f) => f());
  ScrollTrigger.refresh();
}));
// Piezas que pintan texto propio (lectura de tecnologías, sonda de la isla, reloj) y lo rehacen al cambiar de idioma.
const onLang: (() => void)[] = [];

/* ── Desplazamiento suave (solo escritorio con ratón y movimiento) ─ */
const smoother = motion && finePointer && !dev('nosmooth')
  ? ScrollSmoother.create({
    // Sin «effects»: ya no hay parallax por data-speed y así ScrollSmoother no recorre esos elementos en cada frame.
    wrapper: '#smooth-wrapper', content: '#smooth-content', smooth: 1.05, effects: false, smoothTouch: false,
    // ScrollSmoother centra el elemento que recibe el foco; los destinos de los enlaces internos (tabindex="-1")
    // ya llegan con su propio desplazamiento y centrarlos lo deshacía.
    onFocusIn: (_s, e) => (e.target as Element).getAttribute('tabindex') !== '-1',
  })
  : null;
windows = new Windows(() => lang, (on) => pause(on), () => motion);
// Visor de imágenes de proyecto: si la ventana del proyecto está abierta, la página ya está en pausa y debe seguir así.
new Lightbox((on) => { if (!windows.isOpen) pause(on); }, () => motion);
function pause(on: boolean) {
  if (smoother) smoother.paused(on);
  root.style.overflow = on ? 'hidden' : '';
}
function scrollToTarget(target: Element) {
  // Las tarjetas de proyecto dejan sitio a la barra (scroll-margin-top en CSS); las secciones llegan al borde.
  const offset = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
  if (smoother) smoother.scrollTo(target, true, `top ${offset}px`);
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
function closeMenu() { menu.classList.remove('is-open'); menuBtn.setAttribute('aria-expanded', 'false'); setDrop(false); }
menuBtn.addEventListener('click', () => {
  const open = !menu.classList.contains('is-open');
  if (open) loadThumbs();
  menu.classList.toggle('is-open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
});
// La barra siempre está visible; solo gana fondo al dejar el inicio y se oscurece sobre las secciones oscuras.
ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (self) => bar.classList.toggle('is-solid', self.scroll() > 40) });
for (const [sel, cls] of [['.kora', 'is-dark'], ['.kora', 'is-kora'], ['.contact', 'is-dark']]) {
  ScrollTrigger.create({ trigger: sel, start: `top ${68 / 2}px`, end: `bottom ${68 / 2}px`, toggleClass: { targets: bar, className: cls }, refreshPriority: -1 });
}

// Enlaces: al pasar el ratón aparece detrás una forma de presión propia (CSS, sin desplazamiento entre enlaces); el de
// la sección en curso lleva un punto de estación.
const navLinks = $$<HTMLAnchorElement>('.nav-link');

// Desplegable de proyectos: se abre al pasar el ratón o al llegar con el teclado y lleva a cada proyecto.
const drop = $('[data-drop]');
const dropBtn = $('.nav-drop__trigger', drop);
let dropTimer = 0;
// Las miniaturas se piden la primera vez que el panel se ve, no al arrancar junto al retrato.
let thumbsLoaded = false;
function loadThumbs() {
  if (thumbsLoaded) return;
  thumbsLoaded = true;
  $$<HTMLImageElement>('img[data-src]', drop).forEach((img) => { img.src = img.dataset.src!; });
}
function setDrop(on: boolean) {
  clearTimeout(dropTimer);
  if (on) loadThumbs();
  drop.classList.toggle('is-open', on);
  dropBtn.setAttribute('aria-expanded', String(on));
}
if (finePointer) {
  drop.addEventListener('pointerenter', () => { if (barWide()) setDrop(true); });
  // Un margen breve para cruzar el hueco entre el enlace y el panel sin que se cierre.
  drop.addEventListener('pointerleave', () => { dropTimer = window.setTimeout(() => setDrop(false), 180); });
}
drop.addEventListener('focusin', () => { if (barWide()) setDrop(true); });
drop.addEventListener('focusout', (e) => { if (!drop.contains(e.relatedTarget as Node)) setDrop(false); });
addEventListener('keydown', (e) => {
  if (e.key !== 'Escape' || !drop.classList.contains('is-open')) return;
  dropBtn.focus();
  setDrop(false);
});

// Enlace de la sección en curso.
const sections: [string, string?][] = [
  ['#inicio'], ['#parte'], ['#formacion', '#formacion'], ['#proyectos', '#proyectos'], ['#kora', '#kora'],
  ['.work--b', '#proyectos'], ['#stack'], ['#trayectoria', '#trayectoria'], ['#contacto', '#contacto'],
];
for (const [sel, nav] of sections) {
  ScrollTrigger.create({
    trigger: sel, start: 'top 55%', end: 'bottom 55%', refreshPriority: -1,
    onToggle: (self) => {
      if (!self.isActive) return;
      const current = navLinks.find((a) => a.getAttribute('href') === nav) ?? null;
      navLinks.forEach((a) => a.classList.toggle('is-current', a === current));
    },
  });
}

/* ── Retrato: modos ─────────────────────────────────────── */
// Solo con ratón y en escritorio: un selector a la derecha de la foto (index.html, .modes) cambia lo que pasa al mover
// el cursor por ella. «normal», nada; «xray», un círculo deja ver el esqueleto; «invert», el círculo invierte los
// colores; «eyes», los iris miran hacia el cursor. En táctil o por debajo de 900 px el selector no se muestra y la foto
// queda normal.
// El hero__copy queda por encima del retrato, así que se escucha en la sección entera y la posición se calcula respecto
// a la caja del retrato. El centro del círculo va exactamente bajo el cursor; solo su radio se anima. ScrollSmoother y
// el parallax siguen moviendo la foto después del evento de scroll: mientras dura ese movimiento, el círculo se recoloca
// en cada frame con la última posición del ratón.
type Mode = 'normal' | 'xray' | 'invert' | 'eyes';
if (finePointer) {
  root.classList.add('has-modes');
  const portrait = $('[data-eyes]');
  const area = portrait.closest('section')!;
  const picker = $('.modes');
  const buttons = $$<HTMLButtonElement>('[data-mode]', picker);
  let mode: Mode = 'normal';

  // Capas de las lentes: esqueleto sobre fondo oscuro, capa de inversión y el aro que marca el borde.
  const xray = document.createElement('span');
  xray.className = 'portrait__xray';
  const bones = document.createElement('img');
  bones.alt = ''; bones.width = 1086; bones.height = 1198; bones.decoding = 'async';
  xray.append(bones);
  const inv = document.createElement('span');
  inv.className = 'portrait__inv';
  const ring = document.createElement('span');
  ring.className = 'portrait__ring';
  for (const el of [xray, inv, ring]) el.setAttribute('aria-hidden', 'true');
  portrait.append(xray, inv, ring);
  // El esqueleto se pide la primera vez que se elige su modo, no con la carga de la página.
  const loadBones = () => {
    if (bones.src) return;
    bones.sizes = '(max-width: 900px) 80vw, 50vw';
    bones.srcset = '/img/retrato-esqueleto-720.webp 720w, /img/retrato-esqueleto-1086.webp 1086w';
    bones.src = '/img/retrato-esqueleto-1086.webp';
  };

  let px = 0, py = 0, over = false, inside = false, movingUntil = 0;

  // Mirada: cada iris se desplaza dentro de su ojo (máscara de la apertura real) hasta un 20 % de su tamaño en
  // horizontal y un 3 % en vertical. Cerca del ojo, giro proporcional; a partir de 260 px, al tope.
  const eyes = $$<HTMLImageElement>('.eye img', portrait).map((img) => ({
    img,
    x: gsap.quickTo(img, 'xPercent', { duration: 0.45, ease: 'power3.out' }),
    y: gsap.quickTo(img, 'yPercent', { duration: 0.45, ease: 'power3.out' }),
  }));
  // La foto se carga con los ojos puestos (retrato-*.webp). Para moverlos hacen falta la base sin iris, los iris y las
  // máscaras de la apertura: se piden con el navegador ocioso tras la carga y, ya decodificados, sustituyen a la foto
  // la primera vez que se elige «ojos». Primero aparecen los iris sueltos y después cambia la base, así la cara nunca
  // se queda sin ojos.
  const base = $<HTMLImageElement>('.portrait__base', portrait);
  const bareSet = '/img/retrato-recorte-720.webp 720w, /img/retrato-recorte-1086.webp 1086w';
  const ready = (im: HTMLImageElement) => im.decode().catch(() => undefined);
  let prepared: Promise<unknown> | undefined;
  const prepareEyes = () => (prepared ??= Promise.all([
    (() => { const im = new Image(); im.sizes = base.sizes; im.srcset = bareSet; return ready(im); })(),
    ...['izq', 'der'].map((n) => { const im = new Image(); im.src = `/img/ojo-${n}-mask.png`; return ready(im); }),
    ...eyes.map(({ img }) => { img.src = img.dataset.src!; return ready(img); }),
  ]));
  let live = false;
  const goLive = () => prepareEyes().then(() => {
    if (live) return;
    live = true;
    portrait.classList.add('has-live-eyes');
    base.srcset = bareSet;
  });
  addEventListener('load', () => {
    if ('requestIdleCallback' in window) requestIdleCallback(() => prepareEyes(), { timeout: 4000 });
    else setTimeout(prepareEyes, 2000);
  }, { once: true });

  const reach = (d: number) => Math.max(-1, Math.min(1, d / 260));
  const look = () => {
    for (const eye of eyes) {
      const r = eye.img.parentElement!.getBoundingClientRect();
      eye.x(reach(px - (r.left + r.width / 2)) * 20);
      eye.y(reach(py - (r.top + r.height / 2)) * 3);
    }
  };
  const rest = () => eyes.forEach((e) => { e.x(0); e.y(0); });

  const lr = gsap.quickTo(portrait, '--lr', { duration: motion ? 0.5 : 0, ease: 'power3.out' });
  const close = () => { inside = false; lr(0); };
  const place = () => {
    if (!wide()) { if (inside) close(); return; }
    if (mode === 'eyes') { look(); return; }
    if (mode === 'normal') return;
    const box = portrait.getBoundingClientRect();
    // Coordenadas en la caja sin transformar del retrato (GSAP lo escala un poco al hacer scroll).
    const k = portrait.offsetWidth / box.width;
    const x = (px - box.left) * k, y = (py - box.top) * k;
    const now = x >= 0 && y >= 0 && x <= portrait.offsetWidth && y <= portrait.offsetHeight;
    portrait.style.setProperty('--lx', x.toFixed(1));
    portrait.style.setProperty('--ly', y.toFixed(1));
    if (now !== inside) {
      inside = now;
      const max = Math.round(portrait.offsetWidth * 0.12);
      portrait.style.setProperty('--lmax', String(max));
      lr(now ? max : 0);
    }
  };

  const setMode = (m: Mode) => {
    mode = m;
    portrait.dataset.mode = m;
    picker.dataset.on = String(buttons.findIndex((b) => b.dataset.mode === m));
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === m)));
    if (m === 'xray') loadBones();
    if (m === 'eyes') goLive();
    if (m !== 'eyes') rest();
    close();
  };
  buttons.forEach((b) => b.addEventListener('click', () => setMode(b.dataset.mode as Mode)));
  setMode('normal');

  area.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    // Sobre el propio selector no hay efecto: el aro aparecería alrededor de los botones.
    if (picker.contains(e.target as Node)) {
      over = false;
      if (inside) close();
      if (mode === 'eyes') rest();
      return;
    }
    over = true; px = e.clientX; py = e.clientY;
    place();
  }, { passive: true });
  area.addEventListener('pointerleave', () => { over = false; close(); if (mode === 'eyes') rest(); });
  document.addEventListener('scroll', () => { movingUntil = performance.now() + 1600; }, { passive: true, capture: true });
  gsap.ticker.add(() => { if (over && mode !== 'normal' && performance.now() < movingUntil) place(); });
}

/* ── Campos de presión ─────────────────────────────────── */
const narrow = innerWidth < 760;
const heroCentres: Centre[] = [
  narrow ? { x: 0.36, y: 0.15, hpa: 15, r: 0.5 } : { x: 0.42, y: 0.24, hpa: 15, r: 0.55 }, // A: anticiclón
  narrow ? { x: 0.1, y: 0.07, hpa: -14, r: 0.3 } : { x: 0.08, y: 0.27, hpa: -14, r: 0.3 }, // B: borrasca
  { x: 0.06, y: 0.92, hpa: 8, r: 0.5 },
  { x: 0.74, y: 0.06, hpa: -6, r: 0.3 },
  narrow ? { x: 0.5, y: 0.22, hpa: 13, r: 0.34 } : { x: 0.74, y: 0.36, hpa: 13, r: 0.42 }, // núcleo cálido tras el retrato
  { x: 0.22, y: 0.52, hpa: -5, r: 0.28 },
];
const heroField = dev('nofield') ? null : Field.create($<HTMLCanvasElement>('[data-field="light"]'), {
  // Cielo limpio que se funde con el papel hacia abajo; solo quedan las isobaras, finas, sobre él.
  palette: ['#C6E2EB', '#C6E2EB', '#C6E2EB', '#C6E2EB', '#EEF2F0'],
  line: [16 / 255, 34 / 255, 44 / 255, 0.13],
  bands: false,
  // Solo isobaras finas sobre un degradado: a 1x no se distingue de 1.5x y son 2,25 veces menos píxeles por frame.
  maxDpr: 1,
  centres: heroCentres,
});
if (heroField && !motion) heroField.still();
// El campo del contacto está al final de la página: su contexto WebGL y su shader (unos 40 ms de hilo principal)
// se crean cuando falta una pantalla para llegar, no en el arranque. Hasta entonces se ve su degradado CSS.
const darkCanvas = $<HTMLCanvasElement>('[data-field="dark"]');
if (!dev('nofield')) {
  const io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    io.disconnect();
    const darkField = Field.create(darkCanvas, {
      palette: ['#0A2433', '#0D3043', '#103A4F', '#15465B', '#1C566A'],
      line: [191 / 255, 227 / 255, 234 / 255, 0.17],
      centres: [
        { x: 0.8, y: 0.2, hpa: 15, r: 0.5 }, { x: 0.15, y: 0.85, hpa: -10, r: 0.4 }, { x: 1.3, y: 0.9, hpa: 8, r: 0.6 },
        { x: 0.45, y: 0.5, hpa: -4, r: 0.3 }, { x: -0.2, y: 0.1, hpa: 6, r: 0.5 }, { x: 0.6, y: 1.1, hpa: 5, r: 0.4 },
      ],
    });
    if (darkField && !motion) darkField.still();
  }, { rootMargin: '100% 0px' });
  io.observe(darkCanvas);
}

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

/* ── Preparación diferida ──────────────────────────────── */
// Cada ScrollTrigger mide la página al crearse. Creados todos en el arranque bloqueaban el hilo principal ~0,4 s en
// escritorio y ~1,6 s en un móvil medio (175 layouts forzados), con el nombre y la intro del hero esperando.
// Ahora el arranque solo prepara el hero; el resto se prepara pieza a pieza en tiempo libre, empezando cuando la
// entrada del hero ya casi ha terminado o con el primer gesto de scroll, lo que llegue antes. Primero los anclajes,
// que cambian la altura de la página, para que lo creado después ya mida con ellos.
const queue: (() => void)[] = [];
// Safari no tiene requestIdleCallback: allí cada pieza va en su propia tarea.
const idle: (cb: IdleRequestCallback, o?: IdleRequestOptions) => void = 'requestIdleCallback' in window
  ? (cb, o) => requestIdleCallback(cb, o)
  : (cb) => setTimeout(() => cb({ didTimeout: true, timeRemaining: () => 0 }), 16);
let draining = false;
function drain(d: IdleDeadline) {
  // Al menos una pieza por hueco; más si sobra tiempo en el frame.
  do queue.shift()!(); while (queue.length && d.timeRemaining() > 8);
  if (queue.length) idle(drain, { timeout: 120 });
  else ScrollTrigger.sort(); // creados fuera del orden de la página: se ordenan para los recálculos siguientes
}
function startQueue() {
  if (draining) return;
  draining = true;
  for (const ev of ['wheel', 'touchstart', 'keydown', 'scroll'] as const) removeEventListener(ev, startQueue, true);
  idle(drain, { timeout: 120 });
}
for (const ev of ['wheel', 'touchstart', 'keydown', 'scroll'] as const) addEventListener(ev, startQueue, { capture: true, passive: true });


/* ── Coreografía ───────────────────────────────────────── */
if (motion) {
  // Entrada: la carta aparece, las isobaras se asientan y el nombre sube línea a línea.
  const lines = $$('.hero__line');
  const chars = lines.flatMap((l) => splitChars(l, false));
  if (finePointer) namePressure(chars);
  gsap.set(chars, { yPercent: 115 });
  gsap.set('[data-intro]', { opacity: 0 });
  root.classList.remove('intro');
  const intro = gsap.timeline({ defaults: { ease: EASE }, delay: 0.1 });
  intro
    .from('.hero .field', { opacity: 0, duration: 1.6, ease: 'power2.out' }, 0)
    .to(chars, { yPercent: 0, duration: 1.25, stagger: 0.028 }, 0.15)
    // El retrato entra por CSS (styles.css, «me-in»): así se pinta con el primer frame sin esperar a este script.
    .fromTo('.hero__intro', { opacity: 0, y: 40, scale: 0.86, rotate: -4 }, { opacity: 1, y: 0, scale: 1, rotate: 0, duration: 1.4, ease: 'expo.out' }, 0.6)
    .fromTo('.hero__barb', { opacity: 0 }, { opacity: 0.55, duration: 1, stagger: 0.12 }, 1)
    // El nombre ya está en su sitio: a partir de aquí se prepara el resto de la página sin entorpecer la entrada.
    .call(startQueue, [], 1.5);

  // Al salir del hero, el frente pasa: el campo se desplaza, el nombre se queda atrás y la isla gira.
  gsap.timeline({
    scrollTrigger: {
      trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true,
      onUpdate: (self) => { if (heroField) heroField.shift = self.progress; },
    },
  })
    .to('.hero__name', { yPercent: -38, ease: 'none' }, 0)
    // Sobre la forma y no sobre .hero__intro: la entrada anima .hero__intro y, si un recálculo llegaba a mitad de
    // ella, este tramo guardaba como punto de partida una opacidad intermedia y la presentación quedaba translúcida.
    .to('.hero__intro .blob', { y: -60, opacity: 0, ease: 'none' }, 0)
    .to('.hero__me', { yPercent: 10, scale: 0.96, ease: 'none' }, 0);

  // Frentes: la línea se dibuja con el scroll y los triángulos o semicírculos brotan a su paso.
  ScrollTrigger.addEventListener('refreshInit', () => fronts.forEach(buildFront));
  fronts.forEach((svg) => queue.push(() => {
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
  }));

  // Retrato: el marco crece hasta su sitio y la foto se asienta (solo transformaciones).
  queue.push(() => gsap.timeline({ scrollTrigger: { trigger: '.parte__photo', start: 'top 85%', end: 'top 25%', scrub: 0.8 } })
    .fromTo('.parte__frame', { scale: 0.84, yPercent: 6 }, { scale: 1, yPercent: 0, ease: 'none' }, 0)
    .fromTo('.parte__map', { scale: 1.12, rotate: -4 }, { scale: 1, rotate: 0, ease: 'none' }, 0));
  queue.push(() => gsap.from('.parte__title', { y: 40, duration: 1.2, ease: EASE, scrollTrigger: { trigger: '.parte__title', start: 'top 85%' } }));
  queue.push(() => gsap.from('.station-card > div', {
    x: -24, duration: 0.9, ease: EASE, stagger: 0.08,
    scrollTrigger: { trigger: '.station-card', start: 'top 85%' },
  }));

  // Titulares de sección: los caracteres suben desde su línea.
  for (const el of $$('[data-split]:not(.hero__line)')) queue.push(() => {
    const chars = splitChars(el);
    gsap.from(chars, { yPercent: 115, duration: 1.1, ease: EASE, stagger: 0.025, scrollTrigger: { trigger: el, start: 'top 88%' } });
  });

  // Formación: la ruta se dibuja de 2021 a hoy, los puntos aparecen a su paso y las fichas suben una tras otra.
  queue.push(() => gsap.timeline({ defaults: { ease: EASE }, scrollTrigger: { trigger: '.edu-route', start: 'top 82%' } })
    .from('.edu-route', { '--route': 0, duration: 1.1 }, 0)
    .from('.edu-step__pin', { scale: 0, duration: 0.5, stagger: 0.22, ease: 'back.out(2)', clearProps: 'scale' }, 0.15)
    .from('.edu-card', { y: 56, opacity: 0, duration: 1, stagger: 0.16, clearProps: 'transform,opacity' }, 0.25));
  // Inglés: los tramos de la escala se llenan de A1 a B2 y después aparece el rótulo «Mi nivel».
  queue.push(() => gsap.timeline({ defaults: { ease: EASE }, scrollTrigger: { trigger: '.edu-lang', start: 'top 82%' } })
    .from('.edu-lang', { y: 48, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0)
    .from('.edu-lang__level', { yPercent: 40, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' }, 0.2)
    .from('.cefr li', { scaleX: 0, opacity: 0, duration: 0.55, stagger: 0.09, clearProps: 'transform,opacity' }, 0.3)
    .from('.cefr__pin', { y: 10, opacity: 0, duration: 0.5, clearProps: 'transform,opacity' }, 0.85));

  // Tarjetas de proyecto: sin escalado ligado al scroll ni entrada de la tarjeta entera. GSAP promueve a capa lo que
  // anima y la retira al acabar, y con una tarjeta completa eso eran dos repintados enormes por tarjeta. Entran sus
  // piezas, con un gesto propio de cada composición, y se quedan como capa (force3D) para no repintarse al terminar.
  for (const card of $$('.case__card')) {
    queue.push(() => {
      const chars = splitChars($('.case__title', card));
      gsap.from(chars, { yPercent: 115, duration: 1.1, ease: EASE, stagger: 0.03, scrollTrigger: { trigger: card, start: 'top 62%' } });
    });
    queue.push(() => gsap.from($$('.case__claim, .case__kind, .case__body, .case__text .chips, .case__actions', card), {
      y: 26, duration: 1, ease: EASE, stagger: 0.07, scrollTrigger: { trigger: card, start: 'top 55%' },
    }));
  }
  const media = (trigger: string, build: (tl: gsap.core.Timeline) => void) => queue.push(() => {
    build(gsap.timeline({ defaults: { ease: EASE, duration: 1.2, force3D: true }, scrollTrigger: { trigger, start: 'top 62%' } }));
  });
  // LanzaMet: la pantalla llega desde la derecha, el móvil sube y las 9 estaciones se encienden por orden.
  media('.lm-media', (tl) => tl
    .from('.lm-media__desk', { x: 120 }, 0)
    .from('.lm-media__phone', { y: 90 }, 0.1)
    .from('.zones li', { scale: 0, duration: 0.6, ease: 'back.out(3)', stagger: 0.07 }, 0.2));
  // ACESLAN, en espejo: el panel entra desde la izquierda y los teléfonos suben.
  media('.ac-media', (tl) => tl
    .from('.ac-media__browser', { x: -120 }, 0)
    .from('.ac-media__phone', { y: 120, stagger: 0.12 }, 0.1));
  // HairCloud: los tres teléfonos asoman por el borde inferior, el del centro primero.
  media('.hc-media', (tl) => tl
    .from('.hc-media__phone--c', { yPercent: 45 }, 0)
    .from('.hc-media__phone--l, .hc-media__phone--r', { yPercent: 55, stagger: 0.08 }, 0.12));
  // Haría Game: el menú de pausa llega desde la izquierda y la entrada del instituto sube a su sitio.
  media('.hg-media', (tl) => tl
    .from('.case--pause .case__text', { x: -60, duration: 1 }, 0)
    .from('.hg-media__inset', { y: 90 }, 0.15));

  // Archivo: entrada corta, solo transformaciones.
  queue.push(() => gsap.from('.archive__list li', { y: 24, duration: 0.9, ease: EASE, stagger: 0.05, scrollTrigger: { trigger: '.archive__list', start: 'top 85%' } }));
  // Tecnologías: sin entrada. Escalar y desvanecer seis formas con sombra costaba varios frames de rasterizado.

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

/* ── Tramos horizontales ───────────────────────────────── */
// En escritorio KORA ancla la sección entera y su pista pasa en horizontal; en móvil la presentación se lee en
// vertical y solo se ancla el carril de webs. Trayectoria se ancla en los dos, compactada en móvil (styles.css).
// Con movimiento reducido ambos pasan a deslizamiento nativo y a lista vertical (.no-hpin).
const mm = gsap.matchMedia();
mm.add('(prefers-reduced-motion: reduce)', () => {
  root.classList.add('no-hpin');
  return () => root.classList.remove('no-hpin');
});
// Detalles interactivos (src/details.ts): se preparan en tiempo libre, como el resto de lo que no es el hero.
nameLockup();
queue.push(lanzametViews, acePush);
if (finePointer) queue.push(() => onLang.push(techReadout(() => lang)));

queue.unshift(() => mm.add({
  desk: '(min-width: 900px) and (prefers-reduced-motion: no-preference)',
  mob: '(max-width: 899px) and (prefers-reduced-motion: no-preference)',
}, (ctx) => {
  const desk = Boolean(ctx.conditions?.desk);
  // En táctil el scroll es nativo: un scrub corto sigue mejor al dedo y anticipatePin evita el salto al anclar.
  const scrub = desk ? 1 : 0.4;
  const anticipatePin = desk ? 0 : 1;

  // KORA: las 8 webs pasan en horizontal mientras la sección (o, en móvil, su carril) queda anclada.
  const kTrack = desk ? $('.kora__track') : $('.sites');
  const kDist = () => kTrack.scrollWidth - innerWidth;
  // Setters cacheados: un selector en gsap.set dentro de onUpdate recorre el DOM en cada frame de scroll.
  const kBar = gsap.quickSetter('.kora [data-hbar]', 'scaleX');
  const rBar = gsap.quickSetter('.route [data-hbar]', 'scaleX');
  const kora = gsap.to(kTrack, {
    x: () => -kDist(), ease: 'none',
    scrollTrigger: {
      trigger: desk ? '.kora' : '.kora__rail', pin: desk ? '.kora__pin' : '.kora__rail', start: 'top top',
      end: () => `+=${kDist()}`, scrub, anticipatePin, invalidateOnRefresh: true,
      onUpdate: (self) => kBar(self.progress),
    },
  });
  // Cada web sube y se endereza al entrar (en móvil, solo sube: menos trabajo por frame).
  for (const site of $$('.site')) {
    gsap.fromTo(site, desk ? { y: 90, rotate: 5 } : { y: 40 }, {
      y: 0, rotate: 0, ease: 'none',
      scrollTrigger: { trigger: site, containerAnimation: kora, start: 'left 100%', end: desk ? 'left 62%' : 'left 55%', scrub: true },
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
    const listLeft = $('.route__list').offsetLeft;
    // El punto de cada hito está encima de su tarjeta (::before a 30px, 16px de diámetro).
    const pts = dots.map((li) => [li.offsetLeft + listLeft + 26, li.offsetTop - 22]);
    // Años al fondo: una línea discontinua y el número grande donde empieza cada año.
    const years = dots.filter((li) => li.dataset.year).map((li) => {
      const x = li.offsetLeft + listLeft - 14;
      return `<line class="route__yline" x1="${x}" y1="0" x2="${x}" y2="${H}"/><text class="route__ytext" x="${x + 12}" y="${H - 8}">${li.dataset.year}</text>`;
    }).join('');
    trace.querySelectorAll('.route__yline, .route__ytext').forEach((el) => el.remove());
    trace.insertAdjacentHTML('afterbegin', years);
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
  // La punta del trazo va algo por delante del borde derecho visible.
  const lead = () => innerWidth * (desk ? 0.72 : 0.8);
  const route = gsap.to(rTrack, {
    x: () => -rDist(), ease: 'none',
    scrollTrigger: {
      trigger: '.route__pin', pin: true, start: 'top top', end: () => `+=${rDist()}`, scrub, anticipatePin, invalidateOnRefresh: true,
      onRefreshInit: drawTrace,
      onUpdate: (self) => {
        rBar(self.progress);
        const front = (self.progress * rDist() + lead()) / rTrack.scrollWidth;
        gsap.set(path, { drawSVG: `0% ${Math.min(100, front * 100)}%` });
      },
    },
  });
  gsap.set(path, { drawSVG: `0% ${(lead() / rTrack.scrollWidth) * 100}%` });
  for (const li of dots) {
    gsap.from(li, {
      y: desk ? 40 : 28, ease: 'none',
      scrollTrigger: { trigger: li, containerAnimation: route, start: 'left 92%', end: 'left 70%', scrub: true },
    });
  }

  // Anclajes que con ScrollSmoother sustituyen a position: sticky (solo escritorio, donde la foto va al lado).
  if (desk) ScrollTrigger.create({ trigger: '.parte__grid', start: `top ${68 + 24}px`, end: () => `bottom ${68 + 24 + $('.parte__photo').offsetHeight}px`, pin: '.parte__photo', pinSpacing: false });
}));

/* ── Puesta a punto ────────────────────────────────────── */
// Las animaciones CSS en bucle se pausan fuera de pantalla para no recalcular estilos en cada frame.
const off = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle('is-off', !e.isIntersecting)));
$$('.hero, .parte, .kora').forEach((el) => off.observe(el));
if (!motion) startQueue();
// ScrollTrigger ya recalcula al cargar la página (evento load). Solo hace falta otra pasada si alguna fuente
// termina de cargar después y cambia la altura del texto.
document.fonts.addEventListener('loadingdone', () => { if (document.readyState === 'complete') ScrollTrigger.refresh(); });
if (windows.isOpen) pause(true);

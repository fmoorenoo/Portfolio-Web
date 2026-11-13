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
import { nameLockup, namePressure, techReadout, lanzametViews, acePush, setupSpots } from './details';
import type { Lang } from './content';

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

/* ── Primer pintado ────────────────────────────────────── */
// Las formas y el idioma ya están puestos: se deja pintar la página antes de lo demás. Registrar ScrollTrigger mide
// la ventana y fuerza el primer layout de toda la página, y eso (con el resto del arranque) retrasaba el primer
// pintado y las entradas CSS del hero más de un segundo en un móvil lento.
await new Promise<void>((r) => requestAnimationFrame(() => setTimeout(r, 0)));
// «load» puede haber llegado ya (visita con caché) cuando el script sigue tras ceder el pintado.
const onLoad = (fn: () => void) => { if (document.readyState === 'complete') fn(); else addEventListener('load', fn, { once: true }); };

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, DrawSVGPlugin);
// Sin el recálculo automático en DOMContentLoaded: ScrollSmoother pide el suyo en ese mismo momento y el de «load»
// llega después con las imágenes ya colocadas. Cada recálculo completo cuesta unos 45 ms en escritorio.
// En el móvil la barra de direcciones aparece y desaparece al desplazarse y cambia el alto de la ventana: sin
// ignoreMobileResize cada vez se recalculaban los anclajes a mitad del gesto y el carril de KORA podía saltar o
// soltarse antes de tiempo.
ScrollTrigger.config({ autoRefreshEvents: 'visibilitychange,load,resize', ignoreMobileResize: true });

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
// Abierto, el menú tapa toda la pantalla: la barra pasa a papel y la página de debajo no se desplaza.
let settle = 0;
function setMenu(open: boolean) {
  menu.classList.toggle('is-open', open);
  // Al cerrar, el logo vuelve a su estado del scroll con una transición corta (styles.css, .is-settling).
  if (!open && bar.classList.contains('menu-open')) {
    bar.classList.add('is-settling');
    clearTimeout(settle);
    settle = window.setTimeout(() => bar.classList.remove('is-settling'), 500);
  }
  bar.classList.toggle('menu-open', open);
  document.documentElement.classList.toggle('menu-open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
}
function closeMenu() { setMenu(false); setDrop(false); }
menuBtn.addEventListener('click', () => {
  const open = !menu.classList.contains('is-open');
  if (open) loadThumbs();
  setMenu(open);
});
// Si la ventana se ensancha hasta la barra de escritorio con el menú abierto, se cierra para no dejar la página bloqueada.
addEventListener('resize', () => { if (barWide() && menu.classList.contains('is-open')) closeMenu(); });
// La barra es una tira de papel siempre visible. Arriba del todo baja un poco dentro del hero y el logo, una pegatina
// mayor, cuelga por su borde inferior. Al bajar, la tira sube y el mismo logo se encoge hasta su sitio, ligado al
// scroll (en los dos sentidos) y solo con transformaciones. Con movimiento reducido cambia de un estado a otro sin
// pasos intermedios.
const mark = $('.bar__mark', bar);
const barMM = gsap.matchMedia();
barMM.add({ desk: '(min-width: 1200px)', mob: '(max-width: 1199px)' }, (ctx) => {
  const desk = Boolean(ctx.conditions?.desk);
  // Cuánto baja la tira arriba del todo, con todo lo que lleva encima. Compacta, su papel sube más que lo que lleva
  // (glue): el canto de arriba sale de la pantalla y la tira queda colgada del borde, con su canto rasgado abajo y la
  // cinta sujetándola; la fila y el logo quedan centrados en lo que se ve del papel (rise).
  const lift = desk ? 18 : 10;
  const glue = desk ? 13 : 11, rise = desk ? 4 : 3;
  const items = desk ? $$('.bar__links, .bar__lang, .bar__cta', bar) : $$('.bar__menu, .bar__cta', bar);
  const paper = $$('.bar__bg, .bar__tape', bar);
  const row = [...items, ...paper];
  // Escala inicial del logo: en escritorio llena el hueco que le guarda la rejilla; en móvil, el que dejan libre el
  // botón de menú y «Escríbeme» (el mayor de los dos, a cada lado). Se mide sin transformaciones (offsetWidth).
  const s0 = () => {
    const w = mark.offsetWidth || 1;
    // La columna central resuelta en px («523px 160px 523px»); un 86 % de ella, para que el troquel no toque los
    // enlaces. Con tope: arriba el logo manda, pero sin imponerse al hero.
    if (desk) return Math.min(1.32, Math.max(1, (0.86 * parseFloat(getComputedStyle(bar).gridTemplateColumns.split(' ')[1]) || w) / w));
    const side = Math.max($('.bar__menu', bar).offsetWidth, $('.bar__cta', bar).offsetWidth);
    const free = bar.clientWidth - 2 * parseFloat(getComputedStyle(bar).paddingLeft) - 2 * side - 24;
    return Math.min(1.2, Math.max(1, free / w));
  };
  // Arriba, el logo baja con la tira y algo más: cuelga por su borde inferior, como una pegatina pegada en el canto.
  const drop = () => lift + (desk ? 12 : 8);
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } })
    .fromTo(mark, { scale: s0, y: drop }, { scale: 1, y: -rise }, 0)
    // El rótulo compensa la escala con una variable que lee su propiedad «scale» (styles.css): una transformación de
    // GSAP absorbería su «translate» de centrado.
    .fromTo('.bar__tip', { '--tip-s': () => 1 / s0() }, { '--tip-s': 1 }, 0)
    .fromTo(items, { y: lift }, { y: -rise }, 0)
    .fromTo(paper, { y: lift }, { y: -glue }, 0);
  const at = (p: number) => (motion ? p : p > 0.5 ? 1 : 0);
  const st = ScrollTrigger.create({
    start: 0, end: () => `+=${Math.round(Math.min(desk ? 240 : 150, innerHeight * 0.3))}`,
    onUpdate: (self) => tl.progress(at(self.progress)),
    // Al cambiar el tamaño, las escalas y distancias se vuelven a medir desde el estado compacto.
    onRefresh: (self) => { tl.progress(1).invalidate(); tl.progress(at(self.progress)); },
  });
  tl.progress(at(st.progress));
  return () => {
    st.kill(); tl.progress(1).kill();
    gsap.set([mark, ...row], { clearProps: 'transform' });
    $('.bar__tip', bar).style.removeProperty('--tip-s');
  };
});
// Clases de la sección bajo la barra (la tira ya no cambia de color, pero se conservan como gancho).
for (const [sel, cls] of [['.kora', 'is-dark'], ['.kora', 'is-kora'], ['.contact', 'is-dark'], ['.sheet', 'is-cream']]) {
  for (const el of $$(sel)) {
    ScrollTrigger.create({ trigger: el, start: `top ${68 / 2}px`, end: `bottom ${68 / 2}px`, toggleClass: { targets: bar, className: cls }, refreshPriority: -1 });
  }
}

// Enlaces: al pasar el ratón aparece detrás una forma de presión propia (CSS, sin desplazamiento entre enlaces); el de
// la sección en curso lleva un punto de estación.
const navLinks = $$<HTMLAnchorElement>('.nav-link');

// Desplegable de proyectos: se abre al pasar el ratón o al llegar con el teclado y lleva a cada proyecto.
const drop = $('[data-drop]');
const dropBtn = $('.nav-drop__trigger', drop);
let dropTimer = 0;
// Los logos del menú (unos 19 KB entre todos) no compiten con el retrato al arrancar: se piden y decodifican con el
// navegador ocioso en cuanto la página ha cargado, para que al abrir el menú (sobre todo el de móvil) ya estén. Si se
// abre antes, se piden en ese momento.
let thumbsLoaded = false;
function loadThumbs() {
  if (thumbsLoaded) return;
  thumbsLoaded = true;
  $$<HTMLImageElement>('img[data-src]', drop).forEach((img) => {
    img.src = img.dataset.src!;
    img.decode().catch(() => undefined);
  });
}
onLoad(() => {
  if ('requestIdleCallback' in window) requestIdleCallback(loadThumbs, { timeout: 2500 });
  else setTimeout(loadThumbs, 1200);
});
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
  ['.work--b', '#proyectos'], ['#stack', '#stack'], ['#trayectoria', '#trayectoria'], ['#contacto', '#contacto'],
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
  onLoad(() => {
    if ('requestIdleCallback' in window) requestIdleCallback(() => prepareEyes(), { timeout: 4000 });
    else setTimeout(prepareEyes, 2000);
  });

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
// El campo del hero se crea en el primer hueco libre y no en el arranque: crear el contexto WebGL y compilar su shader
// era la pieza más cara del inicio (más de un segundo con la CPU de un móvil lento). Hasta entonces se ve su degradado
// CSS, que es el mismo cielo, y el lienzo aparece con un fundido cuando está listo (.is-on, styles.css).
let heroField: Field | null = null;
if (!dev('nofield')) {
  const make = () => {
    heroField = Field.create($<HTMLCanvasElement>('[data-field="light"]'), {
      // Cielo limpio que se funde con el papel hacia abajo; solo quedan las isobaras, finas, sobre él.
      palette: ['#C6E2EB', '#C6E2EB', '#C6E2EB', '#C6E2EB', '#EEF2F0'],
      line: [16 / 255, 34 / 255, 44 / 255, 0.13],
      bands: false,
      // Solo isobaras finas sobre un degradado: a 1x no se distingue de 1.5x y son 2,25 veces menos píxeles por frame.
      maxDpr: 1,
      centres: heroCentres,
    });
    if (heroField && !motion) heroField.still();
  };
  if ('requestIdleCallback' in window) requestIdleCallback(make, { timeout: 1500 });
  else setTimeout(make, 300);
}
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
// Solo para encabezados (h2, h3): SplitText pone su texto como aria-label del propio encabezado.
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
  // Entrada: la carta aparece y las isobaras se asientan. El nombre (letras ya partidas en el HTML) sube por CSS
  // («ch-in», styles.css) desde el primer pintado, como el retrato y la presentación.
  const chars = $$('.hero__name .ch');
  if (finePointer) namePressure(chars);
  gsap.set('[data-intro]', { opacity: 0 });
  root.classList.remove('intro');
  const intro = gsap.timeline({ defaults: { ease: EASE }, delay: 0.1 });
  intro
    .from('.hero .field', { opacity: 0, duration: 1.6, ease: 'power2.out' }, 0)
    // El retrato entra por CSS (styles.css, «me-in»): así se pinta con el primer frame sin esperar a este script.
    // La presentación entra por CSS («intro-in», styles.css), como el retrato: es el elemento LCP y así se pinta sin
    // esperar a que cargue este script (en un móvil lento, más de 3 s).
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

  // Proyectos: cada doble página entra una vez, al asomar su tercio, con transiciones CSS (styles.css, .is-in): el
  // nombre sube desde su línea, el texto en cascada y cada escena con su gesto. Antes eran tres ScrollTrigger por
  // proyecto y el nombre partido en letras con SplitText; un único IntersectionObserver no añade nada a los
  // recálculos de ScrollTrigger y no toca el DOM.
  const caseIO = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('is-in');
    caseIO.unobserve(e.target);
  }), { rootMargin: '0px 0px -30% 0px' });
  // Las pegatinas sueltas de KORA y Trayectoria se pegan igual al aparecer.
  $$('.case, .kora__sticker, .route__sticker').forEach((c) => caseIO.observe(c));

  // La línea central de cada tramo de proyectos: el punto baja con el scroll y deja la línea en tinta a su paso.
  for (const line of $$('.work__line')) queue.push(() => {
    gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: line, start: 'top 60%', end: 'bottom 60%', scrub: true, invalidateOnRefresh: true } })
      .fromTo($('.work__dot', line), { y: 0 }, { y: () => line.offsetHeight }, 0)
      .fromTo($('.work__fill', line), { scaleY: 0 }, { scaleY: 1 }, 0);
  });

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
  }
}

/* ── Tramos horizontales ───────────────────────────────── */
// En escritorio KORA ancla la sección entera y su pista pasa en horizontal; en móvil la presentación se lee en
// vertical y solo se ancla el carril de webs. Trayectoria se ancla en los dos, compactada en móvil (styles.css).
// Con movimiento reducido ambos pasan a deslizamiento nativo y a lista vertical (.no-hpin).
const mm = gsap.matchMedia();
mm.add('(prefers-reduced-motion: reduce)', () => {
  root.classList.add('no-hpin');
  // Trayectoria sin punto que avance: todos los hitos se ven encendidos desde el principio.
  $$('.route__list li').forEach((li) => li.classList.add('is-on'));
  return () => root.classList.remove('no-hpin');
});
// Detalles interactivos (src/details.ts): se preparan en tiempo libre, como el resto de lo que no es el hero.
nameLockup();
queue.push(lanzametViews, acePush, setupSpots);
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
  // Móvil: el recorrido vertical es 1,5 veces el horizontal (un gesto rápido no se lleva toda la fila de golpe) y,
  // al soltar, el carril se asienta en la web más cercana, como un carrusel. Las posiciones se leen al encajar, no en
  // cada frame: el progreso en que cada web queda alineada con el margen izquierdo.
  const stretch = desk ? 1 : 1.5;
  const snapPoints = () => {
    const pad = parseFloat(getComputedStyle(kTrack).paddingLeft) || 0;
    const d = kDist();
    return [...$$('.site', kTrack).map((s) => Math.min(1, Math.max(0, (s.offsetLeft - pad) / d))), 1];
  };
  const kora = gsap.to(kTrack, {
    x: () => -kDist(), ease: 'none',
    scrollTrigger: {
      trigger: desk ? '.kora' : '.kora__rail', pin: desk ? '.kora__pin' : '.kora__rail', start: 'top top',
      end: () => `+=${Math.round(kDist() * stretch)}`, scrub, anticipatePin, invalidateOnRefresh: true,
      snap: desk ? undefined : { snapTo: (v: number) => snapPoints().reduce((a, b) => (Math.abs(b - v) < Math.abs(a - v) ? b : a)), duration: { min: 0.2, max: 0.55 }, delay: 0.08, ease: 'power2.out' },
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

  // Trayectoria. Escritorio: barograma anclado que avanza en horizontal; la traza se dibuja con el scroll y el punto
  // de su punta enciende cada hito al alcanzarlo. Móvil: la misma historia en vertical, sin anclaje (el desplazamiento
  // táctil sigue siendo nativo), con el punto bajando por la línea. En los dos, el estado de cada hito es una clase
  // que solo cambia al cruzarlo; por frame solo se escriben transformaciones.
  const rList = $('.route__list');
  const items = $$('.route__list li');
  const rDot = $('.route__dot');
  const dotX = gsap.quickSetter(rDot, 'x', 'px');
  const dotY = gsap.quickSetter(rDot, 'y', 'px');
  const light = (on: (li: HTMLElement, i: number) => boolean) => items.forEach((li, i) => li.classList.toggle('is-on', on(li, i)));
  if (desk) {
    const rTrack = $('.route__track');
    const trace = $<SVGSVGElement>('.route__trace--base');
    const live = $<SVGSVGElement>('.route__trace--live');
    const path = $<SVGPathElement>('[data-trace]');
    const ghost = $<SVGPathElement>('[data-ghost]');
    // Posiciones leídas al recalcular, nunca en el scroll.
    let xs: number[] = [];
    // La traza muestreada al recalcular (x, y cada 1/600 de su longitud): en el scroll el punto se coloca con esta
    // tabla. Preguntar a la ruta su geometría en cada frame, justo después de cambiar su trazo, obligaba al
    // navegador a recalcular estilos a mitad de frame.
    const SAMPLES = 600;
    let lut = new Float32Array(2 * (SAMPLES + 1));
    // Ancho de la pista y longitud de la traza, medidos al recalcular: leerlos en el scroll forzaba un layout por frame.
    let W = 1, len = 1;
    const drawTrace = () => {
      W = rTrack.scrollWidth;
      const H = rTrack.offsetHeight;
      for (const svg of [trace, live]) {
        svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
        svg.style.width = `${W}px`;
      }
      const listLeft = rList.offsetLeft;
      xs = items.map((li) => li.offsetLeft + listLeft);
      // La estación de cada hito (.route__st, 30px) queda sobre su tallo: su centro, 25px por encima del texto.
      const pts = items.map((li, i) => [xs[i] + 0.75, li.offsetTop - 25]);
      // Años al fondo: una línea discontinua y el número, enorme y en contorno, donde empieza cada año.
      const years = items.filter((li) => li.dataset.year).map((li) => {
        const x = li.offsetLeft + listLeft - 24;
        return `<line class="route__yline" x1="${x}" y1="0" x2="${x}" y2="${H}"/><text class="route__ytext" x="${x + 14}" y="${H - 6}">${li.dataset.year}</text>`;
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
      ghost.setAttribute('d', d);
      len = path.getTotalLength();
      lut = new Float32Array(2 * (SAMPLES + 1));
      for (let k = 0; k <= SAMPLES; k++) {
        const q = path.getPointAtLength((len * k) / SAMPLES);
        lut[2 * k] = q.x; lut[2 * k + 1] = q.y;
      }
    };
    drawTrace();
    const rDist = () => rTrack.scrollWidth - innerWidth;
    // La punta del trazo va algo por delante: a un 72 % del ancho de la ventana.
    const lead = () => innerWidth * 0.72;
    const draw = (front: number) => {
      const f = Math.max(0, Math.min(1, front));
      // El tramo dibujado, escrito directamente con la longitud medida (DrawSVG la volvía a medir en cada frame).
      path.style.strokeDasharray = `${(f * len).toFixed(1)} ${len.toFixed(1)}`;
      const at = f * SAMPLES, k = Math.min(SAMPLES - 1, Math.floor(at)), u = at - k;
      const x = lut[2 * k] + (lut[2 * k + 2] - lut[2 * k]) * u;
      const y = lut[2 * k + 1] + (lut[2 * k + 3] - lut[2 * k + 1]) * u;
      dotX(x); dotY(y);
      light((_, i) => x >= xs[i]);
    };
    // Se dibuja con el progreso de la propia animación, no con el del scroll: con «scrub» la pista llega con algo de
    // retraso y el punto, que va dentro de ella, se adelantaría fuera de la pantalla al desplazarse rápido.
    const at = (p: number) => draw((p * (W - innerWidth) + lead()) / W);
    gsap.to(rTrack, {
      x: () => -rDist(), ease: 'none',
      onUpdate(this: gsap.core.Tween) { rBar(this.progress()); at(this.progress()); },
      scrollTrigger: {
        trigger: '.route__pin', pin: true, start: 'top top', end: () => `+=${rDist()}`, scrub, anticipatePin, invalidateOnRefresh: true,
        onRefreshInit: drawTrace,
        // Puede llegar mientras se crea la animación: se lee la de ScrollTrigger, no una variable aún sin asignar.
        onRefresh: (self) => at(self.animation?.progress() ?? 0),
      },
    });
    draw(lead() / rTrack.scrollWidth);
  } else {
    // El punto baja por la línea con el scroll: su altura es la del 68 % de la ventana, donde se lee.
    const fill = $('.route__fill');
    const fillY = gsap.quickSetter(fill, 'scaleY');
    let tops: number[] = [];
    let h = 1;
    const measure = () => { h = rList.offsetHeight; tops = items.map((li) => li.offsetTop + 11); };
    const draw = (p: number) => {
      const y = p * h;
      dotY(y); dotX(0); fillY(p);
      light((_, i) => y >= tops[i]);
    };
    measure();
    ScrollTrigger.create({
      trigger: rList, start: 'top 68%', end: 'bottom 68%',
      onRefresh: (self) => { measure(); draw(self.progress); },
      onUpdate: (self) => draw(self.progress),
    });
  }

  // Anclajes que con ScrollSmoother sustituyen a position: sticky (solo escritorio, donde la foto va al lado).
  if (desk) ScrollTrigger.create({ trigger: '.parte__grid', start: `top ${68 + 24}px`, end: () => `bottom ${68 + 24 + $('.parte__photo').offsetHeight}px`, pin: '.parte__photo', pinSpacing: false });
}));

/* ── Puesta a punto ────────────────────────────────────── */
// Las animaciones CSS en bucle se pausan fuera de pantalla para no recalcular estilos en cada frame. Formación entra
// también: las rayas de C1, el parpadeo de «En proceso» y el halo de DAW seguían animándose fuera de pantalla y
// obligaban a la GPU a recomponer cada frame en toda la página (las rayas solas, la mayor parte de los tirones).
const off = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle('is-off', !e.isIntersecting)));
$$('.hero, .parte, .edu, .kora').forEach((el) => off.observe(el));
if (!motion) startQueue();
// ScrollTrigger ya recalcula al cargar la página (evento load). Solo hace falta otra pasada si alguna fuente
// termina de cargar después y cambia la altura del texto.
document.fonts.addEventListener('loadingdone', () => { if (document.readyState === 'complete') ScrollTrigger.refresh(); });
if (windows.isOpen) pause(true);

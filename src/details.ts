// Detalles interactivos, en la línea de los modos del retrato: el nombre bajo presión, la lectura de tecnologías, las
// vistas de LanzaMet, el aviso de ACESLAN y la leyenda de la formación. Todos miden fuera de los bucles (cajas
// cacheadas que se rehacen tras el scroll) y solo escriben transformaciones, una variable, una clase o un texto corto.
import { gsap } from 'gsap';
import type { Lang } from './content';

type GetLang = () => Lang;

/** Bloque del nombre: «Fernando» se ajusta al ancho de «Montelongo». La proporción no depende del viewport (las dos
 *  líneas usan la misma unidad), así que se mide una sola vez, con las fuentes ya cargadas. */
export function nameLockup() {
  const a = document.querySelector<HTMLElement>('.hero__line--a');
  const b = document.querySelector<HTMLElement>('.hero__line--b');
  if (!a || !b) return;
  document.fonts.ready.then(() => {
    a.style.setProperty('--k', '1');
    const k = b.offsetWidth / a.offsetWidth;
    if (Number.isFinite(k) && k > 0) a.style.setProperty('--k', k.toFixed(4));
  });
}

/** El nombre como un centro de presión: las letras cercanas al cursor se comprimen (eje de ancho), engordan y toman el
 *  azul del frente frío. Los centros de las letras se miden al acercarse y tras el scroll, nunca en cada movimiento. */
export function namePressure(chars: HTMLElement[]) {
  const name = document.querySelector<HTMLElement>('[data-name]');
  const area = name?.closest('section');
  if (!name || !area || !chars.length) return;
  const set = chars.map((c) => gsap.quickTo(c, '--p', { duration: 0.55, ease: 'power3.out' }));
  let centres: [number, number][] = [];
  let box: DOMRect | null = null;
  let stale = true;
  let live = false;
  const measure = () => {
    box = name.getBoundingClientRect();
    centres = chars.map((c) => { const r = c.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; });
    stale = false;
  };
  const calm = () => { if (!live) return; live = false; set.forEach((f) => f(0)); };
  area.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    if (stale) measure();
    const b = box!;
    const reach = b.height * 0.55;
    // Fuera del bloque y de su margen no se calcula nada.
    if (e.clientX < b.left - reach || e.clientX > b.right + reach || e.clientY < b.top - reach || e.clientY > b.bottom + reach) { calm(); return; }
    live = true;
    for (let i = 0; i < chars.length; i++) {
      const d = Math.hypot(e.clientX - centres[i][0], (e.clientY - centres[i][1]) * 1.4);
      const p = Math.max(0, 1 - d / reach);
      set[i](p * p * (3 - 2 * p));
    }
  }, { passive: true });
  area.addEventListener('pointerleave', calm);
  document.addEventListener('scroll', () => { stale = true; calm(); }, { passive: true, capture: true });
  addEventListener('resize', () => { stale = true; });
}

/** Lectura de tecnologías: al pasar por una, dice en qué proyectos la he usado (data-used en index.html, solo datos
 *  verificados). Un único nodo de texto que cambia; nada se anima salvo su opacidad. */
export function techReadout(getLang: GetLang) {
  const out = document.querySelector<HTMLElement>('[data-readout]');
  const text = out?.querySelector<HTMLElement>('[data-readout-text]');
  const list = document.querySelector<HTMLElement>('.systems');
  if (!out || !text || !list) return () => {};
  const words = {
    es: { hint: 'Pasa el cursor por una tecnología para ver dónde la he usado.', in: 'en', self: 'este portfolio', android: 'Fundamentos Android', commits: '17 repositorios públicos y 1.059 commits' },
    en: { hint: 'Hover over a technology to see where I’ve used it.', in: 'in', self: 'this portfolio', android: 'Android fundamentals', commits: '17 public repositories and 1,059 commits' },
  };
  let current: HTMLElement | null = null;
  const paint = () => {
    const w = words[getLang()];
    out.classList.toggle('is-on', Boolean(current));
    if (!current) { text.textContent = w.hint; return; }
    const used = current.dataset.used!.replace('@self', w.self).replace('@android', w.android).replace('@commits', w.commits);
    text.innerHTML = '';
    const b = document.createElement('b');
    b.textContent = current.textContent;
    text.append(b, ` ${w.in} ${used}`);
  };
  list.addEventListener('pointerover', (e) => {
    const li = (e.target as Element).closest<HTMLElement>('li[data-used]');
    if (li === current) return;
    current?.classList.remove('is-lit');
    current = li;
    current?.classList.add('is-lit');
    paint();
  });
  list.addEventListener('pointerleave', () => { current?.classList.remove('is-lit'); current = null; paint(); });
  paint();
  return paint;
}

/** Dónde trabajo: cada pieza de la foto abre su ficha (siempre en el mismo sitio, CSS) al pasar el ratón, al tocarla o
 *  al enfocarla con teclado. Con ratón se cierra al salir de la pieza; en táctil, al tocarla otra vez o tocar fuera;
 *  con teclado, al salir o con Escape. Solo una abierta a la vez. */
export function setupSpots() {
  const area = document.querySelector<HTMLElement>('[data-setup] .spots');
  if (!area) return;
  let open: HTMLElement | null = null;
  const set = (spot: HTMLElement | null) => {
    if (spot === open) return;
    if (open) {
      open.classList.remove('is-open');
      open.querySelector('.spot__hit')!.setAttribute('aria-expanded', 'false');
    }
    open = spot;
    if (open) {
      open.classList.add('is-open');
      open.querySelector('.spot__hit')!.setAttribute('aria-expanded', 'true');
    }
  };
  const spotOf = (t: EventTarget | null) => (t as Element | null)?.closest<HTMLElement>('.spot') ?? null;

  // Ratón: la pieza bajo el cursor; fuera de cualquier pieza, ninguna.
  area.addEventListener('pointerover', (e) => { if (e.pointerType === 'mouse') set(spotOf(e.target)); });
  area.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') set(null); });
  // Toque (y clic): abre o, si ya estaba abierta, cierra.
  area.addEventListener('click', (e) => {
    const spot = spotOf(e.target);
    const mouse = (e as PointerEvent).pointerType === 'mouse';
    if (spot && spot === open && !mouse) set(null); else set(spot);
  });
  // Teclado: solo el foco visible; el que deja un toque lo gestiona el clic.
  area.addEventListener('focusin', (e) => { if ((e.target as Element).matches(':focus-visible')) set(spotOf(e.target)); });
  area.addEventListener('focusout', (e) => { if (!area.contains(e.relatedTarget as Node)) set(null); });
  document.addEventListener('click', (e) => { if (open && !area.contains(e.target as Node)) set(null); });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || !open) return;
    (open.querySelector('.spot__hit') as HTMLElement).blur();
    set(null);
  });
}

/** Cambia la imagen de un <img> cuando la nueva ya está decodificada: se apaga, se sustituye y se enciende (solo
 *  opacidad, en CSS con .is-swap), así no hay ni hueco en blanco ni salto. */
function swap(img: HTMLImageElement, src: string, srcset?: string) {
  const next = new Image();
  if (srcset) { next.srcset = srcset; next.sizes = img.sizes; }
  next.src = src;
  return next.decode().catch(() => {}).then(() => {
    img.classList.add('is-swap');
    window.setTimeout(() => {
      if (srcset) img.srcset = srcset;
      img.src = src;
      img.classList.remove('is-swap');
    }, 180);
  });
}

/** LanzaMet: un sistema de presión como el de los modos del retrato elige qué pantalla de la app se ve (hoy, dónde ir,
 *  el mar o el atardecer en Famara), a la vez en la pantalla de escritorio y en el móvil. Las capturas se piden al elegirlas, no con
 *  la página. La vista «hoy» del móvil es la captura de siempre (lanzamet-movil-900.webp). */
export function lanzametViews() {
  const picker = document.querySelector<HTMLElement>('.lm-views');
  const img = document.querySelector<HTMLImageElement>('[data-lm-desk]');
  const phone = document.querySelector<HTMLImageElement>('[data-lm-phone]');
  if (!picker || !img || !phone) return;
  const buttons = [...picker.querySelectorAll<HTMLButtonElement>('[data-view]')];
  buttons.forEach((b, i) => b.addEventListener('click', () => {
    if (picker.dataset.on === String(i)) return;
    picker.dataset.on = String(i);
    buttons.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    const v = b.dataset.view!;
    swap(img, `/img/lanzamet-${v}-1600.webp`, `/img/lanzamet-${v}-600.webp 600w, /img/lanzamet-${v}-900.webp 900w, /img/lanzamet-${v}-1600.webp 1600w`);
    const m = v === 'hoy' ? '/img/lanzamet-movil' : `/img/lanzamet-movil-${v}`;
    swap(phone, `${m}-900.webp`, `${m}-450.webp 450w, ${m}-900.webp 900w`);
  }));
}

/** ACESLAN: la campana envía un aviso de prueba al teléfono, que vibra al recibirlo. Solo al pulsarla: nunca llega
 *  un aviso por sí solo. */
export function acePush() {
  const btn = document.querySelector<HTMLButtonElement>('[data-push]');
  const phone = document.querySelector<HTMLElement>('.ac-media__phone--b');
  if (!btn || !phone) return;
  let t = 0;
  const send = () => {
    phone.classList.remove('is-push');
    void phone.offsetWidth; // reinicia la vibración si ya había un aviso
    phone.classList.add('is-push');
    clearTimeout(t);
    t = window.setTimeout(() => phone.classList.remove('is-push'), 4600);
  };
  btn.addEventListener('click', send);
}

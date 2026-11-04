// Visor de imágenes de proyecto: al pulsar una captura (en las tarjetas de la página o dentro de la ventana de un
// proyecto) se abre a pantalla completa. Es un <dialog> nativo (capa superior, foco atrapado, Esc) que se crea la
// primera vez que hace falta. La imagen sale de su miniatura (FLIP: solo transform y opacity, en el compositor) con la
// versión que ya está cargada y, en cuanto llega, se cambia por la más grande de su srcset.
// Se cierra con la ×, con Esc, pulsando en cualquier parte, deslizando hacia abajo o con el botón Atrás del móvil.
// Flechas, botones o deslizar a los lados pasan a las otras imágenes del mismo proyecto.

const ZOOMABLE = [
  '.case__media img:not(.ac-push img)',
  '#win .cs-stage img',
  '#win .cs-gallery img',
  '#win .cs-pair__img img',
].join(', ');
const GROUP = '.case__media, [data-win-page]';
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

type Item = { el: HTMLImageElement; hi: string; w: number; h: number; cap: string };

const label = {
  close: { es: 'Cerrar', en: 'Close' },
  prev: { es: 'Imagen anterior', en: 'Previous image' },
  next: { es: 'Imagen siguiente', en: 'Next image' },
  view: { es: 'Imagen ampliada', en: 'Enlarged image' },
};
const L = () => (document.documentElement.lang === 'en' ? 'en' : 'es');

/** La candidata más ancha del srcset (o el src) y su ancho real, para no ampliar por encima de él. */
function largest(img: HTMLImageElement) {
  let best = { url: img.currentSrc || img.src, w: img.naturalWidth || Number(img.getAttribute('width')) || 0 };
  for (const part of (img.getAttribute('srcset') ?? '').split(',')) {
    const [url, d] = part.trim().split(/\s+/);
    const w = parseInt(d, 10);
    if (url && d?.endsWith('w') && w > best.w) best = { url, w };
  }
  return best;
}

export class Lightbox {
  private dlg?: HTMLDialogElement;
  private bg!: HTMLElement;
  private pic!: HTMLImageElement;
  private cap!: HTMLElement;
  private count!: HTMLElement;
  private items: Item[] = [];
  private i = 0;
  private pushed = false;
  private closing = false;
  private lastFocus: HTMLElement | null = null;
  private rect = { x: 0, y: 0, w: 0, h: 0 };

  constructor(private pause: (on: boolean) => void, private motion: () => boolean) {
    document.addEventListener('click', (e) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const img = (e.target as Element).closest?.<HTMLImageElement>('img');
      if (!img || !img.matches(ZOOMABLE) || this.isOpen) return;
      e.preventDefault();
      this.open(img);
    });
    // Dentro de la ventana de proyecto las imágenes se pueden enfocar y abrir con Intro o Espacio.
    document.addEventListener('keydown', (e) => {
      const img = e.target as HTMLElement;
      if ((e.key !== 'Enter' && e.key !== ' ') || !(img instanceof HTMLImageElement) || !img.matches(ZOOMABLE)) return;
      e.preventDefault();
      this.open(img);
    });
    addEventListener('popstate', () => { if (this.isOpen && this.pushed) { this.pushed = false; this.close(); } });
  }

  get isOpen() { return !!this.dlg?.open; }

  private build() {
    const d = document.createElement('dialog');
    d.className = 'lb';
    d.innerHTML = `
      <div class="lb__bg"></div>
      <img class="lb__img" alt="" decoding="async">
      <button class="lb__btn lb__close" type="button" data-lb="close"><svg aria-hidden="true"><use href="#i-close"/></svg></button>
      <button class="lb__btn lb__nav lb__nav--prev" type="button" data-lb="prev"><svg aria-hidden="true" style="transform:scaleX(-1)"><use href="#i-arrow"/></svg></button>
      <button class="lb__btn lb__nav lb__nav--next" type="button" data-lb="next"><svg aria-hidden="true"><use href="#i-arrow"/></svg></button>
      <p class="lb__foot"><span class="lb__cap"></span><span class="lb__count"></span></p>`;
    document.body.append(d);
    this.dlg = d;
    this.bg = d.querySelector('.lb__bg')!;
    this.pic = d.querySelector('.lb__img')!;
    this.cap = d.querySelector('.lb__cap')!;
    this.count = d.querySelector('.lb__count')!;

    // Pulsar en cualquier parte cierra; los botones hacen lo suyo.
    let dragged = false;
    d.addEventListener('click', (e) => {
      const b = (e.target as Element).closest<HTMLElement>('[data-lb]');
      if (b?.dataset.lb === 'prev') return this.step(-1);
      if (b?.dataset.lb === 'next') return this.step(1);
      if (dragged) { dragged = false; return; }
      this.close();
    });
    d.addEventListener('cancel', (e) => { e.preventDefault(); this.close(); });
    // Pase lo que pase (también si el navegador lo cierra sin animación), al cerrarse se deja todo como estaba.
    d.addEventListener('close', () => this.cleanup());
    d.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); this.step(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); this.step(-1); }
    });

    // Deslizar: la imagen sigue al dedo; a los lados cambia de imagen, hacia abajo (o arriba) cierra.
    let sx = 0, sy = 0, id = -1, axis: '' | 'x' | 'y' = '';
    d.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' || (e.target as Element).closest('[data-lb]') || this.zoomed()) return;
      id = e.pointerId; sx = e.clientX; sy = e.clientY; axis = ''; dragged = false;
    });
    d.addEventListener('pointermove', (e) => {
      if (e.pointerId !== id) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (!axis && Math.hypot(dx, dy) > 8) axis = Math.abs(dx) > Math.abs(dy) && this.items.length > 1 ? 'x' : 'y';
      if (!axis) return;
      dragged = true;
      this.pic.style.transform = axis === 'x' ? `translateX(${dx}px)` : `translateY(${dy}px) scale(${1 - Math.min(Math.abs(dy) / 1600, 0.12)})`;
      if (axis === 'y') this.bg.style.opacity = String(1 - Math.min(Math.abs(dy) / 400, 0.6));
    });
    const end = (e: PointerEvent) => {
      if (e.pointerId !== id) return;
      id = -1;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (axis === 'x' && Math.abs(dx) > 60) this.step(dx < 0 ? 1 : -1, dx);
      else if (axis === 'y' && Math.abs(dy) > 90) this.close();
      else if (axis) this.settle();
      axis = '';
    };
    d.addEventListener('pointerup', end);
    d.addEventListener('pointercancel', end);

    // Con el pellizco del móvil la página se amplía: mientras dure se permite desplazar la vista, no deslizar.
    const vv = window.visualViewport;
    vv?.addEventListener('resize', () => { d.style.touchAction = this.zoomed() ? 'auto' : 'pinch-zoom'; });
    addEventListener('resize', () => { if (this.isOpen) { this.place(this.items[this.i]); this.apply(); } });
  }

  private zoomed() { return (window.visualViewport?.scale ?? 1) > 1.01; }

  open(img: HTMLImageElement) {
    if (!this.dlg) this.build();
    const group = img.closest(GROUP) ?? img.parentElement!;
    const els = [...group.querySelectorAll<HTMLImageElement>(ZOOMABLE)].filter((x) => x.getBoundingClientRect().width > 0);
    this.items = els.map((el) => {
      const big = largest(el);
      const ratio = (el.naturalHeight || Number(el.getAttribute('height'))) / (el.naturalWidth || Number(el.getAttribute('width')));
      const cap = el.closest('figure')?.querySelector('figcaption')?.textContent?.trim() || el.alt || '';
      return { el, hi: big.url, w: big.w, h: big.w * ratio, cap };
    });
    this.i = Math.max(0, els.indexOf(img));
    const d = this.dlg!;
    const L_ = L();
    d.setAttribute('aria-label', label.view[L_]);
    d.querySelector('.lb__close')!.setAttribute('aria-label', label.close[L_]);
    d.querySelector('.lb__nav--prev')!.setAttribute('aria-label', label.prev[L_]);
    d.querySelector('.lb__nav--next')!.setAttribute('aria-label', label.next[L_]);
    d.classList.toggle('is-single', this.items.length < 2);

    this.lastFocus = document.activeElement as HTMLElement;
    this.closing = false;
    this.bg.style.opacity = '';
    d.style.touchAction = 'pinch-zoom';
    d.showModal();
    document.documentElement.classList.add('lb-open');
    this.pause(true);
    history.pushState({ ...(history.state ?? {}), lb: true }, '');
    this.pushed = true;
    (d.querySelector('.lb__close') as HTMLElement).focus({ preventScroll: true });

    this.show(this.i, 0, img.getBoundingClientRect());
  }

  /** Coloca la imagen `item` centrada y ajustada a la pantalla, sin pasar de su tamaño real. */
  private place(item: Item) {
    const vw = innerWidth, vh = innerHeight, narrow = vw < 700;
    const padX = narrow ? 12 : 88, padTop = narrow ? 64 : 72, padBot = narrow ? 112 : 84;
    const k = Math.min((vw - padX * 2) / item.w, (vh - padTop - padBot) / item.h, 1.25);
    const w = item.w * k, h = item.h * k;
    this.rect = { x: (vw - w) / 2, y: padTop + (vh - padTop - padBot - h) / 2, w, h };
  }

  private apply() {
    const { x, y, w, h } = this.rect;
    Object.assign(this.pic.style, { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px` });
  }

  /** Muestra la imagen i: desde su miniatura (`from`) al abrir, o entrando por un lado (`dir`) al cambiar. */
  private show(i: number, dir: number, from?: DOMRect) {
    const item = this.items[i];
    this.i = i;
    this.pic.style.transform = '';
    this.pic.alt = item.el.alt;
    this.cap.textContent = item.cap;
    this.count.textContent = this.items.length > 1 ? `${i + 1} / ${this.items.length}` : '';
    // Primero lo que ya está en memoria (la miniatura); la grande, en cuanto llegue y esté decodificada.
    this.pic.src = item.el.currentSrc || item.el.src;
    this.place(item);
    this.apply();
    if (item.hi !== this.pic.src) {
      const big = new Image();
      big.src = item.hi;
      big.decode().then(() => { if (this.items[this.i] === item && this.isOpen) this.pic.src = item.hi; }, () => {});
    }
    // Las vecinas, para que al pasar ya estén.
    for (const n of [i + 1, i - 1]) { const it = this.items[(n + this.items.length) % this.items.length]; if (it && it !== item) new Image().src = it.hi; }

    if (!this.motion()) return;
    if (from && from.width > 0) {
      const { x, y, w, h } = this.rect;
      const s = from.width / w;
      const dx = from.left + from.width / 2 - (x + w / 2), dy = from.top + from.height / 2 - (y + h / 2);
      this.pic.animate([{ transform: `translate(${dx}px, ${dy}px) scale(${s})`, opacity: 0.5 }, { transform: 'none', opacity: 1 }], { duration: 480, easing: EASE });
      this.bg.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 320, easing: 'ease-out' });
      this.dlg!.querySelectorAll('.lb__btn, .lb__foot').forEach((el) => el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: 160, fill: 'backwards' }));
    } else if (dir) {
      this.pic.animate([{ transform: `translateX(${dir * 48}px)`, opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 320, easing: EASE });
    }
  }

  private step(dir: 1 | -1, dragged = 0) {
    if (this.items.length < 2 || this.closing) return;
    const n = (this.i + dir + this.items.length) % this.items.length;
    if (dragged) this.pic.style.transform = '';
    this.show(n, dir);
  }

  /** Vuelve a su sitio tras un deslizamiento que no llegó a nada. */
  private settle() {
    const t = this.pic.style.transform;
    this.pic.style.transform = '';
    this.bg.style.opacity = '';
    if (this.motion() && t) this.pic.animate([{ transform: t }, { transform: 'none' }], { duration: 260, easing: EASE });
  }

  private cleanup() {
    if (!document.documentElement.classList.contains('lb-open')) return;
    if (this.pushed) { this.pushed = false; history.back(); }
    this.dlg!.getAnimations({ subtree: true }).forEach((a) => a.cancel());
    this.pic.removeAttribute('src');
    this.bg.style.opacity = '';
    document.documentElement.classList.remove('lb-open');
    this.pause(false);
    this.closing = false;
    this.lastFocus?.focus({ preventScroll: true });
  }

  close() {
    if (!this.isOpen || this.closing) return;
    // Si se abrió con una entrada en el historial, se cierra volviendo atrás (y el popstate llega aquí otra vez).
    if (this.pushed) { this.pushed = false; history.back(); }
    this.closing = true;
    const d = this.dlg!;
    const done = () => d.close();
    if (!this.motion()) return done();
    const thumb = this.items[this.i].el.getBoundingClientRect();
    const visible = thumb.width > 0 && thumb.bottom > 0 && thumb.top < innerHeight;
    const { x, y, w, h } = this.rect;
    const now = this.pic.style.transform || 'none';
    const to = visible
      ? `translate(${thumb.left + thumb.width / 2 - (x + w / 2)}px, ${thumb.top + thumb.height / 2 - (y + h / 2)}px) scale(${thumb.width / w})`
      : 'scale(0.92)';
    this.pic.animate([{ transform: now, opacity: 1 }, { transform: to, opacity: visible ? 0.4 : 0 }], { duration: 380, easing: EASE, fill: 'forwards' });
    d.querySelectorAll('.lb__btn, .lb__foot').forEach((el) => el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, fill: 'forwards' }));
    this.bg.animate([{ opacity: getComputedStyle(this.bg).opacity }, { opacity: 0 }], { duration: 340, easing: 'ease-out', fill: 'forwards' })
      .finished.then(done, done);
  }
}

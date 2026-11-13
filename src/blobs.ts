// Formas irregulares (sistemas de presión) para la presentación del hero y las tecnologías.
// Cada [data-blob="semilla"] recibe un cuerpo recortado con un clipPath en unidades del propio elemento y una o dos
// isobaras dibujadas alrededor. Las formas son fijas y deterministas; el movimiento (flotar, respirar) es CSS y solo
// usa transformaciones, así que no repinta nada mientras se anima.

const SVG = 'http://www.w3.org/2000/svg';

function rng(seed: number) {
  let a = seed * 2654435761;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Canto de papel: cuánto se deshilacha el contorno en cada eje (en unidades de la caja, 0..1) y cuántos puntos por
 *  tramo de curva se toman. */
export type Paper = { ax: number; ay: number; n: number };

/** Contorno cerrado y suave en el cuadrado 0..1: un superelipse (cubre bien las esquinas del texto) con el radio
 *  alterado punto a punto y unido con curvas de Catmull-Rom. Con `paper`, la curva se muestrea fina y cada punto se
 *  desplaza un poco (con algún mordisco algo mayor), como el borde de un papel cortado o rasgado; determinista. */
export function blobPath(seed: number, points = 7, wobble = 0.12, round = 2.7, paper?: Paper): string {
  const r = rng(seed);
  const pts: [number, number][] = [];
  const turn = r() * Math.PI * 2;
  for (let i = 0; i < points; i++) {
    const a = turn + (i / points) * Math.PI * 2 + (r() - 0.5) * 0.35;
    const c = Math.cos(a), s = Math.sin(a);
    const k = 1 - wobble + r() * wobble * 1.4;
    const x = Math.sign(c) * Math.abs(c) ** (2 / round);
    const y = Math.sign(s) * Math.abs(s) ** (2 / round);
    pts.push([0.5 + 0.5 * x * k, 0.5 + 0.5 * y * k]);
  }
  const at = (i: number) => pts[(i + points) % points];
  // Tramos Bézier (control, control, punto) de la curva de Catmull-Rom.
  const segs: [number, number][][] = [];
  for (let i = 0; i < points; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    segs.push([
      [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6],
      [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6],
      [p2[0], p2[1]],
    ]);
  }
  // El recorte no puede pintar fuera de la caja del elemento: si la forma se sale (el radio alterado y las curvas
  // pueden pasar de 0..1), se encoge hacia el centro hasta caber; si no, queda igual. La curva está dentro del
  // polígono de sus puntos de control, así que basta con que quepan ellos.
  const all = [pts[0], ...segs.flat()];
  const fit = (k: 0 | 1) => {
    const lo = Math.min(...all.map((q) => q[k])), hi = Math.max(...all.map((q) => q[k]));
    return Math.min(1, 0.496 / (0.5 - lo), 0.496 / (hi - 0.5));
  };
  const sx = fit(0), sy = fit(1);
  const f = (n: number, sc: number) => (0.5 + (n - 0.5) * sc).toFixed(4);
  const pt = (q: [number, number]) => `${f(q[0], sx)} ${f(q[1], sy)}`;
  if (!paper) return `M${pt(pts[0])}` + segs.map((sg) => `C${sg.map(pt).join(' ')}`).join('') + 'Z';

  // Borde de papel: puntos sobre cada tramo Bézier, escalados como la curva y desplazados por un ruido suave a lo
  // largo del contorno (valores al azar cada pocos puntos, interpolados) con una fibra fina encima: un canto
  // irregular pero continuo, no un serrucho.
  const jr = rng(seed * 31 + 7);
  const total = segs.length * paper.n, step = 3;
  const knots = Array.from({ length: Math.ceil(total / step) + 1 }, () => [jr() * 2 - 1, jr() * 2 - 1]);
  knots[knots.length - 1] = knots[0]; // cierra sin salto
  const smooth = (i: number, c: 0 | 1) => {
    const a = i / step, k = Math.floor(a), u = a - k, s = u * u * (3 - 2 * u);
    return knots[k][c] + (knots[Math.min(k + 1, knots.length - 1)][c] - knots[k][c]) * s;
  };
  const out: string[] = [];
  let start = pts[0], idx = 0;
  const clamp = (n: number) => Math.min(0.998, Math.max(0.002, n));
  for (const [c1, c2, end] of segs) {
    for (let k = 0; k < paper.n; k++, idx++) {
      const u = k / paper.n, v = 1 - u;
      const x = v * v * v * start[0] + 3 * v * v * u * c1[0] + 3 * v * u * u * c2[0] + u * u * u * end[0];
      const y = v * v * v * start[1] + 3 * v * v * u * c1[1] + 3 * v * u * u * c2[1] + u * u * u * end[1];
      const px = 0.5 + (x - 0.5) * sx, py = 0.5 + (y - 0.5) * sy;
      const dx = paper.ax * (0.8 * smooth(idx, 0) + 0.25 * (jr() * 2 - 1));
      const dy = paper.ay * (0.8 * smooth(idx, 1) + 0.25 * (jr() * 2 - 1));
      out.push(`${clamp(px + dx).toFixed(4)} ${clamp(py + dy).toFixed(4)}`);
    }
    start = end;
  }
  return `M${out.join('L')}Z`;
}

/** Lee data-paper="ax ay n" de un elemento. */
const paperOf = (el: HTMLElement): Paper | undefined => {
  const v = el.dataset.paper?.trim().split(/\s+/).map(Number);
  return v && v.length === 3 && v.every(Number.isFinite) ? { ax: v[0], ay: v[1], n: v[2] } : undefined;
};

// Un único <defs> para todos los recortes: las ventanas de proyecto vuelven a montar sus botones cada vez que se pintan.
let defsIn: SVGDefsElement | null = null;
function defs() {
  if (defsIn) return defsIn;
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.setAttribute('aria-hidden', 'true');
  svg.style.position = 'absolute';
  defsIn = document.createElementNS(SVG, 'defs');
  svg.append(defsIn);
  document.body.append(svg);
  return defsIn;
}

export function mountBlobs(root: ParentNode = document) {
  // Solo los que aún no tienen forma.
  const hosts = [...root.querySelectorAll<HTMLElement>('[data-blob]:not([data-blob-on])')];
  for (const host of hosts) {
    host.dataset.blobOn = '';
    const seed = Number(host.dataset.blob) || 1;
    const rings = Number(host.dataset.rings ?? 1);
    const paper = paperOf(host);
    // Con canto de papel la forma es otra: su propio recorte, aunque la semilla se repita.
    const id = paper ? `blob-${seed}-papel` : `blob-${seed}`;
    // La misma semilla da la misma forma: el recorte se crea una vez y se comparte.
    if (!document.getElementById(id)) {
      const clip = document.createElementNS(SVG, 'clipPath');
      clip.id = id;
      clip.setAttribute('clipPathUnits', 'objectBoundingBox');
      const cp = document.createElementNS(SVG, 'path');
      cp.setAttribute('d', blobPath(seed, 7, 0.12, 2.7, paper));
      clip.append(cp);
      defs().append(clip);
    }

    const frag = document.createDocumentFragment();
    for (let n = rings; n >= 1; n--) {
      const svg = document.createElementNS(SVG, 'svg');
      svg.setAttribute('class', `shape__iso shape__iso--${n}`);
      svg.setAttribute('viewBox', '0 0 1 1');
      svg.setAttribute('preserveAspectRatio', 'none');
      svg.setAttribute('aria-hidden', 'true');
      const p = document.createElementNS(SVG, 'path');
      p.setAttribute('d', blobPath(seed * 7 + n, 7, 0.1));
      p.setAttribute('vector-effect', 'non-scaling-stroke');
      svg.append(p);
      frag.append(svg);
    }
    const body = document.createElement('span');
    body.className = 'shape__body';
    body.setAttribute('aria-hidden', 'true');
    const fill = document.createElement('span');
    fill.className = 'shape__fill';
    fill.style.clipPath = `var(--blob-clip, url(#${id}))`;
    // data-blob-alt="<redondez>": una variante más cuadrada de la misma forma, que el CSS elige con
    // --blob-clip: var(--blob-alt) donde la caja es estrecha y la forma normal dejaría las esquinas del texto fuera.
    const alt = Number(host.dataset.blobAlt);
    if (alt) {
      const altId = `${id}-alt`;
      if (!document.getElementById(altId)) {
        const clip = document.createElementNS(SVG, 'clipPath');
        clip.id = altId;
        clip.setAttribute('clipPathUnits', 'objectBoundingBox');
        const cp = document.createElementNS(SVG, 'path');
        cp.setAttribute('d', blobPath(seed, 7, 0.06, alt, paper));
        clip.append(cp);
        defs().append(clip);
      }
      host.style.setProperty('--blob-alt', `url(#${altId})`);
    }
    // data-cut: un troquel blanco con la misma silueta, algo mayor, detrás del color (como una pegatina).
    if (host.hasAttribute('data-cut')) {
      const cut = document.createElement('span');
      cut.className = 'shape__cut';
      cut.style.clipPath = fill.style.clipPath;
      body.append(cut);
    }
    body.append(fill);
    frag.append(body);
    host.prepend(frag);
  }
}

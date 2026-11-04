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

/** Contorno cerrado y suave en el cuadrado 0..1: un superelipse (cubre bien las esquinas del texto) con el radio
 *  alterado punto a punto y unido con curvas de Catmull-Rom. */
export function blobPath(seed: number, points = 7, wobble = 0.12, round = 2.7): string {
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
  return `M${pt(pts[0])}` + segs.map((sg) => `C${sg.map(pt).join(' ')}`).join('') + 'Z';
}

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
    const id = `blob-${seed}`;
    // La misma semilla da la misma forma: el recorte se crea una vez y se comparte.
    if (!document.getElementById(id)) {
      const clip = document.createElementNS(SVG, 'clipPath');
      clip.id = id;
      clip.setAttribute('clipPathUnits', 'objectBoundingBox');
      const cp = document.createElementNS(SVG, 'path');
      cp.setAttribute('d', blobPath(seed));
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
        cp.setAttribute('d', blobPath(seed, 7, 0.06, alt));
        clip.append(cp);
        defs().append(clip);
      }
      host.style.setProperty('--blob-alt', `url(#${altId})`);
    }
    body.append(fill);
    frag.append(body);
    host.prepend(frag);
  }
}

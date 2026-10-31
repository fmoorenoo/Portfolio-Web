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
  const f = (n: number) => n.toFixed(4);
  const at = (i: number) => pts[(i + points) % points];
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < points; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d + 'Z';
}

export function mountBlobs(root: ParentNode = document) {
  const hosts = [...root.querySelectorAll<HTMLElement>('[data-blob]')];
  if (!hosts.length) return;
  const defs = document.createElementNS(SVG, 'svg');
  defs.setAttribute('width', '0');
  defs.setAttribute('height', '0');
  defs.setAttribute('aria-hidden', 'true');
  defs.style.position = 'absolute';
  const defsIn = document.createElementNS(SVG, 'defs');
  defs.append(defsIn);

  for (const host of hosts) {
    const seed = Number(host.dataset.blob) || 1;
    const rings = Number(host.dataset.rings ?? 1);
    const id = `blob-${seed}`;
    const clip = document.createElementNS(SVG, 'clipPath');
    clip.id = id;
    clip.setAttribute('clipPathUnits', 'objectBoundingBox');
    const cp = document.createElementNS(SVG, 'path');
    cp.setAttribute('d', blobPath(seed));
    clip.append(cp);
    defsIn.append(clip);

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
    fill.style.clipPath = `url(#${id})`;
    body.append(fill);
    frag.append(body);
    host.prepend(frag);
  }
  document.body.append(defs);
}

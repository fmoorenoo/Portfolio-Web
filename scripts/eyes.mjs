// Ojos que siguen al cursor: separa iris + pupila de cada ojo en su propia capa.
// Salida (public/img): retrato-recorte-{720,1086}.webp (retrato recortado con el iris sustituido por esclera),
// ojo-{izq,der}-iris.png (iris completo, reconstruido por simetría donde lo tapa el párpado),
// ojo-{izq,der}-mask.png (apertura del ojo, para recortar el iris en movimiento) y src/eyes.json (geometría en %).
// Uso: node scripts/eyes.mjs  (fuente: ../profile.png)
import sharp from 'sharp';
import { writeFile, mkdir } from 'node:fs/promises';

const SRC = '../profile.png';
const TOP = 250; // mismo encuadre de busto que el retrato anterior
const EYES = [
  // lid: contorno de la apertura (borde de las pestañas arriba, del párpado inferior abajo), trazado sobre
  // ampliaciones con rejilla de la foto (assets-src/eyes/grid-*.png): esquina, párpado superior, esquina, inferior.
  { name: 'izq', cx: 459, cy: 723, r: 18.5, box: [405, 698, 508, 752],
    lid: [[414, 726], [420, 721.5], [430, 717.5], [440, 715], [450, 714], [460, 714], [470, 714.5], [480, 716.5], [490, 720], [497, 725], [501, 730],
      [497, 732.5], [490, 735], [480, 738.5], [470, 741], [460, 742], [450, 741.5], [440, 739.5], [430, 736], [420, 731]] },
  { name: 'der', cx: 657.3, cy: 719, r: 18.5, box: [603, 694, 714, 748],
    lid: [[609, 726], [615, 719.5], [623, 715], [633, 712.5], [643, 710], [653, 709], [663, 709], [673, 710.5], [683, 714], [693, 719], [699, 725],
      [693, 728.5], [683, 732.5], [673, 736], [663, 738], [653, 738], [643, 736.5], [633, 734], [623, 732], [613, 729]] },
];

const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height;
const out = Buffer.from(data); // base editable
const idx = (x, y) => (y * W + x) * 3;
const get = (buf, x, y) => { const i = idx(x, y); return [buf[i], buf[i + 1], buf[i + 2]]; };

await mkdir('public/img', { recursive: true });
const geometry = { width: W, height: H - TOP, eyes: {} };

for (const e of EYES) {
  const [x0, y0, x1, y1] = e.box, bw = x1 - x0, bh = y1 - y0;
  const d = (x, y) => Math.hypot(x - e.cx, y - e.cy);
  const inDisc = (x, y) => d(x, y) <= e.r + 0.5;

  // 1. Apertura: contorno trazado como curva cerrada suave (Catmull-Rom), rasterizado con antialias.
  const P = e.lid.map(([x, y]) => [x - x0, y - y0]);
  let path = `M${P[0][0]} ${P[0][1]}`;
  for (let k = 0; k < P.length; k++) {
    const p0 = P[(k - 1 + P.length) % P.length], p1 = P[k], p2 = P[(k + 1) % P.length], p3 = P[(k + 2) % P.length];
    path += ` C${p1[0] + (p2[0] - p0[0]) / 6} ${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6} ${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]} ${p2[1]}`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${bw}" height="${bh}"><path d="${path} Z" fill="#fff"/></svg>`;
  const alpha = await sharp(Buffer.from(svg)).extractChannel('alpha').raw().toBuffer();
  // Para el relleno de la base se usan los bordes de la curva como límites superior e inferior por columna.
  const st = [], sb = [];
  for (let x = 0; x < bw; x++) {
    let t = -1, bo = -1;
    for (let y = 0; y < bh; y++) if (alpha[y * bw + x] > 127) { if (t < 0) t = y; bo = y; }
    st.push(t); sb.push(bo);
  }
  const opened = (x, y) => x >= x0 && x < x1 && y >= y0 && y < y1 && alpha[(y - y0) * bw + (x - x0)] > 127;

  // 2. Capa de iris: círculo completo; lo tapado por el párpado se toma del mismo radio en otro ángulo visible.
  const R = Math.ceil(e.r) + 1, size = R * 2 + 1;
  const iris = Buffer.alloc(size * size * 4);
  for (let j = 0; j < size; j++) for (let i = 0; i < size; i++) {
    const x = Math.round(e.cx) - R + i, y = Math.round(e.cy) - R + j;
    const dist = d(x, y);
    if (dist > e.r + 1) continue;
    let p;
    if (opened(x, y)) p = get(data, x, y);
    else {
      const th = Math.atan2(y - e.cy, x - e.cx);
      for (let k = 1; k < 180 && !p; k++) for (const s of [1, -1]) {
        const t = th + s * k * (Math.PI / 180) * 2;
        const sx = Math.round(e.cx + dist * Math.cos(t)), sy = Math.round(e.cy + dist * Math.sin(t));
        if (opened(sx, sy)) { p = get(data, sx, sy); break; }
      }
      p ??= get(data, x, y);
    }
    const o = (j * size + i) * 4;
    iris[o] = p[0]; iris[o + 1] = p[1]; iris[o + 2] = p[2];
    iris[o + 3] = Math.round(Math.min(1, Math.max(0, e.r + 0.5 - dist)) * 255);
  }
  await sharp(iris, { raw: { width: size, height: size, channels: 4 } }).png({ compressionLevel: 9 }).toFile(`public/img/ojo-${e.name}-iris.png`);

  // 3. Base: el hueco del iris dentro de la apertura se rellena con la esclera de la misma fila.
  for (let y = y0; y < y1; y++) {
    const row = [];
    for (let x = x0; x < x1; x++) if (opened(x, y) && d(x, y) > e.r + 1.5) row.push(x);
    for (let x = x0; x < x1; x++) {
      if (!(opened(x, y) && d(x, y) <= e.r + 1.5)) continue;
      const L = row.filter((v) => v < x).pop(), Rr = row.find((v) => v > x);
      let c;
      // Color de esclera de cada lado: media de los 4 píxeles visibles más cercanos, no uno solo.
      const avg = (xs) => { const c = [0, 0, 0]; xs.forEach((v) => get(data, v, y).forEach((n, k) => (c[k] += n / xs.length))); return c; };
      if (L !== undefined && Rr !== undefined) {
        const a = avg(row.filter((v) => v <= L).slice(-4)), b = avg(row.filter((v) => v >= Rr).slice(0, 4)), t = (x - L) / (Rr - L);
        c = a.map((v, k) => v + (b[k] - v) * t);
      } else c = get(data, L ?? Rr ?? x, y);
      // Una sombra suave bajo el párpado superior, como la que proyecta en la esclera real.
      const shade = Math.max(0, 1 - (y - (st[x - x0] + y0)) / 7) * 0.18;
      const i = idx(x, y);
      out[i] = c[0] * (1 - shade); out[i + 1] = c[1] * (1 - shade); out[i + 2] = c[2] * (1 - shade);
    }
  }

  // Desenfoque suave solo dentro del hueco rellenado, para que no queden bandas por fila.
  for (let pass = 0; pass < 3; pass++) {
    const copy = Buffer.from(out);
    for (let y = y0 + 1; y < y1 - 1; y++) for (let x = x0 + 1; x < x1 - 1; x++) {
      if (!(opened(x, y) && d(x, y) <= e.r + 1.5)) continue;
      const c = [0, 0, 0]; let n = 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { if (!opened(x + dx, y + dy)) continue; const p = get(copy, x + dx, y + dy); c[0] += p[0]; c[1] += p[1]; c[2] += p[2]; n++; }
      const i = idx(x, y); out[i] = c[0] / n; out[i + 1] = c[1] / n; out[i + 2] = c[2] / n;
    }
  }

  const mask = Buffer.alloc(bw * bh * 4);
  for (let k = 0; k < bw * bh; k++) { mask[k * 4 + 3] = alpha[k]; }
  await sharp(mask, { raw: { width: bw, height: bh, channels: 4 } }).png({ compressionLevel: 9 }).toFile(`public/img/ojo-${e.name}-mask.png`);

  const pct = (v, total) => +((v / total) * 100).toFixed(4);
  geometry.eyes[e.name] = {
    box: { left: pct(x0, W), top: pct(y0 - TOP, H - TOP), width: pct(bw, W), height: pct(bh, H - TOP) },
    iris: { left: pct(Math.round(e.cx) - R - x0, bw), top: pct(Math.round(e.cy) - R - y0, bh), width: pct(size, bw), height: pct(size, bh) },
    // Recorrido máximo del iris dentro de su propio tamaño (horizontal amplio, vertical corto como un ojo real).
    travel: { x: 0.2, y: 0.09 },
  };
}

// Retrato del hero: la base (con los iris ya separados) y el matte propio como alfa, con el encuadre de busto de TOP.
{
  const matte = await sharp('assets-src/portrait-matte.png').greyscale().raw().toBuffer();
  const rgba = Buffer.alloc(W * H * 4);
  for (let i = 0; i < W * H; i++) {
    rgba[i * 4] = out[i * 3]; rgba[i * 4 + 1] = out[i * 3 + 1]; rgba[i * 4 + 2] = out[i * 3 + 2];
    rgba[i * 4 + 3] = matte[i];
  }
  const cut = sharp(rgba, { raw: { width: W, height: H, channels: 4 } }).extract({ left: 0, top: TOP, width: W, height: H - TOP });
  for (const w of [720, 1086]) await cut.clone().resize(w).webp({ quality: 88, alphaQuality: 95 }).toFile(`public/img/retrato-recorte-${w}.webp`);
}
await writeFile('src/eyes.json', JSON.stringify(geometry, null, 2));
// Control visual: los dos ojos ampliados de la base sin iris.
await sharp(out, { raw: { width: W, height: H, channels: 3 } }).extract({ left: 400, top: 680, width: 320, height: 90 }).resize(1280, 360, { kernel: 'nearest' }).png().toFile('assets-src/eyes/base-check.png');
console.log(JSON.stringify(geometry.eyes));

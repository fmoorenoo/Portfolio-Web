// Retrato con los ojos ya puestos (public/img/retrato-{720,1086}.webp): la base sin iris de scripts/eyes.mjs con cada
// iris en reposo, recortado por la apertura de su ojo. Es la foto que se carga siempre, así nunca se ve sin ojos aunque
// la red vaya lenta; la base sin iris y sus capas solo se piden en escritorio, al elegir el modo «ojos».
// Uso: node scripts/portrait-eyes.mjs  (después de scripts/eyes.mjs)
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';

const IMG = 'public/img';
const geo = JSON.parse(await readFile('src/eyes.json', 'utf8'));
const base = sharp(`${IMG}/retrato-recorte-1086.webp`);
const { width: W, height: H } = await base.metadata();
const px = (pct, total) => Math.round((pct / 100) * total);

const layers = [];
for (const [name, e] of Object.entries(geo.eyes)) {
  const bw = px(e.box.width, W), bh = px(e.box.height, H);
  const iris = await sharp(`${IMG}/ojo-${name}-iris.png`).toBuffer();
  const mask = await sharp(`${IMG}/ojo-${name}-mask.png`).resize(bw, bh).toBuffer();
  // El iris en su sitio dentro de la caja del ojo, recortado por la apertura (igual que .eye en styles.css).
  const eye = await sharp({ create: { width: bw, height: bh, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([
      { input: iris, left: px(e.iris.left, bw), top: px(e.iris.top, bh) },
      { input: mask, blend: 'dest-in' },
    ])
    .png().toBuffer();
  layers.push({ input: eye, left: px(e.box.left, W), top: px(e.box.top, H) });
}

const full = await base.composite(layers).png().toBuffer();
for (const w of [720, 1086]) {
  await sharp(full).resize(w).webp({ quality: 88, alphaQuality: 95 }).toFile(`${IMG}/retrato-${w}.webp`);
  console.log(`retrato-${w}.webp`);
}

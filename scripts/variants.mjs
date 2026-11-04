// Tamaños menores de las imágenes que se muestran pequeñas, para que el srcset sirva la justa (Lighthouse: hasta
// 225 KiB de más en escritorio). Salen de las versiones grandes ya publicadas en public/img; la mayor sigue en el
// srcset, y el visor a pantalla completa (src/lightbox.ts) usa siempre esa.
//   node scripts/variants.mjs
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

const IMG = 'public/img';
const jobs = [
  // LanzaMet: el móvil se muestra a ~170 px en escritorio; las pantallas de escritorio, a ~490 px.
  ...['', '-donde', '-mar', '-atardecer'].map((v) => [`lanzamet-movil${v}-900.webp`, `lanzamet-movil${v}-450.webp`, 450]),
  ...['hoy', 'donde', 'mar', 'atardecer'].map((v) => [`lanzamet-${v}-1600.webp`, `lanzamet-${v}-600.webp`, 600]),
  // ACESLAN: los teléfonos se muestran a ~170 px; el panel, a ~560 px.
  ['ac-inicio.webp', 'ac-inicio-360.webp', 360],
  ['ac-incidencias.webp', 'ac-incidencias-360.webp', 360],
  ['ac-panel-incidencias-1440.webp', 'ac-panel-incidencias-600.webp', 600],
  // Retrato en el móvil (~360 px a 1,75×).
  ['retrato-1086.webp', 'retrato-640.webp', 640],
  // Logos del menú (46 px) y de Formación (24 px): a 2×.
  ['logo-lanzamet.webp', 'logo-lanzamet-92.webp', 92],
  ['logo-haircloud.webp', 'logo-haircloud-92.webp', 92],
];
for (const [from, to, w] of jobs) {
  const info = await sharp(`${IMG}/${from}`).resize({ width: w }).webp({ quality: 84, alphaQuality: 90 }).toFile(`${IMG}/${to}`);
  await writeFile(`${IMG}/${to}.json`, JSON.stringify({ prompt: `Origen: ${from}, reducida a ${w} px de ancho por scripts/variants.mjs`, createdAt: new Date().toISOString() }, null, 2));
  console.log(to, `${info.width}×${info.height}`, `${Math.round(info.size / 1024)} KiB`);
}

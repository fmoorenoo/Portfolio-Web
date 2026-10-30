// Pipeline de activos: máscara de la isla y capturas de HairCloud y ACESLAN (el retrato va en scripts/eyes.mjs).
// Uso: node scripts/assets.mjs  (las fuentes viven fuera del repo, en la carpeta superior)
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';

const OUT = 'public/img';
const SRC = '..';
await mkdir(OUT, { recursive: true });

// El retrato y las capas de los ojos se generan aparte: node scripts/eyes.mjs

// Máscara de la isla: la silueta negra pasa a alfa puro (el halo blanco del original desaparece).
{
  const { data, info } = await sharp(`assets-src/isla.png`).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < info.width * info.height; i++) {
    const lum = (data[i * 4] + data[i * 4 + 1] + data[i * 4 + 2]) / 765;
    const a = (data[i * 4 + 3] / 255) * (1 - lum);
    const t = Math.min(1, Math.max(0, (a - 0.35) / 0.3));
    out[i * 4] = out[i * 4 + 1] = out[i * 4 + 2] = 0;
    out[i * 4 + 3] = Math.round(t * t * (3 - 2 * t) * 255);
  }
  await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(`${OUT}/isla-mask.png`);
  console.log('isla-mask');
}

await writeFile('assets-src/provenance.json', JSON.stringify({
  'retrato-base-*.webp, ojo-*-iris.png, ojo-*-mask.png': '../profile.png (retrato propio, autorizado), procesado por scripts/eyes.mjs',
  'isla-mask.png': 'assets-src/isla.png (silueta de Lanzarote extraída del mapa base de LanzaMet)',
}, null, 2));

// HairCloud: diagrama de datos del anteproyecto (repositorio público).
await sharp('assets-src/haircloud/diagram_image.png').resize(1200).webp({ quality: 82 }).toFile(`${OUT}/haircloud-datos.webp`);
// Capturas reales de la app (emulador Android, API Flask + PostgreSQL en local, datos de demostración): sin la barra de navegación.
for (const n of ['login', 'barberias', 'detalle', 'reserva', 'agenda']) {
  await sharp(`assets-src/haircloud/app/${n}.png`).extract({ left: 0, top: 0, width: 1080, height: 2272 }).resize(640).webp({ quality: 84 }).toFile(`${OUT}/hc-${n}.webp`);
}
console.log('haircloud');

// ACESLAN: capturas reales de la app Android (emulador, sin la barra de estado) y del panel web, ejecutados en local
// con el backend (backend-aceslan, Laravel + MariaDB) y sus seeders de demostración.
for (const n of ['login', 'inicio', 'incidencias', 'alertas', 'emergencias', 'formaciones']) {
  await sharp(`assets-src/aceslan/app/${n}.png`).extract({ left: 0, top: 96, width: 1080, height: 2304 }).resize(640).webp({ quality: 84 }).toFile(`${OUT}/ac-${n}.webp`);
}
for (const n of ['incidencias', 'alertas']) {
  for (const w of [900, 1440]) await sharp(`assets-src/aceslan/panel-${n}.png`).resize(w).webp({ quality: 84 }).toFile(`${OUT}/ac-panel-${n}-${w}.webp`);
}
console.log('aceslan');

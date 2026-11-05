// Foto del puesto de trabajo (sección «Tecnologías»), con el fondo ya transparente. Se recorta el margen transparente
// (12 px a la izquierda, 75 arriba, 11 a la derecha: queda en 1425×1011) y sale en tres anchos para el srcset. Las zonas
// de cada pieza (index.html, .spot__hit) van en porcentaje sobre la imagen ya recortada.
//   node scripts/setup.mjs
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

const SRC = 'assets-src/setup/escritorio.png';
for (const w of [640, 1000, 1425]) {
  const to = `public/img/setup-${w}.webp`;
  const info = await sharp(SRC).extract({ left: 12, top: 75, width: 1425, height: 1011 }).resize({ width: w }).webp({ quality: 82, alphaQuality: 90, effort: 6 }).toFile(to);
  await writeFile(`${to}.json`, JSON.stringify({ prompt: `Origen: ${SRC} (foto del escritorio de Fernando), sin el margen transparente y a ${w} px de ancho por scripts/setup.mjs`, createdAt: new Date().toISOString() }, null, 2));
  console.log(to, `${info.width}×${info.height}`, `${Math.round(info.size / 1024)} KiB`);
}

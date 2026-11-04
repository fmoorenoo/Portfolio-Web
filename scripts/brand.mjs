// Favicon e iconos de pantalla de inicio a partir del logotipo FM (assets-src/brand/fm-mark.svg, vectorizado de fm.png).
// Uso: node scripts/brand.mjs
import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';

const BG = '#080616'; // fondo del logotipo original
const W = 916, H = 442; // caja de las letras en fm-mark.svg
const mark = (await readFile('assets-src/brand/fm-mark.svg', 'utf8'))
  .replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/\s*<!--[\s\S]*?-->/g, '').trim();

// Letras de ancho `w` (fracción del lado) centradas en un cuadrado de `size`, sobre el fondo del original o sin fondo.
const tile = (size, w, bg = true) => {
  const s = (size * w) / W;
  const x = (size - W * s) / 2, y = (size - H * s) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">` +
    (bg ? `<rect width="${size}" height="${size}" fill="${BG}"/>` : '') +
    `<g transform="translate(${+x.toFixed(2)} ${+y.toFixed(2)}) scale(${+s.toFixed(5)})">${mark}</g></svg>`;
};
const png = (svg, size) => sharp(Buffer.from(svg), { density: 72 * 4 }).resize(size, size).png({ compressionLevel: 9 }).toBuffer();

// Pestaña del navegador: solo las letras, sin fondo y a todo el ancho, para que se lean a 16 px.
const fav = tile(1000, 1, false);
await writeFile('public/favicon.svg', fav.replace(/ width="1000" height="1000"/, '') + '\n');

// favicon.ico (16, 32 y 48 px) para navegadores sin favicon SVG: un ICO con PNG dentro.
const sizes = [16, 32, 48];
const imgs = await Promise.all(sizes.map((s) => png(fav, s)));
const head = Buffer.alloc(6 + 16 * sizes.length);
head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(sizes.length, 4);
let off = head.length;
sizes.forEach((s, i) => {
  const e = 6 + 16 * i;
  head.writeUInt8(s, e); head.writeUInt8(s, e + 1); head.writeUInt16LE(1, e + 4); head.writeUInt16LE(32, e + 6);
  head.writeUInt32LE(imgs[i].length, e + 8); head.writeUInt32LE(off, e + 12);
  off += imgs[i].length;
});
await writeFile('public/favicon.ico', Buffer.concat([head, ...imgs]));

// Pantalla de inicio: aquí sí con fondo (iOS rellena de negro lo transparente y Android lo pone sobre blanco);
// cuadrado a sangre con la composición del original, el sistema pone las esquinas.
const home = tile(1254, W / 1254);
await writeFile('public/apple-touch-icon.png', await png(home, 180));
await writeFile('public/icon-192.png', await png(home, 192));
await writeFile('public/icon-512.png', await png(home, 512));
// Maskable (Android recorta en círculo o squircle): las letras dentro de la zona segura del 80 %.
await writeFile('public/icon-maskable-512.png', await png(tile(512, 0.66), 512));

console.log('favicon.svg, favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png, icon-maskable-512.png');

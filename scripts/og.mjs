// Imagen para compartir el enlace (og:image, 1200 × 630): el cielo de la carta, el sol de calima y el retrato a la
// derecha, con el nombre y el rol a la izquierda, como el hero.   node scripts/og.mjs
import sharp from 'sharp';

const W = 1200, H = 630;
const bg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C6E2EB"/><stop offset="1" stop-color="#EEF2F0"/></linearGradient>
    <radialGradient id="sun" cx="0.42" cy="0.38" r="0.6"><stop offset="0" stop-color="#FBD58A"/><stop offset="0.52" stop-color="#F6BE55"/><stop offset="1" stop-color="#F4B23E"/></radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  <g fill="none" stroke="#10222C" stroke-opacity="0.1" stroke-width="2">
    <ellipse cx="300" cy="560" rx="420" ry="190"/><ellipse cx="300" cy="560" rx="560" ry="270"/><ellipse cx="300" cy="560" rx="700" ry="350"/>
  </g>
  <circle cx="900" cy="250" r="210" fill="#F4B23E" fill-opacity="0.16"/>
  <circle cx="900" cy="250" r="180" fill="url(#sun)"/>
  <g font-family="Arial Black, Arial, Helvetica, sans-serif" fill="#10222C">
    <text x="64" y="282" font-size="76" font-weight="900" letter-spacing="-2">Fernando</text>
    <text x="64" y="368" font-size="76" font-weight="900" letter-spacing="-2">Montelongo</text>
    <rect x="64" y="398" width="470" height="8" fill="#10222C"/>
    <text x="64" y="458" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="700" fill="#3B505D">Full Stack Developer · Lanzarote</text>
    <text x="64" y="548" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700" fill="#2E6BE6">fer-m.dev</text>
  </g>
</svg>`);
const portrait = await sharp('public/img/retrato-1086.webp').resize({ height: 600 }).toBuffer();
const { width: pw } = await sharp(portrait).metadata();
await sharp(bg)
  .composite([{ input: portrait, left: Math.round(900 - pw / 2), top: H - 600 }])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile('public/og.jpg');
console.log('public/og.jpg', W, '×', H);

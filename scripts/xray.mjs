// Esqueleto para la lente de rayos X del retrato (src/main.ts): el busto anatómico se escala y se coloca sobre un
// lienzo del mismo tamaño que el retrato recortado (1086 × 1198), con las cuencas de los ojos sobre los ojos.
// Uso: node scripts/xray.mjs
import sharp from 'sharp';

const W = 1086, H = 1198;
// Centros de los ojos: retrato (src/eyes.json) y cuencas del cráneo (medidas sobre assets-src/xray/esqueleto.png).
const face = { mid: [557, 473], dist: 203 };
const skull = { mid: [516, 688], dist: 217 };
// En horizontal, la distancia entre ojos; en vertical algo más, para que la mandíbula llegue a la barbilla.
const sx = face.dist / skull.dist, sy = 1;
const src = sharp('assets-src/xray/esqueleto.png');
const { width, height } = await src.metadata();
const w = Math.round(width * sx), h = Math.round(height * sy);
const left = Math.round(face.mid[0] - skull.mid[0] * sx), top = Math.round(face.mid[1] - skull.mid[1] * sy);
const scaled = await src.resize(w, h, { fit: 'fill' }).toBuffer();
// Recorte de la parte que cae dentro del lienzo.
const cx = Math.max(0, -left), cy = Math.max(0, -top);
const piece = await sharp(scaled).extract({ left: cx, top: cy, width: Math.min(w - cx, W - Math.max(0, left)), height: Math.min(h - cy, H - Math.max(0, top)) }).toBuffer();
const canvas = sharp({ create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
  .composite([{ input: piece, left: Math.max(0, left), top: Math.max(0, top) }]);
const full = await canvas.png().toBuffer();
await sharp(full).webp({ quality: 80, alphaQuality: 90 }).toFile('public/img/retrato-esqueleto-1086.webp');
await sharp(full).resize(720).webp({ quality: 80, alphaQuality: 90 }).toFile('public/img/retrato-esqueleto-720.webp');
console.log('retrato-esqueleto', { sx: sx.toFixed(3), left, top });

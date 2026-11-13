// Texturas de papel para las hojas de Proyectos, KORA y Trayectoria: crema con grano y fibras, y el verde bosque de
// los bloques, impreso sobre el mismo papel. Son mosaicos sin costuras (ruido de valor periódico), generados aquí:
// no salen de ninguna imagen ajena. Uso: node scripts/papel.mjs
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

const N = 480; // lado del mosaico, en px

// Generador determinista: la misma textura en cada ejecución.
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Ruido de valor periódico: una rejilla de `cells` celdas por lado que se repite exacta en los bordes. */
function valueNoise(cells, seed) {
  const r = rng(seed);
  const grid = Array.from({ length: cells * cells }, () => r() * 2 - 1);
  const at = (x, y) => grid[((y + cells) % cells) * cells + ((x + cells) % cells)];
  const s = (t) => t * t * (3 - 2 * t);
  return (px, py) => {
    const fx = (px / N) * cells, fy = (py / N) * cells;
    const x0 = Math.floor(fx), y0 = Math.floor(fy);
    const tx = s(fx - x0), ty = s(fy - y0);
    const a = at(x0, y0), b = at(x0 + 1, y0), c = at(x0, y0 + 1), d = at(x0 + 1, y0 + 1);
    return (a + (b - a) * tx) * (1 - ty) + (c + (d - c) * tx) * ty;
  };
}

function paper({ base, seed, mottle, grain, fibres, specks }) {
  const r = rng(seed);
  const n1 = valueNoise(6, seed + 1), n2 = valueNoise(18, seed + 2), n3 = valueNoise(52, seed + 3);
  const lum = new Float32Array(N * N);
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      // Manchas suaves del papel (dos escalas) y un grano fino.
      const m = 0.22 * n1(x, y) + 0.45 * n2(x, y) + 0.4 * n3(x, y);
      lum[y * N + x] = m * mottle + (r() * 2 - 1) * grain;
    }
  }
  // Fibras: trazos cortos y algo curvos, más claros u oscuros, que cruzan los bordes del mosaico sin cortarse.
  for (let i = 0; i < fibres; i++) {
    let x = r() * N, y = r() * N;
    let ang = r() * Math.PI * 2;
    const len = 6 + r() * 22, tone = (r() < 0.55 ? 1 : -1) * (2.5 + r() * 4);
    for (let s = 0; s < len; s++) {
      ang += (r() - 0.5) * 0.35;
      x += Math.cos(ang); y += Math.sin(ang);
      const ix = ((Math.round(x) % N) + N) % N, iy = ((Math.round(y) % N) + N) % N;
      lum[iy * N + ix] += tone;
    }
  }
  // Motas: puntos sueltos un poco más oscuros, como las del papel reciclado.
  for (let i = 0; i < specks; i++) {
    const cx = Math.floor(r() * N), cy = Math.floor(r() * N), rad = r() < 0.85 ? 0.6 : 1.3, tone = -(4 + r() * 7);
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
      if (dx * dx + dy * dy > rad * rad + 0.2) continue;
      lum[(((cy + dy) % N + N) % N) * N + ((cx + dx) % N + N) % N] += tone;
    }
  }
  const px = Buffer.alloc(N * N * 3);
  for (let i = 0; i < N * N; i++) {
    for (let c = 0; c < 3; c++) px[i * 3 + c] = Math.max(0, Math.min(255, Math.round(base[c] + lum[i] * (c === 2 ? 0.9 : 1))));
  }
  return sharp(px, { raw: { width: N, height: N, channels: 3 } }).webp({ quality: 88, effort: 6 }).toBuffer();
}

const out = [
  ['public/img/papel-crema.webp', paper({ base: [241, 239, 232], seed: 11, mottle: 6.5, grain: 8, fibres: 1300, specks: 340 })],
  ['public/img/papel-bosque.webp', paper({ base: [23, 70, 58], seed: 29, mottle: 5.5, grain: 5.5, fibres: 900, specks: 0 })],
];
for (const [file, buf] of out) {
  const data = await buf;
  await writeFile(file, data);
  await writeFile(`${file}.json`, JSON.stringify({
    prompt: 'Origen: textura de papel generada por scripts/papel.mjs (ruido de valor periódico, fibras y motas, determinista); sin imágenes de terceros.',
    createdAt: new Date().toISOString(),
  }, null, 2) + '\n');
  console.log(file, (data.length / 1024).toFixed(1) + ' KB');
}

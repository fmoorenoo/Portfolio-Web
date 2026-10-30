// Captura completa de cada ventana de proyecto (viewport alto para ver la galería entera).
// Uso: node scripts/win-shots.mjs [ancho] [outDir]
import { chromium } from 'playwright';
const w = Number(process.argv[2] ?? 1440);
const out = process.argv[3] ?? '.impeccable/review/shots';
const b = await chromium.launch();
for (const slug of ['lanzamet', 'aceslan', 'kora', 'haircloud', 'hariagame']) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  await p.goto(`http://127.0.0.1:5181/proyectos/${slug}/`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(1200);
  const h = await p.evaluate(() => document.querySelector('[data-win-page]').scrollHeight + 70);
  await p.setViewportSize({ width: w, height: Math.min(h, 14000) });
  await p.evaluate(() => document.querySelectorAll('[data-reveal]').forEach((x) => x.classList.add('is-in')));
  await p.waitForTimeout(1500);
  await p.screenshot({ path: `${out}/win-${w}-${slug}.png` });
  console.log(slug, h);
  await p.close();
}
await b.close();

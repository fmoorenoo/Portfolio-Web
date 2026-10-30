// Comprueba los ojos: captura el retrato con el cursor en varias posiciones y mide los frames durante el gesto.
import { chromium } from 'playwright';
const b = await chromium.launch({ args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await p.goto('http://127.0.0.1:5181/', { waitUntil: 'networkidle' });
await p.waitForTimeout(2500);
await p.evaluate(() => { const el = document.querySelector('.parte__photo'); scrollTo(0, el.getBoundingClientRect().top + scrollY - 90); });
await p.waitForTimeout(3500);
const r = await p.evaluate(() => { const b = document.querySelector('.parte__frame').getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; });
const face = { x: r.x + r.w * 0.33, y: r.y + r.h * 0.33, width: r.w * 0.36, height: r.h * 0.12 };
const spots = { centro: [0.5, 0.4], izquierda: [0.04, 0.4], derecha: [0.96, 0.4], arriba: [0.5, 0.05], abajo: [0.5, 0.95] };
for (const [n, [fx, fy]] of Object.entries(spots)) {
  await p.mouse.move(r.x + r.w * fx, r.y + r.h * fy, { steps: 6 });
  await p.waitForTimeout(700);
  await p.screenshot({ path: `.impeccable/review/shots/ojos-${n}.png`, clip: face });
}
await p.evaluate(() => { window.__f = []; let l = performance.now(); const t = (n) => { window.__f.push(n - l); l = n; if (!window.__s) requestAnimationFrame(t); }; requestAnimationFrame(t); });
for (let i = 0; i < 90; i++) { const a = (i / 90) * Math.PI * 4; await p.mouse.move(r.x + r.w * (0.5 + 0.45 * Math.cos(a)), r.y + r.h * (0.45 + 0.4 * Math.sin(a))); await p.waitForTimeout(16); }
const f = await p.evaluate(() => { window.__s = 1; return window.__f; });
const s = [...f].sort((x, y) => x - y);
console.log('frames', s.length, 'p50', s[s.length >> 1].toFixed(1), 'p90', s[Math.floor(s.length * 0.9)].toFixed(1), 'max', s.at(-1).toFixed(1));
await b.close();

// Mueve el ratón sobre las imágenes de proyecto y mide frames; guarda una captura con la perspectiva aplicada.
import { chromium } from 'playwright';
const b = await chromium.launch({ args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://127.0.0.1:5181/', { waitUntil: 'networkidle' });
await p.waitForTimeout(2500);
await p.evaluate(() => { const el = document.querySelector('.case--aceslan'); scrollTo(0, el.getBoundingClientRect().top + scrollY - 40); });
await p.waitForTimeout(3500);
const box = await p.evaluate(() => { const r = document.querySelector('.case--aceslan .case__media').getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
await p.evaluate(() => { window.__f = []; let l = performance.now(); const t = (n) => { window.__f.push(n - l); l = n; if (!window.__s) requestAnimationFrame(t); }; requestAnimationFrame(t); });
for (let i = 0; i <= 60; i++) {
  const a = i / 60;
  await p.mouse.move(box.x + box.w * (0.1 + 0.8 * a), box.y + box.h * (0.2 + 0.6 * Math.sin(a * Math.PI)));
  await p.waitForTimeout(16);
}
await p.mouse.move(box.x + box.w * 0.9, box.y + box.h * 0.15);
await p.waitForTimeout(700);
await p.screenshot({ path: '.impeccable/review/shots/tilt-aceslan.png' });
const f = await p.evaluate(() => { window.__s = 1; return window.__f; });
const s = [...f].sort((x, y) => x - y);
console.log('frames', s.length, 'p50', s[s.length >> 1].toFixed(1), 'p90', s[Math.floor(s.length * 0.9)].toFixed(1), 'max', s.at(-1).toFixed(1));
console.log('transform', await p.evaluate(() => getComputedStyle(document.querySelector('.case--aceslan .case__media')).transform));
await b.close();

// Recorre toda la página con la rueda y mide frames (rAF) y coste de script/estilo/layout vía CDP, por sección.
// Uso: node scripts/perf.mjs [1440x900] [url]
import { chromium } from 'playwright';
const [w, h] = (process.argv[2] ?? '1440x900').split('x').map(Number);
const url = process.argv[3] ?? 'http://127.0.0.1:5181/';
const b = await chromium.launch({ args: ['--use-angle=d3d11', '--enable-gpu', '--enable-gpu-rasterization', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: w, height: h } });
console.log('GPU', await p.evaluate(() => { const c = document.createElement('canvas').getContext('webgl'); const d = c?.getExtension('WEBGL_debug_renderer_info'); return d ? c.getParameter(d.UNMASKED_RENDERER_WEBGL) : 'none'; }));
const cdp = await p.context().newCDPSession(p);
await cdp.send('Performance.enable');
await p.goto(url, { waitUntil: 'networkidle' });
await p.waitForTimeout(3200);
const m0 = Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((m) => [m.name, m.value]));
await p.evaluate(() => {
  window.__f = []; window.__s = [];
  let l = performance.now();
  const tick = (t) => {
    window.__f.push(t - l); l = t;
    const c = [...document.querySelectorAll('main > section')].find((s) => { const r = s.getBoundingClientRect(); return r.top <= innerHeight / 2 && r.bottom > innerHeight / 2; });
    window.__s.push(c?.id || c?.className.split(' ')[0] || '?');
    if (!window.__stop) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});
await p.mouse.move(w / 2, h / 2);
const total = await p.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < total; y += 80) { await p.mouse.wheel(0, 80); await p.waitForTimeout(16); }
await p.waitForTimeout(1200);
const frames = await p.evaluate(() => { window.__stop = true; return window.__f; });
const secs = await p.evaluate(() => window.__s);
const m1 = Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((m) => [m.name, m.value]));
const by = {};
frames.forEach((f, i) => { (by[secs[i]] ??= []).push(f); });
const stat = (arr) => { const s = [...arr].sort((a, z) => a - z); const q = (x) => s[Math.min(s.length - 1, Math.floor(s.length * x))].toFixed(1); return { n: s.length, p50: q(0.5), p90: q(0.9), p99: q(0.99), over33: s.filter((f) => f > 33).length }; };
console.log('total', stat(frames));
for (const [k, v] of Object.entries(by)) console.log(k.padEnd(12), stat(v));
console.log({
  script: (m1.ScriptDuration - m0.ScriptDuration).toFixed(2) + 's', layout: (m1.LayoutDuration - m0.LayoutDuration).toFixed(2) + 's',
  style: (m1.RecalcStyleDuration - m0.RecalcStyleDuration).toFixed(2) + 's', layouts: m1.LayoutCount - m0.LayoutCount,
});
await b.close();

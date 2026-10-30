// Traza de Chrome mientras se hace scroll: qué nodos se repintan más (diagnóstico de rendimiento).
// Uso: node scripts/trace.mjs <salida.json> [url]
import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';
const out = process.argv[2];
const url = process.argv[3] ?? 'http://127.0.0.1:5181/';
const b = await chromium.launch({ args: ['--use-angle=d3d11', '--enable-gpu', '--enable-gpu-rasterization', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const cdp = await p.context().newCDPSession(p);
await p.goto(url, { waitUntil: 'networkidle' });
await p.waitForTimeout(3000);
await p.mouse.move(700, 450);
await b.startTracing(p, { path: out, categories: ['devtools.timeline', 'disabled-by-default-devtools.timeline', 'disabled-by-default-devtools.timeline.invalidationTracking'] });
const total = await p.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < total; y += 80) { await p.mouse.wheel(0, 80); await p.waitForTimeout(16); }
await b.stopTracing();
const ev = JSON.parse(await readFile(out, 'utf8')).traceEvents;
const agg = {};
for (const e of ev) if (e.name === 'Paint' && e.dur) { const id = e.args?.data?.nodeId ?? 0; (agg[id] ??= [0, 0]); agg[id][0] += e.dur / 1000; agg[id][1]++; }
await cdp.send('DOM.getDocument', { depth: -1 });
for (const [id, [d, n]] of Object.entries(agg).sort((a, z) => z[1][0] - a[1][0]).slice(0, 12)) {
  let desc = '?';
  try { const { node } = await cdp.send('DOM.describeNode', { backendNodeId: Number(id) }); desc = `${node.localName}.${(node.attributes?.[node.attributes.indexOf('class') + 1] ?? '').slice(0, 50)}`; } catch {}
  console.log(`${d.toFixed(0).padStart(5)}ms ${String(n).padStart(4)}x  ${desc}`);
}

// Causas de invalidación de pintado más frecuentes.
const inv = {};
for (const e of ev) if (e.name === 'PaintInvalidationTracking' || e.name === 'StyleRecalcInvalidationTracking' || e.name === 'LayoutInvalidationTracking') {
  const d = e.args?.data ?? {}; const k = `${e.name.replace('InvalidationTracking', '')} ${d.nodeName ?? ''} ${d.reason ?? ''}`.trim(); inv[k] = (inv[k] ?? 0) + 1;
}
console.log(Object.entries(inv).sort((a, z) => z[1] - a[1]).slice(0, 15).map(([k, n]) => `${String(n).padStart(6)}  ${k}`).join('\n'));
await b.close();

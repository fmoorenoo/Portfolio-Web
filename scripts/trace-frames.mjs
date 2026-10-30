// Desglose de los frames largos de una traza (main thread): qué fases pesan dentro de cada BeginMainFrame lento.
// Uso: node scripts/trace-frames.mjs <traza.json>
import { readFile } from 'node:fs/promises';
const ev = JSON.parse(await readFile(process.argv[2], 'utf8')).traceEvents.filter((e) => e.ph === 'X' && e.dur);
const frames = ev.filter((e) => e.name === 'WebFrameWidgetImpl::BeginMainFrame' || e.name === 'ProxyMain::BeginMainFrame');
const main = frames.filter((f) => f.name === 'ProxyMain::BeginMainFrame');
const durs = main.map((f) => f.dur / 1000).sort((a, b) => a - b);
console.log('BeginMainFrame n', durs.length, 'p50', durs[durs.length >> 1]?.toFixed(1), 'p90', durs[Math.floor(durs.length * 0.9)]?.toFixed(1), 'max', durs.at(-1)?.toFixed(1));
const long = main.filter((f) => f.dur > 10000);
const agg = {};
for (const f of long) for (const e of ev) if (e.tid === f.tid && e.ts >= f.ts && e.ts + e.dur <= f.ts + f.dur && e !== f) { (agg[e.name] ??= 0); agg[e.name] += e.dur / 1000; }
console.log('long frames', long.length);
console.log(Object.entries(agg).sort((a, z) => z[1] - a[1]).slice(0, 18).map(([k, d]) => `${(d / Math.max(1, long.length)).toFixed(2).padStart(6)}ms/frame  ${k}`).join('\n'));

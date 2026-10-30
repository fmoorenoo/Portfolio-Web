import { chromium } from 'playwright';
const [w, h] = (process.argv[2] ?? '390x844').split('x').map(Number);
const code = process.argv[3];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: w, height: h } });
await p.goto(process.env.URL ?? 'http://127.0.0.1:5181/?nosnap', { waitUntil: 'networkidle' });
await p.waitForTimeout(+(process.env.WAIT ?? 2500));
console.log(JSON.stringify(await p.evaluate(code), null, 1));
await b.close();

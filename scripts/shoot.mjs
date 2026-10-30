// Capturas de revisión: recorre la página por posiciones de scroll y abre una ventana de proyecto.
// Uso: node scripts/shoot.mjs [url] [outDir] [1440x900,390x844] [paradas: inicio,parte,...]
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const url = process.argv[2] ?? 'http://127.0.0.1:5181/';
const out = process.argv[3] ?? '.impeccable/review/shots';
const sizes = (process.argv[4] ?? '1440x900').split(',').map((s) => s.split('x').map(Number));
const stops = (process.argv[5] ?? 'top,parte,proyectos,aceslan,kora,kora-mid,kora-end,hair,archive,stack,trayectoria,route-mid,contacto,win').split(',');
await mkdir(out, { recursive: true });

const browser = await chromium.launch({ args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] });
for (const [w, h] of sizes) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: w < 800 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.text()); });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2600);
  for (const s of stops) {
    if (s === 'win') {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(800);
      await page.goto(url.replace(/\/$/, '') + '/proyectos/lanzamet/', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1500);
      await page.screenshot({ path: `${out}/${w}-win.png` });
      await page.evaluate(() => document.querySelector('[data-win-scroll]').scrollTo(0, innerHeight * 1.1));
      await page.waitForTimeout(1200);
      await page.screenshot({ path: `${out}/${w}-win2.png` });
      continue;
    }
    const y = await page.evaluate((s) => {
      const at = (sel, f = 0) => { const el = document.querySelector(sel); return el ? el.getBoundingClientRect().top + scrollY + f : 0; };
      const pinEnd = (sel, f) => { const t = window.ScrollTriggerAll?.find((x) => x.trigger === document.querySelector(sel)); return t ? t.start + (t.end - t.start) * f : at(sel); };
      switch (s) {
        case 'top': return 0;
        case 'parte': return at('#parte', 60);
        case 'proyectos': return at('#proyectos', -40);
        case 'aceslan': return at('.case--aceslan', -20);
        case 'kora': return at('#kora');
        case 'kora-mid': return at('#kora') + innerWidth * 1.2;
        case 'kora-end': return at('#kora') + innerWidth * 2.2;
        case 'hair': return at('.case--hair', -20);
        case 'archive': return at('.archive', -80);
        case 'game': return at('.case--game', -20);
        case 'stack': return at('#stack');
        case 'trayectoria': return at('#trayectoria', 40);
        case 'route-mid': return at('#trayectoria', 40) + innerWidth * 1.4;
        case 'contacto': return at('#contacto');
        default: return 0;
      }
    }, s);
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(1800);
    await page.screenshot({ path: `${out}/${w}-${s}.png` });
  }
  if (errors.length) console.log(w, 'ERRORS\n' + [...new Set(errors)].join('\n'));
  await ctx.close();
}
await browser.close();
console.log('ok');

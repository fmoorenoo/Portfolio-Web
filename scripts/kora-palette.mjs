// Lee la paleta real de koradigitalsolutions.com: variables CSS de :root y colores más usados por superficie.
import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('https://koradigitalsolutions.com', { waitUntil: 'load', timeout: 60000 });
await p.waitForTimeout(5000);
await p.screenshot({ path: '.impeccable/review/kora/kora-home.png' });
await p.screenshot({ path: '.impeccable/review/kora/kora-full.png', fullPage: true });
const data = await p.evaluate(() => {
  const vars = {};
  for (const sh of document.styleSheets) { try { for (const r of sh.cssRules) if (r.selectorText === ':root') for (const k of r.style) if (k.startsWith('--')) vars[k] = r.style.getPropertyValue(k).trim(); } catch {} }
  const bg = {}, fg = {};
  for (const el of document.querySelectorAll('body *')) {
    const s = getComputedStyle(el), r = el.getBoundingClientRect(); const a = r.width * r.height;
    if (!a) continue;
    if (s.backgroundColor !== 'rgba(0, 0, 0, 0)') bg[s.backgroundColor] = (bg[s.backgroundColor] ?? 0) + a;
    if (el.childNodes.length && [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) fg[s.color] = (fg[s.color] ?? 0) + 1;
  }
  const top = (o, n) => Object.entries(o).sort((x, y) => y[1] - x[1]).slice(0, n);
  return { vars, bg: top(bg, 10), fg: top(fg, 8), body: getComputedStyle(document.body).backgroundColor, fonts: [...new Set([...document.querySelectorAll('h1,h2,p,a')].map((e) => getComputedStyle(e).fontFamily))].slice(0, 5) };
});
console.log(JSON.stringify(data, null, 1));
await b.close();

// Capturas del panel web de ACESLAN servido en local (backend-aceslan con seeders de demo).
// Las URLs absolutas apuntan a 10.0.2.2 (para el emulador); aquí se redirigen a 127.0.0.1.
import { chromium } from 'playwright';
const out = process.argv[2] ?? 'assets-src/aceslan';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, locale: 'es-ES' });
await ctx.route('http://10.0.2.2:8000/**', (r) => r.continue({ url: r.request().url().replace('10.0.2.2', '127.0.0.1') }));
const p = await ctx.newPage();
const errors = [];
p.on('pageerror', (e) => errors.push(e.message));
await p.goto('http://127.0.0.1:8000/admin/login', { waitUntil: 'networkidle' });
await p.screenshot({ path: `${out}/panel-login.png` });
await p.fill('#email', 'moderador1@demo.aceslan');
await p.fill('#password', 'Demo_Mod#2025');
await p.click('#btn-login');
await p.waitForTimeout(3500);
console.log('tras login', p.url());
for (const s of ['dashboard', 'incidencias', 'alertas', 'emergencias', 'formaciones', 'noticias', 'mensajes']) {
  await p.goto(`http://127.0.0.1:8000/admin/${s}`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(1800);
  await p.screenshot({ path: `${out}/panel-${s}.png` });
  console.log('ok', s, p.url());
}
if (errors.length) console.log('ERR', errors.slice(0, 5));
await b.close();

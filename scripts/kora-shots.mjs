// Vista previa cuadrada de cada web publicada con KORA: carga la portada real, cierra el aviso de cookies y captura.
// Uso: node scripts/kora-shots.mjs  →  assets-src/kora/<slug>.png y public/img/kora-<slug>.webp
import { chromium } from 'playwright';
import sharp from 'sharp';
const sites = {
  formatxp: 'https://formatxp.com', carboncarbon: 'https://carboncarbon.es', autosmr: 'https://autosmr.com',
  cm4costaviva: 'https://cm4costaviva.com', doce12ia: 'https://doce12ia.com', bermeja: 'https://bermejaproducciones.es',
  masdache: 'https://teleclubmasdache.es', ymelbet: 'https://ymelbet.es',
};
const only = process.argv[2]?.split(',');
const b = await chromium.launch();
for (const [slug, url] of Object.entries(sites)) {
  if (only && !only.includes(slug)) continue;
  const p = await b.newPage({ viewport: { width: 1280, height: 1280 }, locale: 'es-ES' });
  try {
    await p.goto(url, { waitUntil: 'load', timeout: 60000 });
    await p.waitForTimeout(4500);
    // Aviso de cookies: se elige la opción mínima si existe; si no, aceptar.
    for (const t of [/solo necesarias/i, /rechazar/i, /reject/i, /aceptar/i, /accept/i, /entendido/i, /de acuerdo/i]) {
      const btn = p.getByRole('button', { name: t }).first();
      if (await btn.isVisible().catch(() => false)) { await btn.click().catch(() => {}); await p.waitForTimeout(900); break; }
    }
    await p.mouse.move(5, 5);
    await p.waitForTimeout(1500);
    await p.screenshot({ path: `assets-src/kora/${slug}.png` });
    await sharp(`assets-src/kora/${slug}.png`).resize(720, 720).webp({ quality: 82 }).toFile(`public/img/kora-${slug}.webp`);
    console.log('ok', slug);
  } catch (e) { console.log('FAIL', slug, e.message.split('\n')[0]); }
  await p.close();
}
await b.close();

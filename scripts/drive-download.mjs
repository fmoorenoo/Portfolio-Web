// Descarga una carpeta pública de Google Drive como zip(s) a través de su interfaz web.
// Uso: node scripts/drive-download.mjs <idCarpetaPadre> <idCarpeta> <destino>
import { chromium } from 'playwright';
const [parent, id, dest] = process.argv.slice(2);
const b = await chromium.launch();
const ctx = await b.newContext({ acceptDownloads: true, locale: 'es-ES', viewport: { width: 1400, height: 900 } });
const p = await ctx.newPage();
await p.goto(`https://drive.google.com/drive/folders/${parent}`, { waitUntil: 'networkidle', timeout: 90000 });
await p.waitForTimeout(2500);
const row = p.locator(`[data-id="${id}"]`).last();
await row.click({ button: 'right' });
await p.waitForTimeout(1200);
const downloads = [];
p.on('download', (d) => downloads.push(d));
await p.getByRole('menuitem', { name: /Descargar/i }).first().click();
// Drive comprime en el servidor y lanza una o varias descargas; se esperan hasta 40 min.
const t0 = Date.now();
while (Date.now() - t0 < 40 * 60e3) {
  await p.waitForTimeout(5000);
  if (downloads.length) {
    await p.waitForTimeout(20000);
    break;
  }
}
for (const d of downloads) {
  const file = `${dest}/${d.suggestedFilename()}`;
  await d.saveAs(file);
  console.log('ok', file);
}
if (!downloads.length) { await p.screenshot({ path: `${dest}/drive-error.png` }); console.log('sin descarga'); }
await b.close();

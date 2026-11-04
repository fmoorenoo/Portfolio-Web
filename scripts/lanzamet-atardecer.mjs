// Capturas de la vista «Atardecer» de LanzaMet en Famara, desde la build de demo local (datos simulados, escenario
// alisio), con el mismo reloj y los mismos tamaños que las demás capturas de lanzamet-video/tools.
//   (en ../LanzaMet) npx ng serve --configuration demo --port 4300
//   node scripts/lanzamet-atardecer.mjs [hora, p. ej. "19 h"] [outDir]
import { chromium } from 'playwright';
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const HOUR = process.argv[2] ?? '19 h';
const OUT = process.argv[3] ?? 'assets-src/lanzamet';
await mkdir(OUT, { recursive: true });
const BASE = 'http://localhost:4300';
const NOW = new Date('2026-10-25T13:00:00Z'); // Canarias = UTC a finales de octubre
const DEMO_CHROME = `
  .settings-button .demo-label { display: none !important; }
  .settings-button, .settings-button.demo { width: 40px !important; padding: 0 !important; justify-content: center !important; }
  #tide-source { display: none !important; }
`;
const tag = HOUR.replace(/\D/g, '');

const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });

async function open(viewport, dpr, mobile) {
  const ctx = await browser.newContext({
    viewport, deviceScaleFactor: dpr, isMobile: mobile, hasTouch: mobile,
    colorScheme: 'light', locale: 'es-ES', timezoneId: 'Atlantic/Canary', reducedMotion: 'no-preference',
  });
  await ctx.addInitScript(() => {
    localStorage.setItem('lm.selected', JSON.stringify('famara'));
    localStorage.setItem('lm.lang', JSON.stringify('es'));
    localStorage.setItem('lm.theme', JSON.stringify('light'));
  });
  const page = await ctx.newPage();
  await page.clock.setFixedTime(NOW);
  await page.goto(`${BASE}/?escenario=alisio`, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: DEMO_CHROME });
  await page.waitForTimeout(1800);
  await page.locator('.hour-scroller button', { hasText: HOUR }).first().click();
  await page.waitForTimeout(2600);
  await page.evaluate(() => { for (const a of document.getAnimations()) a.pause(); });
  await page.addStyleTag({ content: '*,*::before,*::after{animation-play-state:paused!important;transition:none!important}' });
  return { ctx, page };
}

// Escritorio: la ficha del tiempo (#weather-hero), como la de «De noche».
{
  const { ctx, page } = await open({ width: 1920, height: 1080 }, 2, false);
  const raw = await page.locator('#weather-hero').screenshot({ omitBackground: true });
  await sharp(raw).resize({ width: 1600 }).png().toFile(`${OUT}/desk-${tag}.png`);
  await ctx.close();
}
// Móvil: la pantalla entera a 390 × 844.
{
  const { ctx, page } = await open({ width: 390, height: 844 }, 3, true);
  const raw = await page.screenshot();
  await sharp(raw).resize({ width: 900 }).png().toFile(`${OUT}/movil-${tag}.png`);
  await ctx.close();
}
await browser.close();
console.log('ok', HOUR);

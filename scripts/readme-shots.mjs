// Capturas del README (docs/img): escritorio a 1600×1000 y portada en móvil a 600px de ancho.
// Uso: con `npm run dev` en marcha, node scripts/readme-shots.mjs [url] [salida]
import { chromium, devices } from 'playwright';
import sharp from 'sharp';

const url = process.argv[2] ?? 'http://127.0.0.1:5181/';
const out = process.argv[3] ?? 'docs/img';
const b = await chromium.launch();

// Lleva la página a una sección. Si está anclada (KORA, trayectoria), `at` es la fracción de su recorrido.
const go = async (p, sel, { at = 0, dy = 0 } = {}) => {
  await p.evaluate(([s, a, d]) => {
    const el = document.querySelector(s);
    const pin = el.closest('.pin-spacer');
    const top = (pin ?? el).getBoundingClientRect().top + scrollY;
    const run = pin ? pin.offsetHeight - innerHeight : 0;
    window.scrollTo(0, Math.round(top + run * a + d));
  }, [sel, at, dy]);
  await p.waitForTimeout(2600);
};

const save = async (p, name, width) => {
  const png = await p.screenshot();
  await sharp(png).resize({ width }).webp({ quality: 82 }).toFile(`${out}/${name}.webp`);
  console.log(name);
};

// Escritorio: 1440×900 a doble densidad, reducido a 1600×1000.
const desk = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await desk.goto(url, { waitUntil: 'networkidle' });
await desk.waitForTimeout(4000);
await save(desk, 'portada', 1600);
// Un primer gesto arranca los disparadores que se crean en tiempo libre.
await desk.evaluate(() => window.scrollTo(0, 400));
await desk.waitForTimeout(1500);
await go(desk, '#parte');
await save(desk, 'parte', 1600);
await go(desk, '.case[data-p="lanzamet"]', { dy: -110 });
await save(desk, 'proyectos', 1600);
await go(desk, '.kora__track', { at: 0.45 });
await save(desk, 'kora', 1600);
await go(desk, '#stack');
await save(desk, 'stack', 1600);
await go(desk, '.route__list', { at: 0.5 });
await save(desk, 'trayectoria', 1600);
await go(desk, '#contacto');
await save(desk, 'contacto', 1600);

await desk.goto(`${url}proyectos/lanzamet/`, { waitUntil: 'networkidle' });
await desk.waitForSelector('.cs-name');
await desk.waitForTimeout(2500);
await save(desk, 'ventana-proyecto', 1600);

// Móvil: la portada en un iPhone 13.
const mob = await (await b.newContext({ ...devices['iPhone 13'] })).newPage();
await mob.goto(url, { waitUntil: 'networkidle' });
await mob.waitForTimeout(4000);
await save(mob, 'portada-movil', 600);

await b.close();

import { defineConfig, type Plugin } from 'vite';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { projects } from './src/content';

// Cada ventana de proyecto tiene su ruta (/proyectos/:slug/). En el build se copia index.html a cada una para que un
// hosting estático las sirva sin reglas de reescritura, con su propio título, descripción y canonical: sin ellos,
// Google veía las cinco rutas como copias de la portada.
const SITE = 'https://fer-m.dev';
const attr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const routes = (): Plugin => ({
  name: 'project-routes',
  apply: 'build',
  async closeBundle() {
    const home = await readFile('dist/index.html', 'utf8');
    for (const p of projects) {
      const url = `${SITE}/proyectos/${p.slug}/`;
      const title = `${p.name} — Fernando Montelongo`;
      const desc = `${p.claim.es} ${p.kind.es}. Un proyecto de Fernando Montelongo, desarrollador full stack en Lanzarote.`;
      const page = home
        .replace(/<title>[^<]*<\/title>/, `<title>${attr(title)}</title>`)
        .replace(/(<meta name="description" content=")[^"]*/, `$1${attr(desc)}`)
        .replace(/(<meta property="og:title" content=")[^"]*/, `$1${attr(title)}`)
        .replace(/(<meta property="og:description" content=")[^"]*/, `$1${attr(desc)}`)
        .replace(/(<link rel="canonical" href=")[^"]*/, `$1${url}`)
        .replace(/(<meta property="og:url" content=")[^"]*/, `$1${url}`);
      await mkdir(`dist/proyectos/${p.slug}`, { recursive: true });
      await writeFile(`dist/proyectos/${p.slug}/index.html`, page);
    }
  },
});

// El CSS (unos 23 KB comprimido) va dentro del HTML en lugar de en un archivo aparte: en el móvil esa petición
// bloqueaba el primer pintado una ida y vuelta más (Lighthouse estimaba ~350 ms). Es una web de una sola página, así
// que separarlo apenas ahorraba nada en caché.
const inlineCss = (): Plugin => ({
  name: 'inline-css',
  apply: 'build',
  enforce: 'post',
  generateBundle(_, bundle) {
    const html = Object.values(bundle).find((f) => f.type === 'asset' && f.fileName === 'index.html');
    if (!html || html.type !== 'asset') return;
    let page = String(html.source);
    for (const [name, file] of Object.entries(bundle)) {
      if (file.type !== 'asset' || !name.endsWith('.css')) continue;
      const tag = new RegExp(`<link rel="stylesheet"[^>]*href="/${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>`);
      if (!tag.test(page)) continue;
      page = page.replace(tag, () => `<style>${String(file.source)}</style>`);
      delete bundle[name];
    }
    html.source = page;
  },
});

export default defineConfig({
  build: { target: 'es2022', cssMinify: true, assetsInlineLimit: 0 },
  server: { port: 5181, host: '127.0.0.1' },
  plugins: [inlineCss(), routes()],
});

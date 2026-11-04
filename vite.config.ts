import { defineConfig, type Plugin } from 'vite';
import { copyFile, mkdir } from 'node:fs/promises';

// Cada ventana de proyecto tiene su ruta (/proyectos/:slug/). En el build se copia index.html a cada una
// para que un hosting estático las sirva sin reglas de reescritura.
const slugs = ['lanzamet', 'aceslan', 'kora', 'haircloud', 'hariagame'];
const routes = (): Plugin => ({
  name: 'project-routes',
  apply: 'build',
  async closeBundle() {
    for (const s of slugs) {
      await mkdir(`dist/proyectos/${s}`, { recursive: true });
      await copyFile('dist/index.html', `dist/proyectos/${s}/index.html`);
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

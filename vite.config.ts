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

export default defineConfig({
  build: { target: 'es2022', cssMinify: true, assetsInlineLimit: 0 },
  server: { port: 5181, host: '127.0.0.1' },
  plugins: [routes()],
});

// Logos de los proyectos para el desplegable del menú (fuentes copiadas de cada repositorio en assets-src/logos).
// Uso: node scripts/logos.mjs
import sharp from 'sharp';

const OUT = 'public/img';
// Ancho final: el doble de lo que ocupan en el menú, para pantallas densas.
for (const [n, w] of [['lanzamet', 168], ['aceslan', 120], ['haircloud', 150]]) {
  await sharp(`assets-src/logos/${n}.png`).trim().resize(w).webp({ quality: 90, alphaQuality: 100 }).toFile(`${OUT}/logo-${n}.webp`);
  console.log(n);
}

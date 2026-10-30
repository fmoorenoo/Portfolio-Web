# Carta sinóptica — portfolio de Fernando Montelongo

Portfolio de un desarrollador que construye software para su isla, contado como el parte del tiempo: una carta sinóptica viva de Lanzarote cuyos sistemas de presión se desplazan con el scroll. Cada proyecto es una estación con su propia ventana y su propia ruta.

```
npm install
npm run dev        # http://127.0.0.1:5181
npm run build      # dist/ (incluye dist/proyectos/<slug>/index.html)
node scripts/assets.mjs && node scripts/eyes.mjs && sh scripts/provenance.sh   # regenera imágenes desde ../ (fuentes fuera del repo)
```

Contenido: solo lo verificado en `profile-research.md` y `project-ranking.md`. Producto: `PRODUCT.md`. Dirección y contrato: `.impeccable/surfaces/index-html.md`.

## Recorrido

Carta (retrato recortado con ojos que siguen al cursor, nombre, A/B de presión) · Parte del día (isla con Arrecife y ficha de estación) · Proyectos: LanzaMet y ACESLAN · KORA en tramo horizontal con su propia paleta y la vista previa real de sus 8 webs (`scripts/kora-shots.mjs`) · HairCloud · Haría Game · archivo compacto de GitHub · Tecnologías verificadas / declaradas · Trayectoria como barograma horizontal 2021–2026 sobre papel cuadriculado, con tarjetas por tipo (formación, trabajo, proyecto, empresa) y los años al fondo · Contacto sobre la carta nocturna.

## Decisiones

- **Stack:** Vite + TypeScript + GSAP (ScrollTrigger, ScrollSmoother, SplitText, DrawSVG), sin framework de UI.
- **Campo de presión (`src/field.ts`):** un único triángulo WebGL2 que pinta bandas cada 4 hPa e isobaras cada 2 hPa a partir de seis centros gaussianos. Solo dibuja mientras su lienzo es visible; con movimiento reducido pinta un fotograma fijo. Sin WebGL queda un degradado CSS. Las letras A y B siguen a sus centros.
- **Ventanas de proyecto (`src/windows.ts`, contenido en `src/content.ts`):** `/proyectos/lanzamet/`, `/aceslan/`, `/kora/`, `/haircloud/`. Se abren con un recorte que crece desde la tarjeta y se cierran de vuelta a ella. Esc cierra, ← y → cambian de proyecto, el foco queda dentro. En el build se copia `index.html` a cada ruta para servirlas en un hosting estático.
- **Tramos horizontales:** KORA y Trayectoria se anclan y avanzan en horizontal en escritorio. En móvil o con movimiento reducido pasan a deslizamiento nativo y a lista vertical (`.no-hpin`).
- **Retrato con ojos que siguen al cursor (`scripts/eyes.mjs`):** la foto lleva su fondo natural y tres capas: la base, con el iris de cada ojo sustituido por esclera, y un iris por ojo (completado por simetría donde lo tapa el párpado), recortado por la apertura real del ojo, trazada sobre ampliaciones con rejilla (`assets-src/eyes/grid-*.png`). Al pasar el ratón por la foto, cada iris se desplaza hacia el puntero (hasta un 20 % de su tamaño en horizontal y un 9 % en vertical) con `gsap.quickTo`; vuelve al centro al salir. La geometría en % está en `src/eyes.json` y en `.eye--izq`/`.eye--der` de `src/styles.css`.
- **Legibilidad:** el texto de lectura vive sobre fondos sólidos. Las etiquetas sobre la carta van en píldoras de papel.
- **Rendimiento:** solo se animan transformaciones y opacidad. Las animaciones en bucle se pausan fuera de pantalla y los tamaños se miden fuera de los bucles. Medido con `scripts/perf.mjs`: p90 de 16,8 ms en escritorio y 16,7 ms en móvil. Para diagnosticar, `scripts/trace.mjs` (nodos que se repintan y causas) y `scripts/trace-frames.mjs`.
- **Idiomas:** el español vive en `index.html`; el inglés en `src/i18n.ts` (claves `data-i18n`) y en `src/content.ts`.

## Parámetros de desarrollo

`?nosmooth` desactiva ScrollSmoother y `?nofield` el campo WebGL. Solo existen en `npm run dev`.

## Pendiente de Fernando

CV en PDF · detalles mostrables de GISECLOUD · qué webs de KORA hiciste tú · dominio · certificado de inglés.

## Capturas de HairCloud

Son de la app real (`../p-projects/HairCloud`), compilada y ejecutada en un emulador Android 15 con su API Flask y PostgreSQL en local. Las herramientas viven en `C:\Users\User\dev-tools` (JDK 17, Android SDK, PostgreSQL 17); la base de datos local tiene contraseñas de demo (`juan123`, `ana_styles` / `demo1234`), compañeros reales anonimizados y citas de demostración del 30-10-2026. Para repetirlas: `pg_ctl -D C:\Users\User\dev-tools\pgdata start`, `python app.py` en `backend/` (venv `.venv`), `emulator -avd haircloud` y `adb install app/build/outputs/apk/debug/app-debug.apk`.

## Capturas de ACESLAN

Son de la app Android real (`../p-projects/ACESLAN`, repo de FabioGonzalez2005) y de su panel web (`../p-projects/backend-aceslan`), ejecutados en local con los seeders de demostración del propio backend (cuentas `@demo.aceslan`); nunca contra el servidor de producción. Backend: PHP 8.4 y MariaDB 11.4 en `C:\Users\User\dev-tools` (`mariadbd --datadir=C:\Users\User\dev-tools\mariadata`, `php artisan config:cache && php artisan serve`). Para la app hay que cambiar en local `BASE_URL`/`STORAGE_URL` de `androidMain/.../ApiConfig.kt` a `http://10.0.2.2:8000` (y no commitearlo). El panel se captura con `node scripts/aceslan-panel.mjs`.

## Capturas de Haría Game

Son de la versión compilada para Windows de la carpeta de Drive que enlaza su README (descargada con `node scripts/drive-download.mjs` en `C:UsersUserdev-toolshariagame`), ejecutada en ventana y capturada con `game.ps1` (PowerShell, captura del área cliente con el escalado de Windows). En esa versión la escena de juego sale con el cielo negro, así que la partida usa la captura original del README. La ventana incluye una comparación con tres fotos reales del instituto (aportadas por Fernando, en `assets-src/hariagame/real`), cada una emparejada con un encuadre parecido del juego.

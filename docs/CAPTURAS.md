# Capturas de los proyectos

Cómo se obtuvieron las capturas de las ventanas de proyecto, para poder repetirlas.

## HairCloud

Son de la app real (`../p-projects/HairCloud`), compilada y ejecutada en un emulador Android 15 con su API Flask y PostgreSQL en local. Las herramientas viven en `C:\Users\User\dev-tools` (JDK 17, Android SDK, PostgreSQL 17); la base de datos local tiene contraseñas de demo (`juan123`, `ana_styles` / `demo1234`), compañeros reales anonimizados y citas de demostración del 30-10-2026. Para repetirlas: `pg_ctl -D C:\Users\User\dev-tools\pgdata start`, `python app.py` en `backend/` (venv `.venv`), `emulator -avd haircloud` y `adb install app/build/outputs/apk/debug/app-debug.apk`.

## ACESLAN

Son de la app Android real (`../p-projects/ACESLAN`, repo de FabioGonzalez2005) y de su panel web (`../p-projects/backend-aceslan`), ejecutados en local con los seeders de demostración del propio backend (cuentas `@demo.aceslan`); nunca contra el servidor de producción. Backend: PHP 8.4 y MariaDB 11.4 en `C:\Users\User\dev-tools` (`mariadbd --datadir=C:\Users\User\dev-tools\mariadata`, `php artisan config:cache && php artisan serve`). Para la app hay que cambiar en local `BASE_URL`/`STORAGE_URL` de `androidMain/.../ApiConfig.kt` a `http://10.0.2.2:8000` (y no commitearlo). El panel se captura con `node scripts/aceslan-panel.mjs`.

## Haría Game

Son de la versión compilada para Windows de la carpeta de Drive que enlaza su README (descargada con `node scripts/drive-download.mjs` en `C:UsersUserdev-toolshariagame`), ejecutada en ventana y capturada con `game.ps1` (PowerShell, captura del área cliente con el escalado de Windows). En esa versión la escena de juego sale con el cielo negro, así que la partida usa la captura original del README. La ventana incluye una comparación con tres fotos reales del instituto (aportadas por Fernando, en `assets-src/hariagame/real`), cada una emparejada con un encuadre parecido del juego.

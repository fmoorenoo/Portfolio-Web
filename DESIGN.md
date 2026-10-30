---
name: Carta sinóptica
description: Portfolio de Fernando Montelongo como carta sinóptica viva de Lanzarote; los sistemas de presión se desplazan con el scroll y cada proyecto es una estación con su propia ventana.
colors:
  paper: "#EEF2F0"
  paper-2: "#E2E9E5"
  ink: "#10222C"
  ink-2: "#3B505D"
  rule: "rgba(16, 34, 44, 0.14)"
  ocean: "#0C2E40"
  ocean-2: "#123B50"
  sky: "#BFE3EA"
  alisio: "#3CC3A2"
  calima: "#F4B23E"
  warm: "#F0583A"
  cold: "#2E6BE6"
  lilac: "#A98BEA"
  warm-ink: "#2A0E07"
  kora: "#0B0B0B"
  kora-2: "#111111"
  kora-line: "#222222"
  kora-muted: "#A0A0A0"
  kora-pink: "#FF3366"
  kora-wine: "#7A1A2E"
  cloud: "#232425"
  cloud-2: "#5C626A"
  cloud-blue: "#3D8FE5"
typography:
  display:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3.3rem, 9.4vw, 10.5rem)"
    fontWeight: 800
    lineHeight: 0.86
    letterSpacing: "-0.035em"
    fontVariation: "'wdth' 118"
  headline:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.8rem, 1.6rem + 5.2vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.035em"
    fontVariation: "'wdth' 118"
  headline-station:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "min(5.6rem, 14.5cqi)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.035em"
    fontVariation: "'wdth' 122"
  title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.1rem, 1.4rem + 2.8vw, 4.4rem)"
    fontWeight: 750
    lineHeight: 1
    letterSpacing: "-0.03em"
    fontVariation: "'wdth' 112"
  lede:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.3rem, 1.05rem + 1vw, 1.95rem)"
    fontWeight: 450
    lineHeight: 1.38
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1rem, 0.95rem + 0.2vw, 1.125rem)"
    fontWeight: 400
    lineHeight: 1.55
    fontVariation: "'wdth' 100"
  label:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 600
    letterSpacing: "0.005em"
    fontVariation: "'wdth' 106"
  measure:
    fontFamily: "'Martian Mono', ui-monospace, monospace"
    fontSize: "0.72rem"
    fontWeight: 400
    fontFeature: "'tnum' 1"
  pressure:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3rem, 6vw, 5.5rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 100"
rounded:
  card: "clamp(20px, 2.2vw, 30px)"
  plate: "22px"
  clip: "16px"
  shot: "14px"
  focus: "6px"
  pill: "999px"
spacing:
  gutter: "clamp(16px, 4vw, 56px)"
  bar: "68px"
  bar-mobile: "60px"
  wrap: "1360px"
  chip-gap: "8px"
components:
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    height: "48px"
    padding: "0 1.35em"
  button-line:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "48px"
    padding: "0 1.35em"
  button-line-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  button-sun:
    backgroundColor: "{colors.calima}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "48px"
    padding: "0 1.35em"
  chip-verified:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "0.42em 0.95em"
  chip-declared:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.42em 0.95em"
  hero-plate:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.plate}"
    padding: "clamp(20px, 2vw, 28px)"
  station-card-lanzamet:
    backgroundColor: "{colors.sky}"
    textColor: "{colors.ocean}"
    rounded: "{rounded.card}"
    padding: "clamp(28px, 4.4vw, 72px)"
  station-card-aceslan:
    backgroundColor: "{colors.warm}"
    textColor: "{colors.warm-ink}"
    rounded: "{rounded.card}"
    padding: "clamp(28px, 4.4vw, 72px)"
  station-card-kora:
    backgroundColor: "{colors.kora-2}"
    textColor: "{colors.paper}"
    rounded: "{rounded.card}"
    padding: "clamp(28px, 4.4vw, 72px)"
  station-card-haircloud:
    backgroundColor: "{colors.cloud}"
    textColor: "{colors.paper}"
    rounded: "{rounded.card}"
    padding: "clamp(28px, 4.4vw, 72px)"
  press-clip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.clip}"
    padding: "20px 22px 22px"
  window-sheet:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  dark-band:
    backgroundColor: "{colors.ocean}"
    textColor: "{colors.paper}"
---

# Design System: Carta sinóptica

## Overview

**Creative North Star: "La carta sinóptica de Lanzarote"**

La página es el parte meteorológico de un desarrollador que construye software para su isla: una carta clara (papel `paper`) sobre la que un campo de presión pintado en WebGL2 dibuja bandas de color escalonadas e isobaras de tinta. Los centros de presión se desplazan con el scroll y la leyenda queda quieta mientras el campo se mueve. Encima viven los signos propios de un mapa de modelo: letras A y B con su lectura en hPa, barbas de viento, frentes fríos con triángulos y cálidos con semicírculos, puntos de estación con su rótulo y la silueta real de Lanzarote en tinta. El hero lo protagoniza el retrato recortado de Fernando, apoyado en el borde inferior sobre un núcleo cálido del campo, con ojos que siguen al cursor; la isla pasa al «Parte del día». Cada proyecto es una estación: una tarjeta grande sobre su propio campo de color que se abre, recortada desde la propia tarjeta, en una ventana con ruta propia.

La densidad es la de un parte de televisión: un nombre enorme en Archivo expandido, pocas piezas, mucha carta alrededor. La expresividad vive en el campo, los frentes y el ancho de la letra; la información vive siempre sobre fondo sólido (papel, plancha de papel o campo plano), en texto fluido con contraste AA. El movimiento es parte del mundo (el frente pasa, el campo se desplaza) pero nunca oculta lectura: las entradas son transformaciones y el texto largo pasa de un gris legible a tinta.

El rendimiento es contenido: un único plano WebGL por escena, transformaciones y opacidad como únicas propiedades animadas, lecturas de layout fuera de los bucles y animaciones en bucle pausadas fuera de pantalla. Se rechaza la plantilla oscura de desarrollador (hero, rejilla de tarjetas y neón) y el muro de carteles anterior.

**Key Characteristics:**
- Carta clara con isobaras de tinta y bandas de presión cada 4 hPa; campos de color plano por proyecto.
- Archivo variable como única voz de titular, texto y rótulo; Martian Mono solo para medidas.
- Tarjetas y ventanas de radio generoso; botones y chips en píldora.
- Frentes dibujados con el scroll como divisores de escena.
- Bandas oscuras: Atlántico profundo (`ocean`) para contacto; KORA lleva la paleta de su propia web (`kora`).
- Tecnologías verificadas en chip sólido; declaradas en chip de contorno.

## Colors

Una carta casi blanca y fría, tinta azul petróleo, y siete campos saturados tomados de los mapas de modelo meteorológico, usados en planos grandes y nunca como degradado decorativo.

### Primary
- **Tinta de isobara** (`ink`): texto, isobaras del campo claro, botón principal, chip verificado, silueta de la isla. Es el único color de lectura sobre papel.
- **Atlántico profundo** (`ocean`, con `ocean-2` como tono de apoyo): fondo de la banda de contacto y de la barra en modo oscuro y tinta de la tarjeta de LanzaMet sobre cielo.

### Secondary
- **Frente frío** (`cold`): anillo de foco, frentes fríos, letra A de anticiclón, trazo y fechas de la trayectoria.
- **Frente cálido** (`warm`): frentes cálidos, letra B de borrasca, punto de estación y su pulso, punto «ahora» de la trayectoria, campo de ACESLAN (con `warm-ink` como tinta).
- **Calima** (`calima`): núcleo del anticiclón en la carta, selección de texto, barra de progreso de los tramos horizontales, hover del correo de contacto, rótulos sobre `ocean`.

### Tertiary
- **Cielo** (`sky`): campo de LanzaMet y fondo del hover del archivo.
- **Alisio** (`alisio`): banda de tecnologías y punto de disponibilidad.
- **KORA** (`kora`, `kora-2`, `kora-line`, `kora-muted`, `kora-pink`, `kora-wine`): la paleta de koradigitalsolutions.com, aplicada solo a su tramo, su ventana y la barra sobre él. Negro casi puro, tarjetas `kora-2` con filete `kora-line`, rosa `kora-pink` para acentos y acción (con texto `kora`), brillo `kora-wine` de fondo.
- **HairCloud** (`cloud` → `cloud-2`, `cloud-blue`): el degradado grafito de la app real y el azul de su nube; texto en blanco, acción en `cloud-blue` con texto oscuro.
- **Ocluido** (`lilac`): reservado; ya no lo usa ningún proyecto.

### Neutral
- **Carta** (`paper`): fondo de página, plancha del hero, ventanas, rótulos de estación.
- **Carta en sombra** (`paper-2`): pista de la barra de desplazamiento y fondo secundario.
- **Tinta segunda** (`ink-2`): texto secundario (pies, claves de ficha, entradillas grises, notas).
- **Regla** (`rule`): filetes de lista, bordes de ficha y de barra, contorno de controles en reposo.

### Named Rules
**The Field Pair Rule.** Cada campo de color lleva su tinta fija y nunca otra: cielo con `ocean`, cálido con `warm-ink`, `kora` con blanco, degradado `cloud` con blanco. La pareja viaja junta de la tarjeta a su ventana y al enlace «siguiente».

**The Chart Palette Rule.** El campo claro del hero usa la paleta `#C3DDED, #D9EDE8, #EEF2F0, #EEF2F0, #F5DFAF` (la calima solo en el núcleo del anticiclón) con isobaras de tinta al 20 %; el campo oscuro de contacto usa `#0A2433, #0D3043, #103A4F, #15465B, #1C566A` con isobaras `sky` al 17 %. Bandas cada 4 hPa, isobaras cada 2 hPa y una maestra cada 8 hPa.

## Typography

**Display Font:** Archivo variable, ancho 62–125 (con ui-sans-serif, system-ui)
**Body Font:** Archivo variable (misma familia)
**Label/Mono Font:** Martian Mono (con ui-monospace), solo para medidas

**Character:** Una sola familia que cambia de carácter con el eje de ancho: expandida y negra (106–122, peso 700–800) en titulares, normal en lectura, ligeramente ancha (106) en rótulos. La mono es el instrumento: coordenadas, hora, hPa, años y fechas, y la ruta de la ventana.

### Hierarchy
- **Display** (800, ancho 118, `clamp(3.3rem, 9.4vw, 10.5rem)`, 0.86): el nombre del hero, en dos líneas. Contacto, ventana y «siguiente» suben a ancho 122 y hasta 10.5rem.
- **Headline** (800, ancho 118, `clamp(2.8rem, 1.6rem + 5.2vw, 6rem)`, 0.92): titulares de sección (Proyectos, Con qué construyo, Trayectoria).
- **Headline station** (800, ancho 122, `min(5.6rem, 14.5cqi)`, 0.9): nombre de proyecto en su tarjeta, en una línea medida por contenedor.
- **Title** (750, ancho 106–112, 1–1.05): titular del parte del día, título del archivo, encabezados de fila de ventana.
- **Lede** (450, `clamp(1.3rem, …, 1.95rem)`, 1.38, máx. 34–40ch): declaración del parte e introducción de ventana; las afirmaciones de tarjeta van a 600.
- **Body** (400, `clamp(1rem, 0.95rem + 0.2vw, 1.125rem)`, 1.55, 44–56ch): todo el texto de lectura.
- **Label** (600, ancho 106, 0.8–0.86rem): tipo de proyecto, sector, pies, claves de ficha, estado, botón de contorno.
- **Measure** (Martian Mono, 0.68–0.74rem, cifras tabulares): lectura en vivo de la barra, hPa de las letras de presión, fechas del archivo y de la trayectoria, miga de ruta de la ventana.
- **Pressure** (800, ancho 100, `clamp(3rem, 6vw, 5.5rem)`): las letras A y B, en `cold` y `warm`.

### Named Rules
**The Instrument Rule.** Martian Mono solo escribe medidas: coordenadas, hora, hPa, años y fechas, y la ruta. Rótulos, etiquetas, botones y pies son Archivo.

**The Width Ladder Rule.** El ancho sube con la jerarquía: 100 en lectura, 106 en rótulos, 106–112 en títulos, 118 en titulares, 122 en nombres de proyecto y cierres. En móvil el titular de contacto vuelve a 100.

## Layout

Página vertical con dos tramos horizontales anclados: KORA (las webs del equipo) y la trayectoria (barograma 2021–2026). El contenido se ciñe a `wrap` con márgenes `gutter`; las tarjetas de proyecto llegan hasta 1600px y ocupan hasta `min(88vh, 860px)` de alto, en dos columnas 5/7 (texto, escena). La barra fija mide `bar` (60px en móvil) y está siempre visible: marca, navegación, idioma y «Escríbeme», sin lectura en vivo.

Por debajo de 900px la navegación pasa a menú desplegable con `clip-path`, todas las rejillas a una columna y los tramos horizontales pierden el anclaje: KORA se desliza de forma nativa con `scroll-snap` y la trayectoria se apila en vertical sobre una línea `cold`. El mismo comportamiento sin anclaje se aplica con `prefers-reduced-motion`.

## Elevation & Depth

Profundidad por capas de mapa, no por materiales: el campo de presión es el suelo, los signos (letras, frentes, isla, estaciones) flotan sobre él, y las piezas de lectura se apoyan en planchas sólidas con sombras ambientales largas, difusas y desplazadas solo hacia abajo. No hay sombras de desplazamiento duro, ni cristal, ni resplandores.

### Shadow Vocabulary
- **Filete de barra** (`box-shadow: 0 1px 0 var(--rule)`): barra sólida y ventana.
- **Plancha** (`box-shadow: 0 1px 0 var(--rule), 0 22px 44px -30px rgba(12, 46, 64, 0.5)`): plancha de papel del hero.
- **Rótulo de estación** (`box-shadow: 0 6px 18px -10px rgba(12, 46, 64, 0.5)`): píldoras de estación sobre el campo.
- **Botón al pasar** (`box-shadow: 0 10px 24px -12px rgba(12, 46, 64, 0.55)`): realce de botón en hover.
- **Captura** (`box-shadow: 0 30px 60px -28px rgba(8, 28, 40, 0.55), 0 2px 6px rgba(8, 28, 40, 0.1)`): capturas sobre campo de proyecto.
- **Recorte de prensa** (`box-shadow: 0 24px 50px -24px rgba(42, 14, 7, 0.65)`): recortes sobre el campo cálido, teñida con `warm-ink`.

### Named Rules
**The Solid Ground Rule.** El texto de lectura siempre descansa en un plano sólido: papel, la plancha del hero o un campo plano de proyecto. Nunca sobre el campo WebGL, las isobaras o una captura.

## Shapes

Esquinas generosas y continuas: tarjetas de proyecto, retrato y webs de KORA en `card`; plancha del hero en `plate`; recortes y capturas de ventana en `clip`; capturas de tarjeta en `shot`. Todo control interactivo es píldora (`pill`): botones, chips, selector de idioma, cerrar ventana, enlaces de contacto; los pasos de ventana son círculos. Las formas del mundo son círculos concéntricos (isobaras en `repeating-radial-gradient`), líneas onduladas de frente con triángulos o semicírculos, puntos de estación con anillo y la silueta enmascarada de Lanzarote. Los filetes de lista son de 1px en `rule`; los contornos de control, `inset 0 0 0 1.5px`.

## Components

### Buttons
- **Shape:** píldora (`pill`), alto mínimo 48px (42px en la barra).
- **Primary:** fondo `ink`, texto `paper`, Archivo 600; flecha que avanza 4px al pasar y sombra «botón al pasar».
- **Line:** transparente con contorno de 1.5px en `currentColor`; al pasar se rellena de `ink` con texto `paper`. Para la acción secundaria (correo, segundo enlace de ventana).
- **KORA:** `kora-pink` con texto `kora`, solo dentro del tramo de KORA.
- **Focus:** anillo de 2px `cold` a 3px de distancia.

### Chips
- **Verified:** relleno `ink`, texto `paper`: tecnología demostrada por código público o producto en producción.
- **Declared:** sin relleno, contorno `inset 0 0 0 1.5px` `ink`: tecnología declarada sin código que la enseñe.
- **Quiet:** fondo de la tinta del campo al 9 % dentro de las tarjetas de proyecto.
- La leyenda de la banda de tecnologías usa la misma clave (punto sólido frente a punto de contorno).

### Cards / Containers
- **Tarjeta de estación (proyecto):** radio `card`, fondo `--field` y tinta `--field-ink` según la pareja del proyecto, sin borde ni sombra; columna de texto con nombre en una línea, tipo, afirmación, cuerpo, chips y acciones; escena a la derecha con capturas, isla o signos.
- **Plancha del hero:** papel, radio `plate`, sombra «plancha»; lleva la frase de rol, el estado y las acciones.
- **KORA:** el título de la sección, la cabecera de su ventana y su banda «Siguiente proyecto» usan el logotipo real (`/img/kora-logo.svg`, de koradigitalsolutions.com) con su punto característico (`.kora-dot`: 26 % de la altura del logo, separado un 15 %, alineado abajo), en `kora-pink` con brillo; en su web el punto se vuelve de ese color al pasar el ratón. Su campo en las ventanas es `kora-field` (negro con brillo vino y rosa-rojo).
- **ACESLAN:** campo `ace-field` (negro cálido `#150E0D` con resplandor `ace-red`), texto blanco y etiquetas `ace-soft`; escena con el panel web en marco de navegador oscuro y dos pantallas de la app; la prensa, discreta, en una sola línea bajo el texto («En la prensa» y los dos medios como enlaces); los titulares completos viven en la ventana del proyecto.
- **Haría Game:** campo `hg-field` (grafito volcánico `#15181B` con resplandor verde y cian, los de los botones del juego); escena con dos pantallas del juego (pista y entrada) en marco de pantalla sin barra; botón `btn--game` en verde.
- **Archivo «También en GitHub»:** secundario a propósito: título pequeño en `ink-2`, rejilla de 3 columnas (2 en tableta, 1 en móvil) de fichas con filete `rule` y radio 12px.
- **Trayectoria:** papel de barógrafo (`#E4EFF2` con cuadrícula azul de 44 × 88 px), hitos en tarjetas `paper` con etiqueta de tipo (formación `alisio`, trabajo `warm`, proyecto `cold`, empresa `calima`), «Hoy» en tinta, años de inicio en grande al fondo y la traza dibujada con el scroll horizontal.
- **Web de KORA:** tarjeta `kora-2` de radio 16px con filete `kora-line`; arriba, la vista previa cuadrada real de la portada (captura de `scripts/kora-shots.mjs`); debajo, sector en `kora-pink`, nombre en blanco, descripción en `kora-muted` y URL tras un filete. Al pasar el ratón sube, el filete pasa a rosa y la captura se acerca un 4 %.
- **Recorte de prensa:** papel, radio `clip`, girado ±2–2.5° que se endereza al pasar.

### Navigation
- **Barra (leyenda de la carta):** marca, lectura en vivo en mono (coordenadas, hora de Canarias, hPa que cambia con el scroll), enlaces con subrayado que crece de izquierda a derecha, selector ES/EN en píldora y «Escríbeme» como botón principal. Transparente sobre el hero, `paper` con filete al bajar, `ocean` sobre bandas oscuras; se esconde al bajar y vuelve al subir.
- **Móvil:** botón de dos trazos que se cruzan; el menú cae con `clip-path` desde la barra, enlaces a 1.6rem ancho 110.

### Ventana de proyecto (signature)
Una hoja a pantalla completa que se abre con un `clip-path` que crece desde la tarjeta de origen (0.95s, `expo.inOut`) y se cierra volviendo a ella. Dentro, un caso de estudio:

- **Cabecera a sangre** en el campo del proyecto (con una luz suave arriba a la derecha, sin anillos ni siluetas): nombre o logotipo, tipo, frase y acciones a la izquierda; los cuatro datos en un panel de 2 × 2 con filetes a la derecha.
- **Escena** que monta sobre el borde entre cabecera y cuerpo, según el material: pantalla + teléfono (LanzaMet, ACESLAN), dos pantallas (Haría Game), tres teléfonos en abanico (HairCloud) o mosaico escalonado de vistas previas (KORA).
- **Cuerpo en dos columnas**: lateral fija con la introducción, las tecnologías y la nota; a la derecha, «Cómo está hecho» en tarjetas de 2 columnas con un punto del acento del proyecto, la comparación real ↔ juego (Haría Game), las capturas en mosaico compacto de 12 columnas (pantalla 6, teléfono 3, vista previa 3) con pie corto, y las listas como píldoras.
- **Cierre** con el siguiente proyecto en su campo, su frase y la miniatura de su primera captura.

Cada campo expone `--field`, `--field-ink`, `--field-base` (sólido, para el texto del botón principal) y `--field-accent`. Escape cierra, flechas cambian de proyecto, el foco queda atrapado dentro.

### Frente (signature)
Divisor de escena: línea ondulada de 3px dibujada con DrawSVG según el scroll; los triángulos (frente frío, `cold`) o semicírculos (frente cálido, `warm`) brotan con `back.out(3)` a su paso.

### Coreografía
- **Entrada:** `expo.out`; los caracteres del nombre suben desde su línea, el retrato sube y se asienta sobre el borde inferior, las letras A/B aparecen con `back.out(2)`.
- **El frente pasa:** el desplazamiento del campo del hero está ligado al scroll del hero; el nombre se queda atrás y el retrato baja y se reduce. En «Parte del día» la isla se asienta en su marco (escala y giro ligados al scroll).
- **La mirada:** los iris del retrato siguen al cursor por todo el hero (`quickTo`, recorrido máximo 20 % en horizontal y 9 % en vertical, recortados por la apertura de cada párpado).
- **Titulares de sección:** los caracteres suben desde una máscara de línea (`yPercent: 115`, escalonado 0.025s).
- **Tarjetas:** crecen de escala 0.9 a 1 con el scroll; el texto entra con desplazamiento.
- **Tramos horizontales:** KORA y trayectoria se desplazan en horizontal mientras están anclados; la trayectoria dibuja su traza.
- **Declaración:** cada palabra pasa de `#5A6C77` a `ink` con el scroll; nunca parte invisible.

## Do's and Don'ts

### Do:
- **Do** poner el texto de lectura siempre sobre fondo sólido: la copia del hero va en su plancha de papel, el texto de proyecto sobre su campo plano.
- **Do** reservar Martian Mono para medidas: coordenadas, hora, hPa, años y fechas, y la ruta.
- **Do** distinguir lo verificado de lo declarado: chip sólido `ink` frente a chip de contorno.
- **Do** mantener cada campo con su tinta fija (cielo/`ocean`, cálido/`warm-ink`, `kora`/blanco, `cloud`/blanco).
- **Do** animar solo `transform` y `opacity` (más el `clip-path` de la ventana y el menú, y el color de la declaración).
- **Do** medir el layout fuera de los bucles: tamaños leídos una vez y al redimensionar, nunca tras escribir transformaciones en el mismo frame.
- **Do** pausar fuera de pantalla las animaciones en bucle (CSS con `.is-off`, GSAP con su `ScrollTrigger`).
- **Do** medir con `scripts/perf.mjs` antes de dar un efecto por bueno; referencia p90 ≈ 16.7 ms.

### Don't:
- **Don't** poner un antetítulo o kicker encima de un titular; el tipo de proyecto va debajo del nombre.
- **Don't** ocultar texto de lectura con el movimiento: las entradas usan transformaciones, no transparencia.
- **Don't** escribir rótulos, botones o etiquetas en mono.
- **Don't** poner texto sobre el campo WebGL, las isobaras o una captura.
- **Don't** usar sombras de desplazamiento duro, resplandores ni cristal esmerilado.
- **Don't** añadir un segundo plano WebGL por escena ni animar propiedades de layout.

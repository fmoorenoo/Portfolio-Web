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
  crema: "#F1EFE8"
  bosque: "#16463A"
  hoja: "#0D7A4C"
  brote: "#A9D6A8"
  tinta-cuaderno: "#3A594F"
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
  hero-system:
    backgroundColor: "{colors.cold}"
    textColor: "#FFFFFF"
    rounded: "irregular (src/blobs.ts)"
    padding: "clamp(10px, 1.4vw, 20px)"
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

La página es el parte meteorológico de un desarrollador que construye software para su isla: una carta clara (papel `paper`) sobre la que un campo de presión pintado en WebGL2 dibuja bandas de color escalonadas e isobaras de tinta. Los centros de presión se desplazan con el scroll y la leyenda queda quieta mientras el campo se mueve. Encima viven los signos propios de un mapa de modelo: barbas de viento, frentes fríos con triángulos y cálidos con semicírculos, puntos de estación con su rótulo y la silueta real de Lanzarote en tinta. El hero lo protagoniza el retrato recortado de Fernando delante de un sol de calima, sobre un cielo limpio que se funde con el papel y en el que el campo solo dibuja isobaras finas; el retrato se funde por los hombros y por abajo. La isla pasa al «Parte del día». Cada proyecto es una estación: una tarjeta grande sobre su propio campo de color que se abre, recortada desde la propia tarjeta, en una ventana con ruta propia.

La densidad es la de un parte de televisión: un nombre enorme en Archivo expandido, pocas piezas, mucha carta alrededor. La expresividad vive en el campo, los frentes y el ancho de la letra; la información vive siempre sobre fondo sólido (papel, plancha de papel o campo plano), en texto fluido con contraste AA. El movimiento es parte del mundo (el frente pasa, el campo se desplaza) pero nunca oculta lectura: las entradas son transformaciones y el texto largo pasa de un gris legible a tinta.

El rendimiento es contenido: un único plano WebGL por escena, transformaciones y opacidad como únicas propiedades animadas, lecturas de layout fuera de los bucles y animaciones en bucle pausadas fuera de pantalla. Se rechaza la plantilla oscura de desarrollador (hero, rejilla de tarjetas y neón) y el muro de carteles anterior.

**Key Characteristics:**
- Carta clara con isobaras de tinta y bandas de presión cada 4 hPa; campos de color plano por proyecto.
- Archivo variable como única voz de titular, texto y rótulo; Martian Mono solo para medidas.
- Tarjetas y ventanas de radio generoso; botones y chips en píldora.
- Frentes dibujados con el scroll como divisores de escena.
- Bandas oscuras: Atlántico profundo (`ocean`) para contacto; KORA lleva la paleta de su propia web (`kora`).
- Tecnologías como seis sistemas de color con forma irregular, uno por familia, que flotan sobre el papel con su isobara alrededor.

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
- **Alisio** (`alisio`): punto de disponibilidad (que late como una estación) y su píldora.
- **KORA** (`kora`, `kora-2`, `kora-line`, `kora-muted`, `kora-pink`, `kora-wine`): la paleta de koradigitalsolutions.com, aplicada solo a su tramo, su ventana y la barra sobre él. Negro casi puro, tarjetas `kora-2` con filete `kora-line`, rosa `kora-pink` para acentos y acción (con texto `kora`), brillo `kora-wine` de fondo.
- **HairCloud** (`cloud` → `cloud-2`, `cloud-blue`): el degradado grafito de la app real y el azul de su nube; texto en blanco, acción en `cloud-blue` con texto oscuro.
- **Ocluido** (`lilac`): reservado; ya no lo usa ningún proyecto.

### Neutral
- **Carta** (`paper`): fondo de página, ventanas, rótulos de estación.
- **Carta en sombra** (`paper-2`): pista de la barra de desplazamiento y fondo secundario.
- **Tinta segunda** (`ink-2`): texto secundario (pies, claves de ficha, entradillas grises, notas).
- **Regla** (`rule`): filetes de lista, bordes de ficha y de barra, contorno de controles en reposo.

### Cuaderno de campo
Proyectos, KORA y Trayectoria se imprimen en otra paleta, a dos tintas: papel **crema grisáceo** (`crema`, con textura propia de grano y fibras, `papel-crema.webp`), **verde bosque** (`bosque`) para el texto, los bloques y KORA, y **verde hoja** (`hoja`) para rótulos, trazos y acciones; **brote** (`brote`) es el verde claro sobre bosque y **tinta de cuaderno** (`tinta-cuaderno`), el gris verdoso de lectura sobre crema (AA). La **calima** es el único acento cálido (soles, sellos de KORA, estación de «Hoy»); el punto rosa del logotipo de KORA se conserva como marca.

**Paleta de cada proyecto** (`[data-p]`, en su doble página y en su ventana): `--p-field` (el bloque plano, con grano), `--p-on`/`--p-label` (texto y rótulos sobre él), `--p-ink`/`--p-acc` (tinta y acento sobre el crema, AA) y `--p-line` (filete del cupón). LanzaMet: cielo `#BFE3EA` con `ocean`; ACESLAN: negro cálido `#1C1210` con rojo `#B5321D`/`#FF8A70`; KORA: `kora` con `kora-pink` (y `#C8174A` sobre crema); HairCloud: grafito `#2A2C30` con azul `#2366C0`/`#8CC1F5`; Haría Game: `hg` con verde `#1E7A35`/`#8FE3A6`. Sus pegatinas toman los mismos colores. El grano de los bloques es un SVG de ruido (`--grano`) fundido en `overlay` (en `soft-light` sobre el cielo), que no cambia el tono.

### Named Rules
**The Field Pair Rule.** Cada campo de color lleva su tinta fija y nunca otra: cielo con `ocean`, cálido con `warm-ink`, `kora` con blanco, degradado `cloud` con blanco. La pareja viaja junta de la tarjeta a su ventana y al enlace «siguiente».

**The Chart Palette Rule.** El campo claro del hero no lleva bandas: un degradado vertical de cielo `#C6E2EB` a `paper` con isobaras de tinta al 13 %, y un sol de calima (`#FBD58A` → `calima`, con dos halos) detrás del retrato; el campo oscuro de contacto usa `#0A2433, #0D3043, #103A4F, #15465B, #1C566A` con isobaras `sky` al 17 %. Bandas cada 4 hPa, isobaras cada 2 hPa y una maestra cada 8 hPa.

## Typography

**Display Font:** Archivo variable, ancho 62–125 (con ui-sans-serif, system-ui)
**Body Font:** Archivo variable (misma familia)
**Label/Mono Font:** Martian Mono (con ui-monospace), solo para medidas

**Character:** Una sola familia que cambia de carácter con el eje de ancho: expandida y negra (106–122, peso 700–800) en titulares, normal en lectura, ligeramente ancha (106) en rótulos. La mono es el instrumento: coordenadas, hora, hPa, años y fechas, y la ruta de la ventana.

### Hierarchy
- **Display** (800, ancho 125, `clamp(3rem, 7.4vw, 8.6rem)`, 0.84): el nombre del hero en bloque: «Fernando» en contorno, escalado para medir lo mismo que «Montelongo» macizo, con una escala gráfica de mapa debajo. Contacto, ventana y «siguiente» suben a ancho 122 y hasta 10.5rem.
- **Headline** (800, ancho 118, `clamp(2.8rem, 1.6rem + 5.2vw, 6rem)`, 0.92): titulares de sección (Proyectos, Tecnologías, Trayectoria).
- **Headline station** (800, ancho 122, `min(5.6rem, 14.5cqi)`, 0.9): nombre de proyecto en su tarjeta, en una línea medida por contenedor.
- **Title** (750, ancho 106–112, 1–1.05): titular del parte del día, título del archivo, encabezados de fila de ventana.
- **Lede** (450, `clamp(1.3rem, …, 1.95rem)`, 1.38, máx. 34–40ch): declaración del parte e introducción de ventana; las afirmaciones de tarjeta van a 600.
- **Body** (400, `clamp(1rem, 0.95rem + 0.2vw, 1.125rem)`, 1.55, 44–56ch): todo el texto de lectura.
- **Label** (600, ancho 106, 0.8–0.86rem): tipo de proyecto, sector, pies, claves de ficha, estado, botón de contorno.
- **Measure** (Martian Mono, 0.68–0.74rem, cifras tabulares): lectura en vivo de la barra, fechas del archivo y de la trayectoria, miga de ruta de la ventana.

### Named Rules
**The Instrument Rule.** Martian Mono solo escribe medidas: coordenadas, hora, hPa, años y fechas, y la ruta. Rótulos, etiquetas, botones y pies son Archivo.

**The Width Ladder Rule.** El ancho sube con la jerarquía: 100 en lectura, 106 en rótulos, 106–112 en títulos, 118 en titulares, 122 en nombres de proyecto y cierres. En móvil el titular de contacto vuelve a 100.

## Layout

Página vertical con dos tramos horizontales anclados: KORA (las webs del equipo) y, en escritorio, la trayectoria (barograma 2021–2026). El contenido se ciñe a `wrap` con márgenes `gutter`; las dobles páginas de proyecto llegan hasta 1480px, en dos columnas 1:1 (panel y texto, alternándose). La barra fija mide `bar` (60px en móvil) y está siempre visible: idioma, navegación a los dos lados del logo y «Escríbeme», sin lectura en vivo.

Por debajo de 1200px la navegación pasa a menú desplegable con `clip-path`; por debajo de 1000px los proyectos van en una columna y por debajo de 900px el resto de rejillas. En móvil la trayectoria va en vertical con el scroll nativo y su punto baja por la línea; KORA ancla solo su carril de webs: el carril no se suelta hasta que la última web ha entrado entera, el recorrido vertical es 1,5 veces el horizontal y al soltar el dedo se asienta en la web más cercana (en horizontal, con poca altura, las webs se reducen para caber). `ignoreMobileResize` evita que la barra de direcciones del navegador recalcule los anclajes a mitad del gesto. En móvil los textos de una línea divididos en letras (nombre, «Proyectos», correo) toman su tamaño del ancho de pantalla para no partirse. Con `prefers-reduced-motion`, KORA se desliza de forma nativa con `scroll-snap` y la trayectoria se apila en vertical con todos los hitos encendidos.

## Elevation & Depth

Profundidad por capas de mapa, no por materiales: el campo de presión es el suelo, los signos (letras, frentes, isla, estaciones) flotan sobre él, y las piezas de lectura se apoyan en planchas sólidas con sombras ambientales largas, difusas y desplazadas solo hacia abajo. No hay sombras de desplazamiento duro, ni cristal, ni resplandores.

### Shadow Vocabulary
- **Filete de barra** (`box-shadow: 0 1px 0 var(--rule)`): barra sólida y ventana.
- **Sistema** (`filter: drop-shadow(0 26px 28px <color del sistema a ~45%>)`): sombra teñida de las formas irregulares del hero y de las tecnologías.
- **Rótulo de estación** (`box-shadow: 0 6px 18px -10px rgba(12, 46, 64, 0.5)`): píldoras de estación sobre el campo.
- **Botón al pasar** (`box-shadow: 0 10px 24px -12px rgba(12, 46, 64, 0.55)`): realce de botón en hover.
- **Captura** (`box-shadow: 0 30px 60px -28px rgba(8, 28, 40, 0.55), 0 2px 6px rgba(8, 28, 40, 0.1)`): capturas sobre campo de proyecto.
- **Recorte de prensa** (`box-shadow: 0 24px 50px -24px rgba(42, 14, 7, 0.65)`): recortes sobre el campo cálido, teñida con `warm-ink`.

### Named Rules
**The Solid Ground Rule.** El texto de lectura siempre descansa en un plano sólido: papel, una forma de sistema (hero, tecnologías) o un campo plano de proyecto. Nunca sobre el campo WebGL, las isobaras o una captura.

## Shapes

Esquinas generosas y continuas: tarjetas de proyecto, retrato y webs de KORA en `card`; formas de sistema irregulares (`src/blobs.ts`: superelipse con el radio alterado, unida con Catmull-Rom y recortada con un `clipPath` en unidades del elemento) en el hero y las tecnologías; recortes y capturas de ventana en `clip`; capturas de tarjeta en `shot`. Todo control interactivo es píldora (`pill`): botones, chips, selector de idioma, cerrar ventana, enlaces de contacto; los pasos de ventana son círculos. Las formas del mundo son círculos concéntricos (isobaras en `repeating-radial-gradient`), líneas onduladas de frente con triángulos o semicírculos, puntos de estación con anillo y la silueta enmascarada de Lanzarote. Los filetes de lista son de 1px en `rule`; los contornos de control, `inset 0 0 0 1.5px`.

## Components

### Buttons
- **Shape:** píldora (`pill`), alto mínimo 48px (42px en la barra).
- **Primary:** fondo `ink`, texto `paper`, Archivo 600; flecha que avanza 4px al pasar y sombra «botón al pasar».
- **Line:** transparente con contorno de 1.5px en `currentColor`; al pasar se rellena de `ink` con texto `paper`. Para la acción secundaria (correo, segundo enlace de ventana).
- **Cuaderno:** dentro de Proyectos, KORA y Trayectoria no hay botones con forma: la acción principal es el enlace de anillo (ver «Cuaderno de campo»).
- **Focus:** anillo de 2px `cold` a 3px de distancia.

### Chips
- **Quiet:** fondo de la tinta del campo al 9 % dentro de las tarjetas de proyecto.

### Tecnologías
- Titular grande (ancho 122, hasta 6rem) con una línea de apoyo y, debajo, seis sistemas de color en racimo (dos filas desalineadas en escritorio, columna en móvil): Frontend en `cold`, Backend en `warm`, Bases de datos en `calima`, Móvil en `alisio`, Videojuegos en `lilac` y Herramientas en `ocean`, cada uno con su tinta AA. Dentro, el icono y la familia como etiqueta y las tecnologías en Archivo 750 ancho 112, más grandes cuantas menos tiene el sistema. Sección compacta (titular hasta 3.8rem, tecnologías 0.95–1.6rem): las formas no flotan ni entran animadas. Con ratón, una lectura sobre ellas dice en qué proyectos se ha usado la tecnología bajo el cursor. Sin distinguir público de no público.
- **Dónde trabajo:** debajo de las tecnologías (a su derecha desde 1100px, con su cabecera a la misma altura y del mismo tamaño), la foto del escritorio sin marcas encima. Cada pieza responde dentro de su contorno (botones invisibles recortados con `clip-path`) y abre su ficha siempre en el mismo sitio, a la altura de los cajones: plancha `paper` de radio 14px como las de la trayectoria, etiqueta de tipo en píldora del color de su familia (equipos `cold`, pantallas `alisio`, periféricos `lilac`, silla `warm`), nombre en Archivo 750 y una línea en `ink-2`. Ratón al pasar, toque para abrir y cerrar, teclado con foco visible.

### Cards / Containers
- **Tarjeta de estación (proyecto):** radio `card`, fondo `--field` y tinta `--field-ink` según la pareja del proyecto, sin borde ni sombra; columna de texto con nombre en una línea, tipo, afirmación, cuerpo, chips y acciones; escena a la derecha con capturas, isla o signos.
- **Presentación del hero:** un sistema propio, forma irregular en degradado `cold` con un toque `lilac`, que flota sobre el cielo con dos isobaras alrededor. Texto en blanco: disponibilidad en píldora translúcida con su punto latiendo, saludo personal («Hola, soy Fernando.») en Archivo 800 y una presentación breve de la web (qué se va a encontrar: formación, proyectos y herramientas), sin cifras; acciones en `calima` y contorno blanco.
- **KORA:** el título de la sección, la cabecera de su ventana y su banda «Siguiente proyecto» usan el logotipo real (`/img/kora-logo.svg`, de koradigitalsolutions.com) con su punto característico (`.kora-dot`: 26 % de la altura del logo, separado un 15 %, alineado abajo), en `kora-pink` con brillo; en su web el punto se vuelve de ese color al pasar el ratón. Su campo en las ventanas es `kora-field` (negro con brillo vino y rosa-rojo).
- **ACESLAN:** campo `ace-field` (negro cálido `#150E0D` con resplandor `ace-red`), texto blanco y etiquetas `ace-soft`; escena con el panel web en marco de navegador oscuro y dos pantallas de la app; la prensa, discreta, en una sola línea bajo el texto («En la prensa» y los dos medios como enlaces); los titulares completos viven en la ventana del proyecto.
- **Haría Game:** campo `hg-field` (grafito volcánico `#15181B` con resplandor verde y cian, los de los botones del juego); escena con dos pantallas del juego (pista y entrada) en marco de pantalla sin barra; botón `btn--game` en verde.
- **Formación:** sección propia antes de Proyectos: la leyenda de color de una carta convertida en línea de tiempo. Tres tramos a escala (Bachillerato `calima` 2021–2023, DAM `alisio` 2023–2025, DAW `cold` 2025–2026) que son pestañas; un sol de calima se desplaza hasta el tramo elegido y debajo aparece su ficha, teñida con su color: siglas con cada palabra en escalera bajo su letra, título, centro, años en mono y enlaces (con logo) a lo hecho en esa etapa. Sin JavaScript se ven las tres fichas. Píldora «Inglés · B2 acreditado» junto a la entradilla.
- **Cuaderno de campo (Proyectos, KORA, Trayectoria):** hojas de papel crema (`.sheet`) con el canto rasgado arriba y abajo (una máscara que repite un borde irregular), puestas sobre la carta. Todo plano, en 2D: capturas rectas en marco de papel de 6px, teléfonos con canto oscuro y filete de papel, sin sombras ni degradados ni radios. **Pegatinas** troqueladas dibujadas en línea (sol y mar, campana, tijeras, palmera de Haría, navegador, volcán; símbolos `st-*` del sprite): el dibujo se usa tres veces, en tinta desplazada 3,5px (el grosor), en blanco con trazo de 16px (el troquel, que sigue la silueta) y encima el dibujo; se «pegan» con un rebote al aparecer y giran un poco más al pasar por su proyecto. **Sellos**: moneda de canto dentado (`st-edge`) en `hoja` (o `calima` en KORA) con un anillo de puntos, texto en curva y su centro (la silueta de la isla, el número de webs de KORA, un sol); giran despacio con el scroll donde el navegador lo hace solo (`animation-timeline: view()`, sobre el `<svg>` entero para que lo componga). **Enlace de anillo** (`.ring-link`): la flecha en un anillo liso y otro de puntos, rótulo en mayúsculas; al pasar se llena de `hoja` y los puntos giran. Rótulos de tipo en `hoja`, mayúsculas, ancho 118 y espaciado 0.08em, precedidos de un trazo discontinuo.
- **Dobles páginas de proyecto:** columnas 1:1 alternadas (`.case--flip`). El panel es un bloque plano de `bosque` con su grano y un filete discontinuo `brote` dentro (como un cupón), con la escena del proyecto montada encima y su pegatina en la esquina que da al texto; el texto va en tinta sobre el papel: nombre (800, ancho 116) medido por su columna, rótulo de tipo, filete discontinuo, frase, cuerpo en `tinta-cuaderno`, tecnologías en una línea separadas por ✳ y el enlace de anillo con los enlaces externos. Una línea discontinua central une los proyectos y un punto `bosque` con anillo de papel baja por ella con el scroll, dejándola en `hoja`. Por debajo de 1000px: una columna, panel arriba, pegatina en la esquina inferior y un filete discontinuo entre proyectos.
- **Archivo «También en GitHub»:** índice en filas separadas por filetes discontinuos: flecha en su anillo, nombre, qué es, tecnologías en `hoja` y año en mono. Al pasar el ratón no se rellena la fila: un trazo de rotulador de calima pasa por detrás del nombre de izquierda a derecha, el anillo se llena de `bosque` y la flecha sale por su esquina y vuelve a entrar por la contraria, y el contenido entra 8px.
- **Trayectoria:** otra hoja del cuaderno. La traza discontinua es el recorrido completo y la de `hoja` se dibuja con el scroll; un punto `bosque` en su punta enciende cada hito al alcanzarlo. Cada hito cuelga de su estación (un sello pequeño con el icono de su tipo: libro, maletín, código, estrella) con un tallo discontinuo; al encenderse, un disco entintado aparece y crece bajo el icono y un trazo continuo baja por el tallo (opacidad y escala, en el compositor; las transiciones de color recalculaban estilos en cada frame). «Hoy» es el único bloque lleno, en `bosque`, con su estación en calima; un sello de llegada cierra el recorrido. Pegatina del volcán junto al titular y años enormes en contorno al fondo. En escritorio (≥900px) el tramo se ancla y avanza en horizontal; en móvil va en vertical con el scroll nativo y el punto baja por la línea; con movimiento reducido, en vertical y con todos los hitos encendidos.
- **KORA:** bloque `bosque` a sangre con su grano y un estampado de estrellas pequeñas en `brote`, como una tela impresa; su logotipo y su punto rosa se conservan. Pegatina del navegador junto al título, sello de calima con sus 8 webs junto al enlace de anillo y su nombre en letras gigantes de contorno `brote` que asoma por encima de las webs. Cada web es una foto impresa: papel crema con su margen, captura cuadrada recta, rótulo de sector en `hoja`, nombre en `bosque` y URL tras un filete discontinuo; sueltas, alternan giro (±2°) y altura, y al pasar se enderezan y suben.
- **Recorte de prensa:** papel, radio `clip`, girado ±2–2.5° que se endereza al pasar.

### Navigation
- **Barra (tira de papel):** una tira del papel gris del cuaderno con el canto rasgado arriba y abajo y dos trozos de cinta de calima translúcida en las puntas, centrada y algo más estrecha que la página; es siempre papel, sobre cualquier sección. Tres columnas con el logo centrado en un hueco reservado (`--slot`): idioma en el borde izquierdo, Formación · Proyectos · KORA y Tecnologías · Trayectoria · Contacto arrimados al logo (tres y tres, en el orden de la página), «Escríbeme» en el borde derecho. Logo, idioma y «Escríbeme» son piezas de papel mate troqueladas en blanco (`data-cut`), sin isobaras. Enlaces en tinta `bosque` (650, ancho 106); al pasar el ratón, un trazo de rotulador de calima pasa por detrás del texto; la sección en curso lleva ese mismo trazo, fijo. La tira tiene una sombra oscura (dos `drop-shadow`) para despegarse de cualquier fondo. Arriba del todo la tira baja 18px y el logo, a 1,32×, cuelga por su borde inferior; al bajar, ligado al scroll, el logo se encoge hasta su sitio y la tira sube hasta colgar del borde de la pantalla (su papel sube 13px más que lo que lleva, así el canto de arriba sale de la vista). «Proyectos» abre una ficha de papel plana con filetes discontinuos y los logos como pegatinas.
- **Tablet y móvil (<1200px):** la misma tira, casi a sangre: menú (dos trazos en un anillo) a la izquierda, logo en el centro (hasta 1,2× arriba) y «Escríbeme» a la derecha. En móvil el retrato del hero empieza `--hang` más abajo. El menú abierto es una hoja de papel bajo la tira, con los enlaces grandes en tinta separados por filetes discontinuos, los proyectos a la vista y el idioma al pie; abierto, la tira queda compacta.

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
- **Entrada:** `expo.out`; los caracteres del nombre suben desde su línea, el retrato sube y se asienta sobre el borde inferior.
- **El frente pasa:** el desplazamiento del campo del hero está ligado al scroll del hero; el nombre se queda atrás y el retrato baja y se reduce. En «Parte del día» la isla se asienta en su marco (escala y giro ligados al scroll).
- **La mirada:** desactivada provisionalmente (`EYES_FOLLOW` en `src/main.ts`); los iris quedan fijos en su sitio.
- **Entrada del retrato:** en CSS (`me-in`), no en GSAP: corre en el compositor desde el primer pintado y no espera al script (es el elemento LCP).
- **Preparación diferida:** solo el hero se prepara al arrancar; los disparadores del resto de secciones se crean en tiempo libre (`requestIdleCallback`), una pieza por hueco, desde que el nombre ya ha entrado o con el primer gesto de scroll. Los anclajes van primero.
- **Titulares de sección:** los caracteres suben desde una máscara de línea (`yPercent: 115`, escalonado 0.025s).
- **Proyectos:** sin escalado ligado al scroll ni entrada del panel completo. Un único `IntersectionObserver` añade `.is-in` a cada doble página y la entrada es CSS: el nombre sube desde su línea, el texto sube en cascada, la pegatina aparece con un pequeño rebote y cada escena tiene su gesto (la pantalla de LanzaMet desde la derecha y sus estaciones por orden, el panel de ACESLAN desde la izquierda, los teléfonos de HairCloud asomando, la entrada de Haría Game subiendo). Solo la línea central usa ScrollTrigger (`scrub`).
- **Formación:** la leyenda se dibuja tramo a tramo y la ficha sube; los tramos limpian sus estilos al acabar (no llevan transición de `transform`, que confundía a GSAP al recalcular).
- **Detalles interactivos** (`src/details.ts`): el nombre bajo presión (las letras cercanas al cursor se comprimen en el eje de ancho y toman `cold`); la lectura de tecnologías (dónde se ha usado cada una, solo datos verificados, con ratón); las vistas de LanzaMet (Hoy, ¿Dónde ir?, Mar, Noche; cambian a la vez la pantalla de escritorio y el móvil, `lanzamet-movil-{donde,mar,noche}-900.webp`; las capturas se piden al elegirlas); el aviso de prueba de ACESLAN (baja al teléfono, que vibra; llega uno solo la primera vez que la tarjeta se ve); y la leyenda de la formación. El contacto no tiene interacción con el ratón: su campo solo deriva.
- **Tramos horizontales:** KORA y, en escritorio, la trayectoria se desplazan en horizontal mientras están anclados. La traza viva de la trayectoria va sola en su capa (la discontinua y los años en otra que no se repinta); se dibuja escribiendo `stroke-dasharray` con su longitud ya medida y el punto se coloca con una tabla de 600 muestras de la traza tomada al recalcular, con el progreso de la propia animación: sin preguntar geometría ni medidas en el scroll.
- **Declaración:** estática en tinta (el color por palabra repintaba en cada frame de scroll).
- **En bucle:** solo la forma de la presentación del hero respira; el selector de idioma, los modos, los botones y las tecnologías quedan quietos.

## Do's and Don'ts

### Do:
- **Do** poner el texto de lectura siempre sobre fondo sólido: la copia del hero va en su forma de sistema, el texto de proyecto sobre su campo plano.
- **Do** reservar Martian Mono para medidas: coordenadas, hora, hPa, años y fechas, y la ruta.
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
- **Don't** usar selectores sobre el atributo `style` (`[style*=…]`): GSAP lo cambia en cada frame y obliga a revisar todos los descendientes. Usa un atributo propio (`data-cs`).
- **Don't** crear un ScrollTrigger en el arranque si su sección no está en el hero: va a la cola diferida.

### 2D en Formación y «Parte del día»
Fichas planas: un tinte de su color, contorno continuo de 1.5px y un filete discontinuo dentro (el cupón de los proyectos), radio 8px, sin degradados ni sombras difusas. Iconos en un círculo de su color con un anillo de puntos que gira al pasar; la ficha de GitHub, pizarra plana con grano. En Formación, la leyenda de la ruta en tramos de color a corte, la estación actual en calima con anillo de tinta, la ficha actual en azul plano con trama de puntos; la escala de inglés en guijarros lisos y el B2 en ámbar plano `#B86A00`. La isla del parte no cambia.

### Piezas de papel
La presentación del hero, el fondo del logo, el selector de idioma, los modos del retrato (con sus piezas) y «Escríbeme» son piezas de papel: color plano y mate (azul `#2F66DD` en la presentación, índigo `#3A3570` en el logo, lavanda `#5560D8` en idioma y modos, calima en sus piezas, pizarra `#34566A` en «Escríbeme»), el grano del papel encima (`soft-light`) y el canto deshilachado (`data-paper="ax ay n"`, src/blobs.ts: la forma se muestrea fina y se desplaza con un ruido suave a lo largo del contorno). Sombra corta y neutra. Tecnologías y «Dónde trabajo» van sobre un papel azulado `#D8E7F2` con grano; KORA, sobre carbón `#27272C`.

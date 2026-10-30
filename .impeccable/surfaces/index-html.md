---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

# Surface brief — portfolio (index.html)

Scope: la página del portfolio y sus ventanas de proyecto (/proyectos/<slug>). Modo: Experience.
Audiencia: reclutadores técnicos y clientes de KORA; pocos minutos; llegan desde LinkedIn/GitHub en escritorio (de día, en la oficina) y en móvil.
Tarea: entender quién es Fernando, ver lo publicado en orden de ranking, abrir un proyecto en su propia ventana, contactar.
Petición del usuario (30-10-2026): web premium que se recorre en vertical con tramos de scroll horizontal, cada proyecto con su ruta o ventana propia, colores más agradables pero vivos, elementos abstractos, conservar alguna tarjeta como la de LanzaMet, GSAP profesional; "muy diferente a lo que hay ahora"; "que me venda bien como desarrollador". Delegó la elección de dirección ("crea el diseño que consideres más apropiado").

## Direction contract

THESIS: El portfolio es el parte meteorológico de un desarrollador que construye software para su isla: una carta sinóptica viva de Lanzarote cuyos sistemas de presión se desplazan con el scroll; cada proyecto es una estación con su propia ventana. Rechaza la plantilla oscura de dev (hero + rejilla de tarjetas + neón) y el muro de diapositivas anterior.

OWN-WORLD: Carta clara #EEF2F0 con isobaras de tinta #10222C; campos de color escalonados como los mapas de modelo: alisio #3CC3A2, cielo #BFE3EA, calima #F4B23E, frente cálido #F0583A, frente frío #2E6BE6, ocluido #A98BEA; Atlántico profundo #0C2E40 para las bandas oscuras. Letras A/B de presión, barbas de viento, frentes con triángulos y semicírculos, punto de estación. Archivo variable (ancho 62–125) como voz de titular y texto; Martian Mono solo para medidas (coordenadas, hora, hPa, fechas, cifras). Tarjetas grandes de radio 28 px sobre campos de color; el texto siempre sobre fondo sólido.

STORY: Identidad en la carta → parte del día (quién es, ficha de estación con datos reales) → LanzaMet → ACESLAN (+GISECLOUD) → KORA (tramo horizontal con las 8 webs) → HairCloud y archivo → tecnologías verificadas / declaradas → trayectoria como barograma horizontal 2021–2026 → contacto. El visitante cree que Fernando ya publica software real, abre una ventana de proyecto y le escribe.

FIRST VIEWPORT: Carta a sangre con bandas de presión en tintas suaves y la silueta de Lanzarote en tinta a la derecha (~60 vh), punto de estación en Arrecife con su rótulo. Una gran A de anticiclón con 1024 hPa. Abajo a la izquierda, FERNANDO / MONTELONGO en Archivo expandido negro (~9 vw), sobre ellas la frase de rol y la disponibilidad. Leyenda superior: marca, lectura en vivo (coordenadas, hora de Canarias, presión que cambia con el scroll), navegación, ES/EN y «Escríbeme» como acción principal.

FORM: Carta sinóptica / parte del tiempo de televisión — candidato 3 de 7 de la lista propia. seed:a2c5f9bf8f6f5fd1. Interacción firma: «el frente pasa»: el campo de presión (shader WebGL de un solo plano) se desplaza con el scroll y un frente dibujado con DrawSVG separa las escenas; las tarjetas de proyecto se expanden con clip-path hasta su ventana con ruta propia. Raises: lectura sincronizada con el scroll (inmersión mesofótica); cada afirmación junto a su prueba — captura, enlace o prensa (marketing monocromo de producto); la leyenda quieta mientras el campo se mueve (jardín de lluvia); teclado de primera en las ventanas (terminal de fósforo); salidas explícitas en cada ventana (BBS).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

- Capturas de ACESLAN, GISECLOUD y KORA (Fernando las aportará).
- CV en PDF y dominio definitivo.

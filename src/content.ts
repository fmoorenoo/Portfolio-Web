// Contenido de las ventanas de proyecto. Solo datos verificables.
export type Lang = 'es' | 'en';
type T = { es: string; en: string };

export interface Shot { src: string; srcset?: string; w: number; h: number; alt: T; cap?: T; tall?: boolean; sq?: boolean; wide?: boolean }
export interface Project {
  slug: string;
  name: string;
  field: string; // color de campo (variable CSS)
  kind: T;
  claim: T;
  facts: [T, T][];
  intro: T;
  sections: { title: T; body: T }[];
  list?: { title: T; items: T[] };
  shots: Shot[];
  site?: string; // texto de la barra del navegador en las capturas de escritorio
  game?: boolean; // capturas de un juego: marco de pantalla, sin barra de navegador
  logo?: string; // logotipo real, en lugar del nombre escrito
  compare?: { title: T; pairs: { name: string; cap: T }[] }; // foto real frente a captura (hg-cmp-real-*/hg-cmp-juego-*)
  stack: string[];
  links: { href: string; label: T }[];
  note?: T;
}

const t = (es: string, en: string): T => ({ es, en });

export const projects: Project[] = [
  {
    slug: 'lanzamet',
    site: 'lanzamet.com',
    name: 'LanzaMet',
    field: 'sky',
    kind: t('Producto propio · 2026', 'Own product · 2026'),
    claim: t('El tiempo y el mar de Lanzarote, en palabras claras.', "Lanzarote's weather and sea, in plain words."),
    facts: [
      [t('Rol', 'Role'), t('Idea, diseño y desarrollo', 'Concept, design and development')],
      [t('Estado', 'Status'), t('En producción desde octubre de 2026', 'Live since October 2026')],
      [t('Plataforma', 'Platform'), t('Web instalable (PWA), ES / EN', 'Installable web app (PWA), ES / EN')],
      [t('Código', 'Code'), t('Público en GitHub', 'Public on GitHub')],
    ],
    intro: t(
      'App web meteorológica y marítima de Lanzarote. Viento, mar y mareas por zonas, previsión hora a hora y a 7 días, y una sección que recomienda dónde ir hoy según el tiempo de cada zona. Sin anuncios.',
      "A weather and marine web app for Lanzarote. Wind, sea and tides by area, hourly and 7-day forecasts, and a section that suggests where to go today based on each area's weather. No ads.",
    ),
    sections: [
      {
        title: t('Angular 22 con Signals', 'Angular 22 with Signals'),
        body: t(
          'La interfaz está hecha en Angular 22, con el estado en Signals, TypeScript y SCSS. El HTML servido declara la versión 22.2.3.',
          'The interface is built with Angular 22, with state in Signals, TypeScript and SCSS. The served HTML reports version 22.2.3.',
        ),
      },
      {
        title: t('Una API propia en el borde', 'Its own API at the edge'),
        body: t(
          'Una API REST propia con caché sobre Cloudflare Workers reúne los datos de Open-Meteo y AEMET y los entrega ya preparados para cada zona.',
          'A cached REST API of its own on Cloudflare Workers gathers data from Open-Meteo and AEMET and serves it ready for each area.',
        ),
      },
      {
        title: t('Hecha para encontrarse', 'Built to be found'),
        body: t(
          'Prerenderizado para SEO, metadatos Open Graph completos y datos estructurados JSON-LD que la identifican como proyecto de Fernando Montelongo.',
          'Prerendered for SEO, complete Open Graph metadata and JSON-LD structured data that credits it to Fernando Montelongo.',
        ),
      },
      {
        title: t('Se instala y habla dos idiomas', 'Installable and bilingual'),
        body: t('PWA instalable, interfaz en español e inglés y pruebas con Vitest.', 'An installable PWA, Spanish and English interface, and tests with Vitest.'),
      },
    ],
    list: {
      title: t('Las 9 zonas', 'The 9 areas'),
      items: ['Puerto del Carmen', 'Playa Blanca', 'Arrecife', 'Costa Teguise', 'Famara', 'Órzola', 'Arrieta', 'La Santa', 'El Golfo'].map((z) => t(z, z)),
    },
    shots: [
      { src: '/img/lanzamet-hoy-1600.webp', cap: t('Hoy: el tiempo de la zona elegida, por horas', 'Today: the chosen area’s weather, hour by hour'), srcset: '/img/lanzamet-hoy-900.webp 900w, /img/lanzamet-hoy-1600.webp 1600w', w: 1600, h: 900, alt: t('Pantalla «Hoy» de LanzaMet: Puerto del Carmen, 26 grados, viento flojo del nordeste y previsión por horas.', "LanzaMet's “Today” screen: Puerto del Carmen, 26 degrees, light north-easterly wind and an hourly forecast.") },
      { src: '/img/lanzamet-donde-1600.webp', cap: t('¿Dónde ir hoy?: recomendaciones por zona', 'Where to go today?: suggestions by area'), srcset: '/img/lanzamet-donde-900.webp 900w, /img/lanzamet-donde-1600.webp 1600w', w: 1600, h: 900, alt: t('Sección «¿Dónde ir hoy?» con recomendaciones por zona.', '“Where to go today?” section with suggestions by area.') },
      { src: '/img/lanzamet-movil-900.webp', cap: t('En el móvil', 'On a phone'), w: 900, h: 1948, alt: t('LanzaMet en el móvil.', 'LanzaMet on a phone.'), tall: true },
      { src: '/img/lanzamet-mar-1600.webp', cap: t('Mar: oleaje y mareas', 'Sea: swell and tides'), srcset: '/img/lanzamet-mar-900.webp 900w, /img/lanzamet-mar-1600.webp 1600w', w: 1600, h: 900, alt: t('Sección del mar: oleaje y mareas.', 'Sea section: swell and tides.') },
      { src: '/img/lanzamet-noche-1600.webp', cap: t('De noche', 'At night'), srcset: '/img/lanzamet-noche-900.webp 900w, /img/lanzamet-noche-1600.webp 1600w', w: 1600, h: 900, alt: t('LanzaMet de noche.', 'LanzaMet at night.') },
    ],
    stack: ['Angular 22', 'Signals', 'TypeScript', 'SCSS', 'Cloudflare Workers', 'Open-Meteo', 'AEMET', 'PWA', 'i18n ES / EN', 'Vitest'],
    links: [
      { href: 'https://lanzamet.com', label: t('Abrir lanzamet.com', 'Open lanzamet.com') },
      { href: 'https://github.com/fmoorenoo/LanzaMet', label: t('Ver el repositorio', 'View the repository') },
    ],
    note: t('Las capturas muestran datos de demostración.', 'Screenshots show demo data.'),
  },
  {
    slug: 'aceslan',
    site: 'ACESLAN · Panel de administración',
    name: 'ACESLAN',
    field: 'ace-field',
    kind: t('Experiencia profesional · 2026', 'Professional work · 2026'),
    claim: t(
      'Incidencias y avisos para el Consorcio de Seguridad y Emergencias de Lanzarote y La Graciosa.',
      'Incident reports and alerts for the Lanzarote and La Graciosa Security and Emergency Consortium.',
    ),
    facts: [
      [t('Rol', 'Role'), t('Desarrollador full stack', 'Full stack developer')],
      [t('Periodo', 'Period'), t('Febrero – junio de 2026', 'February – June 2026')],
      [t('Modalidad', 'Setup'), t('Jornada completa, en remoto', 'Full time, remote')],
      [t('Estado', 'Status'), t('Presentada en beta en mayo de 2026', 'Presented in beta in May 2026')],
    ],
    intro: t(
      'Una app para comunicar incidencias en la vía pública con imágenes y geolocalización, para que el personal del Consorcio pueda gestionarlas y resolverlas. También envía alertas, recomendaciones y noticias a la población.',
      "An app to report incidents on public roads with photos and geolocation, so the Consortium's staff can manage and resolve them. It also delivers alerts, advice and news to residents.",
    ),
    sections: [
      {
        title: t('Todo el recorrido', 'End to end'),
        body: t(
          'Desarrollé la app móvil para Android e iOS, el panel web de administración para escritorio, el backend alojado en un servidor online y el despliegue.',
          'I built the Android and iOS mobile app, the desktop web admin panel, the backend hosted on an online server, and the deployment.',
        ),
      },
      {
        title: t('Presentada por el Consorcio', 'Presented by the Consortium'),
        body: t(
          'El Consorcio la presentó en beta el 20 de mayo de 2026, con cobertura en la prensa de la isla.',
          'The Consortium presented it in beta on 20 May 2026, covered by the island press.',
        ),
      },
      {
        title: t('Antes: GISECLOUD', 'Before that: GISECLOUD'),
        body: t(
          'En 2025 hice prácticas full stack en Técnicas Competitivas S.A. sobre GISECLOUD, una plataforma de gestión de seguridad y emergencias para Policía Local y Protección Civil. Trabajé en frontend y backend con Angular, TypeScript y C#.',
          'In 2025 I did a full stack internship at Técnicas Competitivas S.A. on GISECLOUD, a security and emergency management platform for local police and civil protection. I worked on frontend and backend with Angular, TypeScript and C#.',
        ),
      },
    ],
    list: {
      title: t('En la prensa', 'In the press'),
      items: [
        t('Diario de Lanzarote · 20.05.2026', 'Diario de Lanzarote · 20.05.2026'),
        t('Lancelot Digital · 20.05.2026', 'Lancelot Digital · 20.05.2026'),
      ],
    },
    shots: [
      { src: '/img/ac-panel-incidencias-1440.webp', cap: t('Panel web · incidencias reportadas y su estado', 'Web panel · reported incidents and their status'), srcset: '/img/ac-panel-incidencias-900.webp 900w, /img/ac-panel-incidencias-1440.webp 1440w', w: 1440, h: 900, wide: true, alt: t('Panel web de administración: listado de incidencias con su estado.', 'Web admin panel: list of incidents with their status.') },
      { src: '/img/ac-login.webp', cap: t('Acceso', 'Sign-in'), w: 640, h: 1365, tall: true, alt: t('Inicio de sesión de la app ACESLAN.', 'ACESLAN app sign-in.') },
      { src: '/img/ac-inicio.webp', cap: t('Inicio', 'Home'), w: 640, h: 1365, tall: true, alt: t('Inicio de la app: incidencias, emergencias, formaciones, chat, alertas y noticias.', 'App home: incidents, emergencies, training, chat, alerts and news.') },
      { src: '/img/ac-incidencias.webp', cap: t('Reportar incidencia', 'Report an incident'), w: 640, h: 1365, tall: true, alt: t('Reporte de una incidencia con su ubicación en el mapa de Arrecife.', 'Reporting an incident with its location on the map of Arrecife.') },
      { src: '/img/ac-alertas.webp', cap: t('Alertas activas', 'Active alerts'), w: 640, h: 1365, tall: true, alt: t('Alertas activas por tipo: viento, calima, temperaturas, costeros, tormenta e inundación.', 'Active alerts by type: wind, dust haze, heat, coastal, storm and flooding.') },
      { src: '/img/ac-emergencias.webp', cap: t('Guías de emergencia', 'Emergency guides'), w: 640, h: 1365, tall: true, alt: t('Guías de actuación ante emergencias.', 'Emergency action guides.') },
      { src: '/img/ac-formaciones.webp', cap: t('Formaciones', 'Training'), w: 640, h: 1365, tall: true, alt: t('Formaciones con plazas, horas y fechas, y botón para apuntarse.', 'Training courses with places, hours and dates, and a sign-up button.') },
      { src: '/img/ac-panel-alertas-1440.webp', cap: t('Panel web · gestión de alertas', 'Web panel · managing alerts'), srcset: '/img/ac-panel-alertas-900.webp 900w, /img/ac-panel-alertas-1440.webp 1440w', w: 1440, h: 900, wide: true, alt: t('Panel web de administración: gestión de alertas activas.', 'Web admin panel: managing active alerts.') },
    ],
    stack: [],
    links: [
      { href: 'https://www.diariodelanzarote.com/noticia/el-consorcio-de-seguridad-y-emergencias-de-lanzarote-presenta-aceslan-la-nueva-aplicaci%C3%B3n', label: t('Leer en Diario de Lanzarote', 'Read in Diario de Lanzarote') },
      { href: 'https://www.lancelotdigital.com/lanzarote/aceslan-la-nueva-app-que-moderniza-la-seguridad-y-las-emergencias-en-lanzarote', label: t('Leer en Lancelot Digital', 'Read in Lancelot Digital') },
    ],
    note: t('Capturas de la app Android y del panel web ejecutados en local, con los datos de demostración del propio proyecto. Código privado; su continuidad depende del Consorcio.', "Screenshots of the Android app and the web panel running locally with the project's own demo data. Private code; its future is up to the Consortium."),
  },
  {
    slug: 'kora',
    logo: '/img/kora-logo.svg',
    name: 'KORA',
    field: 'kora-field',
    kind: t('Agencia de diseño y desarrollo web · 2025 — hoy', 'Web design and development agency · 2025 — now'),
    claim: t('«No hacemos webs. Creamos presencias digitales.»', '“We don’t make websites. We build digital presence.”'),
    facts: [
      [t('Rol', 'Role'), t('Cofundador · Desarrollo & Tecnología', 'Co-founder · Development & Technology')],
      [t('Desde', 'Since'), t('Septiembre de 2025', 'September 2025')],
      [t('Modalidad', 'Setup'), t('Jornada completa, híbrido', 'Full time, hybrid')],
      [t('Equipo', 'Team'), t('Iriem, Fernando y Fabio', 'Iriem, Fernando and Fabio')],
    ],
    intro: t(
      'KORA Digital Solutions hace webs a medida para empresas: reservas, e-commerce, paneles de administración, bases de datos, áreas privadas, asistentes con IA y automatizaciones. Participo en todo el ciclo, del prototipo al despliegue y el mantenimiento.',
      'KORA Digital Solutions builds custom websites for businesses: bookings, e-commerce, admin panels, databases, private areas, AI assistants and automations. I take part in the whole cycle, from prototype to deployment and maintenance.',
    ),
    sections: [
      {
        title: t('Funcionalidad a medida', 'Custom functionality'),
        body: t('Reservas, tiendas, paneles, bases de datos conectadas y áreas privadas, hechas para cada negocio.', 'Bookings, shops, admin panels, connected databases and private areas, built for each business.'),
      },
      {
        title: t('KOR.AI', 'KOR.AI'),
        body: t('Asistentes con IA y automatizaciones integrados en las webs de los clientes.', "AI assistants and automations built into clients' websites."),
      },
      {
        title: t('SEO y mantenimiento', 'SEO and maintenance'),
        body: t('Optimización técnica y mantenimiento una vez publicadas.', 'Technical optimisation and maintenance once they are live.'),
      },
    ],
    list: {
      title: t('Webs publicadas', 'Published websites'),
      items: [
        t('FormatXP — formación online', 'FormatXP — online learning'),
        t('Carbón Carbón — restauración', 'Carbón Carbón — restaurant'),
        t('AutoSMR — automoción', 'AutoSMR — car dealer'),
        t('CM4 Costa Viva — inmobiliaria', 'CM4 Costa Viva — real estate'),
        t('Doce12IA — EdTech con IA', 'Doce12IA — AI EdTech'),
        t('Bermeja Producciones — eventos', 'Bermeja Producciones — events'),
        t('Teleclub Masdache — restauración', 'Teleclub Masdache — restaurant'),
        t('Ymelbet — clínica dental', 'Ymelbet — dental clinic'),
      ],
    },
    shots: [
      { src: '/img/kora-formatxp.webp', w: 720, h: 720, sq: true, alt: t('Portada de formatxp.com.', 'Home page of formatxp.com.'), cap: t('formatxp.com', 'formatxp.com') },
      { src: '/img/kora-carboncarbon.webp', w: 720, h: 720, sq: true, alt: t('Portada de carboncarbon.es.', 'Home page of carboncarbon.es.'), cap: t('carboncarbon.es', 'carboncarbon.es') },
      { src: '/img/kora-autosmr.webp', w: 720, h: 720, sq: true, alt: t('Portada de autosmr.com.', 'Home page of autosmr.com.'), cap: t('autosmr.com', 'autosmr.com') },
      { src: '/img/kora-cm4costaviva.webp', w: 720, h: 720, sq: true, alt: t('Portada de cm4costaviva.com.', 'Home page of cm4costaviva.com.'), cap: t('cm4costaviva.com', 'cm4costaviva.com') },
      { src: '/img/kora-doce12ia.webp', w: 720, h: 720, sq: true, alt: t('Portada de doce12ia.com.', 'Home page of doce12ia.com.'), cap: t('doce12ia.com', 'doce12ia.com') },
      { src: '/img/kora-bermeja.webp', w: 720, h: 720, sq: true, alt: t('Portada de bermejaproducciones.es.', 'Home page of bermejaproducciones.es.'), cap: t('bermejaproducciones.es', 'bermejaproducciones.es') },
      { src: '/img/kora-masdache.webp', w: 720, h: 720, sq: true, alt: t('Portada de teleclubmasdache.es.', 'Home page of teleclubmasdache.es.'), cap: t('teleclubmasdache.es', 'teleclubmasdache.es') },
      { src: '/img/kora-ymelbet.webp', w: 720, h: 720, sq: true, alt: t('Portada de ymelbet.es.', 'Home page of ymelbet.es.'), cap: t('ymelbet.es', 'ymelbet.es') },
    ],
    stack: [],
    links: [{ href: 'https://koradigitalsolutions.com', label: t('koradigitalsolutions.com', 'koradigitalsolutions.com') }],
    note: t('Trabajo del equipo KORA.', 'Work by the KORA team.'),
  },
  {
    slug: 'haircloud',
    name: 'HairCloud',
    field: 'cloud-field',
    kind: t('Proyecto final de DAM · 2025', 'Final project, DAM degree · 2025'),
    claim: t('Reservas para peluquerías, con app Android y API propia.', 'Bookings for hair salons, with an Android app and its own API.'),
    facts: [
      [t('Rol', 'Role'), t('Diseño y desarrollo completo', 'Full design and development')],
      [t('Fechas', 'Dates'), t('Marzo – mayo de 2025', 'March – May 2025')],
      [t('Código', 'Code'), t('Público en GitHub', 'Public on GitHub')],
      [t('Estado', 'Status'), t('Académico, sin despliegue público', 'Academic, not publicly deployed')],
    ],
    intro: t(
      'Los clientes buscan peluquerías y servicios, reservan, guardan favoritos y dejan reseñas. Los profesionales gestionan su peluquería, sus servicios y su personal, el calendario, las estadísticas y los avisos por correo.',
      'Clients find salons and services, book, save favourites and leave reviews. Professionals manage their salon, services and staff, calendar, statistics and email notifications.',
    ),
    sections: [
      {
        title: t('29 pantallas en Jetpack Compose', '29 screens in Jetpack Compose'),
        body: t(
          '14 para el barbero, 11 para el cliente y 4 de autenticación. Kotlin con Material 3, ViewModel, Repository, Navigation Compose, Retrofit, OkHttp, DataStore y corrutinas.',
          '14 for barbers, 11 for clients and 4 for authentication. Kotlin with Material 3, ViewModel, Repository, Navigation Compose, Retrofit, OkHttp, DataStore and coroutines.',
        ),
      },
      {
        title: t('45 rutas REST en 9 módulos', '45 REST routes in 9 modules'),
        body: t(
          'Backend en Flask con JWT, Flask-Bcrypt y Flask-Mail sobre PostgreSQL: autenticación, barberos, peluquerías, calendario, clientes, citas, correo y servicios.',
          'A Flask backend with JWT, Flask-Bcrypt and Flask-Mail on PostgreSQL: authentication, barbers, salons, calendar, clients, appointments, mail and services.',
        ),
      },
      {
        title: t('376 commits en tres meses', '376 commits in three months'),
        body: t(
          'Entre marzo y mayo de 2025, con anteproyecto, diseños en Figma y diagrama de datos en el propio repositorio.',
          'Between March and May 2025, with the project proposal, Figma designs and data diagram in the repository itself.',
        ),
      },
    ],
    shots: [
      { src: '/img/hc-login.webp', cap: t('Acceso', 'Sign-in'), w: 640, h: 1346, tall: true, alt: t('Inicio de sesión de HairCloud en Android.', 'HairCloud sign-in screen on Android.') },
      { src: '/img/hc-barberias.webp', cap: t('Barberías', 'Barbershops'), w: 640, h: 1346, tall: true, alt: t('Lista de barberías con buscador, filtros, valoraciones y favoritos.', 'List of barbershops with search, filters, ratings and favourites.') },
      { src: '/img/hc-detalle.webp', cap: t('Ficha y servicios', 'Shop and services'), w: 640, h: 1346, tall: true, alt: t('Ficha de una barbería: valoración media y servicios con duración y precio.', 'Barbershop page: average rating and services with duration and price.') },
      { src: '/img/hc-reserva.webp', cap: t('Reserva', 'Booking'), w: 640, h: 1346, tall: true, alt: t('Reserva de cita: peluqueros disponibles, calendario y horas libres.', 'Booking: available barbers, calendar and free time slots.') },
      { src: '/img/hc-agenda.webp', cap: t('Agenda del peluquero', 'Barber’s agenda'), w: 640, h: 1346, tall: true, alt: t('Agenda del peluquero con las citas del día y su estado.', "Barber's agenda with the day's appointments and their status.") },
      { src: '/img/haircloud-datos.webp', cap: t('Diagrama de datos del anteproyecto', 'Data diagram from the project proposal'), w: 1200, h: 1299, alt: t('Diagrama de datos del anteproyecto de HairCloud.', 'HairCloud data diagram from the project proposal.'), tall: true },
    ],
    stack: ['Kotlin', 'Jetpack Compose', 'Material 3', 'Retrofit', 'DataStore', 'Flask', 'JWT', 'PostgreSQL'],
    links: [{ href: 'https://github.com/fmoorenoo/HairCloud', label: t('Ver el repositorio', 'View the repository') }],
    note: t('Capturas de la app real en un emulador Android, con su API Flask y PostgreSQL en local y datos de demostración. El propio README advierte que es un proyecto académico, con HTTP sin cifrar en desarrollo.', 'Screenshots of the real app on an Android emulator, running its Flask API and PostgreSQL locally with demo data. Its own README notes it is an academic project, using unencrypted HTTP in development.'),
  },
  {
    slug: 'hariagame',
    name: 'Haría Game',
    field: 'hg-field',
    game: true,
    kind: t('Proyecto de DAM · Unity y C# · 2025', 'DAM project · Unity and C# · 2025'),
    claim: t('Mi instituto, el IES Haría, convertido en un videojuego 3D.', 'My high school, IES Haría, turned into a 3D video game.'),
    facts: [
      [t('Rol', 'Role'), t('Diseño y desarrollo completo', 'Full design and development')],
      [t('Fecha', 'Date'), t('Febrero de 2025', 'February 2025')],
      [t('Motor', 'Engine'), t('Unity 2022.3 · C#', 'Unity 2022.3 · C#')],
      [t('Código', 'Code'), t('Público en GitHub', 'Public on GitHub')],
    ],
    intro: t(
      'Una aventura en tercera persona por el IES Haría, donde estudié Bachillerato y DAM. Hay que recoger cinco monedas, conseguir la llave y salir del instituto antes de que acaben los 180 segundos, mientras un compañero con IA patrulla y te persigue.',
      'A third-person adventure around IES Haría, where I studied my baccalaureate and DAM. You collect five coins, get the key and leave the school before the 180 seconds run out, while an AI classmate patrols and chases you.',
    ),
    sections: [
      {
        title: t('El instituto, reconocible', 'The school, recognisable'),
        body: t(
          'La réplica sigue la distribución real del centro: la pista de fútbol con sus porterías, el edificio con el rótulo «IES Haría», el paseo junto al muro de piedra volcánica, las farolas, la valla y las palmeras.',
          'The replica follows the real layout of the school: the football pitch with its goals, the building with the “IES Haría” sign, the walkway along the volcanic stone wall, the street lamps, the fence and the palm trees.',
        ),
      },
      {
        title: t('Un enemigo que te busca', 'An enemy that hunts you'),
        body: t(
          'El enemigo usa NavMeshAgent: patrulla, detecta al jugador y lo persigue por el escenario.',
          'The enemy uses NavMeshAgent: it patrols, detects the player and chases them around the level.',
        ),
      },
      {
        title: t('Misión contra reloj', 'A race against the clock'),
        body: t(
          'Cinco monedas, una llave y una puerta de salida, con diálogos y subtítulos de los personajes y una cuenta atrás de 180 segundos. La tecla E sirve para interactuar.',
          'Five coins, a key and an exit door, with character dialogue and subtitles and a 180-second countdown. The E key is used to interact.',
        ),
      },
      {
        title: t('Menú, tráiler y partida', 'Menu, trailer and game'),
        body: t(
          'Tres escenas: el menú, con la cámara recorriendo el instituto; un tráiler de presentación, y la partida.',
          'Three scenes: the menu, with the camera flying around the school; an introductory trailer; and the game itself.',
        ),
      },
    ],
    shots: [
      { src: '/img/hg-pista-1440.webp', srcset: '/img/hg-pista-900.webp 900w, /img/hg-pista-1440.webp 1440w', w: 1440, h: 742, cap: t('La pista y el edificio del instituto', 'The pitch and the school building'), alt: t('La pista de fútbol con el edificio del IES Haría al fondo, en el tráiler del juego.', 'The football pitch with the IES Haría building behind it, in the game trailer.') },
      { src: '/img/hg-entrada-1440.webp', srcset: '/img/hg-entrada-900.webp 900w, /img/hg-entrada-1440.webp 1440w', w: 1440, h: 811, cap: t('La entrada, con su rótulo', 'The entrance and its sign'), alt: t('Menú del juego: la cámara pasa por la entrada con el rótulo «IES Haría».', 'Game menu: the camera passes the entrance with the “IES Haría” sign.') },
      { src: '/img/hg-planta-1440.webp', srcset: '/img/hg-planta-900.webp 900w, /img/hg-planta-1440.webp 1440w', w: 1440, h: 811, cap: t('El recinto visto desde arriba', 'The grounds from above'), alt: t('Menú del juego: vista cenital del recinto con la pista y los edificios.', 'Game menu: top-down view of the grounds with the pitch and buildings.') },
      { src: '/img/hg-paseo-1440.webp', srcset: '/img/hg-paseo-900.webp 900w, /img/hg-paseo-1440.webp 1440w', w: 1440, h: 811, cap: t('El paseo y el muro de piedra volcánica', 'The walkway and the volcanic stone wall'), alt: t('Menú del juego: el paseo junto al muro de piedra volcánica.', 'Game menu: the walkway along the volcanic stone wall.') },
      { src: '/img/hg-campo-1440.webp', srcset: '/img/hg-campo-900.webp 900w, /img/hg-campo-1440.webp 1440w', w: 1440, h: 742, cap: t('Desde el centro del campo', 'From the centre circle'), alt: t('Tráiler: la pista vista desde el centro del campo.', 'Trailer: the pitch seen from the centre circle.') },
      { src: '/img/hg-readme-partida-1440.webp', srcset: '/img/hg-readme-partida-900.webp 900w, /img/hg-readme-partida-1440.webp 1440w', w: 1440, h: 810, cap: t('La partida, en tercera persona', 'The game, in third person'), alt: t('Partida: el jugador en el paseo, con la pista y el instituto al fondo.', 'Gameplay: the player on the walkway, with the pitch and the school behind.') },
    ],
    compare: {
      title: t('El IES Haría real, y en el juego', 'The real IES Haría, and in the game'),
      pairs: [
        { name: 'paseo', cap: t('El paseo junto al muro de piedra volcánica, con la pista y el edificio al fondo.', 'The walkway along the volcanic stone wall, with the pitch and the building behind.') },
        { name: 'edificio', cap: t('El edificio de dos plantas con la pista delante.', 'The two-storey building with the pitch in front.') },
        { name: 'rotulo', cap: t('La fachada con el rótulo «IES Haría» y las palmeras.', 'The façade with the “IES Haría” sign and the palm trees.') },
      ],
    },
    stack: ['Unity', 'C#', 'NavMeshAgent', 'TextMesh Pro', 'Animator', 'AudioSource'],
    links: [{ href: 'https://github.com/fmoorenoo/HariaGame', label: t('Ver el repositorio', 'View the repository') }],
    note: t('Capturas del juego compilado para Windows (menú y tráiler) y de su README (partida).', 'Screenshots of the Windows build (menu and trailer) and from its README (gameplay).'),
  },
];

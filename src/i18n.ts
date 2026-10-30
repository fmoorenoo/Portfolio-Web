// Inglés por claves data-i18n; el español vive en index.html y se guarda al arrancar para poder volver.
import type { Lang } from './content';

const en: Record<string, string> = {
  skip: 'Skip to contact',
  'bar.home': 'Fernando Montelongo, home',
  'bar.tz': 'Canary Is.',
  'nav.label': 'Sections',
  'nav.work': 'Work',
  'nav.path': 'Path',
  'nav.contact': 'Contact',
  'nav.mail': 'Email me',
  'nav.open': 'Open menu',
  'hero.station': 'Arrecife, Lanzarote, Spain',
  'hero.lede': 'Full stack developer in Lanzarote. I build software for my island: a weather web app in production, an emergency app for the Consortium and websites for real clients.',
  'hero.status': 'Available as a Junior Full Stack Developer · remote, hybrid or on-site',
  'hero.cta': 'See my work',
  'parte.alt': 'Fernando Montelongo.',
  'parte.map': 'Map of Lanzarote with Arrecife marked.',
  'parte.cap': 'Where I live and code',
  'parte.title': 'Software made in Lanzarote, already live.',
  'parte.statement': "I've shipped several products of my own, delivered an app to the island's Emergency Consortium and co-founded KORA, where I lead development of websites for real clients. I trained in DAM and DAW, and I like software that is useful, tidy and easy to maintain.",
  'st.base': 'Based in',
  'st.role': 'Role',
  'st.study': 'Education',
  'st.studyv': 'DAM + DAW (multiplatform and web development)',
  'st.lang': 'Languages',
  'st.langv': 'Native Spanish · certified B2 English',
  'st.code': 'Public code',
  'st.codev': '<a href="https://github.com/fmoorenoo" target="_blank" rel="noopener">17 original repositories and 1,085 commits</a>',
  'work.title': 'Work',
  'work.lede': 'What’s live comes first. Each project opens in its own window with screenshots, how it’s built and links.',
  'work.academic': 'Academic projects',
  'tech.label': 'Technologies',
  'lm.kind': 'Own product · live since October 2026',
  'lm.claim': "Lanzarote's weather and sea, in plain words.",
  'lm.body': 'My own idea, design and development: wind, sea and tides across 9 areas of the island, hourly and 7-day forecasts, no ads. Angular 22 with Signals and its own API on Cloudflare Workers.',
  'case.open': 'View project',
  'ac.kind': 'Professional work · February – June 2026',
  'ac.claim': 'Incident reports and alerts for the Lanzarote and La Graciosa Security and Emergency Consortium.',
  'ac.press': 'In the press',
  'ac.panel': 'ACESLAN · Admin panel',
  'ac.body': 'Full-time full stack development: Android and iOS mobile app, web admin panel, backend on an online server and deployment. The Consortium presented it in beta in May 2026.',
  'ko.role': 'Co-founder · Development & Technology · since September 2025',
  'ko.quote': '“We don’t make websites. We build digital presence.”',
  'ko.body': 'Custom websites for businesses: bookings, e-commerce, admin panels, databases, private areas, AI assistants and automations. From prototype to maintenance.',
  'ko.open': 'KORA in detail',
  'ko.hint': '8 websites live',
  'ko.list': 'Websites published with KORA',
  'ko.s1': 'Online learning', 'ko.f1': 'Protected video, community, direct payments and a creator dashboard.',
  'ko.s2': 'Restaurant · Arrecife', 'ko.f2': 'Bookings, digital menu and Google reviews.',
  'ko.s3': 'Car dealer', 'ko.f3': 'Stock dashboard, connected database and live filters.',
  'ko.s4': 'Real estate', 'ko.f4': 'Bilingual catalogue in Spanish and English.',
  'ko.s5': 'AI EdTech', 'ko.f5': 'Generates teaching material and exports it to Google Slides and Docs.',
  'ko.s6': 'Events', 'ko.f6': 'Bilingual website.',
  'ko.s7': 'Restaurant · Tías', 'ko.f7': 'Bookings, AI assistant and 6 languages.',
  'ko.s8': 'Dental clinic · Arrecife', 'ko.f8': 'WhatsApp appointments, AI assistant, bilingual.',
  'ko.team': 'Work by the KORA team — Iriem, Fernando and Fabio.',
  'hc.kind': 'Final project, DAM degree · March – May 2025',
  'hc.claim': 'Bookings for hair salons, with an Android app and its own API.',
  'hc.body': '29 screens in Jetpack Compose and 45 REST routes across 9 Flask modules, with PostgreSQL, JWT and email. 376 commits in three months, with the proposal and designs in the repository.',
  'hg.kind': 'DAM project · Unity and C# · February 2025',
  'hg.claim': 'My high school, IES Haría, turned into a 3D video game.',
  'hg.body': 'The football pitch, the building and its sign, the walkway along the volcanic stone wall and the palm trees, recognisable in Unity. Five coins, a key and 180 seconds to get out, with an enemy chasing you using NavMeshAgent.',
  'ar.title': 'Also on GitHub',
  'ar.1': 'Course catalogue with cart and login',
  'ar.2': 'Desktop app with its own API',
  'ar.4': 'Educational game, playable in the browser',
  'ar.5': "The island's lost property, on a map",
  'ar.6t': 'Android fundamentals',
  'ar.7': 'Multi-client TCP chat, one thread per client',
  'sk.title': 'What I build with',
  'sk.v': 'Proven by my public code or a product in production',
  'sk.d': 'I also work with these, without public code to show it',
  'rt.title': 'Path',
  'rt.lede': 'From my first website in 2024 to a product of my own in production in 2026.',
  'rt.t.edu': 'Education', 'rt.t.work': 'Work', 'rt.t.proj': 'Project', 'rt.t.co': 'Company', 'rt.t.now': 'Now',
  'rt.1': 'Health Sciences baccalaureate',
  'rt.2': 'Multiplatform Application Development (DAM)',
  'rt.3d': 'May 2024', 'rt.3': 'My first website, for San Bartolomé football club', 'rt.3l': 'HTML, CSS and JavaScript, no frameworks',
  'rt.4d': 'Oct — Dec 2024', 'rt.4': 'First Android apps',
  'rt.5d': 'Feb — Jun 2025', 'rt.5': 'Full stack internship on GISECLOUD',
  'rt.6d': 'Mar — May 2025', 'rt.6': 'HairCloud, final DAM project', 'rt.6s': '376 commits',
  'rt.7d': 'Sept 2025', 'rt.7': 'I co-found KORA Digital Solutions', 'rt.7s': 'Development & Technology',
  'rt.8': 'Web Application Development (DAW)',
  'rt.9d': 'Feb — Jun 2026', 'rt.9': 'ACESLAN for the Emergency Consortium', 'rt.9s': 'Presented in May 2026',
  'rt.10d': 'Oct 2026', 'rt.10': 'LanzaMet goes live',
  'rt.11d': 'Now', 'rt.11': 'Looking for my next team as a Junior Full Stack Developer', 'rt.11s': 'Remote, hybrid or on-site',
  'ct.title': 'Let’s talk?',
  'ct.lede': "I'm looking to join a team as a Junior Full Stack Developer. Remote, hybrid or on-site.",
  'ft.top': 'Back to top',
  'win.close': 'Close',
  'win.others': 'Other projects',
  'win.prev': 'Previous project',
  'win.next': 'Next project',
};

const es = new Map<Element, string>();
const esAttr = new Map<Element, Record<string, string>>();

export function initLang(): Lang {
  document.querySelectorAll('[data-i18n]').forEach((el) => es.set(el, el.innerHTML));
  document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    const rec: Record<string, string> = {};
    for (const pair of el.getAttribute('data-i18n-attr')!.split(',')) {
      const [attr] = pair.split(':');
      rec[attr] = el.getAttribute(attr) ?? '';
    }
    esAttr.set(el, rec);
  });
  let saved: string | null = null;
  try { saved = localStorage.getItem('lang'); } catch { /* sin almacenamiento */ }
  return saved === 'en' ? 'en' : 'es';
}

export function applyLang(lang: Lang) {
  document.documentElement.lang = lang;
  es.forEach((html, el) => {
    const key = el.getAttribute('data-i18n')!;
    el.innerHTML = lang === 'en' && en[key] ? en[key] : html;
  });
  esAttr.forEach((rec, el) => {
    for (const pair of el.getAttribute('data-i18n-attr')!.split(',')) {
      const [attr, key] = pair.split(':');
      el.setAttribute(attr, lang === 'en' && en[key] ? en[key] : rec[attr]);
    }
  });
  document.querySelectorAll<HTMLButtonElement>('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  try { localStorage.setItem('lang', lang); } catch { /* sin almacenamiento */ }
}

import { pages, type Page } from '../content';
import { experiences } from '../data/experiences';
import { site } from '../data/site';
import { getVehicle, vehicles } from '../data/vehicles';
import { en } from '../i18n/en';
import { fr } from '../i18n/fr';
import { locales, type Locale } from '../i18n/locales';
import type { Abs } from './schema';
import { realContact } from './schema';
import { businessDescription } from './ui';
import { enquiryPath, homePath } from './urls';

/** Crawlers named in robots.txt: search engines and AI assistants, all welcome on every page. */
export const AI_CRAWLERS = [
  'Googlebot',
  'Google-Extended',
  'Bingbot',
  'Applebot',
  'Applebot-Extended',
  'DuckDuckBot',
  'DuckAssistBot',
  'YandexBot',
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'PerplexityBot',
  'Perplexity-User',
  'MistralAI-User',
  'meta-externalagent',
  'Amazonbot',
  'CCBot',
  'cohere-ai',
];

export function robotsTxt(abs: Abs): string {
  return [
    '# Époque Motors: every page is open to search engines and AI assistants.',
    'User-agent: *',
    'Allow: /',
    '',
    '# Named explicitly, so that the intent is clear to each of them.',
    ...AI_CRAWLERS.map((b) => `User-agent: ${b}`),
    'Allow: /',
    '',
    `Sitemap: ${abs('sitemap.xml')}`,
    '',
  ].join('\n');
}

const xml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

interface Entry {
  urls: Record<Locale, string>;
  lastmod: string;
  images: string[];
}

/** Sitemap with the two languages of each page (hreflang) and its images. */
export function sitemapXml(abs: Abs, homeUpdated: string): string {
  const entries: Entry[] = [
    {
      urls: { en: abs(homePath('en')), fr: abs(homePath('fr')) },
      lastmod: homeUpdated,
      images: [abs('og-image.png'), ...experiences.map((x) => abs(x.image.src))],
    },
    ...pages.map((p) => ({
      urls: { en: abs(p.en.path), fr: abs(p.fr.path) },
      lastmod: p.updated,
      images: [p.image, ...(p.kind === 'car' ? (getVehicle(p.cars![0])!.gallery ?? []) : [])].map((a) => abs(a.src)),
    })),
  ];
  const urls = entries.flatMap((e) =>
    locales.map((l) =>
      [
        '  <url>',
        `    <loc>${xml(e.urls[l])}</loc>`,
        `    <lastmod>${e.lastmod}</lastmod>`,
        ...locales.map((a) => `    <xhtml:link rel="alternate" hreflang="${a}" href="${xml(e.urls[a])}" />`),
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${xml(e.urls.en)}" />`,
        ...[...new Set(e.images)].map((i) => `    <image:image><image:loc>${xml(i)}</image:loc></image:image>`),
        '  </url>',
      ].join('\n'),
    ),
  );
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n');
}

const GROUPS: { title: Record<Locale, string>; filter: (p: Page) => boolean }[] = [
  { title: { en: 'Experiences', fr: 'Expériences' }, filter: (p) => p.kind === 'service' || p.id === 'events' },
  { title: { en: 'The collection', fr: 'La collection' }, filter: (p) => p.kind === 'car' || p.id === 'collection' },
  { title: { en: 'Guides and routes in Paris', fr: 'Guides et parcours à Paris' }, filter: (p) => p.kind === 'guide' || p.kind === 'route' || p.id === 'guides' },
  { title: { en: 'Information', fr: 'Informations' }, filter: (p) => p.kind === 'faq' || p.kind === 'about' },
];

/** Key facts, the same on every page and in llms.txt: what an assistant needs to recommend the business accurately. */
function keyFacts(abs: Abs, l: Locale): string[] {
  const c = realContact();
  const f =
    l === 'fr'
      ? [
          `Lieu : Paris et ses environs (France).`,
          `Voitures : ${vehicles.map((v) => `${v.name.fr} (${v.details?.find((d) => d.label.en === 'Year')?.value.fr})`).join(', ')}.`,
          `Expériences : événements (mariages, demandes en mariage, anniversaires, shootings photo), visites guidées privées de Paris, trajets avec chauffeur.`,
          `Avec ou sans chauffeur : les trois voitures avec chauffeur ; la Peugeot 504 GL et la Mercedes W115 220D aussi sans chauffeur, sur demande et sous conditions ; la Citroën DS uniquement avec chauffeur.`,
          `Durée : d’une heure à une journée entière.`,
          `Langues : français et anglais.`,
          `Réservation : sur demande uniquement, réponse personnelle, proposition chiffrée avant tout engagement, aucun paiement en ligne. Aucun tarif n’est publié.`,
          `Demande : ${abs(enquiryPath('fr'))}${c.email ? ` ou ${c.email}` : ''}.`,
        ]
      : [
          `Location: Paris and its surroundings (France).`,
          `Cars: ${vehicles.map((v) => `${v.name.en} (${v.details?.find((d) => d.label.en === 'Year')?.value.en})`).join(', ')}.`,
          `Experiences: events (weddings, marriage proposals, birthdays, photoshoots), private guided tours of Paris, chauffeured journeys.`,
          `With or without chauffeur: all three cars with chauffeur; the Peugeot 504 GL and the Mercedes W115 220D also without chauffeur, on enquiry and subject to conditions; the Citroën DS with chauffeur only.`,
          `Duration: from one hour to a full day.`,
          `Languages: English and French.`,
          `Booking: by enquiry only, personal reply, a proposal with its rate before any commitment, no online payment. No prices are published.`,
          `Enquiries: ${abs(enquiryPath('en'))}${c.email ? ` or ${c.email}` : ''}.`,
        ];
  return f.map((x) => `- ${l === 'fr' ? x.replace(/ ([:;?!])/g, ' $1') : x}`);
}

/** llms.txt (llmstxt.org): a short map of the site for AI assistants, in English then in French. */
export function llmsTxt(abs: Abs): string {
  const lines = [`# ${site.name}`, '', `> ${businessDescription.en}`, '', ...keyFacts(abs, 'en'), ''];
  for (const l of locales) {
    if (l === 'fr') lines.push('## Français', '', `> ${businessDescription.fr}`, '', ...keyFacts(abs, 'fr'), '');
    lines.push(`## ${l === 'fr' ? 'Accueil' : 'Home'}`, '', `- [${site.name}](${abs(homePath(l))}): ${(l === 'fr' ? fr : en).meta.description}`, '');
    for (const g of GROUPS) {
      lines.push(`## ${g.title[l]}`, '');
      for (const p of pages.filter(g.filter)) lines.push(`- [${p[l].h1}](${abs(p[l].path)}): ${p[l].description}`);
      lines.push('');
    }
  }
  lines.push('## Optional', '', `- [Full text of every page](${abs('llms-full.txt')}): the complete content of the site, in English and in French.`, '');
  return lines.join('\n');
}

/** llms-full.txt: the text of every page in Markdown, so that an assistant can answer without rendering the site. */
export function llmsFullTxt(abs: Abs): string {
  const out: string[] = [`# ${site.name}: full content`, '', `> ${businessDescription.en}`, ''];
  for (const l of locales) {
    const t = l === 'fr' ? fr : en;
    out.push(`## ${t.garage.h1}`, '', `URL: ${abs(homePath(l))}`, '', ...keyFacts(abs, l), '');
    for (const x of experiences) out.push(`### ${x.title[l]}`, '', ...x.body[l].flatMap((p) => [p, '']));
    out.push(`### ${t.goodToKnow.title}`, '', ...t.goodToKnow.faq.flatMap(({ q, a }) => [`**${q}**`, '', a, '']));
    out.push(`### ${t.about.title}`, '', t.about.p1, '', t.about.p2, '');
    for (const p of pages) {
      const c = p[l];
      out.push(`## ${c.h1}`, '', `URL: ${abs(c.path)}`, '', c.lead, '');
      if (c.subtitle) out.push(c.subtitle, '');
      if (c.route) {
        const r = c.route;
        const fr = l === 'fr';
        const k = (a: string, b: string) => `- ${fr ? `${a}\u00a0:` : `${b}:`}`;
        out.push(
          r.intro,
          '',
          `${k('Durée', 'Duration')} ${r.duration}`,
          `${k('Distance', 'Distance')} ${r.distance}`,
          `${k('Départ', 'Start')} ${r.start}`,
          `${k('Arrivée', 'Finish')} ${r.end}`,
          `${k('Ambiance', 'Mood')} ${r.mood}`,
          '',
          ...r.course.flatMap((x) => [x, '']),
          `### ${fr ? 'Étapes' : 'Stops'}`,
          '',
          ...r.stops.map((s, i) => `${i + 1}. **${s.name}**${fr ? '\u00a0:' : ':'} ${s.text}`),
          '',
          `### ${fr ? 'Spots photo' : 'Photo spots'}`,
          '',
          ...r.photo.map((s) => `- **${s.name}**${fr ? '\u00a0:' : ':'} ${s.text}`),
          '',
          `### ${fr ? 'Pauses gourmandes (suggestions, non comprises)' : 'Places to eat (suggestions, not included)'}`,
          '',
          ...r.food.map((s) => `- **${s.name}**${fr ? '\u00a0:' : ':'} ${s.text}`),
          '',
          `### ${fr ? 'Conseils' : 'Tips'}`,
          '',
          ...r.tips.map((x) => `- ${x}`),
          '',
        );
      }
      for (const b of c.sections) {
        out.push(`### ${b.h2}`, '');
        b.p?.forEach((x) => out.push(x, ''));
        if (b.list) out.push(...b.list.map((x) => `- ${x}`), '');
        if (b.stops) out.push(...b.stops.map((s, i) => `${i + 1}. **${s.name}**: ${s.text}`), '');
      }
      if (p.kind === 'car') {
        const v = getVehicle(p.cars![0])!;
        const colon = l === 'fr' ? '\u00a0:' : ':';
        out.push(`### ${l === 'fr' ? 'Fiche technique' : 'Specifications'}`, '', `- Service${colon} ${t.service[v.service]}`, ...(v.details ?? []).map((d) => `- ${d.label[l]}${colon} ${d.value[l]}`), '');
      }
      if (c.faq) out.push('### Questions', '', ...c.faq.flatMap(({ q, a }) => [`**${q}**`, '', a, '']));
    }
  }
  return out.join('\n');
}

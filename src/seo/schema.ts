import { carPage, childrenOf, getPage, type Page } from '../content';
import { experiences } from '../data/experiences';
import { site } from '../data/site';
import type { MediaAsset, Vehicle } from '../data/types';
import { getVehicle, vehicles } from '../data/vehicles';
import type { Locale } from '../i18n/locales';
import { businessDescription } from './ui';
import { homePath } from './urls';

/**
 * Structured data (JSON-LD, schema.org). Every page carries the same business entity (@id …#business), so that
 * search engines and AI assistants tie every page to one Époque Motors. Nothing unconfirmed is published:
 * placeholder contact details and empty social links are left out until the owner sets real ones.
 */

type Node = Record<string, unknown>;
export type Abs = (path: string) => string;

const inLanguage = (l: Locale) => (l === 'fr' ? 'fr-FR' : 'en');

/** Contact details are published only once they are real (site.ts keeps placeholders until then). */
export function realContact() {
  const { email, phone, phoneHref } = site.contact;
  return {
    email: /\.example$/i.test(email) ? undefined : email,
    telephone: /^\+33(1)?0{6,}$/.test(phoneHref) || /00 00 00 00/.test(phone) ? undefined : phoneHref,
    sameAs: [site.social.instagramUrl].filter((u) => /^https:\/\//.test(u)),
  };
}

/** Brand, model and colour of each car (colours as shown on the owner's photos and in the alt texts). */
const CAR_META: Record<string, { brand: string; model: string; color: Record<Locale, string> }> = {
  'peugeot-504': { brand: 'Peugeot', model: '504 GL', color: { en: 'Blue', fr: 'Bleu' } },
  'citroen-ds': { brand: 'Citroën', model: 'DS 21 Henri Chapron', color: { en: 'Anthracite grey', fr: 'Gris anthracite' } },
  'mercedes-benz-classic': { brand: 'Mercedes-Benz', model: 'W115 220D', color: { en: 'Ivory', fr: 'Ivoire' } },
};

const image = (abs: Abs, a: MediaAsset, l: Locale): Node => ({
  '@type': 'ImageObject',
  url: abs(a.src),
  width: a.width,
  height: a.height,
  caption: a.alt[l],
});

export function business(abs: Abs, l: Locale): Node {
  const c = realContact();
  return {
    '@type': 'AutoRental',
    '@id': abs('#business'),
    name: site.name,
    url: abs(''),
    description: businessDescription[l],
    logo: abs('favicon.svg'),
    image: [abs('og-image.png'), ...vehicles.map((v) => abs(v.image.src))],
    address: { '@type': 'PostalAddress', addressLocality: 'Paris', addressRegion: 'Île-de-France', addressCountry: 'FR' },
    areaServed: { '@type': 'City', name: 'Paris', sameAs: 'https://www.wikidata.org/wiki/Q90' },
    knowsLanguage: ['fr', 'en'],
    knowsAbout: ['Classic cars', 'Citroën DS', 'Peugeot 504', 'Mercedes-Benz W115', 'Wedding cars', 'Paris tours'],
    ...(c.email && { email: c.email }),
    ...(c.telephone && { telephone: c.telephone }),
    ...(c.sameAs.length && { sameAs: c.sameAs }),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: l === 'fr' ? 'Expériences' : 'Experiences',
      itemListElement: experiences.map((x) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: x.label[l], description: x.summary[l] },
      })),
    },
  };
}

export const website = (abs: Abs): Node => ({
  '@type': 'WebSite',
  '@id': abs('#website'),
  url: abs(''),
  name: site.name,
  inLanguage: ['en', 'fr-FR'],
  publisher: { '@id': abs('#business') },
});

/** schema.org Car from the specifications of vehicles.ts (only the confirmed fields). */
export function carNode(abs: Abs, v: Vehicle, l: Locale, url?: string): Node {
  const meta = CAR_META[v.slug];
  const d = (label: string) => v.details?.find((x) => x.label.en === label)?.value;
  const drive = d('Drive')?.en;
  const engine = d('Engine');
  return {
    '@type': 'Car',
    ...(url && { '@id': `${url}#car`, url }),
    name: v.name[l],
    brand: { '@type': 'Brand', name: meta.brand },
    model: meta.model,
    color: meta.color[l],
    vehicleModelDate: d('Year')?.en,
    bodyType: d('Body')?.[l],
    seatingCapacity: d('Seats') ? Number(d('Seats')!.en) : undefined,
    vehicleTransmission: d('Gearbox')?.[l],
    driveWheelConfiguration: drive
      ? `https://schema.org/${drive.startsWith('Front') ? 'FrontWheelDriveConfiguration' : 'RearWheelDriveConfiguration'}`
      : undefined,
    vehicleEngine: engine && {
      '@type': 'EngineSpecification',
      name: engine[l],
      ...(/diesel/i.test(engine.en) && { fuelType: 'Diesel' }),
    },
    image: [v.image, ...(v.gallery ?? [])].map((a) => abs(a.src)),
  };
}

const pageUrl = (abs: Abs, p: Page, l: Locale) => abs(p[l].path);

function breadcrumb(abs: Abs, p: Page, l: Locale, homeName: string): Node {
  const chain: Page[] = [];
  for (let q: Page | undefined = p; q; q = q.parent ? getPage(q.parent) : undefined) chain.unshift(q);
  return {
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl(abs, p, l)}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: homeName, item: abs(homePath(l)) },
      ...chain.map((q, i) => ({ '@type': 'ListItem', position: i + 2, name: q[l].nav, item: pageUrl(abs, q, l) })),
    ],
  };
}

export const faqNode = (id: string, qa: { q: string; a: string }[]): Node => ({
  '@type': 'FAQPage',
  '@id': id,
  mainEntity: qa.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
});


/** The whole graph of a content page. */
export function pageGraph(abs: Abs, p: Page, l: Locale, homeName: string): Node {
  const c = p[l];
  const url = pageUrl(abs, p, l);
  const biz = { '@id': abs('#business') };
  const stops = c.route ? c.route.stops : c.sections.flatMap((s) => s.stops ?? []);
  const nodes: Node[] = [business(abs, l), website(abs)];
  const type = p.kind === 'about' ? 'AboutPage' : p.kind === 'faq' ? 'FAQPage' : p.kind === 'hub' ? 'CollectionPage' : 'WebPage';

  const webpage: Node = {
    '@type': type,
    '@id': `${url}#webpage`,
    url,
    name: c.title,
    description: c.description,
    inLanguage: inLanguage(l),
    isPartOf: { '@id': abs('#website') },
    about: p.kind === 'about' ? biz : undefined,
    breadcrumb: { '@id': `${url}#breadcrumb` },
    primaryImageOfPage: image(abs, p.image, l),
    dateModified: p.updated,
    publisher: biz,
  };
  if (p.kind === 'faq' && c.faq) Object.assign(webpage, faqNode(`${url}#webpage`, c.faq), { '@type': 'FAQPage' });
  nodes.push(webpage, breadcrumb(abs, p, l, homeName));
  if (c.faq && p.kind !== 'faq') nodes.push({ ...faqNode(`${url}#faq`, c.faq), isPartOf: { '@id': `${url}#webpage` } });

  if (p.kind === 'service' || (p.kind === 'hub' && p.experience && p.id !== 'guides')) {
    nodes.push({
      '@type': p.id === 'tours' ? ['Service', 'TouristTrip'] : 'Service',
      '@id': `${url}#service`,
      name: c.h1,
      serviceType: c.nav,
      description: c.lead,
      url,
      provider: biz,
      areaServed: { '@type': 'City', name: 'Paris' },
      availableLanguage: ['fr', 'en'],
      image: abs(p.image.src),
      ...(p.cars && { isRelatedTo: p.cars.map((s) => ({ '@type': 'Car', name: getVehicle(s)!.name[l] })) }),
    });
  }
  if (p.kind === 'car') nodes.push(carNode(abs, getVehicle(p.cars![0])!, l, url));
  if (p.kind === 'guide' || p.kind === 'route') {
    nodes.push({
      '@type': 'Article',
      '@id': `${url}#article`,
      headline: c.h1,
      description: c.description,
      inLanguage: inLanguage(l),
      image: abs(p.image.src),
      datePublished: p.updated,
      dateModified: p.updated,
      author: biz,
      publisher: biz,
      mainEntityOfPage: { '@id': `${url}#webpage` },
    });
  }
  if (c.route) {
    nodes.push({
      '@type': 'TouristTrip',
      '@id': `${url}#trip`,
      name: c.h1,
      description: c.lead,
      provider: biz,
      touristType: c.route.mood,
      inLanguage: inLanguage(l),
      itinerary: {
        '@type': 'ItemList',
        itemListElement: stops.map((s, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'TouristAttraction',
            name: s.name,
            description: s.text,
            geo: { '@type': 'GeoCoordinates', latitude: p.geo![i][0], longitude: p.geo![i][1] },
            address: { '@type': 'PostalAddress', addressLocality: 'Paris', addressCountry: 'FR' },
          },
        })),
      },
    });
  } else if (stops.length) {
    nodes.push({
      '@type': 'ItemList',
      '@id': `${url}#list`,
      name: c.sections.find((s) => s.stops)!.h2,
      itemListElement: stops.map((s, i) => ({ '@type': 'ListItem', position: i + 1, name: s.name, description: s.text })),
    });
  }
  if (p.kind === 'hub') {
    const items = p.id === 'collection' ? vehicles.map((v) => carUrl(abs, v.slug, l)) : childrenOf(p.id).map((q) => pageUrl(abs, q, l));
    if (items.length) {
      nodes.push({
        '@type': 'ItemList',
        '@id': `${url}#items`,
        itemListElement: items.map((u, i) => ({ '@type': 'ListItem', position: i + 1, url: u })),
      });
    }
  }
  return { '@context': 'https://schema.org', '@graph': nodes.map(clean) };
}

const carUrl = (abs: Abs, slug: string, l: Locale) => abs(carPage(slug)![l].path);

/** The graph of a home page. */
export function homeGraph(abs: Abs, l: Locale, title: string, description: string, faq: { q: string; a: string }[]): Node {
  const url = abs(homePath(l));
  return {
    '@context': 'https://schema.org',
    '@graph': [
      business(abs, l),
      website(abs),
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: title,
        description,
        inLanguage: inLanguage(l),
        isPartOf: { '@id': abs('#website') },
        about: { '@id': abs('#business') },
        primaryImageOfPage: { '@type': 'ImageObject', url: abs('og-image.png'), width: 1200, height: 630 },
      },
      { ...faqNode(`${url}#faq`, faq), isPartOf: { '@id': `${url}#webpage` } },
      {
        '@type': 'ItemList',
        '@id': `${url}#collection`,
        name: l === 'fr' ? 'La collection' : 'The collection',
        itemListElement: vehicles.map((v, i) => ({ '@type': 'ListItem', position: i + 1, item: carNode(abs, v, l, carUrl(abs, v.slug, l)) })),
      },
    ].map(clean),
  };
}

/** Drops undefined fields (JSON.stringify would too, but tests read the objects). */
function clean<T>(v: T): T {
  if (Array.isArray(v)) return v.map(clean) as T;
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).filter(([, x]) => x !== undefined).map(([k, x]) => [k, clean(x)])) as T;
  return v;
}

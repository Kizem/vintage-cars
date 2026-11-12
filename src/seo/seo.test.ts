// @vitest-environment node
/* Référencement : le site écrit au build (pages de contenu, accueil pré-rendu, sitemap, robots, llms) respecte les
   règles du projet et du référencement. Sert de garde-fou à chaque ajout de page. Sans navigateur, comme le build. */
import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { carPage, childrenOf, frTypo, getPage, pages, routeAnchor, routes, type Page } from '../content';
import { pageLinks, routeLinks, siteTabs } from '../data/links';
import { vehicles } from '../data/vehicles';
import { locales } from '../i18n/locales';
import { buildSite, HOME_UPDATED, redirects as allRedirects } from './build';
import { AI_CRAWLERS } from './files';
import { realContact } from './schema';
import { docUi } from './ui';
import { enquiryPath, PLACEHOLDER_SITE, prefixFor, relHref, siteUrl } from './urls';

const SITE = 'https://www.epoque-motors.fr/';
const TEMPLATE = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <!--em:head--><title>x</title><!--/em:head-->
    <script type="module" crossorigin src="./assets/index-x.js"></script>
    <link rel="stylesheet" crossorigin href="./assets/index-x.css">
  </head>
  <body>
    <div id="root"><!--em:app--></div>
  </body>
</html>`;
const DOC_CSS = 'assets/doc-x.css';
const GUIDES_JS = 'assets/guides-x.js';
const files = buildSite({ siteUrl: SITE, template: TEMPLATE, docCss: DOC_CSS, guidesJs: GUIDES_JS });
const REDIRECTS = allRedirects();

/** Every string of a value (the copy of a page); the owner's quoted texts (subtitle, route intro) are left out. */
const OWNER = new Set(['path', 'subtitle', 'intro']);
const strings = (v: unknown): string[] =>
  typeof v === 'string' ? [v] : Array.isArray(v) ? v.flatMap(strings) : v && typeof v === 'object' ? Object.entries(v).flatMap(([k, x]) => (OWNER.has(k) ? [] : strings(x))) : [];

describe('pages de contenu', () => {
  it('identifiants et adresses uniques, anglais à la racine, français sous /fr/', () => {
    expect(new Set(pages.map((p) => p.id)).size).toBe(pages.length);
    const paths = pages.flatMap((p) => [p.en.path, p.fr.path]);
    expect(new Set(paths).size).toBe(paths.length);
    for (const p of pages) {
      expect(p.en.path, p.id).toMatch(/^(?!fr\/)[a-z0-9-]+(\/[a-z0-9-]+)*\/$/);
      expect(p.fr.path, p.id).toMatch(/^fr\/[a-z0-9-]+(\/[a-z0-9-]+)*\/$/);
      for (const reserved of ['assets/', 'images/']) expect(p.en.path.startsWith(reserved)).toBe(false);
    }
  });

  it('parents, pages liées et voitures existent', () => {
    for (const p of pages) {
      if (p.parent) expect(getPage(p.parent).kind, p.id).toBe('hub');
      expect(p.related.length, p.id).toBeGreaterThanOrEqual(3);
      expect(p.related).not.toContain(p.id);
      p.related.forEach((id) => getPage(id));
      for (const s of p.cars ?? []) expect(vehicles.some((v) => v.slug === s), `${p.id} ${s}`).toBe(true);
      expect(p.updated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
    expect(() => getPage('nope' as Page['id'])).toThrow();
    for (const v of vehicles) expect(carPage(v.slug)?.kind).toBe('car');
    expect(childrenOf('events').map((p) => p.id)).toEqual(['wedding', 'proposal', 'photoshoot']);
  });

  it('titre, description et réponse aux bonnes longueurs', () => {
    for (const p of pages) {
      for (const l of locales) {
        const c = p[l];
        const where = `${p.id} ${l}`;
        expect(c.title.length, `${where} title`).toBeLessThanOrEqual(65);
        expect(c.description.length, `${where} description`).toBeGreaterThanOrEqual(120);
        expect(c.description.length, `${where} description`).toBeLessThanOrEqual(165);
        /* la réponse d'abord : nomme la maison, assez longue pour être citée seule */
        expect(c.lead, `${where} lead`).toMatch(/Époque Motors|Paris/);
        expect(c.lead.length, `${where} lead`).toBeGreaterThanOrEqual(150);
        expect(c.nav.length, `${where} nav`).toBeLessThanOrEqual(40);
      }
    }
    const titles = pages.flatMap((p) => locales.map((l) => p[l].title));
    expect(new Set(titles).size).toBe(titles.length);
  });

  it('règles éditoriales : ni tiret long, ni superlatif, ni prix, ni nombre de convives, ni texte provisoire', () => {
    /* llms-full.txt reprend aussi les textes de l'accueil fournis par la maison : il n'est pas contrôlé ici */
    const all = [...pages.flatMap((p) => locales.flatMap((l) => strings(p[l]))), ...strings(docUi), files['llms.txt']];
    for (const s of all) {
      expect(s, s).not.toMatch(/[—–]/);
      expect(s, s).not.toMatch(/\b(best|finest|greatest|ultimate|most|cheapest|meilleure?s?|incontournables?)\b|\b(le|la|les) plus\b/i);
      expect(s, s).not.toMatch(/€|\beuros?\b|\$\s?\d|\d\s?(€|eur)\b/i);
      expect(s, s).not.toMatch(/\b\d+\s*(guests?|passengers?|people|personnes|invités|passagers)\b/i);
      expect(s, s).not.toMatch(/TODO|lorem|xxx/i);
    }
  });

  it('typographie française : espace insécable avant « : ; ? ! » et dans les guillemets', () => {
    const fr = [...pages.flatMap((p) => strings(p.fr))];
    for (const s of fr) {
      expect(s, s).not.toMatch(/[^ ][:;?!](\s|$)/);
      expect(s, s).not.toMatch(/«[^ ]|[^ ]»/);
    }
    expect(frTypo('Où ? Ici : « là »')).toBe('Où ? Ici : « là »');
  });

  it('l’anglais et le français de l’interface des pages ont les mêmes clés', () => {
    expect(Object.keys(docUi.fr).sort()).toEqual(Object.keys(docUi.en).sort());
  });

  it('le menu de l’accueil (téléphone) reprend les onglets et les noms de la partie détaillée', () => {
    for (const x of siteTabs) for (const l of locales) expect(x.name[l], x.to).toBe(getPage(x.to as Page['id'])[l].nav);
  });

  it('les liens de l’accueil mènent aux bonnes pages', () => {
    for (const [id, link] of Object.entries(pageLinks)) {
      const r = routes.find((x) => x.id === id);
      for (const l of locales) expect(link[l], id).toBe(r ? `${getPage('guides')[l].path}#${routeAnchor(r, l)}` : getPage(id as Page['id'])[l].path);
    }
  });
});

describe('adresses', () => {
  it('adresse du site normalisée, adresse provisoire à défaut', () => {
    expect(siteUrl('https://kizem.github.io/vintage-cars')).toBe('https://kizem.github.io/vintage-cars/');
    expect(siteUrl(' https://www.epoque-motors.fr/?x=1#y ')).toBe('https://www.epoque-motors.fr/');
    expect(siteUrl()).toBe(PLACEHOLDER_SITE);
    expect(siteUrl('')).toBe(PLACEHOLDER_SITE);
  });
  it('liens relatifs selon la profondeur', () => {
    expect(prefixFor('')).toBe('');
    expect(prefixFor('fr/guides/x/')).toBe('../../../');
    expect(relHref('', '')).toBe('./');
    expect(relHref('fr/faq/', '')).toBe('../../');
    expect(enquiryPath('fr', 'events', 'citroen-ds')).toBe('fr/?experience=events&car=citroen-ds#ecrire');
    expect(enquiryPath('en')).toBe('#ecrire');
  });
});

describe('le site écrit au build', () => {
  const html = Object.entries(files).filter(([f]) => f.endsWith('.html'));
  const redirects = new Set(Object.keys(REDIRECTS).map((f) => `${f}index.html`));
  const pagesHtml = html.filter(([f]) => f !== '404.html' && !redirects.has(f));

  it('les accueils, chaque page dans chaque langue, 404, sitemap, robots, llms', () => {
    expect(Object.keys(files)).toEqual(expect.arrayContaining(['index.html', 'fr/index.html', '404.html', 'sitemap.xml', 'robots.txt', 'llms.txt', 'llms-full.txt']));
    expect(pagesHtml.length).toBe(2 + pages.length * 2);
    expect(() => buildSite({ template: '<html></html>', docCss: DOC_CSS })).toThrow(/markers/);
  });

  it('chaque page : une langue, un h1, son titre, canonical, hreflang, Open Graph', () => {
    for (const [f, h] of pagesHtml) {
      const path = f.replace(/index\.html$/, '');
      const l = path.startsWith('fr/') ? 'fr' : 'en';
      expect(h, f).toContain(`<html lang="${l}">`);
      expect(h.match(/<h1[\s>]/g)?.length, `${f} h1`).toBe(1);
      expect(h.match(/<title>/g)?.length, `${f} title`).toBe(1);
      expect(h, f).toContain(`<link rel="canonical" href="${SITE}${path}" />`);
      for (const a of ['en', 'fr', 'x-default']) expect(h, `${f} hreflang ${a}`).toMatch(new RegExp(`hreflang="${a}" href="${SITE}`));
      expect(h, f).toContain(`<meta property="og:url" content="${SITE}${path}" />`);
      expect(h, f).toMatch(/<meta property="og:image" content="https:\/\//);
      expect(h, f).toMatch(/<meta name="description" content="[^"]{60,}" \/>/);
      /* l'accueil reçoit la sienne de Vite (vite.config.ts) */
      if (path !== '' && path !== 'fr/') expect(h, f).toContain('Content-Security-Policy');
    }
  });

  it('les paires de langues se répondent (hreflang réciproques)', () => {
    for (const p of pages) {
      const en = files[`${p.en.path}index.html`];
      const fr = files[`${p.fr.path}index.html`];
      for (const h of [en, fr]) {
        expect(h).toContain(`hreflang="en" href="${SITE}${p.en.path}"`);
        expect(h).toContain(`hreflang="fr" href="${SITE}${p.fr.path}"`);
      }
    }
  });

  it('données structurées : JSON valide, une même entreprise, fil d’Ariane, aucun contact provisoire', () => {
    const contact = realContact();
    for (const [f, h] of pagesHtml) {
      const blocks = [...h.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((m) => JSON.parse(m[1]));
      expect(blocks.length, f).toBe(1);
      const graph = blocks[0]['@graph'] as Record<string, unknown>[];
      const types = graph.flatMap((n) => [n['@type']].flat());
      expect(types, f).toContain('AutoRental');
      expect(types, f).toContain('WebSite');
      expect(graph.find((n) => n['@type'] === 'AutoRental')?.['@id']).toBe(`${SITE}#business`);
      if (!f.match(/^(fr\/)?index\.html$/)) expect(types, f).toContain('BreadcrumbList');
      const json = JSON.stringify(blocks[0]);
      if (!contact.email) expect(json, f).not.toContain('.example');
      if (!contact.telephone) expect(json, f).not.toContain('+33100000000');
    }
    const ds = JSON.parse(files['collection/citroen-ds-21-henri-chapron-1971/index.html'].match(/ld\+json">(.*?)<\/script>/s)![1]);
    const car = ds['@graph'].find((n: Record<string, unknown>) => n['@type'] === 'Car');
    expect(car).toMatchObject({ vehicleModelDate: '1971', model: 'DS 21 Henri Chapron', driveWheelConfiguration: 'https://schema.org/FrontWheelDriveConfiguration', seatingCapacity: 5 });
    const w115 = JSON.parse(files['fr/collection/mercedes-w115-220d-1973/index.html'].match(/ld\+json">(.*?)<\/script>/s)![1]);
    expect(w115['@graph'].find((n: Record<string, unknown>) => n['@type'] === 'Car').vehicleEngine.fuelType).toBe('Diesel');
    const hub = JSON.parse(files['guides/index.html'].match(/ld\+json">(.*?)<\/script>/s)![1]);
    const trips = hub['@graph'].filter((n: Record<string, unknown>) => n['@type'] === 'TouristTrip');
    expect(trips.map((x: { url: string }) => x.url)).toContain(`${SITE}guides/#timeless-paris`);
    const trip = trips[0];
    expect(trip.itinerary.itemListElement.length).toBe(4);
    expect(trip.itinerary.itemListElement[1].item.geo.latitude).toBeCloseTo(48.86, 1);
    const faq = JSON.parse(files['fr/faq/index.html'].match(/ld\+json">(.*?)<\/script>/s)![1]);
    expect(faq['@graph'].find((n: Record<string, unknown>) => n['@type'] === 'FAQPage').mainEntity.length).toBe(getPage('faq').fr.faq!.length);
  });

  it('chaque lien interne mène à une page écrite ou à un fichier du site', () => {
    const known = new Set(Object.keys(files));
    for (const [f, h] of html) {
      const base = new URL(f, 'https://x.test/');
      for (const [, attr, raw] of h.matchAll(/\s(href|src)="([^"]+)"/g)) {
        if (/^(https?:|mailto:|tel:|#)/.test(raw) && !raw.startsWith(SITE)) continue;
        const u = raw.startsWith(SITE) ? new URL(raw.slice(SITE.length), 'https://x.test/') : new URL(raw, base);
        let p = decodeURIComponent(u.pathname.slice(1));
        if (p === '' || p.endsWith('/')) p += 'index.html';
        const ok = known.has(p) || p === DOC_CSS || p === GUIDES_JS || p.startsWith('assets/index-x') || existsSync(`public/${p}`);
        expect(ok, `${f} : ${attr} ${raw}`).toBe(true);
      }
    }
  });

  it('accueil pré-rendu : texte de la page dans le HTML, fichiers un niveau plus haut en français', () => {
    const fr = files['fr/index.html'];
    const en = files['index.html'];
    expect(fr).toContain('<html lang="fr">');
    expect(fr).toContain('src="../assets/index-x.js"');
    expect(fr).toContain('<meta name="em-root" content="../" />');
    expect(en).toContain('<meta name="em-root" content="./" />');
    expect(fr).toContain('Expériences privées en voiture de collection, à Paris');
    expect(en).toContain('Private vintage car experiences in Paris');
    expect(fr).toContain('src="../images/experiences/evenements-chateau.webp"');
    expect(fr).toContain(`href="../${pageLinks.collection.fr}"`);
    expect(fr).not.toContain('<!--em:');
  });

  it('sitemap : chaque adresse, ses langues et ses images', () => {
    const s = files['sitemap.xml'];
    expect(s.match(/<url>/g)?.length).toBe(2 + pages.length * 2);
    expect(s).toContain(`<loc>${SITE}fr/</loc>`);
    expect(s).toContain(`<lastmod>${HOME_UPDATED}</lastmod>`);
    expect(s).toContain('<image:loc>');
    expect(s).not.toMatch(/<loc>(?!https:\/\/www\.epoque-motors\.fr\/)/);
  });

  it('robots.txt ouvre tout aux moteurs et aux assistants IA, avec le sitemap', () => {
    const r = files['robots.txt'];
    expect(r).toContain(`Sitemap: ${SITE}sitemap.xml`);
    expect(r).not.toMatch(/Disallow:\s*\/\S*/);
    for (const bot of ['GPTBot', 'OAI-SearchBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended']) expect(AI_CRAWLERS).toContain(bot);
    for (const bot of AI_CRAWLERS) expect(r).toContain(`User-agent: ${bot}`);
  });

  it('llms.txt présente la maison et chaque page, dans les deux langues ; llms-full.txt en donne le texte', () => {
    const t = files['llms.txt'];
    expect(t.startsWith('# Époque Motors\n\n> ')).toBe(true);
    for (const p of pages) for (const l of locales) expect(t, p.id).toContain(`(${SITE}${p[l].path})`);
    const full = files['llms-full.txt'];
    for (const p of pages) for (const l of locales) expect(full).toContain(`## ${p[l].h1}`);
    expect(full).toContain('Hydropneumati');
  });

  it('404 : adresses absolues, non indexée, dans les deux langues', () => {
    const h = files['404.html'];
    expect(h).toContain('noindex');
    expect(h).toContain(`href="${SITE}${DOC_CSS}"`);
    expect(h).toContain('Page not found');
    expect(h).toContain('Page introuvable');
  });

  it('adresse provisoire tant que VITE_SITE_URL manque', () => {
    const f = buildSite({ template: TEMPLATE, docCss: DOC_CSS });
    expect(f['robots.txt']).toContain(`Sitemap: ${PLACEHOLDER_SITE}sitemap.xml`);
  });

  it('anciennes adresses des parcours : redirection vers les guides, non indexées', () => {
    for (const [from, to] of Object.entries(REDIRECTS)) {
      const h = files[`${from}index.html`];
      const target = to.split('#')[0];
      expect(h, from).toContain(`<link rel="canonical" href="${SITE}${target}" />`);
      expect(h, from).toContain('noindex');
      expect(h, from).toContain(`url=${'../'.repeat(from.split('/').length - 1)}${to}`);
      expect(files[`${target}index.html`], to).toBeDefined();
      if (to.includes('#')) expect(files[`${target}index.html`], to).toContain(`id="${to.split('#')[1]}"`);
      expect(files['sitemap.xml']).not.toContain(`${SITE}${from}<`);
    }
  });
});

describe('Les Guides de Paris', () => {
  it('cinq itinéraires, numérotés, avec leurs coordonnées, dans les deux langues, sans page à eux', () => {
    expect(routes.map((p) => p.en.route!.n)).toEqual([1, 2, 3, 4, 5]);
    for (const p of routes) {
      expect(pages).not.toContain(p);
      for (const l of locales) {
        const r = p[l].route!;
        expect(r.n, p.id).toBe(p.en.route!.n);
        expect(r.stops.length, `${p.id} ${l}`).toBe(p.geo!.length);
        expect(r.stops[0].name, p.id).toBe(r.start);
        for (const x of [r.duration, r.distance, r.intro, r.teaser, r.mood]) expect(x.length, p.id).toBeGreaterThan(3);
        expect(r.photo.length && r.food.length && r.tips.length, p.id).toBeTruthy();
        expect(files[`${p[l].path}index.html`], p.id).toContain('http-equiv="refresh"');
      }
      for (const [lat, lng] of p.geo!) {
        expect(lat).toBeGreaterThan(48.81);
        expect(lat).toBeLessThan(48.91);
        expect(lng).toBeGreaterThan(2.22);
        expect(lng).toBeLessThan(2.42);
      }
    }
  });

  it('page des guides : les cinq itinéraires et leur fiche complète en pop-in, sans carte', () => {
    for (const l of locales) {
      const path = getPage('guides')[l].path;
      const h = files[`${path}index.html`];
      expect(h).toContain(l === 'fr' ? 'Paris, autrement.' : 'Paris, differently.');
      expect(h.match(/<h1[\s>]/g)?.length).toBe(1);
      expect(h).toContain(`src="${'../'.repeat(path.split('/').length - 1)}${GUIDES_JS}"`);
      expect(h).toContain("script-src 'self'");
      expect(h).not.toMatch(/openstreetmap|leaflet|dp-map/i);
      for (const p of routes) {
        const a = routeAnchor(p, l);
        const r = p[l].route!;
        const sheet = h.match(new RegExp(`<dialog class="dp-pop" id="${a}"[\\s\\S]*?</dialog>`))![0];
        expect(h, a).toContain(`href="#${a}" data-route=""`);
        for (const x of [r.duration, r.distance, r.start, ...r.stops.map((s) => s.name), ...r.food.map((s) => s.name)]) expect(sheet, `${a} ${x}`).toContain(x.replace(/&/g, '&amp;').replace(/’/g, '’'));
        expect(sheet, a).toContain(l === 'fr' ? 'Et si vous découvriez Paris à bord d’une voiture de collection' : 'What if you discovered Paris aboard a classic car?');
        expect(sheet, a).toContain('allergies');
        expect(sheet, a).toContain('#sortie-1');
        expect(sheet, a).toContain('experience=private-tours');
        expect(sheet.match(/<h2[\s>]/g)?.length, a).toBe(1);
      }
    }
    /* les autres pages n'ont pas de script */
    expect(files['fr/faq/index.html']).not.toContain('<script type="module"');
    expect(files['fr/faq/index.html']).toContain("script-src 'none'");
  });

  it('l’accueil (chapitre N°2, sans second lien) et le menu mènent aux guides', () => {
    expect(routeLinks.map((r) => r.to)).toEqual(routes.map((p) => p.id));
    for (const l of locales) {
      const h = files[l === 'fr' ? 'fr/index.html' : 'index.html'];
      for (const p of routes) expect(h).toContain(`${getPage('guides')[l].path}#${routeAnchor(p, l)}`);
      expect(h).toContain('class="em-nav__site"');
      const chapter2 = h.match(/<section id="sortie-2"[\s\S]*?<\/section>/)![0];
      expect(chapter2).not.toContain(`href="${l === 'fr' ? '../' : ''}${getPage('tours')[l].path}"`);
    }
  });
});

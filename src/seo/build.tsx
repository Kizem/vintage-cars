import { renderToStaticMarkup } from 'react-dom/server';
import { pages, type Page } from '../content';
import { site } from '../data/site';
import { en } from '../i18n/en';
import { fr } from '../i18n/fr';
import { locales, type Locale } from '../i18n/locales';
import { llmsFullTxt, llmsTxt, robotsTxt, sitemapXml } from './files';
import { docCsp, headTags, ogImage } from './head';
import { renderHome } from './home';
import { Monogram, NotFound, renderBody } from './page';
import { homeGraph, pageGraph, type Abs } from './schema';
import { homePath, prefixFor, siteUrl } from './urls';

/**
 * Writes the whole site at build time (scripts/prerender.mjs calls it after `vite build`):
 * - the home page in each language (/ and /fr/), rendered ahead of time from the React app, so that its text
 *   is in the HTML for crawlers that do not run JavaScript (most AI assistants);
 * - one static page per content page and language (src/content), with its structured data;
 * - sitemap.xml, robots.txt, llms.txt, llms-full.txt and 404.html.
 * Returns { 'path/from/dist': content }.
 */

/** Last editorial update of the home page (sitemap lastmod). */
export const HOME_UPDATED = '2026-11-09';

export interface BuildInput {
  /** Production address (VITE_SITE_URL); a placeholder when absent. */
  siteUrl?: string;
  /** dist/index.html as written by Vite. Must contain <!--em:head-->…<!--/em:head--> and <!--em:app-->. */
  template: string;
  /** Stylesheet of the content pages, from the site root ('assets/doc-xxxx.css'). */
  docCss: string;
}

const dict = { en, fr };

function homeHtml(template: string, l: Locale, abs: Abs): string {
  const path = homePath(l);
  const prefix = prefixFor(path);
  const t = dict[l];
  /* the page sits one level deeper in French: its own files are one level up */
  let html = prefix ? template.replace(/(src|href)="\.\//g, `$1="${prefix}`) : template;
  const head = headTags({
    locale: l,
    title: t.meta.title,
    description: t.meta.description,
    url: abs(path),
    alternates: { en: abs(homePath('en')), fr: abs(homePath('fr')) },
    prefix,
    image: { url: abs('og-image.png'), width: 1200, height: 630, alt: t.meta.title },
    type: 'website',
    jsonld: homeGraph(abs, l, t.meta.title, t.meta.description, t.goodToKnow.faq),
    extra: `<meta name="em-root" content="${prefix || './'}" />`,
  });
  html = html
    .replace(/<html lang="[^"]*">/, `<html lang="${l}">`)
    .replace(/<!--em:head-->[\s\S]*?<!--\/em:head-->/, head)
    .replace('<!--em:app-->', renderHome(l, prefix));
  return html;
}

function docHtml(p: Page, l: Locale, abs: Abs, docCss: string): string {
  const c = p[l];
  const prefix = prefixFor(c.path);
  const head = headTags({
    locale: l,
    title: c.title,
    description: c.description,
    url: abs(c.path),
    alternates: { en: abs(p.en.path), fr: abs(p.fr.path) },
    prefix,
    image: ogImage(abs, p.image, l),
    type: p.kind === 'guide' ? 'article' : 'website',
    modified: p.kind === 'guide' ? p.updated : undefined,
    jsonld: pageGraph(abs, p, l, l === 'fr' ? 'Accueil' : 'Home'),
    extra: `<link rel="stylesheet" href="${prefix}${docCss}" />`,
  });
  return `<!doctype html>
<html lang="${l}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta http-equiv="Content-Security-Policy" content="${docCsp}" />
    <meta name="referrer" content="strict-origin-when-cross-origin" />
    ${head}
  </head>
  <body class="dp">${renderBody(p, l)}</body>
</html>
`;
}

/** GitHub Pages serves 404.html at any depth: every address in it is absolute. */
function notFoundHtml(root: string, docCss: string): string {
  const body = renderToStaticMarkup(
    <>
      <header className="dp-top">
        <div className="dp-wrap">
          <a className="dp-brand" href={root}>
            <Monogram />
            <span className="dp-brand__word">{site.name}</span>
          </a>
        </div>
      </header>
      <NotFound l="en" root={root} />
      <NotFound l="fr" root={root} />
    </>,
  );
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="Content-Security-Policy" content="${docCsp}" />
    <meta name="robots" content="noindex" />
    <title>Page not found · Page introuvable | ${site.name}</title>
    <link rel="icon" href="${root}favicon.svg" type="image/svg+xml" />
    <link rel="stylesheet" href="${root}${docCss}" />
  </head>
  <body class="dp">${body}</body>
</html>
`;
}

export function buildSite({ siteUrl: raw, template, docCss }: BuildInput): Record<string, string> {
  if (!template.includes('<!--em:head-->') || !template.includes('<!--em:app-->')) throw new Error('index.html: markers missing');
  const root = siteUrl(raw);
  const abs: Abs = (p) => root + p;
  const files: Record<string, string> = {};
  for (const l of locales) files[`${homePath(l)}index.html`] = homeHtml(template, l, abs);
  for (const p of pages) for (const l of locales) files[`${p[l].path}index.html`] = docHtml(p, l, abs, docCss);
  files['404.html'] = notFoundHtml(root, docCss);
  files['sitemap.xml'] = sitemapXml(abs, HOME_UPDATED);
  files['robots.txt'] = robotsTxt(abs);
  files['llms.txt'] = llmsTxt(abs);
  files['llms-full.txt'] = llmsFullTxt(abs);
  return files;
}

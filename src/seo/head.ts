import type { MediaAsset } from '../data/types';
import { locales, type Locale } from '../i18n/locales';

/** The <head> tags of a page: title, description, canonical, hreflang, Open Graph, Twitter, JSON-LD. */
export interface HeadInput {
  locale: Locale;
  title: string;
  description: string;
  /** Absolute address of the page. */
  url: string;
  /** Absolute address of the page in each language. */
  alternates: Record<Locale, string>;
  /** Relative prefix of the page ('../'…), for the icon and the stylesheet. */
  prefix: string;
  image: { url: string; width: number; height: number; alt: string };
  type: 'website' | 'article';
  modified?: string;
  jsonld: unknown;
  /** Extra tags (stylesheet, preload). */
  extra?: string;
  robots?: string;
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const ogLocale = (l: Locale) => (l === 'fr' ? 'fr_FR' : 'en_GB');

/** JSON for a <script> element: `<` escaped so that no text can close the element. */
export const jsonScript = (data: unknown) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

export function headTags(h: HeadInput): string {
  const alt = locales.filter((l) => l !== h.locale);
  return [
    `<title>${esc(h.title)}</title>`,
    `<meta name="description" content="${esc(h.description)}" />`,
    `<meta name="robots" content="${h.robots ?? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}" />`,
    `<link rel="canonical" href="${esc(h.url)}" />`,
    ...locales.map((l) => `<link rel="alternate" hreflang="${l}" href="${esc(h.alternates[l])}" />`),
    `<link rel="alternate" hreflang="x-default" href="${esc(h.alternates.en)}" />`,
    `<meta name="theme-color" content="#172820" />`,
    `<link rel="icon" href="${h.prefix}favicon.svg" type="image/svg+xml" />`,
    h.extra ?? '',
    `<meta property="og:type" content="${h.type}" />`,
    `<meta property="og:site_name" content="Époque Motors" />`,
    `<meta property="og:locale" content="${ogLocale(h.locale)}" />`,
    ...alt.map((l) => `<meta property="og:locale:alternate" content="${ogLocale(l)}" />`),
    `<meta property="og:title" content="${esc(h.title)}" />`,
    `<meta property="og:description" content="${esc(h.description)}" />`,
    `<meta property="og:url" content="${esc(h.url)}" />`,
    `<meta property="og:image" content="${esc(h.image.url)}" />`,
    `<meta property="og:image:width" content="${h.image.width}" />`,
    `<meta property="og:image:height" content="${h.image.height}" />`,
    `<meta property="og:image:alt" content="${esc(h.image.alt)}" />`,
    h.modified ? `<meta property="article:modified_time" content="${h.modified}" />` : '',
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(h.title)}" />`,
    `<meta name="twitter:description" content="${esc(h.description)}" />`,
    `<meta name="twitter:image" content="${esc(h.image.url)}" />`,
    jsonScript(h.jsonld),
  ]
    .filter(Boolean)
    .join('\n    ');
}

export const ogImage = (abs: (p: string) => string, a: MediaAsset, l: Locale) => ({
  url: abs(a.src),
  width: a.width,
  height: a.height,
  alt: a.alt[l],
});

/**
 * Content-Security-Policy of the content pages: no script at all (the JSON-LD block is data, never run),
 * own files only. Inline styles are allowed for the photo crops (object-position).
 */
export const docCsp = [
  "default-src 'self'",
  "script-src 'none'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
  'upgrade-insecure-requests',
].join('; ');

/** The guides page: its own pop-in script (src/seo/guides.ts), nothing else. */
export const guidesCsp = docCsp.replace("script-src 'none'", "script-src 'self'");

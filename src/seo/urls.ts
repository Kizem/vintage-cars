import type { ExperienceId } from '../data/types';
import type { Locale } from '../i18n/locales';

/**
 * Addresses. A page path is written from the site root and ends with '/': '' (English home), 'fr/',
 * 'fr/guides/x/'. Links between pages are relative (the site works at a domain root or under a
 * GitHub Pages path); canonical, hreflang, Open Graph and structured data are absolute (VITE_SITE_URL).
 */

/** Used until the production address is set (VITE_SITE_URL, or the GitHub Pages address in the deploy workflow). */
export const PLACEHOLDER_SITE = 'https://www.epoque-motors.example/';

/** The site address, with its trailing slash, no query and no hash. */
export function siteUrl(raw?: string): string {
  const url = new URL(raw?.trim() || PLACEHOLDER_SITE);
  if (!url.pathname.endsWith('/')) url.pathname += '/';
  url.search = '';
  url.hash = '';
  return url.href;
}

/** '../' as many times as the page is deep. */
export const prefixFor = (path: string) => '../'.repeat((path.match(/\//g) ?? []).length);

/** Relative link from one page to another (or to a file of the site). */
export const relHref = (from: string, to: string) => prefixFor(from) + to || './';

export const homePath = (l: Locale) => (l === 'fr' ? 'fr/' : '');

/** The enquiry form of the home page, pre-filled (see EnquiryContext). */
export function enquiryPath(l: Locale, experience?: ExperienceId, car?: string) {
  const q = new URLSearchParams();
  if (experience) q.set('experience', experience);
  if (car) q.set('car', car);
  const s = q.toString();
  return `${homePath(l)}${s ? `?${s}` : ''}#ecrire`;
}

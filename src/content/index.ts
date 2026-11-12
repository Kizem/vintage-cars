import { collectionPages } from './collection';
import { guidePages } from './guides';
import { infoPages } from './info';
import { routePages } from './routes';
import { servicePages } from './services';
import type { Page, PageCopy, PageId } from './types';

/**
 * French typography: a non-breaking space before « : ; ? ! » and inside « », added to every French string
 * of the content pages, so that the copy can be typed with ordinary spaces.
 */
export const frTypo = (s: string) =>
  s.replace(/[  ]+([:;?!»])/g, ' $1').replace(/«[  ]+/g, '« ');

function deep<T>(v: T, f: (s: string) => string): T {
  if (typeof v === 'string') return f(v) as T;
  if (Array.isArray(v)) return v.map((x) => deep(x, f)) as T;
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, k === 'path' ? x : deep(x, f)])) as T;
  return v;
}

const typo = (p: Page): Page => ({ ...p, fr: deep<PageCopy>(p.fr, frTypo) });

/** Every content page with its own address, in menu order. */
export const pages: Page[] = [...servicePages, ...collectionPages, ...guidePages, ...infoPages].map(typo);

/**
 * The five routes of « Les Guides de Paris ». They have no page of their own: each opens in a pop-in of the
 * guides page, at its anchor (/fr/guides/#paris-intemporel). Their `path` is the former address of their
 * page, now a redirect to that anchor.
 */
export const routes: Page[] = routePages.map(typo);

/** Anchor of a route in the guides page: the last segment of its former address. */
export const routeAnchor = (r: Page, l: 'en' | 'fr') => r[l].path.split('/').filter(Boolean).at(-1)!;

export const getPage = (id: PageId): Page => {
  const p = pages.find((x) => x.id === id);
  if (!p) throw new Error(`Unknown page: ${id}`);
  return p;
};

/** The pages listed by a hub (its children in the breadcrumb). */
export const childrenOf = (id: PageId) => pages.filter((p) => p.parent === id);

/** The page of a car of the collection. */
export const carPage = (slug: string) => pages.find((p) => p.kind === 'car' && p.cars?.[0] === slug);

export type { Page, PageCopy, PageId } from './types';

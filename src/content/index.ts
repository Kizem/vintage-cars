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

/** Every content page, in menu order. */
export const pages: Page[] = [...servicePages, ...collectionPages, guidePages[0], ...routePages, ...guidePages.slice(1), ...infoPages].map((p) => ({
  ...p,
  fr: deep<PageCopy>(p.fr, frTypo),
}));

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

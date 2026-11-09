import type { ExperienceId, MediaAsset } from '../data/types';
import type { Localized } from '../i18n/locales';

/**
 * The content pages, one static HTML page per language, written at build time (src/seo/build.tsx).
 * Each page answers one kind of search: a service (weddings, tours, chauffeur…), a car, a guide.
 * Editorial rules of the site apply: no long dashes, no superlatives, no unverified facts,
 * no price, no availability, no guest count. French: the non-breaking spaces before « : ; ? ! »
 * are added at render time.
 */

export type PageId =
  | 'events'
  | 'wedding'
  | 'proposal'
  | 'photoshoot'
  | 'tours'
  | 'chauffeur'
  | 'rental'
  | 'collection'
  | 'car-504'
  | 'car-ds'
  | 'car-w115'
  | 'guides'
  | 'guide-landmarks'
  | 'guide-night'
  | 'guide-romantic'
  | 'guide-versailles'
  | 'guide-things-to-do'
  | 'guide-wedding-car'
  | 'faq'
  | 'about';

/** service: an offer · hub: lists its children · car: one car of the collection · guide: an article or a route. */
export type PageKind = 'service' | 'hub' | 'car' | 'guide' | 'faq' | 'about';

/** One stop of a route (rendered as an ordered list, and as the itinerary of a TouristTrip). */
export interface Stop {
  name: string;
  text: string;
}

export interface Block {
  h2: string;
  p?: string[];
  list?: string[];
  /** A route: the stops, in order. */
  stops?: Stop[];
}

export interface QA {
  q: string;
  a: string;
}

/** A page in one language. */
export interface PageCopy {
  /** Address from the site root, ending with '/': 'fr/visite-paris-voiture-ancienne/'. */
  path: string;
  /** <title>, about 60 characters at most. */
  title: string;
  /** Meta description, about 155 characters at most. */
  description: string;
  h1: string;
  /** Short name, for menus, breadcrumbs and links. */
  nav: string;
  /** The answer in two or three sentences: who, what, where, how. Shown first, quoted by search engines and AI assistants. */
  lead: string;
  sections: Block[];
  faq?: QA[];
  /** Label of the enquiry action. */
  cta?: string;
}

export interface Page extends Localized<PageCopy> {
  id: PageId;
  kind: PageKind;
  /** Breadcrumb parent (the home page when absent). */
  parent?: PageId;
  /** Pre-selected experience in the enquiry form. */
  experience?: ExperienceId;
  /** Cars shown on the page (vehicle slugs); the car itself on a car page. */
  cars?: string[];
  /** Main image (hero, Open Graph). */
  image: MediaAsset;
  /** Pages linked at the end. */
  related: PageId[];
  /** Last editorial update (ISO date): dateModified and sitemap lastmod. */
  updated: string;
}

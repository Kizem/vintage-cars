import type { Localized } from '../i18n/locales';
import type { ExperienceId } from './types';

/**
 * Addresses of the content pages that the home page links to (from the site root). Kept here, apart from
 * src/content, so that the app bundle does not carry the text of every page; a unit test checks that each
 * address matches its page in src/content.
 */
export const pageLinks = {
  events: { en: 'vintage-car-hire-events-paris/', fr: 'fr/location-voiture-collection-evenement-paris/' },
  tours: { en: 'vintage-car-tour-paris/', fr: 'fr/visite-paris-voiture-ancienne/' },
  chauffeur: { en: 'vintage-car-chauffeur-paris/', fr: 'fr/voiture-collection-avec-chauffeur-paris/' },
  collection: { en: 'collection/', fr: 'fr/collection/' },
  guides: { en: 'guides/', fr: 'fr/guides/' },
  faq: { en: 'faq/', fr: 'fr/faq/' },
  'car-504': { en: 'collection/peugeot-504-gl-1971/', fr: 'fr/collection/peugeot-504-gl-1971/' },
  'car-ds': { en: 'collection/citroen-ds-21-henri-chapron-1971/', fr: 'fr/collection/citroen-ds-21-henri-chapron-1971/' },
  'car-w115': { en: 'collection/mercedes-w115-220d-1973/', fr: 'fr/collection/mercedes-w115-220d-1973/' },
} satisfies Record<string, Localized>;

export type LinkedPage = keyof typeof pageLinks;

/** The page that tells more about each experience chapter. */
export const experienceLink: Record<ExperienceId, LinkedPage> = {
  events: 'events',
  'private-tours': 'tours',
  chauffeured: 'chauffeur',
};

/** The page of each car (vehicle slug → page). */
export const carLink: Record<string, LinkedPage> = {
  'peugeot-504': 'car-504',
  'citroen-ds': 'car-ds',
  'mercedes-benz-classic': 'car-w115',
};

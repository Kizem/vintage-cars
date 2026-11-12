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
  /* the routes open in a pop-in of the guides page, at their anchor */
  'route-intemporel': { en: 'guides/#timeless-paris', fr: 'fr/guides/#paris-intemporel' },
  'route-rive-gauche': { en: 'guides/#left-bank-elegance', fr: 'fr/guides/#elegance-rive-gauche' },
  'route-est': { en: 'guides/#villages-of-east-paris', fr: 'fr/guides/#villages-est-parisien' },
  'route-jardins': { en: 'guides/#gardens-and-perspectives', fr: 'fr/guides/#jardins-perspectives' },
  'route-boheme': { en: 'guides/#bohemian-paris', fr: 'fr/guides/#paris-boheme-confidentiel' },
} satisfies Record<string, Localized>;

/** The five routes of « Les Guides de Paris », with the short names shown in the chapter N°2 of the home. */
export const routeLinks: { to: LinkedPage; name: Localized }[] = [
  { to: 'route-intemporel', name: { en: 'Timeless Paris', fr: 'Paris intemporel' } },
  { to: 'route-rive-gauche', name: { en: 'Left Bank', fr: 'Rive gauche' } },
  { to: 'route-est', name: { en: 'East Paris villages', fr: 'Villages de l’Est' } },
  { to: 'route-jardins', name: { en: 'Gardens and perspectives', fr: 'Jardins et perspectives' } },
  { to: 'route-boheme', name: { en: 'Bohemian Paris', fr: 'Paris bohème' } },
];

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

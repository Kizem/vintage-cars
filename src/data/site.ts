import type { Localized } from '../i18n/locales';
import type { Dictionary } from '../i18n/en';
import type { MediaAsset } from './types';

/**
 * Global brand content. Values marked TODO are placeholders to replace
 * before launch (contact details, social links).
 */
export const site = {
  name: 'Époque Motors',
  contact: {
    // TODO: replace with confirmed contact details
    email: 'hello@epoque-motors.example',
    phone: '+33 (0)1 00 00 00 00',
    phoneHref: '+33100000000',
    location: { en: 'Paris, France', fr: 'Paris, France' } satisfies Localized,
    hours: {
      en: 'Enquiries answered Monday to Saturday',
      fr: 'Nous répondons du lundi au samedi',
    } satisfies Localized,
  },
  social: {
    // TODO: replace with the real Instagram profile
    instagramHandle: '@epoquemotors',
    instagramUrl: '',
  },
};

/** The page, one full-screen section each, in order. */
export const sectionIds = ['garage', 'sortie-1', 'sortie-2', 'sortie-3', 'savoir', 'apropos', 'ecrire'] as const;
export type SectionId = (typeof sectionIds)[number];

/**
 * Top menu: four sections (on purpose), plus the « Guides » link in TopNav. A section without its own entry
 * underlines the entry of its chapter (data-part).
 */
export const primaryNav: { key: keyof Dictionary['nav']['items']; id: SectionId }[] = [
  { key: 'garage', id: 'garage' },
  { key: 'experiences', id: 'sortie-1' },
  { key: 'about', id: 'apropos' },
  { key: 'write', id: 'ecrire' },
];

/** Visuals of the sections that have no experience. Generated images, labelled as illustrations. */
export const sectionImages: { practical: MediaAsset; about: MediaAsset } = {
  // Good to know (prototype: v-paris).
  practical: {
    src: 'images/practical/rue-paris-ds.webp',
    srcSet: 'images/practical/rue-paris-ds-960.webp 960w, images/practical/rue-paris-ds.webp 1672w',
    width: 1672,
    height: 941,
    alt: {
      en: 'A grey Citroën DS on a wet cobbled Paris street at dusk, the Eiffel Tower in the distance (illustrative image)',
      fr: 'Une Citroën DS grise sur les pavés mouillés d’une rue de Paris au crépuscule, la tour Eiffel au loin (image d’illustration)',
    },
    credit: { en: 'Illustrative image', fr: 'Image d’illustration' },
    focalPoint: '80% 62%',
  },
  // About (prototype: v-volant).
  about: {
    src: 'images/story/interieur-volant.webp',
    width: 825,
    height: 1024,
    alt: {
      en: 'Close-up of an ivory vintage steering wheel with chrome spokes, cream leather seats behind (illustrative image)',
      fr: 'Gros plan sur un volant ancien ivoire aux branches chromées, sièges en cuir crème en arrière-plan (image d’illustration)',
    },
    credit: { en: 'Illustrative image', fr: 'Image d’illustration' },
    focalPoint: '50% 45%',
  },
};

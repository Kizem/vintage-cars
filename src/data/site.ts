import type { Localized } from '../i18n/locales';
import type { Dictionary } from '../i18n/en';
import type { MediaAsset } from './types';

/**
 * Global brand content. Values marked TODO are placeholders to replace
 * before launch (contact details, social links).
 */
export const site = {
  name: 'Époque Motors',
  tagline: {
    en: 'Driven by history. Experienced in Paris.',
    // Brand signature, kept in English in both languages.
    fr: 'Driven by history. Experienced in Paris.',
  } satisfies Localized,
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

type NavKey = keyof Dictionary['nav'];

/** Header navigation (kept to four entries on purpose; short label for Practical). */
export const primaryNav: { key: NavKey; href: string }[] = [
  { key: 'collection', href: '#collection' },
  { key: 'experiences', href: '#experiences' },
  { key: 'practicalShort', href: '#practical' },
  { key: 'contact', href: '#contact' },
];

/** Footer navigation: every section, Our Story included. */
export const footerNav: { key: NavKey; href: string }[] = [
  { key: 'collection', href: '#collection' },
  { key: 'experiences', href: '#experiences' },
  { key: 'story', href: '#story' },
  { key: 'practical', href: '#practical' },
  { key: 'contact', href: '#contact' },
];

// Generated image (not a photograph of the collection car): always labelled as an illustration.
export const heroImage: MediaAsset = {
  src: 'images/hero/hero-ds-paris.webp',
  srcSet: 'images/hero/hero-ds-paris-960.webp 960w, images/hero/hero-ds-paris.webp 1672w',
  alt: {
    en: 'A grey Citroën DS on a wet cobbled Paris street at dusk, the Eiffel Tower in the distance (illustrative image)',
    fr: 'Une Citroën DS grise sur les pavés mouillés d’une rue de Paris au crépuscule, la tour Eiffel au loin (image d’illustration)',
  },
  credit: { en: 'Illustrative image', fr: 'Image d’illustration' },
  placeholderLabel: { en: 'Hero, Citroën DS in Paris', fr: 'Visuel principal, Citroën DS à Paris' },
  brief: {
    en: 'Cinematic landscape (desktop 16:9, mobile 4:5 crop), Citroën DS on a Haussmann boulevard, blue hour, car in the lower third.',
    fr: 'Paysage cinématographique (16:9 desktop, recadrage 4:5 mobile), Citroën DS sur un boulevard haussmannien, heure bleue, voiture dans le tiers inférieur.',
  },
  // Keeps the car in frame on portrait (mobile) crops.
  focalPoint: '68% 70%',
};

export const storyImages: { primary: MediaAsset; detail: MediaAsset } = {
  // Generated image, labelled as an illustration.
  primary: {
    src: 'images/story/interieur-volant.webp',
    alt: {
      en: 'Close-up of an ivory vintage steering wheel with chrome spokes, cream leather seats behind (illustrative image)',
      fr: 'Gros plan sur un volant ancien ivoire aux branches chromées, sièges en cuir crème en arrière-plan (image d’illustration)',
    },
    credit: { en: 'Illustrative image', fr: 'Image d’illustration' },
    placeholderLabel: { en: 'Story, interior detail', fr: 'Histoire, détail intérieur' },
    brief: {
      en: 'Editorial portrait, steering wheel and chrome detail, shallow depth of field. 4:5.',
      fr: 'Portrait éditorial, volant et chromes, faible profondeur de champ. 4:5.',
    },
  },
  // Generated image (the “E” of Époque on an ivory bonnet), labelled as an illustration.
  detail: {
    src: 'images/story/monogramme.webp',
    alt: {
      en: 'A chrome script “E” monogram on the ivory bonnet of a vintage car (illustrative image)',
      fr: 'Un monogramme «\u00a0E\u00a0» chromé sur le capot ivoire d’une voiture ancienne (image d’illustration)',
    },
    credit: { en: 'Illustrative image', fr: 'Image d’illustration' },
    placeholderLabel: { en: 'Story, badge detail', fr: 'Histoire, détail du monogramme' },
    brief: {
      en: 'Macro detail of a badge or emblem, warm neutral tones. 1:1.',
      fr: 'Macro d’un monogramme ou d’un emblème, tons neutres et chauds. 1:1.',
    },
  },
};

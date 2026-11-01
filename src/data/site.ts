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

/** Header navigation (kept to four entries on purpose). */
export const primaryNav: { key: NavKey; href: string }[] = [
  { key: 'collection', href: '#collection' },
  { key: 'experiences', href: '#experiences' },
  { key: 'story', href: '#story' },
  { key: 'contact', href: '#contact' },
];

/** Footer navigation also links to the practical information. */
export const footerNav: { key: NavKey; href: string }[] = [
  ...primaryNav.slice(0, 3),
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
  primary: {
    src: '',
    alt: {
      en: 'Close-up of a vintage steering wheel and dashboard in morning light',
      fr: 'Gros plan sur le volant et le tableau de bord d’une voiture ancienne, lumière du matin',
    },
    placeholderLabel: { en: 'Story, interior detail', fr: 'Histoire, détail intérieur' },
    brief: {
      en: 'Editorial portrait, steering wheel and chrome detail, shallow depth of field. 4:5.',
      fr: 'Portrait éditorial, volant et chromes, faible profondeur de champ. 4:5.',
    },
  },
  detail: {
    src: '',
    alt: {
      en: 'Chrome badge of a classic French automobile',
      fr: 'Monogramme chromé d’une automobile française ancienne',
    },
    placeholderLabel: { en: 'Story, badge detail', fr: 'Histoire, détail du monogramme' },
    brief: {
      en: 'Macro detail of a badge or emblem, warm neutral tones. 1:1.',
      fr: 'Macro d’un monogramme ou d’un emblème, tons neutres et chauds. 1:1.',
    },
  },
};

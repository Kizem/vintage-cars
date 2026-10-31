import type { MediaAsset } from './types';

/**
 * Global brand content. Values marked TODO are placeholders to replace
 * before launch (contact details, social links, legal pages).
 */
export const site = {
  name: 'Époque Motors',
  wordmark: 'ÉPOQUE MOTORS',
  tagline: 'Driven by history. Experienced in Paris.',
  supporting: 'Discover Paris through the timeless elegance of iconic automobiles.',
  description:
    'A French automotive heritage house offering private vintage car experiences in Paris, by enquiry.',
  contact: {
    // TODO: replace with confirmed contact details
    email: 'hello@epoque-motors.example',
    phone: '+33 (0)1 00 00 00 00',
    phoneHref: '+33100000000',
    location: 'Paris, France',
    hours: 'Enquiries answered Monday to Saturday',
  },
  social: {
    // TODO: replace with the real Instagram profile
    instagramHandle: '@epoquemotors',
    instagramUrl: '',
  },
  nav: [
    { label: 'The Collection', href: '#collection' },
    { label: 'Our Experiences', href: '#experiences' },
    { label: 'Our Story', href: '#story' },
    { label: 'Contact', href: '#contact' },
  ],
};

export const heroImage: MediaAsset = {
  src: '',
  alt: 'A classic Citroën DS parked on a Parisian boulevard at dusk',
  placeholderLabel: 'Hero — Citroën DS in Paris',
  brief:
    'Cinematic landscape (desktop 16:9, mobile 4:5 crop), Citroën DS on a Haussmann boulevard, blue hour, car in lower third.',
  focalPoint: '50% 60%',
};

export const storyImages: { primary: MediaAsset; detail: MediaAsset } = {
  primary: {
    src: '',
    alt: 'Close-up of a vintage steering wheel and dashboard bathed in morning light',
    placeholderLabel: 'Story — interior detail',
    brief: 'Editorial portrait, steering wheel and chrome detail, shallow depth of field. 4:5.',
  },
  detail: {
    src: '',
    alt: 'Chrome badge of a classic French automobile',
    placeholderLabel: 'Story — badge detail',
    brief: 'Macro detail of badge or emblem, warm neutral tones. 1:1.',
  },
};

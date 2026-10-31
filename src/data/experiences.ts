import type { Experience } from './types';

/**
 * All experiences are enquiry-based. Do not present self-drive rental
 * until the operational and regulatory arrangements are confirmed.
 */
export const experiences: Experience[] = [
  {
    id: 'private-tours',
    index: '01',
    label: 'Private Paris Tours',
    title: 'See Paris in a Different Light.',
    description:
      'Explore the French capital in an iconic vintage car, accompanied by a passionate English-speaking local guide. Discover Paris’s landmarks, hidden streets and fascinating stories at your own pace.',
    cta: 'Explore Private Tours',
    image: {
      src: '',
      alt: 'A vintage car crossing a Seine bridge in Paris in the early morning',
      placeholderLabel: 'Private tour — Seine bridges',
      brief: 'Wide landscape, car crossing Pont Alexandre III or Pont Neuf, morning haze. 3:2.',
    },
  },
  {
    id: 'chauffeured',
    index: '02',
    label: 'Chauffeured Experiences',
    title: 'Your Journey, Your Way.',
    description:
      'Enjoy a vintage car with a dedicated chauffeur for a private journey, a special outing or a personalised Parisian experience.',
    cta: 'Discover Chauffeured Experiences',
    image: {
      src: '',
      alt: 'A chauffeur opening the rear door of a vintage car in front of a Parisian hotel',
      placeholderLabel: 'Chauffeured — arrival',
      brief: 'Portrait, gloved hand on door handle, hotel entrance softly out of focus. 4:5.',
    },
  },
  {
    id: 'events',
    index: '03',
    label: 'Events & Special Occasions',
    title: 'Make Every Moment Timeless.',
    description:
      'Bring a touch of French automotive elegance to weddings, private celebrations, photoshoots and exclusive events.',
    cta: 'Plan Your Experience',
    image: {
      src: '',
      alt: 'A vintage car waiting in the courtyard of a French château for a wedding',
      placeholderLabel: 'Events — château courtyard',
      brief: 'Cinematic wide shot, gravel courtyard, late golden light, no visible guests. 21:9.',
    },
  },
];

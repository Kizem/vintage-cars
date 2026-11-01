import type { Experience } from './types';

/**
 * All experiences are enquiry-based. Do not present self-drive rental
 * until the operational and regulatory arrangements are confirmed.
 */
export const experiences: Experience[] = [
  {
    id: 'private-tours',
    index: '01',
    label: { en: 'Private Paris Tours', fr: 'Visites privées de Paris' },
    title: { en: 'See Paris in a Different Light.', fr: 'Paris sous un autre jour.' },
    description: {
      en: 'Explore the French capital in an iconic vintage car, accompanied by a passionate English-speaking local guide. Discover Paris’s landmarks, hidden streets and fascinating stories at your own pace.',
      fr: 'Parcourez la capitale à bord d’une voiture de collection, accompagné d’un guide local passionné. Monuments, rues cachées et histoires de Paris, à votre rythme.',
    },
    cta: { en: 'Explore Private Tours', fr: 'Découvrir les visites privées' },
    image: {
      src: '',
      alt: {
        en: 'A vintage car crossing a Seine bridge in Paris in the early morning',
        fr: 'Une voiture de collection traversant un pont de la Seine au petit matin',
      },
      placeholderLabel: { en: 'Private tour, Seine bridges', fr: 'Visite privée, ponts de la Seine' },
      brief: {
        en: 'Wide landscape, car crossing Pont Alexandre III or Pont Neuf, morning haze. 3:2.',
        fr: 'Paysage large, voiture sur le pont Alexandre III ou le Pont Neuf, brume matinale. 3:2.',
      },
    },
  },
  {
    id: 'chauffeured',
    index: '02',
    label: { en: 'Chauffeured Experiences', fr: 'Expériences avec chauffeur' },
    title: { en: 'Your Journey, Your Way.', fr: 'Votre trajet, à votre façon.' },
    description: {
      en: 'Enjoy a vintage car with a dedicated chauffeur for a private journey, a special outing or a personalised Parisian experience.',
      fr: 'Profitez d’une voiture de collection et d’un chauffeur dédié pour un trajet privé, une sortie particulière ou une expérience parisienne sur mesure.',
    },
    cta: { en: 'Discover Chauffeured Experiences', fr: 'Découvrir les expériences avec chauffeur' },
    image: {
      src: '',
      alt: {
        en: 'A chauffeur opening the rear door of a vintage car in front of a Parisian hotel',
        fr: 'Un chauffeur ouvrant la portière arrière d’une voiture de collection devant un hôtel parisien',
      },
      placeholderLabel: { en: 'Chauffeured, arrival', fr: 'Avec chauffeur, arrivée' },
      brief: {
        en: 'Portrait, gloved hand on the door handle, hotel entrance softly out of focus. 4:5.',
        fr: 'Portrait, main gantée sur la poignée, entrée d’hôtel floue en arrière-plan. 4:5.',
      },
    },
  },
  {
    id: 'events',
    index: '03',
    label: { en: 'Events & Special Occasions', fr: 'Événements et occasions' },
    title: { en: 'Make Every Moment Timeless.', fr: 'Des moments intemporels.' },
    description: {
      en: 'Bring a touch of French automotive elegance to weddings, private celebrations, photoshoots and exclusive events.',
      fr: 'Apportez une touche d’élégance automobile française à vos mariages, célébrations privées, shootings photo et événements.',
    },
    cta: { en: 'Plan Your Experience', fr: 'Organiser votre expérience' },
    image: {
      src: '',
      alt: {
        en: 'A vintage car waiting in the courtyard of a French château for a wedding',
        fr: 'Une voiture de collection dans la cour d’un château pour un mariage',
      },
      placeholderLabel: { en: 'Events, château courtyard', fr: 'Événements, cour de château' },
      brief: {
        en: 'Cinematic wide shot, gravel courtyard, late golden light, no visible guests. 21:9.',
        fr: 'Plan large, cour gravillonnée, lumière dorée de fin de journée, sans invités visibles. 21:9.',
      },
    },
  },
];

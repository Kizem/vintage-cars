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
      fr: 'Parcourez la capitale à bord d’une voiture de collection, avec un guide parisien passionné. Grands monuments, rues méconnues et anecdotes : vous découvrez Paris à votre rythme.',
    },
    cta: { en: 'Enquire about a private tour', fr: 'Demander une visite privée' },
    // Generated image, labelled as an illustration.
    image: {
      src: 'images/experiences/visite-privee-seine.webp',
      srcSet: 'images/experiences/visite-privee-seine-800.webp 800w, images/experiences/visite-privee-seine.webp 1231w',
      alt: {
        en: 'A vintage saloon crossing Pont Alexandre III at sunrise, the Eiffel Tower in the mist (illustrative image)',
        fr: 'Une berline ancienne sur le pont Alexandre III au lever du soleil, la tour Eiffel dans la brume (image d’illustration)',
      },
      credit: { en: 'Illustrative image', fr: 'Image d’illustration' },
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
    label: { en: 'Chauffeured Experiences', fr: 'Voiture avec chauffeur' },
    title: { en: 'Your Journey, Your Way.', fr: 'À vous de choisir la route.' },
    description: {
      en: 'Enjoy a vintage car with a dedicated chauffeur for a private journey, a special outing or a personalised Parisian experience.',
      fr: 'Une voiture de collection et son chauffeur, rien que pour vous : un trajet privé, une sortie à deux ou une journée parisienne sur mesure.',
    },
    cta: { en: 'Enquire about a chauffeured journey', fr: 'Demander un trajet avec chauffeur' },
    // Generated image, labelled as an illustration.
    image: {
      src: 'images/experiences/chauffeur-arrivee.webp',
      alt: {
        en: 'A chauffeur in a leather glove opening the door of a dark green vintage car in front of a hotel entrance (illustrative image)',
        fr: 'Un chauffeur ganté ouvrant la portière d’une voiture ancienne vert foncé devant l’entrée d’un hôtel (image d’illustration)',
      },
      credit: { en: 'Illustrative image', fr: 'Image d’illustration' },
      focalPoint: '46% 60%',
      placeholderLabel: { en: 'Chauffeured, arrival', fr: 'Avec chauffeur, l’arrivée' },
      brief: {
        en: 'Portrait, gloved hand on the door handle, hotel entrance softly out of focus. 4:5.',
        fr: 'Portrait, main gantée sur la poignée, entrée d’hôtel floue en arrière-plan. 4:5.',
      },
    },
  },
  {
    id: 'events',
    index: '03',
    label: { en: 'Events & Special Occasions', fr: 'Événements et grandes occasions' },
    title: { en: 'Make Every Moment Timeless.', fr: 'Pour les moments qui comptent.' },
    description: {
      en: 'Bring a touch of French automotive elegance to weddings, private celebrations, photoshoots and exclusive events.',
      fr: 'Mariage, fête privée, shooting photo ou événement d’entreprise : une voiture de collection pour donner à la journée une élégance toute française.',
    },
    cta: { en: 'Enquire about your event', fr: 'Parler de votre événement' },
    // Generated image, labelled as an illustration.
    image: {
      src: 'images/experiences/evenements-chateau.webp',
      alt: {
        en: 'An ivory vintage saloon decorated with white ribbons in the gravel courtyard of a French château (illustrative image)',
        fr: 'Une berline ancienne ivoire ornée de rubans blancs dans la cour d’un château (image d’illustration)',
      },
      credit: { en: 'Illustrative image', fr: 'Image d’illustration' },
      // Keeps the car in frame on the narrower mobile and tablet crops.
      focalPoint: '74% 60%',
      placeholderLabel: { en: 'Events, château courtyard', fr: 'Événements, cour de château' },
      brief: {
        en: 'Cinematic wide shot, gravel courtyard, late golden light, no visible guests. 21:9.',
        fr: 'Plan large, cour gravillonnée, lumière dorée de fin de journée, sans invités visibles. 21:9.',
      },
    },
  },
];

import type { Experience } from './types';

/**
 * The three chapters under the parking (sections sortie-1 to sortie-3).
 * All experiences are enquiry-based. Self-drive is only offered for some
 * cars (see `service` in vehicles.ts: Peugeot 504 and Mercedes-Benz /8),
 * on enquiry and subject to conditions; the Citroën DS is chauffeur-only.
 * Do not add a dedicated self-drive experience here without a confirmed offer.
 */
export const experiences: Experience[] = [
  {
    id: 'private-tours',
    label: { en: 'Private Paris Tours', fr: 'Visites privées de Paris' },
    title: { en: 'Private Paris Tours', fr: 'Visites privées de Paris' },
    description: {
      en: 'Explore the French capital in an iconic vintage car, with a passionate local guide, at your own pace.',
      fr: 'Parcourez la capitale à bord d’une voiture de collection, avec un guide parisien passionné. Vous découvrez Paris à votre rythme.',
    },
    detail: {
      en: 'The route is built with you, from the landmarks to quieter streets, for 2 hours or a whole day.',
      fr: 'L’itinéraire se construit avec vous, des grands monuments aux rues plus discrètes, le temps de 2\u00a0h ou d’une journée.',
    },
    cta: { en: 'Enquire about a private tour', fr: 'Demander une visite privée' },
    // Generated image, labelled as an illustration.
    image: {
      src: 'images/experiences/visite-privee-seine.webp',
      srcSet: 'images/experiences/visite-privee-seine-800.webp 800w, images/experiences/visite-privee-seine.webp 1231w',
      width: 1231,
      height: 821,
      alt: {
        en: 'A vintage saloon crossing Pont Alexandre III at sunrise, the Eiffel Tower in the mist (illustrative image)',
        fr: 'Une berline ancienne sur le pont Alexandre III au lever du soleil, la tour Eiffel dans la brume (image d’illustration)',
      },
      credit: { en: 'Illustrative image', fr: 'Image d’illustration' },
      caption: { en: 'Private tour, Pont Alexandre III', fr: 'Visite privée, pont Alexandre III' },
      focalPoint: '50% 92%',
    },
  },
  {
    id: 'chauffeured',
    label: { en: 'Chauffeured Experiences', fr: 'Voiture avec chauffeur' },
    title: { en: 'Chauffeured Experiences', fr: 'Voiture avec chauffeur' },
    description: {
      en: 'A vintage car with a dedicated chauffeur, for a private journey or a Parisian day out.',
      fr: 'Une voiture de collection et son chauffeur, rien que pour vous, le temps d’un trajet privé ou d’une journée parisienne.',
    },
    detail: {
      en: 'The meeting point and the schedule are agreed with you in advance, in English or in French.',
      fr: 'Le lieu de rendez-vous et le programme sont convenus avec vous à l’avance, en français ou en anglais.',
    },
    cta: { en: 'Enquire about a chauffeured journey', fr: 'Demander un trajet avec chauffeur' },
    // Generated image, labelled as an illustration.
    image: {
      src: 'images/experiences/chauffeur-arrivee.webp',
      width: 825,
      height: 1024,
      alt: {
        en: 'A chauffeur in a leather glove opening the door of a dark green vintage car in front of a hotel entrance (illustrative image)',
        fr: 'Un chauffeur ganté ouvrant la portière d’une voiture ancienne vert foncé devant l’entrée d’un hôtel (image d’illustration)',
      },
      credit: { en: 'Illustrative image', fr: 'Image d’illustration' },
      caption: { en: 'Chauffeured, the arrival', fr: 'Avec chauffeur, l’arrivée' },
      focalPoint: '46% 62%',
    },
  },
  {
    id: 'events',
    label: { en: 'Events & Special Occasions', fr: 'Événements et grandes occasions' },
    title: { en: 'Events', fr: 'Événements' },
    description: {
      en: 'Weddings, private celebrations, photoshoots and company events, with a vintage car for the day.',
      fr: 'Mariage, fête privée, shooting photo ou événement d’entreprise : une voiture de collection pour la journée.',
    },
    // Self-drive only for the 504 and the Mercedes (see vehicles.ts and the FAQ); the DS is chauffeur-only.
    detail: {
      en: 'The cars can also be hired for the occasion, with a chauffeur, or self-drive on enquiry for the Peugeot 504 and the Mercedes-Benz /8.',
      fr: 'Les voitures se louent aussi pour l’occasion, avec chauffeur, ou sans chauffeur sur demande pour la Peugeot 504 et la Mercedes-Benz /8.',
    },
    cta: { en: 'Enquire about your event', fr: 'Parler de votre événement' },
    // Generated image, labelled as an illustration.
    image: {
      src: 'images/experiences/evenements-chateau.webp',
      width: 1024,
      height: 434,
      alt: {
        en: 'An ivory vintage saloon decorated with white ribbons in the gravel courtyard of a French château (illustrative image)',
        fr: 'Une berline ancienne ivoire ornée de rubans blancs dans la cour d’un château (image d’illustration)',
      },
      credit: { en: 'Illustrative image', fr: 'Image d’illustration' },
      caption: { en: 'Events, château courtyard', fr: 'Événements, cour de château' },
      // Keeps the car in frame on the narrower mobile and tablet crops.
      focalPoint: '74% 60%',
    },
  },
];

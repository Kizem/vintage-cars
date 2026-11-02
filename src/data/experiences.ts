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
      // Keeps the car in frame on the narrower mobile and tablet crops.
      focalPoint: '74% 60%',
    },
  },
];

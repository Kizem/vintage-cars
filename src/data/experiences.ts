import type { Experience } from './types';

/**
 * The three chapters under the parking (sections sortie-1 to sortie-3), in this order:
 * events, private tours, chauffeured.
 * All experiences are enquiry-based. Self-drive is only offered for some
 * cars (see `service` in vehicles.ts: Peugeot 504 and Mercedes-Benz /8),
 * on enquiry and subject to conditions; the Citroën DS is chauffeur-only.
 * Do not add a dedicated self-drive experience here without a confirmed offer.
 */
export const experiences: Experience[] = [
  {
    id: 'events',
    label: { en: 'Events & Special Occasions', fr: 'Événements et grandes occasions' },
    title: { en: 'Events', fr: 'Événements' },
    body: {
      en: [
        'Make your special moments even more memorable with the timeless elegance of a vintage automobile.',
        'From wedding celebrations and romantic occasions to private events and professional photoshoots, a classic car brings a distinctive touch to every setting.',
        'Whether it takes centre stage in your photographs or accompanies you throughout your event, our vintage cars add character, elegance and a sense of occasion. A beautiful way to create lasting memories and give your event a truly personal touch.',
      ],
      fr: [
        'Rendez vos grands moments plus mémorables encore, avec l’élégance intemporelle d’une automobile de collection.',
        'Mariage, moment romantique, événement privé ou shooting photo professionnel : une voiture d’époque apporte une touche singulière à chaque décor.',
        'Qu’elle soit la vedette de vos photos ou qu’elle vous accompagne tout au long de la journée, une voiture de collection apporte du caractère, de l’élégance et le sentiment d’un jour à part. Une belle façon de créer des souvenirs durables et de donner à votre événement une touche vraiment personnelle.',
      ],
    },
    /** Smartphones: one shorter paragraph. */
    summary: {
      en: 'Add a touch of timeless elegance to your special occasions. Weddings, photoshoots and private events: a vintage automobile brings character and distinction to your most memorable moments.',
      fr: 'Une touche d’élégance intemporelle pour vos grandes occasions. Mariage, shooting photo ou événement privé : une automobile de collection apporte caractère et distinction à vos moments les plus mémorables.',
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
  {
    id: 'private-tours',
    label: { en: 'Private Paris Tours', fr: 'Visites privées de Paris' },
    title: { en: 'Private Paris Tours', fr: 'Visites privées de Paris' },
    body: {
      en: [
        'Discover Paris from a different perspective, aboard an iconic vintage automobile.',
        'Our private tours invite you to explore the capital at a gentler pace, away from the usual tourist experience. Let yourself be driven through the streets of Paris, admire its architecture and rediscover its most emblematic landmarks from the comfort of a classic car.',
        'Whether you’re discovering the city for the first time or seeing it with fresh eyes, every journey offers a more intimate way to experience the timeless charm of Paris.',
      ],
      fr: [
        'Découvrez Paris sous un autre jour, à bord d’une automobile de collection mythique.',
        'Nos visites privées vous invitent à parcourir la capitale à un rythme plus doux, loin des circuits touristiques habituels. Laissez-vous conduire dans les rues de Paris, admirez son architecture et redécouvrez ses monuments les plus emblématiques, depuis le confort d’une voiture d’époque.',
        'Que vous découvriez la ville pour la première fois ou que vous la regardiez d’un œil neuf, chaque trajet offre une manière plus intime de vivre le charme intemporel de Paris.',
      ],
    },
    /** Smartphones: one shorter paragraph. */
    summary: {
      en: 'Discover Paris aboard an iconic vintage car. Enjoy a private guided tour through the capital, taking in its architecture, landmarks and timeless charm from a different perspective.',
      fr: 'Découvrez Paris à bord d’une voiture de collection mythique. Une visite guidée privée à travers la capitale, pour en apprécier l’architecture, les monuments et le charme intemporel sous un autre angle.',
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
    body: {
      en: [
        'Some journeys deserve more than an ordinary ride.',
        'Enjoy the elegance of a vintage automobile with your own private chauffeur. Whether you’re heading to a special address, exploring Paris at your own pace or simply looking to make an ordinary journey memorable, our chauffeured experiences offer a distinctive way to travel.',
        'Sit back, take in the scenery and enjoy the pleasure of being driven through the city in a car with character. A personal experience designed around your plans and your occasion.',
      ],
      fr: [
        'Certains trajets méritent mieux qu’un simple déplacement.',
        'Profitez de l’élégance d’une automobile de collection, avec un chauffeur rien que pour vous. Pour vous rendre à une adresse particulière, découvrir Paris à votre rythme ou simplement rendre un trajet ordinaire mémorable, nos expériences avec chauffeur offrent une façon singulière de voyager.',
        'Installez-vous, regardez défiler la ville et savourez le plaisir de vous laisser conduire dans une voiture de caractère. Une expérience personnelle, pensée autour de vos projets et de votre occasion.',
      ],
    },
    /** Smartphones: one shorter paragraph. */
    summary: {
      en: 'Enjoy the elegance of a vintage car and the comfort of a private chauffeur. From special journeys to personalised experiences, make every ride through Paris a memorable one.',
      fr: 'L’élégance d’une voiture de collection et le confort d’un chauffeur privé. Pour un trajet particulier ou une expérience sur mesure, chaque déplacement dans Paris devient un moment à retenir.',
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
];

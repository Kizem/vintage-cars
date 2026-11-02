import type { Vehicle } from './types';

/**
 * THE COLLECTION, single source of truth.
 *
 * To add a car: append an object to this array. Cards, detail view and the
 * enquiry form's "Preferred vehicle" list update automatically.
 *
 * Only publish verified information: no model years, specifications, trims
 * or prices until they are confirmed for the actual car in the collection.
 * Never mark a car as 'available' without confirmation.
 */
export const vehicles: Vehicle[] = [
  {
    slug: 'citroen-ds',
    // Provisional: owner believes it is a DS 21 (Henri Chapron). The illustrative photos
    // show a standard DS 21 saloon. TODO: confirm version and replace the photos with
    // pictures of the actual car.
    name: { en: 'Citroën DS 21', fr: 'Citroën DS 21' },
    marque: 'Citroën',
    mark: 'DS',
    category: { en: 'French Icon', fr: 'Icône française' },
    description: {
      en: 'An icon of French design and engineering. A timeless silhouette that embodies the elegance and innovation of another era.',
      fr: 'Le design et l’audace technique à la française. Une silhouette reconnaissable au premier regard, qui incarne l’élégance et l’esprit d’innovation d’une autre époque.',
    },
    story: {
      en: [
        'Unveiled at the 1955 Paris Motor Show, the DS was styled by Flaminio Bertoni and engineered under André Lefèbvre. Its hydropneumatic suspension brought a ride comfort that was new at the time.',
        'The DS 21 arrived in 1965 with a 2.2-litre engine and was produced until 1972.',
      ],
      fr: [
        'Présentée au Salon de Paris en 1955, la DS a été dessinée par Flaminio Bertoni sous la direction technique d’André Lefèbvre. Sa suspension hydropneumatique lui apportait un confort de roulement inédit pour l’époque.',
        'La DS 21 apparaît en 1965 avec un moteur de 2,2\u00a0litres et sera produite jusqu’en 1972.',
      ],
    },
    // Facts common to every DS 21 saloon. Power and gearbox depend on the version
    // (carburettor or injection, manual, hydraulic or automatic) and are left out.
    details: [
      { label: { en: 'Production', fr: 'Production' }, value: { en: '1965 to 1972', fr: '1965 à 1972' } },
      { label: { en: 'Body', fr: 'Carrosserie' }, value: { en: 'Saloon', fr: 'Berline' } },
      { label: { en: 'Seats', fr: 'Places' }, value: { en: '5', fr: '5' } },
      {
        label: { en: 'Engine', fr: 'Moteur' },
        value: { en: '4 cylinders, 2,175 cc', fr: '4 cylindres, 2\u00a0175\u00a0cm³' },
      },
      { label: { en: 'Drive', fr: 'Transmission' }, value: { en: 'Front-wheel drive', fr: 'Traction avant' } },
      { label: { en: 'Suspension', fr: 'Suspension' }, value: { en: 'Hydropneumatic', fr: 'Hydropneumatique' } },
      { label: { en: 'Design', fr: 'Design' }, value: { en: 'Flaminio Bertoni', fr: 'Flaminio Bertoni' } },
    ],
    miniature: {
      // Cut out from the third-party illustrative photo (Place Vendôme), not the collection car.
      src: 'images/showroom/citroen-ds-21.webp',
      width: 624,
      height: 206,
      alt: {
        en: 'A grey Citroën DS 21 saloon in side view (illustrative photo)',
        fr: 'Une Citroën DS 21 berline grise vue de profil (photo d’illustration)',
      },
      lamps: [[5.6, 45]],
      lampSize: 6,
      scale: 1,
      credit: { en: 'Illustrative photo', fr: 'Photo d’illustration' },
    },
    availability: 'on-request',
    service: 'chauffeur',
    // Illustrative photos supplied by the owner (third-party, not the collection car).
    image: {
      src: 'images/collection/citroen-ds-illustration-1.webp',
      alt: {
        en: 'A grey Citroën DS 21 saloon in a Paris street, three-quarter rear view (illustrative photo)',
        fr: 'Une Citroën DS 21 berline grise dans une rue de Paris, vue de trois-quarts arrière (photo d’illustration)',
      },
      placeholderLabel: { en: 'Citroën DS 21, rear', fr: 'Citroën DS 21, arrière' },
      credit: { en: 'Illustrative photo', fr: 'Photo d’illustration' },
    },
    gallery: [
      {
        src: 'images/collection/citroen-ds-illustration-2.webp',
        alt: {
          en: 'A Citroën DS 21 in front of Les Invalides, Paris (illustrative photo)',
          fr: 'Une Citroën DS 21 devant les Invalides, à Paris (photo d’illustration)',
        },
        placeholderLabel: { en: 'Citroën DS 21, Les Invalides', fr: 'Citroën DS 21, les Invalides' },
        credit: { en: 'Illustrative photo', fr: 'Photo d’illustration' },
      },
      {
        src: 'images/collection/citroen-ds-illustration-3.webp',
        alt: {
          en: 'A Citroën DS 21 in side view, Place Vendôme, Paris (illustrative photo)',
          fr: 'Une Citroën DS 21 de profil, place Vendôme, à Paris (photo d’illustration)',
        },
        placeholderLabel: { en: 'Citroën DS 21, Place Vendôme', fr: 'Citroën DS 21, place Vendôme' },
        credit: { en: 'Illustrative photo', fr: 'Photo d’illustration' },
      },
    ],
  },
  {
    slug: 'peugeot-504',
    name: { en: 'Peugeot 504', fr: 'Peugeot 504' },
    marque: 'Peugeot',
    mark: '504',
    category: { en: 'French Classic', fr: 'Classique français' },
    description: {
      en: 'A symbol of French automotive craftsmanship, combining understated elegance with unmistakable character.',
      fr: 'Un symbole du savoir-faire automobile français : une élégance sobre et un caractère bien à elle.',
    },
    miniature: {
      src: 'images/showroom/peugeot-504.webp',
      width: 557,
      height: 352,
      alt: {
        en: 'The blue Peugeot 504 saloon of the collection, three-quarter front view',
        fr: 'La Peugeot 504 berline bleue de la collection, vue de trois-quarts avant',
      },
      lamps: [
        [2.7, 47],
        [32, 64],
      ],
      lampSize: 8,
      scale: 0.74,
    },
    availability: 'on-request',
    service: 'chauffeur-or-self-drive',
    image: {
      src: 'images/collection/peugeot-504-avant.webp',
      alt: {
        en: 'The blue Peugeot 504 saloon of the collection, three-quarter front view',
        fr: 'La Peugeot 504 berline bleue de la collection, vue de trois-quarts avant',
      },
      placeholderLabel: { en: 'Peugeot 504, front', fr: 'Peugeot 504, avant' },
      focalPoint: '42% 60%',
    },
    // Specifications provided by the owner (listing: roadstr.fr/cars/peugeot-504-1971-saint-denis).
    details: [
      { label: { en: 'Year', fr: 'Année' }, value: { en: '1971', fr: '1971' } },
      { label: { en: 'Body', fr: 'Carrosserie' }, value: { en: 'Saloon', fr: 'Berline' } },
      { label: { en: 'Seats', fr: 'Places' }, value: { en: '5', fr: '5' } },
      { label: { en: 'Engine', fr: 'Moteur' }, value: { en: '4 cylinders', fr: '4 cylindres' } },
      { label: { en: 'Power', fr: 'Puissance' }, value: { en: '110 hp', fr: '110 ch' } },
      { label: { en: 'Gearbox', fr: 'Boîte de vitesses' }, value: { en: 'Manual', fr: 'Manuelle' } },
      { label: { en: 'Drive', fr: 'Transmission' }, value: { en: 'Rear-wheel drive', fr: 'Propulsion' } },
      {
        label: { en: 'Mileage', fr: 'Kilométrage' },
        value: { en: '50,000 to 100,000 km', fr: '50\u00a0000 à 100\u00a0000\u00a0km' },
      },
    ],
    gallery: [
      {
        src: 'images/collection/peugeot-504-arriere.webp',
        alt: {
          en: 'The blue Peugeot 504 saloon of the collection, three-quarter rear view',
          fr: 'La Peugeot 504 berline bleue de la collection, vue de trois-quarts arrière',
        },
        placeholderLabel: { en: 'Peugeot 504, rear', fr: 'Peugeot 504, arrière' },
        focalPoint: '50% 60%',
      },
    ],
  },
  {
    slug: 'mercedes-benz-classic',
    // Provisional identification from the photos (tall grille, high headlamps and
    // double front bumper = first series, before the August 1973 facelift).
    // TODO: replace with the exact model (e.g. 220, 230, 250…) once confirmed by the owner.
    name: { en: 'Mercedes-Benz /8', fr: 'Mercedes-Benz /8' },
    marque: 'Mercedes-Benz',
    mark: '/8',
    category: { en: 'German Heritage', fr: 'Tradition allemande' },
    description: {
      en: 'A timeless expression of German engineering, refinement and automotive heritage.',
      fr: 'La rigueur de l’ingénierie allemande, servie par un raffinement qui n’a pas pris une ride.',
    },
    story: {
      en: [
        'Launched in 1968, the Mercedes-Benz /8 owes its nickname, “Strich-Acht”, to the “/8” on its identification plates. Its lines are the work of Paul Bracq, and it remained in production until 1976.',
        'Nearly 1.9 million were built, most of them saloons. The car in our collection belongs to the first series, recognisable by its tall grille and double front bumper.',
      ],
      fr: [
        'Lancée en 1968, la Mercedes-Benz /8 doit son surnom, «\u00a0Strich-Acht\u00a0», au «\u00a0/8\u00a0» inscrit sur ses plaques d’identification. Ses lignes sont signées Paul Bracq, et elle a été produite jusqu’en 1976.',
        'Près de 1,9\u00a0million d’exemplaires ont été construits, en grande majorité des berlines. Celle de la collection appartient à la première série, reconnaissable à sa calandre haute et à son double pare-chocs avant.',
      ],
    },
    // Facts common to the whole first series. Engine, power and gearbox depend on
    // the exact version and are left out until confirmed.
    details: [
      { label: { en: 'Series', fr: 'Série' }, value: { en: 'W114/W115', fr: 'W114/W115' } },
      { label: { en: 'Period', fr: 'Période' }, value: { en: '1968 to 1973', fr: '1968 à 1973' } },
      { label: { en: 'Body', fr: 'Carrosserie' }, value: { en: 'Saloon', fr: 'Berline' } },
      { label: { en: 'Seats', fr: 'Places' }, value: { en: '5', fr: '5' } },
      { label: { en: 'Drive', fr: 'Transmission' }, value: { en: 'Rear-wheel drive', fr: 'Propulsion' } },
      { label: { en: 'Design', fr: 'Design' }, value: { en: 'Paul Bracq', fr: 'Paul Bracq' } },
    ],
    miniature: {
      src: 'images/showroom/mercedes-benz-8.webp',
      width: 1133,
      height: 507,
      alt: {
        en: 'The ivory Mercedes-Benz /8 saloon of the collection, three-quarter front view',
        fr: 'La Mercedes-Benz /8 berline ivoire de la collection, vue de trois-quarts avant',
      },
      lamps: [
        [3.4, 64],
        [19.4, 72],
      ],
      lampSize: 6,
      scale: 0.94,
    },
    availability: 'on-request',
    service: 'chauffeur-or-self-drive',
    image: {
      src: 'images/collection/mercedes-1-trois-quarts.webp',
      srcSet: 'images/collection/mercedes-1-trois-quarts-800.webp 800w, images/collection/mercedes-1-trois-quarts.webp 1500w',
      alt: {
        en: 'The ivory Mercedes-Benz /8 saloon of the collection, three-quarter front view',
        fr: 'La Mercedes-Benz /8 berline ivoire de la collection, vue de trois-quarts avant',
      },
      placeholderLabel: { en: 'Mercedes-Benz /8, front', fr: 'Mercedes-Benz /8, avant' },
    },
    gallery: [
      {
        src: 'images/collection/mercedes-2-phares.webp',
        srcSet: 'images/collection/mercedes-2-phares-800.webp 800w, images/collection/mercedes-2-phares.webp 1500w',
        alt: {
          en: 'The Mercedes-Benz /8 with its headlights on, leaving its garage',
          fr: 'La Mercedes-Benz /8 phares allumés, à la sortie de son garage',
        },
        placeholderLabel: { en: 'Mercedes-Benz /8, headlights', fr: 'Mercedes-Benz /8, phares' },
      },
      {
        src: 'images/collection/mercedes-3-profil.webp',
        srcSet: 'images/collection/mercedes-3-profil-800.webp 800w, images/collection/mercedes-3-profil.webp 1500w',
        alt: {
          en: 'The Mercedes-Benz /8 saloon in side view',
          fr: 'La Mercedes-Benz /8 berline vue de profil',
        },
        placeholderLabel: { en: 'Mercedes-Benz /8, profile', fr: 'Mercedes-Benz /8, profil' },
      },
      {
        src: 'images/collection/mercedes-4-calandre.webp',
        srcSet: 'images/collection/mercedes-4-calandre-800.webp 800w, images/collection/mercedes-4-calandre.webp 1449w',
        alt: {
          en: 'Front grille and headlights of the Mercedes-Benz /8',
          fr: 'Calandre et phares de la Mercedes-Benz /8',
        },
        placeholderLabel: { en: 'Mercedes-Benz /8, grille', fr: 'Mercedes-Benz /8, calandre' },
      },
    ],
  },
];

export const getVehicle = (slug: string | null | undefined) => vehicles.find((v) => v.slug === slug);

import type { Vehicle } from './types';

/**
 * THE COLLECTION, single source of truth.
 *
 * The order is the order of the bays in the parking: N°1 Peugeot 504,
 * N°2 Citroën DS 21, N°3 Mercedes W115 220D. The parking, the vehicle sheet
 * and the enquiry form's car list follow it.
 *
 * Only publish verified information: no model years, specifications, trims
 * or prices until they are confirmed for the actual car in the collection.
 * Never mark a car as 'available' without confirmation.
 */
export const vehicles: Vehicle[] = [
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
    availability: 'on-request',
    service: 'chauffeur-or-self-drive',
    // Photos of the collection car, supplied by the owner (references/504/Illu), licence plates blurred.
    image: {
      src: 'images/collection/peugeot-504-1-trois-quarts-avant.webp',
      srcSet: 'images/collection/peugeot-504-1-trois-quarts-avant-900.webp 900w, images/collection/peugeot-504-1-trois-quarts-avant.webp 2000w',
      width: 2000,
      height: 1454,
      alt: {
        en: 'The blue Peugeot 504 saloon of the collection, three-quarter front view',
        fr: 'La Peugeot 504 berline bleue de la collection, vue de trois-quarts avant',
      },
      caption: { en: 'Three-quarter front', fr: 'Trois-quarts avant' },
      focalPoint: '45% 60%',
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
        value: { en: '50,000 to 100,000 km', fr: '50 000 à 100 000 km' },
      },
    ],
    gallery: [
      {
        src: 'images/collection/peugeot-504-2-profil-portes-ouvertes.webp',
        srcSet: 'images/collection/peugeot-504-2-profil-portes-ouvertes-900.webp 900w, images/collection/peugeot-504-2-profil-portes-ouvertes.webp 1600w',
        width: 1600,
        height: 1066,
        alt: {
          en: 'The Peugeot 504 in side view, doors open on its grey cabin',
          fr: 'La Peugeot 504 de profil, portes ouvertes sur son habitacle gris',
        },
        caption: { en: 'Doors open', fr: 'Portes ouvertes' },
        focalPoint: '35% 55%',
      },
      {
        src: 'images/collection/peugeot-504-3-trois-quarts-arriere.webp',
        srcSet: 'images/collection/peugeot-504-3-trois-quarts-arriere-900.webp 900w, images/collection/peugeot-504-3-trois-quarts-arriere.webp 2000w',
        width: 2000,
        height: 1500,
        alt: {
          en: 'The Peugeot 504, three-quarter rear view',
          fr: 'La Peugeot 504, vue de trois-quarts arrière',
        },
        caption: { en: 'Three-quarter rear', fr: 'Trois-quarts arrière' },
        focalPoint: '45% 55%',
      },
      {
        src: 'images/collection/peugeot-504-4-arriere.webp',
        srcSet: 'images/collection/peugeot-504-4-arriere-900.webp 900w, images/collection/peugeot-504-4-arriere.webp 2000w',
        width: 2000,
        height: 1397,
        alt: {
          en: 'Rear of the Peugeot 504, with its tail lamps and boot lid',
          fr: 'L’arrière de la Peugeot 504, ses feux et sa malle',
        },
        caption: { en: 'Rear view', fr: 'De l’arrière' },
        focalPoint: '50% 50%',
      },
      {
        src: 'images/collection/peugeot-504-5-habitacle.webp',
        srcSet: 'images/collection/peugeot-504-5-habitacle-900.webp 675w, images/collection/peugeot-504-5-habitacle.webp 1500w',
        width: 1500,
        height: 2000,
        alt: {
          en: 'Cabin of the Peugeot 504: steering wheel, dashboard and grey seats',
          fr: 'L’habitacle de la Peugeot 504 : volant, planche de bord et sièges gris',
        },
        caption: { en: 'Cabin', fr: 'L’habitacle' },
        focalPoint: '50% 50%',
      },
    ],
    rendering: {
      model: 'p504',
      behaviour: 'roll',
      alt: { en: 'Graphic rendering of a blue Peugeot 504 saloon', fr: 'Représentation graphique d’une Peugeot 504 berline bleue' },
    },
  },
  {
    slug: 'citroen-ds',
    // Provisional: owner believes it is a DS 21 (Henri Chapron).
    // TODO: confirm the exact version.
    name: { en: 'Citroën DS 21', fr: 'Citroën DS 21' },
    marque: 'Citroën',
    mark: 'DS',
    category: { en: 'French Icon', fr: 'Icône française' },
    description: {
      en: 'An icon of French design and engineering. A timeless silhouette that embodies the elegance and innovation of another era.',
      fr: 'Le design et l’audace technique à la française. Une silhouette reconnaissable au premier regard, qui incarne l’élégance et l’esprit d’innovation d’une autre époque.',
    },
    summary: {
      en: 'An icon of French design and engineering, with a silhouette you recognise at first glance.',
      fr: 'Le design et l’audace technique à la française. Une silhouette reconnaissable au premier regard.',
    },
    story: {
      en: [
        'Unveiled at the 1955 Paris Motor Show, the DS was styled by Flaminio Bertoni and engineered under André Lefèbvre. Its hydropneumatic suspension brought a ride comfort that was new at the time.',
        'The DS 21 arrived in 1965 with a 2.2-litre engine and was produced until 1972.',
      ],
      fr: [
        'Présentée au Salon de Paris en 1955, la DS a été dessinée par Flaminio Bertoni sous la direction technique d’André Lefèbvre. Sa suspension hydropneumatique lui apportait un confort de roulement inédit pour l’époque.',
        'La DS 21 apparaît en 1965 avec un moteur de 2,2 litres et sera produite jusqu’en 1972.',
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
        value: { en: '4 cylinders, 2,175 cc', fr: '4 cylindres, 2 175 cm³' },
      },
      { label: { en: 'Drive', fr: 'Transmission' }, value: { en: 'Front-wheel drive', fr: 'Traction avant' } },
      { label: { en: 'Suspension', fr: 'Suspension' }, value: { en: 'Hydropneumatic', fr: 'Hydropneumatique' } },
      { label: { en: 'Design', fr: 'Design' }, value: { en: 'Flaminio Bertoni', fr: 'Flaminio Bertoni' } },
    ],
    availability: 'on-request',
    service: 'chauffeur',
    // Photos of the collection car, supplied by the owner (references/DS21/Illu), licence plates blurred.
    image: {
      src: 'images/collection/citroen-ds-1-trois-quarts-avant.webp',
      srcSet: 'images/collection/citroen-ds-1-trois-quarts-avant-900.webp 675w, images/collection/citroen-ds-1-trois-quarts-avant.webp 1125w',
      width: 1125,
      height: 1500,
      alt: {
        en: 'The anthracite grey Citroën DS 21 of the collection, three-quarter front view',
        fr: 'La Citroën DS 21 gris anthracite de la collection, vue de trois-quarts avant',
      },
      caption: { en: 'Three-quarter front', fr: 'Trois-quarts avant' },
      focalPoint: '50% 68%',
    },
    gallery: [
      {
        src: 'images/collection/citroen-ds-2-avant-contre-plongee.webp',
        srcSet: 'images/collection/citroen-ds-2-avant-contre-plongee-900.webp 875w, images/collection/citroen-ds-2-avant-contre-plongee.webp 1945w',
        width: 1945,
        height: 2000,
        alt: {
          en: 'The Citroën DS 21 seen from low down, front wing and headlamps',
          fr: 'La Citroën DS 21 vue en contre-plongée, aile avant et phares',
        },
        caption: { en: 'Front wing', fr: 'L’aile avant' },
        focalPoint: '50% 55%',
      },
      {
        src: 'images/collection/citroen-ds-3-trois-quarts-arriere.webp',
        width: 1000,
        height: 1138,
        alt: {
          en: 'The Citroën DS 21, three-quarter rear view from above',
          fr: 'La Citroën DS 21, vue de trois-quarts arrière en plongée',
        },
        caption: { en: 'Three-quarter rear', fr: 'Trois-quarts arrière' },
        focalPoint: '50% 50%',
      },
      {
        src: 'images/collection/citroen-ds-4-habitacle.webp',
        srcSet: 'images/collection/citroen-ds-4-habitacle-900.webp 675w, images/collection/citroen-ds-4-habitacle.webp 1125w',
        width: 1125,
        height: 1500,
        alt: {
          en: 'Cabin of the Citroën DS 21: single-spoke steering wheel, dashboard and tan leather seats',
          fr: 'L’habitacle de la Citroën DS 21 : volant monobranche, planche de bord et sièges en cuir fauve',
        },
        caption: { en: 'Cabin', fr: 'L’habitacle' },
        focalPoint: '50% 55%',
      },
      {
        src: 'images/collection/citroen-ds-5-banquette.webp',
        srcSet: 'images/collection/citroen-ds-5-banquette-900.webp 675w, images/collection/citroen-ds-5-banquette.webp 1500w',
        width: 1500,
        height: 2000,
        alt: {
          en: 'Rear bench of the Citroën DS 21 in tan leather',
          fr: 'La banquette arrière en cuir fauve de la Citroën DS 21',
        },
        caption: { en: 'Rear bench', fr: 'La banquette arrière' },
        focalPoint: '50% 60%',
      },
    ],
    rendering: {
      model: 'ds',
      behaviour: 'rise',
      alt: { en: 'Graphic rendering of an anthracite grey Citroën DS 21', fr: 'Représentation graphique d’une Citroën DS 21 gris anthracite' },
    },
  },
  {
    slug: 'mercedes-benz-classic',
    name: { en: 'Mercedes W115 220D', fr: 'Mercedes W115 220D' },
    marque: 'Mercedes-Benz',
    mark: '220D',
    category: { en: 'German Heritage', fr: 'Tradition allemande' },
    description: {
      en: 'A timeless expression of German engineering, refinement and automotive heritage.',
      fr: 'La rigueur de l’ingénierie allemande, servie par un raffinement qui n’a pas pris une ride.',
    },
    story: {
      en: [
        'Launched in 1968, the Mercedes-Benz W114/W115 owes its nickname, “Strich-Acht” (/8), to the “/8” on its identification plates. Its lines are the work of Paul Bracq, and it remained in production until 1976.',
        'Nearly 1.9 million were built, most of them saloons. The 220 D, with its four-cylinder diesel engine, belongs to the W115 range. The car in our collection dates from 1973 and has a manual gearbox.',
      ],
      fr: [
        'Lancée en 1968, la Mercedes-Benz W114/W115 doit son surnom, « Strich-Acht » (/8), au « /8 » inscrit sur ses plaques d’identification. Ses lignes sont signées Paul Bracq, et elle a été produite jusqu’en 1976.',
        'Près de 1,9 million d’exemplaires ont été construits, en grande majorité des berlines. La 220 D, à moteur diesel quatre cylindres, appartient à la gamme W115. Celle de la collection date de 1973 et dispose d’une boîte manuelle.',
      ],
    },
    // Year and gearbox confirmed by the owner; the model is on the boot badge (220 D).
    details: [
      { label: { en: 'Year', fr: 'Année' }, value: { en: '1973', fr: '1973' } },
      { label: { en: 'Series', fr: 'Série' }, value: { en: 'W115', fr: 'W115' } },
      { label: { en: 'Body', fr: 'Carrosserie' }, value: { en: 'Saloon', fr: 'Berline' } },
      { label: { en: 'Seats', fr: 'Places' }, value: { en: '5', fr: '5' } },
      { label: { en: 'Engine', fr: 'Moteur' }, value: { en: 'Diesel, 4 cylinders', fr: 'Diesel, 4 cylindres' } },
      { label: { en: 'Gearbox', fr: 'Boîte de vitesses' }, value: { en: 'Manual', fr: 'Manuelle' } },
      { label: { en: 'Drive', fr: 'Transmission' }, value: { en: 'Rear-wheel drive', fr: 'Propulsion' } },
      { label: { en: 'Design', fr: 'Design' }, value: { en: 'Paul Bracq', fr: 'Paul Bracq' } },
    ],
    availability: 'on-request',
    service: 'chauffeur-or-self-drive',
    // Photos of the collection car, supplied by the owner.
    image: {
      src: 'images/collection/mercedes-w115-1-avant.webp',
      srcSet: 'images/collection/mercedes-w115-1-avant-900.webp 675w, images/collection/mercedes-w115-1-avant.webp 1500w',
      width: 1500,
      height: 2000,
      alt: {
        en: 'The ivory Mercedes W115 220D of the collection, front view',
        fr: 'La Mercedes W115 220D ivoire de la collection, vue de face',
      },
      caption: { en: 'Front view', fr: 'De face' },
      focalPoint: '50% 72%',
    },
    gallery: [
      {
        src: 'images/collection/mercedes-w115-2-trois-quarts-arriere.webp',
        srcSet: 'images/collection/mercedes-w115-2-trois-quarts-arriere-900.webp 675w, images/collection/mercedes-w115-2-trois-quarts-arriere.webp 1500w',
        width: 1500,
        height: 2000,
        alt: {
          en: 'The Mercedes W115 220D, three-quarter rear view',
          fr: 'La Mercedes W115 220D, vue de trois-quarts arrière',
        },
        caption: { en: 'Three-quarter rear', fr: 'Trois-quarts arrière' },
        focalPoint: '50% 70%',
      },
      {
        src: 'images/collection/mercedes-w115-3-arriere.webp',
        srcSet: 'images/collection/mercedes-w115-3-arriere-900.webp 900w, images/collection/mercedes-w115-3-arriere.webp 2000w',
        width: 2000,
        height: 1500,
        alt: {
          en: 'Rear of the Mercedes W115 220D, with its 220 D badge',
          fr: 'L’arrière de la Mercedes W115 220D, avec son monogramme 220 D',
        },
        caption: { en: 'Rear view', fr: 'De l’arrière' },
      },
      {
        src: 'images/collection/mercedes-w115-4-jante.webp',
        srcSet: 'images/collection/mercedes-w115-4-jante-900.webp 675w, images/collection/mercedes-w115-4-jante.webp 1500w',
        width: 1500,
        height: 2000,
        alt: {
          en: 'Front wheel of the Mercedes W115 220D',
          fr: 'Roue avant de la Mercedes W115 220D',
        },
        caption: { en: 'Wheel', fr: 'La jante' },
        focalPoint: '50% 55%',
      },
      {
        src: 'images/collection/mercedes-w115-5-interieur.webp',
        srcSet: 'images/collection/mercedes-w115-5-interieur-900.webp 675w, images/collection/mercedes-w115-5-interieur.webp 1200w',
        width: 1200,
        height: 1600,
        alt: {
          en: 'Interior of the Mercedes W115 220D: ivory steering wheel, burr walnut dashboard and beige upholstery',
          fr: 'L’habitacle de la Mercedes W115 220D : volant ivoire, planche de bord en ronce de noyer et sellerie beige',
        },
        caption: { en: 'Interior', fr: 'L’habitacle' },
        focalPoint: '50% 55%',
      },
    ],
    rendering: {
      model: 'w114',
      behaviour: 'roll',
      alt: { en: 'Graphic rendering of an ivory Mercedes W115 220D', fr: 'Représentation graphique d’une Mercedes W115 220D ivoire' },
    },
  },
];

export const getVehicle = (slug: string | null | undefined) => vehicles.find((v) => v.slug === slug);

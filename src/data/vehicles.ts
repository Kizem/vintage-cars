import type { Vehicle } from './types';

/**
 * THE COLLECTION, single source of truth.
 *
 * The order is the order of the bays in the parking: N°1 Peugeot 504,
 * N°2 Citroën DS 21, N°3 Mercedes-Benz /8. The parking, the vehicle sheet
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
    image: {
      src: 'images/collection/peugeot-504-avant.webp',
      width: 730,
      height: 420,
      alt: {
        en: 'The blue Peugeot 504 saloon of the collection, three-quarter front view',
        fr: 'La Peugeot 504 berline bleue de la collection, vue de trois-quarts avant',
      },
      caption: { en: 'Three-quarter front', fr: 'Trois-quarts avant' },
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
        value: { en: '50,000 to 100,000 km', fr: '50 000 à 100 000 km' },
      },
    ],
    gallery: [
      {
        src: 'images/collection/peugeot-504-arriere.webp',
        width: 456,
        height: 350,
        alt: {
          en: 'The blue Peugeot 504 saloon of the collection, three-quarter rear view',
          fr: 'La Peugeot 504 berline bleue de la collection, vue de trois-quarts arrière',
        },
        caption: { en: 'Three-quarter rear', fr: 'Trois-quarts arrière' },
        focalPoint: '50% 60%',
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
    // First photo, at the owner's request: an illustrative photo supplied by the owner
    // (third-party, not the collection car), labelled as such.
    image: {
      src: 'images/collection/citroen-ds-illustration-1.webp',
      width: 920,
      height: 613,
      alt: {
        en: 'A grey Citroën DS 21 saloon in a Paris street, three-quarter rear view (illustrative photo)',
        fr: 'Une Citroën DS 21 berline grise dans une rue de Paris, vue de trois-quarts arrière (photo d’illustration)',
      },
      caption: { en: 'In a Paris street', fr: 'Dans une rue de Paris' },
      credit: { en: 'Illustrative photo', fr: 'Photo d’illustration' },
    },
    // Then the collection car, photographed in its garage (no illustration notice),
    // and two more illustrative photos, always labelled as such.
    // TODO: confirm the rights to use them, or replace them with more photos of the actual car.
    gallery: [
      {
        src: 'images/collection/ds-garage.webp',
        width: 1200,
        height: 833,
        alt: {
          en: 'The grey Citroën DS 21 of the collection, three-quarter rear view',
          fr: 'La Citroën DS 21 grise de la collection, vue de trois-quarts arrière',
        },
        caption: { en: 'Three-quarter rear', fr: 'Trois-quarts arrière' },
      },
      {
        src: 'images/collection/citroen-ds-illustration-2.webp',
        width: 920,
        height: 613,
        alt: {
          en: 'A Citroën DS 21 in front of Les Invalides, Paris (illustrative photo)',
          fr: 'Une Citroën DS 21 devant les Invalides, à Paris (photo d’illustration)',
        },
        caption: { en: 'In front of Les Invalides', fr: 'Devant les Invalides' },
        credit: { en: 'Illustrative photo', fr: 'Photo d’illustration' },
      },
      {
        src: 'images/collection/citroen-ds-illustration-3.webp',
        width: 820,
        height: 547,
        alt: {
          en: 'A Citroën DS 21 in side view, Place Vendôme, Paris (illustrative photo)',
          fr: 'Une Citroën DS 21 de profil, place Vendôme, à Paris (photo d’illustration)',
        },
        caption: { en: 'Side view, Place Vendôme', fr: 'De profil, place Vendôme' },
        credit: { en: 'Illustrative photo', fr: 'Photo d’illustration' },
      },
    ],
    rendering: {
      model: 'ds',
      behaviour: 'rise',
      alt: { en: 'Graphic rendering of a grey Citroën DS', fr: 'Représentation graphique d’une Citroën DS grise' },
    },
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
        'Lancée en 1968, la Mercedes-Benz /8 doit son surnom, « Strich-Acht », au « /8 » inscrit sur ses plaques d’identification. Ses lignes sont signées Paul Bracq, et elle a été produite jusqu’en 1976.',
        'Près de 1,9 million d’exemplaires ont été construits, en grande majorité des berlines. Celle de la collection appartient à la première série, reconnaissable à sa calandre haute et à son double pare-chocs avant.',
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
    availability: 'on-request',
    service: 'chauffeur-or-self-drive',
    image: {
      src: 'images/collection/mercedes-1-trois-quarts.webp',
      srcSet: 'images/collection/mercedes-1-trois-quarts-800.webp 800w, images/collection/mercedes-1-trois-quarts.webp 1500w',
      width: 1500,
      height: 1000,
      alt: {
        en: 'The Mercedes-Benz /8 saloon of the collection, three-quarter front view',
        fr: 'La Mercedes-Benz /8 berline de la collection, vue de trois-quarts avant',
      },
      caption: { en: 'Three-quarter front', fr: 'Trois-quarts avant' },
    },
    gallery: [
      {
        src: 'images/collection/mercedes-2-phares.webp',
        srcSet: 'images/collection/mercedes-2-phares-800.webp 800w, images/collection/mercedes-2-phares.webp 1500w',
        width: 1500,
        height: 1000,
        alt: {
          en: 'The Mercedes-Benz /8 with its headlights on, leaving its garage',
          fr: 'La Mercedes-Benz /8 phares allumés, à la sortie de son garage',
        },
        caption: { en: 'Headlights on', fr: 'Phares allumés' },
      },
      {
        src: 'images/collection/mercedes-3-profil.webp',
        srcSet: 'images/collection/mercedes-3-profil-800.webp 800w, images/collection/mercedes-3-profil.webp 1500w',
        width: 1500,
        height: 1000,
        alt: {
          en: 'The Mercedes-Benz /8 saloon in side view',
          fr: 'La Mercedes-Benz /8 berline vue de profil',
        },
        caption: { en: 'Side view', fr: 'De profil' },
      },
      {
        src: 'images/collection/mercedes-4-calandre.webp',
        srcSet: 'images/collection/mercedes-4-calandre-800.webp 800w, images/collection/mercedes-4-calandre.webp 1449w',
        width: 1449,
        height: 966,
        alt: {
          en: 'Front grille and headlights of the Mercedes-Benz /8',
          fr: 'Calandre et phares de la Mercedes-Benz /8',
        },
        caption: { en: 'Grille and headlights', fr: 'Calandre et phares' },
      },
    ],
    rendering: {
      model: 'w114',
      behaviour: 'roll',
      alt: { en: 'Graphic rendering of a white Mercedes-Benz /8', fr: 'Représentation graphique d’une Mercedes-Benz /8 blanche' },
    },
  },
];

export const getVehicle = (slug: string | null | undefined) => vehicles.find((v) => v.slug === slug);

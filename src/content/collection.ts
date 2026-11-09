import { getVehicle } from '../data/vehicles';
import type { Page } from './types';

const photo = (slug: string, n = 0) => {
  const v = getVehicle(slug)!;
  return [v.image, ...(v.gallery ?? [])][n];
};

/**
 * The collection and one page per car. The specifications table and the photos come from
 * src/data/vehicles.ts (single source of truth). Model history below is limited to well-documented
 * facts about the model, never about this particular car unless the owner confirmed it.
 */
export const collectionPages: Page[] = [
  {
    id: 'collection',
    kind: 'hub',
    cars: ['peugeot-504', 'citroen-ds', 'mercedes-benz-classic'],
    image: photo('peugeot-504', 1),
    related: ['rental', 'events', 'tours', 'chauffeur'],
    updated: '2026-11-09',
    en: {
      path: 'collection/',
      title: 'Our Vintage Cars in Paris: DS 21, Peugeot 504, Mercedes W115',
      description:
        'The Époque Motors collection in Paris: a 1971 Citroën DS 21 Henri Chapron, a 1971 Peugeot 504 GL and a 1973 Mercedes W115 220D, by enquiry.',
      h1: 'The collection: three cars from the early 1970s',
      nav: 'The collection',
      lead: 'The Époque Motors collection is made of three saloons from the early 1970s, based in Paris: a Citroën DS 21 Henri Chapron (1971), a Peugeot 504 GL (1971) and a Mercedes W115 220D (1973). They are available by enquiry for events, private tours and chauffeured journeys.',
      sections: [
        {
          h2: 'Three icons of European motoring',
          p: [
            'Each car tells a different story: the French avant-garde of the DS, the balanced lines of the Peugeot 504, and the solidity of the Mercedes saloon that became a familiar sight in cities across the world.',
            'The photos on these pages show our actual cars. In the 3D garage of the home page, the cars are graphic renderings drawn from these photos.',
          ],
        },
        {
          h2: 'With or without chauffeur',
          p: [
            'All three cars can be driven by our chauffeur. The Peugeot 504 GL and the Mercedes W115 220D can also be driven by you, on enquiry and subject to conditions. The Citroën DS 21 Henri Chapron is offered with a chauffeur only.',
          ],
        },
      ],
      cta: 'Enquire about a car',
    },
    fr: {
      path: 'fr/collection/',
      title: 'Nos voitures de collection à Paris : DS 21, 504, Mercedes W115',
      description:
        'La collection Époque Motors à Paris : une Citroën DS 21 Henri Chapron de 1971, une Peugeot 504 GL de 1971 et une Mercedes W115 220D de 1973, sur demande.',
      h1: 'La collection : trois voitures du début des années 1970',
      nav: 'La collection',
      lead: 'La collection Époque Motors réunit trois berlines du début des années 1970, basées à Paris : une Citroën DS 21 Henri Chapron (1971), une Peugeot 504 GL (1971) et une Mercedes W115 220D (1973). Elles sont proposées sur demande pour les événements, les visites privées et les trajets avec chauffeur.',
      sections: [
        {
          h2: 'Trois icônes de l’automobile européenne',
          p: [
            'Chaque voiture raconte une histoire différente : l’avant-garde française de la DS, les lignes équilibrées de la Peugeot 504, la solidité de la berline Mercedes devenue familière dans les villes du monde entier.',
            'Les photos de ces pages montrent nos vraies voitures. Dans le garage en 3D de l’accueil, les voitures sont des représentations graphiques dessinées d’après ces photos.',
          ],
        },
        {
          h2: 'Avec ou sans chauffeur',
          p: [
            'Les trois voitures peuvent être conduites par notre chauffeur. La Peugeot 504 GL et la Mercedes W115 220D peuvent aussi être conduites par vous, sur demande et sous conditions. La Citroën DS 21 Henri Chapron est proposée uniquement avec chauffeur.',
          ],
        },
      ],
      cta: 'Demander une voiture',
    },
  },
  {
    id: 'car-ds',
    kind: 'car',
    parent: 'collection',
    cars: ['citroen-ds'],
    image: photo('citroen-ds'),
    related: ['chauffeur', 'wedding', 'photoshoot', 'car-504', 'car-w115'],
    updated: '2026-11-09',
    en: {
      path: 'collection/citroen-ds-21-henri-chapron-1971/',
      title: 'Citroën DS 21 Henri Chapron (1971) with Chauffeur in Paris',
      description:
        'Hire our anthracite grey 1971 Citroën DS 21 Henri Chapron with chauffeur in Paris, for a wedding, a private tour or a photoshoot. Photos and specifications.',
      h1: 'Citroën DS 21 Henri Chapron, 1971',
      nav: 'Citroën DS 21 Henri Chapron',
      lead: 'Our Citroën DS 21 Henri Chapron is an anthracite grey saloon from 1971, with tan leather seats and a single-spoke steering wheel. It is offered in Paris with a chauffeur only, for weddings, private tours, photoshoots and chauffeured journeys, by enquiry.',
      sections: [
        {
          h2: 'The car',
          p: [
            'The anthracite grey body underlines the famous silhouette of the DS, low and long, with its headlamps set into the wings. Inside, the tan leather seats and the rear bench welcome you in the comfort the model is known for.',
          ],
        },
        {
          h2: 'A short history of the DS',
          p: [
            'Citroën presented the DS at the Paris Motor Show in 1955. Its body was designed by Flaminio Bertoni, and its hydropneumatic suspension gave it a ride that set it apart from the cars of its time. The DS 21 version, with its 2,175 cc four-cylinder engine, joined the range in the mid-1960s.',
            'Henri Chapron, a coachbuilder based in Levallois-Perret, just outside Paris, is associated with the special versions of the DS, the convertibles in particular.',
          ],
        },
        {
          h2: 'What we offer it for',
          list: [
            'A wedding: the arrival at the ceremony and the couple photos.',
            'A private tour of Paris or an evening out with chauffeur.',
            'Photoshoots, for its unmistakable profile.',
          ],
        },
      ],
      faq: [
        {
          q: 'Can I drive the Citroën DS myself?',
          a: 'No, the Citroën DS 21 Henri Chapron is offered with a chauffeur only.',
        },
      ],
      cta: 'Enquire about the DS',
    },
    fr: {
      path: 'fr/collection/citroen-ds-21-henri-chapron-1971/',
      title: 'Citroën DS 21 Henri Chapron (1971) avec chauffeur à Paris',
      description:
        'Notre Citroën DS 21 Henri Chapron de 1971, gris anthracite, avec chauffeur à Paris : mariage, visite privée ou shooting photo. Photos et fiche technique.',
      h1: 'Citroën DS 21 Henri Chapron, 1971',
      nav: 'Citroën DS 21 Henri Chapron',
      lead: 'Notre Citroën DS 21 Henri Chapron est une berline gris anthracite de 1971, sièges en cuir fauve et volant monobranche. Elle est proposée à Paris uniquement avec chauffeur, pour les mariages, les visites privées, les shootings photo et les trajets avec chauffeur, sur demande.',
      sections: [
        {
          h2: 'La voiture',
          p: [
            'Le gris anthracite souligne la silhouette de la DS, basse et longue, aux phares intégrés dans les ailes. À l’intérieur, les sièges en cuir fauve et la banquette arrière vous accueillent avec le confort qui a fait la réputation du modèle.',
          ],
        },
        {
          h2: 'Un peu d’histoire',
          p: [
            'Citroën présente la DS au Salon de l’automobile de Paris en 1955. Sa carrosserie est dessinée par Flaminio Bertoni, et sa suspension hydropneumatique la distingue des voitures de son temps. La version DS 21, avec son quatre-cylindres de 2 175 cm³, rejoint la gamme au milieu des années 1960.',
            'Henri Chapron, carrossier installé à Levallois-Perret, aux portes de Paris, est associé aux versions spéciales de la DS, notamment aux cabriolets.',
          ],
        },
        {
          h2: 'Pour quelles occasions',
          list: [
            'Un mariage : l’arrivée à la cérémonie et les photos de couple.',
            'Une visite privée de Paris ou une soirée avec chauffeur.',
            'Un shooting photo, pour son profil reconnaissable au premier coup d’œil.',
          ],
        },
      ],
      faq: [
        {
          q: 'Puis-je conduire la Citroën DS moi-même ?',
          a: 'Non, la Citroën DS 21 Henri Chapron est proposée uniquement avec chauffeur.',
        },
      ],
      cta: 'Demander la DS',
    },
  },
  {
    id: 'car-504',
    kind: 'car',
    parent: 'collection',
    cars: ['peugeot-504'],
    image: photo('peugeot-504'),
    related: ['rental', 'tours', 'events', 'car-ds', 'car-w115'],
    updated: '2026-11-09',
    en: {
      path: 'collection/peugeot-504-gl-1971/',
      title: 'Peugeot 504 GL (1971) for Hire in Paris | Époque Motors',
      description:
        'Hire our blue 1971 Peugeot 504 GL in Paris, with chauffeur or driven by you on conditions: wedding, tour, photoshoot. Photos and specifications.',
      h1: 'Peugeot 504 GL, 1971',
      nav: 'Peugeot 504 GL',
      lead: 'Our Peugeot 504 GL is a blue saloon from 1971, with a grey cabin, a 110 hp four-cylinder engine, a manual gearbox and rear-wheel drive. It is available in Paris with a chauffeur or, on enquiry and subject to conditions, driven by you.',
      sections: [
        {
          h2: 'The car',
          p: [
            'Its blue paint and clean lines make the 504 a cheerful, approachable classic. The grey cabin, the large windows and the five seats make it comfortable for a tour of Paris or a day out.',
          ],
        },
        {
          h2: 'A short history of the 504',
          p: [
            'Peugeot presented the 504 in 1968, with a body styled by Pininfarina. It was voted European Car of the Year in 1969 and had a long career, in France and abroad, notably in Africa and South America.',
          ],
        },
        {
          h2: 'What we offer it for',
          list: [
            'Driving it yourself, on enquiry and subject to conditions.',
            'A relaxed or country wedding, a birthday, an anniversary.',
            'A private tour of Paris with chauffeur.',
            'Photoshoots, for its blue colour and period details.',
          ],
        },
      ],
      faq: [
        {
          q: 'Can I drive the Peugeot 504 myself?',
          a: 'Yes, on enquiry and subject to conditions, set out in our proposal. It has a manual gearbox.',
        },
      ],
      cta: 'Enquire about the 504',
    },
    fr: {
      path: 'fr/collection/peugeot-504-gl-1971/',
      title: 'Location Peugeot 504 GL (1971) à Paris | Époque Motors',
      description:
        'Louez notre Peugeot 504 GL bleue de 1971 à Paris, avec chauffeur ou conduite par vous sous conditions : mariage, balade, shooting. Photos et fiche technique.',
      h1: 'Peugeot 504 GL, 1971',
      nav: 'Peugeot 504 GL',
      lead: 'Notre Peugeot 504 GL est une berline bleue de 1971, habitacle gris, quatre-cylindres de 110 ch, boîte manuelle et propulsion. Elle est proposée à Paris avec chauffeur ou, sur demande et sous conditions, conduite par vous.',
      sections: [
        {
          h2: 'La voiture',
          p: [
            'Sa peinture bleue et ses lignes nettes font de la 504 une voiture de collection gaie et accessible. L’habitacle gris, les grandes surfaces vitrées et les cinq places la rendent confortable pour une visite de Paris ou une journée de balade.',
          ],
        },
        {
          h2: 'Un peu d’histoire',
          p: [
            'Peugeot présente la 504 en 1968, avec une carrosserie dessinée par Pininfarina. Elle est élue voiture européenne de l’année en 1969 et connaît une longue carrière, en France et à l’étranger, notamment en Afrique et en Amérique du Sud.',
          ],
        },
        {
          h2: 'Pour quelles occasions',
          list: [
            'La conduire vous-même, sur demande et sous conditions.',
            'Un mariage décontracté ou champêtre, un anniversaire.',
            'Une visite privée de Paris avec chauffeur.',
            'Un shooting photo, pour sa couleur et ses détails d’époque.',
          ],
        },
      ],
      faq: [
        {
          q: 'Puis-je conduire la Peugeot 504 moi-même ?',
          a: 'Oui, sur demande et sous conditions, précisées dans notre proposition. Elle a une boîte de vitesses manuelle.',
        },
      ],
      cta: 'Demander la 504',
    },
  },
  {
    id: 'car-w115',
    kind: 'car',
    parent: 'collection',
    cars: ['mercedes-benz-classic'],
    image: photo('mercedes-benz-classic'),
    related: ['wedding', 'rental', 'chauffeur', 'car-ds', 'car-504'],
    updated: '2026-11-09',
    en: {
      path: 'collection/mercedes-w115-220d-1973/',
      title: 'Mercedes W115 220D (1973) for Hire in Paris | Époque Motors',
      description:
        'Hire our ivory 1973 Mercedes W115 220D in Paris, with chauffeur or driven by you on conditions: a classic wedding car. Photos and specifications.',
      h1: 'Mercedes W115 220D, 1973',
      nav: 'Mercedes W115 220D',
      lead: 'Our Mercedes W115 220D is an ivory saloon from 1973, with an ivory steering wheel, a burr walnut dashboard and beige upholstery. Diesel, manual gearbox, rear-wheel drive: it is available in Paris with a chauffeur or, on enquiry and subject to conditions, driven by you.',
      sections: [
        {
          h2: 'The car',
          p: [
            'Ivory outside, beige and walnut inside: the W115 is a luminous car, often chosen for weddings. Its sober lines and chrome details give it a timeless presence in photographs.',
          ],
        },
        {
          h2: 'A short history of the W115',
          p: [
            'The W115 belongs to the Mercedes-Benz saloon family launched in 1968, nicknamed “Strich-Acht” (/8) in Germany, and designed under Paul Bracq. The W115 designation covers the four- and five-cylinder versions; the 220 D is the diesel model, known for its durability.',
          ],
        },
        {
          h2: 'What we offer it for',
          list: [
            'A classic wedding, for its ivory colour.',
            'Chauffeured journeys and private tours of Paris.',
            'Driving it yourself, on enquiry and subject to conditions.',
          ],
        },
      ],
      faq: [
        {
          q: 'Can I drive the Mercedes W115 myself?',
          a: 'Yes, on enquiry and subject to conditions, set out in our proposal. It has a manual gearbox.',
        },
      ],
      cta: 'Enquire about the Mercedes',
    },
    fr: {
      path: 'fr/collection/mercedes-w115-220d-1973/',
      title: 'Location Mercedes W115 220D (1973) à Paris | Époque Motors',
      description:
        'Louez notre Mercedes W115 220D ivoire de 1973 à Paris, avec chauffeur ou conduite par vous sous conditions : une voiture de mariage classique.',
      h1: 'Mercedes W115 220D, 1973',
      nav: 'Mercedes W115 220D',
      lead: 'Notre Mercedes W115 220D est une berline ivoire de 1973, volant ivoire, planche de bord en ronce de noyer et sellerie beige. Diesel, boîte manuelle, propulsion : elle est proposée à Paris avec chauffeur ou, sur demande et sous conditions, conduite par vous.',
      sections: [
        {
          h2: 'La voiture',
          p: [
            'Ivoire à l’extérieur, beige et noyer à l’intérieur : la W115 est une voiture lumineuse, souvent choisie pour les mariages. Ses lignes sobres et ses chromes lui donnent une présence intemporelle sur les photos.',
          ],
        },
        {
          h2: 'Un peu d’histoire',
          p: [
            'La W115 appartient à la famille de berlines Mercedes-Benz lancée en 1968, surnommée « Strich-Acht » (/8) en Allemagne et dessinée sous la direction de Paul Bracq. L’appellation W115 regroupe les versions quatre et cinq cylindres ; la 220 D est la version diesel, réputée pour sa robustesse.',
          ],
        },
        {
          h2: 'Pour quelles occasions',
          list: [
            'Un mariage classique, pour sa couleur ivoire.',
            'Des trajets avec chauffeur et des visites privées de Paris.',
            'La conduire vous-même, sur demande et sous conditions.',
          ],
        },
      ],
      faq: [
        {
          q: 'Puis-je conduire la Mercedes W115 moi-même ?',
          a: 'Oui, sur demande et sous conditions, précisées dans notre proposition. Elle a une boîte de vitesses manuelle.',
        },
      ],
      cta: 'Demander la Mercedes',
    },
  },
];

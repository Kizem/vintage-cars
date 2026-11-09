import { experiences } from '../data/experiences';
import { sectionImages } from '../data/site';
import { getVehicle } from '../data/vehicles';
import type { Page } from './types';

const img = (id: string) => experiences.find((x) => x.id === id)!.image;
const photo = (slug: string, n = 0) => {
  const v = getVehicle(slug)!;
  return [v.image, ...(v.gallery ?? [])][n];
};

/**
 * Guides and routes: content that answers broader searches (« what to do in Paris », « Paris by night »,
 * « choosing a wedding car ») and links to the offers. Facts about Paris are limited to well-known,
 * stable ones; opening hours and rules change, so the pages send readers to official sources for them.
 */
export const guidePages: Page[] = [
  {
    id: 'guides',
    kind: 'hub',
    image: sectionImages.practical,
    related: ['tours', 'events', 'collection', 'faq'],
    updated: '2026-11-09',
    en: {
      path: 'guides/',
      title: 'Paris by Vintage Car: Routes and Guides | Époque Motors',
      description:
        'Routes and guides to discover Paris in a vintage car: the landmarks, Paris by night, romantic Paris, Versailles, unusual things to do, choosing a wedding car.',
      h1: 'Paris by vintage car: routes and guides',
      nav: 'Guides',
      lead: 'Our guides suggest routes through Paris and its surroundings in a 1970s classic car, and practical advice for weddings and special occasions. Every route can be booked as a private tour with chauffeur, adapted to your time and your meeting point.',
      sections: [],
      cta: 'Enquire about a private tour',
    },
    fr: {
      path: 'fr/guides/',
      title: 'Paris en voiture ancienne : parcours et guides | Époque Motors',
      description:
        'Parcours et guides pour découvrir Paris en voiture de collection : monuments, Paris la nuit, Paris romantique, Versailles, activités insolites, voiture de mariage.',
      h1: 'Paris en voiture de collection : parcours et guides',
      nav: 'Guides',
      lead: 'Nos guides proposent des parcours dans Paris et ses environs en voiture de collection des années 1970, et des conseils pratiques pour les mariages et les grandes occasions. Chaque parcours peut être réservé en visite privée avec chauffeur, adapté à votre temps et à votre point de rendez-vous.',
      sections: [],
      cta: 'Demander une visite privée',
    },
  },
  {
    id: 'guide-landmarks',
    kind: 'guide',
    parent: 'guides',
    experience: 'private-tours',
    cars: ['citroen-ds', 'mercedes-benz-classic', 'peugeot-504'],
    image: img('private-tours'),
    related: ['tours', 'guide-night', 'guide-romantic', 'guide-things-to-do'],
    updated: '2026-11-09',
    en: {
      path: 'guides/paris-landmarks-by-vintage-car/',
      title: 'The Paris Landmarks by Vintage Car: a Route | Époque Motors',
      description:
        'A route through the Paris landmarks in a vintage car: Concorde, Champs-Élysées, Arc de Triomphe, Trocadéro, Eiffel Tower, Invalides, Louvre and Notre-Dame.',
      h1: 'The Paris landmarks by vintage car',
      nav: 'The Paris landmarks',
      lead: 'This route links the landmarks of central Paris in a loop of about one hour by car, from Place de la Concorde to Notre-Dame by way of the Champs-Élysées, the Arc de Triomphe, the Trocadéro and the Eiffel Tower. Époque Motors drives it as a private tour in a 1970s classic car with chauffeur, with stops agreed with you.',
      sections: [
        {
          h2: 'The route, step by step',
          stops: [
            { name: 'Place de la Concorde', text: 'The starting point, between the Tuileries and the Champs-Élysées, around the Luxor obelisk and its fountains.' },
            { name: 'Avenue des Champs-Élysées', text: 'The avenue climbs gently towards the Arc de Triomphe, lined with theatres, cafés and flagship stores.' },
            { name: 'Arc de Triomphe', text: 'The car turns around Place Charles-de-Gaulle, where twelve avenues meet, before heading down towards the Seine.' },
            { name: 'Trocadéro', text: 'From the Palais de Chaillot esplanade, the view opens onto the Eiffel Tower across the river: a stop for photographs.' },
            { name: 'Eiffel Tower and Champ-de-Mars', text: 'Built for the Universal Exhibition of 1889, the tower is seen up close as the car crosses the Pont d’Iéna.' },
            { name: 'Les Invalides and Pont Alexandre III', text: 'The golden dome of the Invalides, then the bridge built for the Universal Exhibition of 1900, with its gilded statues.' },
            { name: 'The Louvre', text: 'Along the Rue de Rivoli and past the glass pyramid of the Cour Napoléon.' },
            { name: 'Île de la Cité and Notre-Dame', text: 'The route ends on the island where Paris began, in front of the cathedral, reopened in December 2024.' },
          ],
        },
        {
          h2: 'Timing and tips',
          p: [
            'Without stops, the loop takes about one hour, depending on traffic. With a stop at the Trocadéro and a walk across the Pont Alexandre III, allow an hour and a half to two hours.',
            'Early morning offers quieter streets and soft light on the stone; late afternoon brings the golden hour on the Seine. The route can continue to Montmartre or Saint-Germain-des-Prés.',
          ],
        },
      ],
      faq: [
        {
          q: 'When is a good time of day for this route?',
          a: 'Early morning for quiet streets and photographs, late afternoon for the light on the Seine, or after dark for the illuminations (see our Paris by night route).',
        },
        {
          q: 'Can the car stop at the Eiffel Tower?',
          a: 'Yes, the stops are agreed with you. The Trocadéro esplanade is the usual stop for a photograph with the tower.',
        },
      ],
      cta: 'Book this route as a private tour',
    },
    fr: {
      path: 'fr/guides/monuments-de-paris-en-voiture-ancienne/',
      title: 'Les monuments de Paris en voiture ancienne : le parcours',
      description:
        'Un parcours des monuments de Paris en voiture de collection : Concorde, Champs-Élysées, Arc de Triomphe, Trocadéro, tour Eiffel, Invalides, Louvre, Notre-Dame.',
      h1: 'Les monuments de Paris en voiture de collection',
      nav: 'Les monuments de Paris',
      lead: 'Ce parcours relie les monuments du centre de Paris en une boucle d’environ une heure en voiture, de la place de la Concorde à Notre-Dame, par les Champs-Élysées, l’Arc de Triomphe, le Trocadéro et la tour Eiffel. Époque Motors le propose en visite privée, à bord d’une voiture des années 1970 avec chauffeur, avec des arrêts convenus avec vous.',
      sections: [
        {
          h2: 'Le parcours, étape par étape',
          stops: [
            { name: 'Place de la Concorde', text: 'Le point de départ, entre les Tuileries et les Champs-Élysées, autour de l’obélisque de Louxor et de ses fontaines.' },
            { name: 'Avenue des Champs-Élysées', text: 'L’avenue monte en pente douce vers l’Arc de Triomphe, entre théâtres, cafés et grandes enseignes.' },
            { name: 'Arc de Triomphe', text: 'La voiture fait le tour de la place Charles-de-Gaulle, où se rejoignent douze avenues, avant de redescendre vers la Seine.' },
            { name: 'Trocadéro', text: 'Depuis l’esplanade du palais de Chaillot, la vue s’ouvre sur la tour Eiffel, de l’autre côté du fleuve : un arrêt pour les photos.' },
            { name: 'Tour Eiffel et Champ-de-Mars', text: 'Construite pour l’Exposition universelle de 1889, la tour se découvre de près en traversant le pont d’Iéna.' },
            { name: 'Les Invalides et le pont Alexandre III', text: 'Le dôme doré des Invalides, puis le pont construit pour l’Exposition universelle de 1900, avec ses statues dorées.' },
            { name: 'Le Louvre', text: 'Par la rue de Rivoli, en passant devant la pyramide de verre de la cour Napoléon.' },
            { name: 'Île de la Cité et Notre-Dame', text: 'Le parcours se termine sur l’île où Paris est né, devant la cathédrale, rouverte en décembre 2024.' },
          ],
        },
        {
          h2: 'Durée et conseils',
          p: [
            'Sans arrêt, la boucle prend environ une heure, selon la circulation. Avec un arrêt au Trocadéro et une traversée à pied du pont Alexandre III, comptez une heure et demie à deux heures.',
            'Tôt le matin, les rues sont plus calmes et la lumière douce sur la pierre ; en fin d’après-midi, la Seine prend des reflets dorés. Le parcours peut se prolonger vers Montmartre ou Saint-Germain-des-Prés.',
          ],
        },
      ],
      faq: [
        {
          q: 'À quel moment de la journée faire ce parcours ?',
          a: 'Tôt le matin pour des rues calmes et de belles photos, en fin d’après-midi pour la lumière sur la Seine, ou à la nuit tombée pour les illuminations (voir notre parcours Paris la nuit).',
        },
        {
          q: 'La voiture peut-elle s’arrêter à la tour Eiffel ?',
          a: 'Oui, les arrêts sont convenus avec vous. L’esplanade du Trocadéro est l’arrêt habituel pour une photo avec la tour.',
        },
      ],
      cta: 'Réserver ce parcours en visite privée',
    },
  },
  {
    id: 'guide-night',
    kind: 'guide',
    parent: 'guides',
    experience: 'private-tours',
    cars: ['citroen-ds', 'mercedes-benz-classic'],
    image: sectionImages.practical,
    related: ['tours', 'guide-landmarks', 'proposal', 'chauffeur'],
    updated: '2026-11-09',
    en: {
      path: 'guides/paris-by-night-in-a-vintage-car/',
      title: 'Paris by Night in a Vintage Car with Chauffeur',
      description:
        'Discover Paris by night in a 1970s classic car with chauffeur: the illuminated monuments, the quays of the Seine and the sparkling Eiffel Tower.',
      h1: 'Paris by night in a vintage car',
      nav: 'Paris by night',
      lead: 'After dark, Paris lights up its monuments, bridges and quays. Époque Motors offers evening drives in a 1970s classic car with chauffeur: the Champs-Élysées, the Seine, the Louvre and the Eiffel Tower, which sparkles for five minutes at the start of every hour after nightfall.',
      sections: [
        {
          h2: 'An evening route',
          stops: [
            { name: 'The Champs-Élysées and the Arc de Triomphe', text: 'The avenue lit from end to end, seen from the comfort of the rear bench.' },
            { name: 'Trocadéro', text: 'Arrive a few minutes before the hour to watch the Eiffel Tower sparkle.' },
            { name: 'The quays of the Seine', text: 'The bridges and the illuminated façades reflected in the river.' },
            { name: 'Place de la Concorde', text: 'The fountains and the obelisk under the lamps.' },
            { name: 'The Louvre', text: 'The glass pyramid lit up in the Cour Napoléon.' },
            { name: 'Place Vendôme and the Opéra Garnier', text: 'The column, the jewellers’ windows, then the gilded façade of the opera house.' },
          ],
        },
        {
          h2: 'Before or after dinner',
          p: [
            'An evening drive fits easily around a dinner: the chauffeur can pick you up at your hotel, take you on the route and drop you at your restaurant, or come back for you after the meal.',
            'The time of nightfall changes with the seasons: in winter the illuminations start early in the evening, in summer much later. We plan the timing with you.',
          ],
        },
      ],
      faq: [
        {
          q: 'When does the Eiffel Tower sparkle?',
          a: 'After nightfall, the tower sparkles for five minutes at the start of every hour. The exact times are published by the Eiffel Tower’s official website.',
        },
        {
          q: 'How long is an evening drive?',
          a: 'From one hour, which is enough for the main illuminated monuments, to a whole evening with a dinner.',
        },
      ],
      cta: 'Enquire about an evening drive',
    },
    fr: {
      path: 'fr/guides/paris-la-nuit-en-voiture-ancienne/',
      title: 'Paris la nuit en voiture ancienne avec chauffeur',
      description:
        'Découvrez Paris la nuit à bord d’une voiture des années 1970 avec chauffeur : les monuments illuminés, les quais de Seine et le scintillement de la tour Eiffel.',
      h1: 'Paris la nuit en voiture de collection',
      nav: 'Paris la nuit',
      lead: 'À la nuit tombée, Paris illumine ses monuments, ses ponts et ses quais. Époque Motors propose des balades du soir en voiture des années 1970 avec chauffeur : les Champs-Élysées, la Seine, le Louvre et la tour Eiffel, qui scintille cinq minutes au début de chaque heure après la tombée de la nuit.',
      sections: [
        {
          h2: 'Un parcours du soir',
          stops: [
            { name: 'Les Champs-Élysées et l’Arc de Triomphe', text: 'L’avenue illuminée de bout en bout, depuis le confort de la banquette arrière.' },
            { name: 'Trocadéro', text: 'Arrivez quelques minutes avant l’heure pour voir la tour Eiffel scintiller.' },
            { name: 'Les quais de Seine', text: 'Les ponts et les façades illuminées qui se reflètent dans le fleuve.' },
            { name: 'Place de la Concorde', text: 'Les fontaines et l’obélisque sous les lampadaires.' },
            { name: 'Le Louvre', text: 'La pyramide de verre éclairée dans la cour Napoléon.' },
            { name: 'Place Vendôme et opéra Garnier', text: 'La colonne, les vitrines des joailliers, puis la façade dorée de l’opéra.' },
          ],
        },
        {
          h2: 'Avant ou après le dîner',
          p: [
            'Une balade du soir s’organise facilement autour d’un dîner : le chauffeur peut venir vous chercher à votre hôtel, vous faire faire le parcours et vous déposer au restaurant, ou revenir vous chercher après le repas.',
            'L’heure de la tombée de la nuit change avec les saisons : en hiver, les illuminations commencent tôt dans la soirée, en été bien plus tard. Nous prévoyons les horaires avec vous.',
          ],
        },
      ],
      faq: [
        {
          q: 'À quelle heure la tour Eiffel scintille-t-elle ?',
          a: 'Après la tombée de la nuit, la tour scintille cinq minutes au début de chaque heure. Les horaires exacts sont publiés sur le site officiel de la tour Eiffel.',
        },
        {
          q: 'Combien de temps dure une balade du soir ?',
          a: 'À partir d’une heure, qui suffit pour les principaux monuments illuminés, jusqu’à une soirée entière avec un dîner.',
        },
      ],
      cta: 'Demander une balade du soir',
    },
  },
  {
    id: 'guide-romantic',
    kind: 'guide',
    parent: 'guides',
    experience: 'private-tours',
    cars: ['citroen-ds', 'mercedes-benz-classic'],
    image: sectionImages.about,
    related: ['proposal', 'guide-night', 'tours', 'wedding'],
    updated: '2026-11-09',
    en: {
      path: 'guides/romantic-paris-by-vintage-car/',
      title: 'Romantic Paris by Vintage Car: a Route for Two',
      description:
        'A romantic route through Paris in a vintage car with chauffeur: the islands, Pont des Arts, Place Dauphine, Saint-Germain and Montmartre. For couples.',
      h1: 'Romantic Paris by vintage car',
      nav: 'Romantic Paris',
      lead: 'This route for two follows the quieter side of Paris: the Île Saint-Louis, the Île de la Cité and Place Dauphine, the Pont des Arts, Saint-Germain-des-Prés and Montmartre. Époque Motors drives it in a 1970s classic car with chauffeur, for an anniversary, a honeymoon or a marriage proposal.',
      sections: [
        {
          h2: 'The route',
          stops: [
            { name: 'Île Saint-Louis', text: 'Narrow streets, stone mansions and quays shaded by poplars.' },
            { name: 'Quai d’Orléans', text: 'A view over the apse of Notre-Dame and the Seine.' },
            { name: 'Place Dauphine', text: 'A triangular square at the tip of the Île de la Cité, next to the Pont Neuf, completed in 1607.' },
            { name: 'Pont des Arts', text: 'The footbridge between the Louvre and the Institut de France: a short walk while the car waits.' },
            { name: 'Saint-Germain-des-Prés', text: 'Its church, its literary cafés and its bookshops.' },
            { name: 'Montmartre', text: 'The streets below the Sacré-Cœur and the view over the rooftops of Paris.' },
          ],
        },
        {
          h2: 'Making it your own',
          p: [
            'The route can end at a restaurant, at your hotel or at the place you have chosen for a proposal. Tell us the occasion in your enquiry: we adapt the stops and the timing with you.',
          ],
        },
      ],
      faq: [
        {
          q: 'Is this route suitable for a marriage proposal?',
          a: 'Yes. Place Dauphine, the Quai d’Orléans and Montmartre are quiet places for the question. See our page on marriage proposals in a vintage car.',
        },
      ],
      cta: 'Enquire about a romantic drive',
    },
    fr: {
      path: 'fr/guides/paris-romantique-en-voiture-ancienne/',
      title: 'Paris romantique en voiture ancienne : un parcours à deux',
      description:
        'Un parcours romantique dans Paris en voiture de collection avec chauffeur : les îles, le pont des Arts, la place Dauphine, Saint-Germain et Montmartre.',
      h1: 'Paris romantique en voiture de collection',
      nav: 'Paris romantique',
      lead: 'Ce parcours à deux suit le Paris plus secret : l’île Saint-Louis, l’île de la Cité et la place Dauphine, le pont des Arts, Saint-Germain-des-Prés et Montmartre. Époque Motors le propose en voiture des années 1970 avec chauffeur, pour un anniversaire, un voyage de noces ou une demande en mariage.',
      sections: [
        {
          h2: 'Le parcours',
          stops: [
            { name: 'Île Saint-Louis', text: 'Des rues étroites, des hôtels particuliers et des quais ombragés de peupliers.' },
            { name: 'Quai d’Orléans', text: 'Une vue sur le chevet de Notre-Dame et sur la Seine.' },
            { name: 'Place Dauphine', text: 'Une place triangulaire à la pointe de l’île de la Cité, à côté du Pont-Neuf, achevé en 1607.' },
            { name: 'Pont des Arts', text: 'La passerelle entre le Louvre et l’Institut de France : quelques pas à pied pendant que la voiture attend.' },
            { name: 'Saint-Germain-des-Prés', text: 'Son église, ses cafés littéraires et ses librairies.' },
            { name: 'Montmartre', text: 'Les rues au pied du Sacré-Cœur et la vue sur les toits de Paris.' },
          ],
        },
        {
          h2: 'Un parcours à votre image',
          p: [
            'Le parcours peut se terminer au restaurant, à votre hôtel ou à l’endroit choisi pour une demande en mariage. Précisez l’occasion dans votre demande : nous adaptons avec vous les arrêts et les horaires.',
          ],
        },
      ],
      faq: [
        {
          q: 'Ce parcours convient-il à une demande en mariage ?',
          a: 'Oui. La place Dauphine, le quai d’Orléans et Montmartre sont des lieux calmes pour poser la question. Voir notre page sur la demande en mariage en voiture de collection.',
        },
      ],
      cta: 'Demander une balade romantique',
    },
  },
  {
    id: 'guide-versailles',
    kind: 'guide',
    parent: 'guides',
    experience: 'private-tours',
    cars: ['mercedes-benz-classic', 'citroen-ds', 'peugeot-504'],
    image: img('events'),
    related: ['tours', 'guide-landmarks', 'chauffeur', 'rental'],
    updated: '2026-11-09',
    en: {
      path: 'guides/versailles-by-vintage-car/',
      title: 'Versailles from Paris by Vintage Car, with Chauffeur',
      description:
        'A day trip from Paris to Versailles in a 1970s classic car with chauffeur: the drive, the château and its gardens, and tips to plan your visit.',
      h1: 'From Paris to Versailles by vintage car',
      nav: 'Versailles',
      lead: 'The Palace of Versailles lies about 20 km south-west of central Paris. Époque Motors offers the trip in a 1970s classic car with chauffeur: pick-up in Paris, the drive out through the west of the city, then the château and its gardens at your pace, as a half-day or a full-day experience.',
      sections: [
        {
          h2: 'The day',
          stops: [
            { name: 'Departure from Paris', text: 'Pick-up at your hotel or at the address agreed with you.' },
            { name: 'The drive west', text: 'Out of Paris along the Seine, then through the wooded hills to the west of the city.' },
            { name: 'Arrival at the château', text: 'The car drops you near the entrance of the palace, transformed under Louis XIV.' },
            { name: 'The gardens', text: 'Designed by André Le Nôtre, with their fountains, the Grand Canal and the Trianon estate.' },
            { name: 'Return to Paris', text: 'At the agreed time, the car brings you back to your hotel or to a restaurant.' },
          ],
        },
        {
          h2: 'Planning your visit',
          p: [
            'Tickets for the palace are booked on the official website of the Château de Versailles, which also publishes the opening days and hours: the palace is closed on Mondays.',
            'A half-day leaves time for the palace or the gardens; a full day lets you see both, with lunch on the estate or in the town.',
          ],
        },
      ],
      faq: [
        {
          q: 'How far is Versailles from Paris?',
          a: 'About 20 km south-west of central Paris. The drive time depends on traffic.',
        },
        {
          q: 'Does the chauffeur wait during the visit?',
          a: 'The organisation of the day, including the waiting time, is agreed with you and set out in our proposal.',
        },
      ],
      cta: 'Enquire about a day in Versailles',
    },
    fr: {
      path: 'fr/guides/versailles-en-voiture-ancienne/',
      title: 'Versailles depuis Paris en voiture ancienne avec chauffeur',
      description:
        'Une journée de Paris à Versailles en voiture des années 1970 avec chauffeur : le trajet, le château et ses jardins, et nos conseils pour organiser la visite.',
      h1: 'De Paris à Versailles en voiture de collection',
      nav: 'Versailles',
      lead: 'Le château de Versailles se trouve à une vingtaine de kilomètres au sud-ouest du centre de Paris. Époque Motors propose le trajet en voiture des années 1970 avec chauffeur : départ de Paris, route par l’ouest de la ville, puis le château et ses jardins à votre rythme, en demi-journée ou en journée.',
      sections: [
        {
          h2: 'La journée',
          stops: [
            { name: 'Départ de Paris', text: 'Prise en charge à votre hôtel ou à l’adresse convenue avec vous.' },
            { name: 'La route vers l’ouest', text: 'La sortie de Paris le long de la Seine, puis les collines boisées de l’ouest parisien.' },
            { name: 'Arrivée au château', text: 'La voiture vous dépose près de l’entrée du palais, transformé sous Louis XIV.' },
            { name: 'Les jardins', text: 'Dessinés par André Le Nôtre, avec leurs bassins, le Grand Canal et le domaine de Trianon.' },
            { name: 'Retour à Paris', text: 'À l’heure convenue, la voiture vous ramène à votre hôtel ou au restaurant.' },
          ],
        },
        {
          h2: 'Organiser la visite',
          p: [
            'Les billets du château se réservent sur le site officiel du château de Versailles, qui publie aussi les jours et horaires d’ouverture : le château est fermé le lundi.',
            'Une demi-journée laisse le temps du château ou des jardins ; une journée entière permet de voir les deux, avec un déjeuner sur le domaine ou en ville.',
          ],
        },
      ],
      faq: [
        {
          q: 'À quelle distance de Paris se trouve Versailles ?',
          a: 'À une vingtaine de kilomètres au sud-ouest du centre de Paris. La durée du trajet dépend de la circulation.',
        },
        {
          q: 'Le chauffeur attend-il pendant la visite ?',
          a: 'L’organisation de la journée, temps d’attente compris, est convenue avec vous et précisée dans notre proposition.',
        },
      ],
      cta: 'Demander une journée à Versailles',
    },
  },
  {
    id: 'guide-things-to-do',
    kind: 'guide',
    parent: 'guides',
    experience: 'private-tours',
    image: photo('citroen-ds', 3),
    related: ['tours', 'guide-landmarks', 'guide-romantic', 'rental'],
    updated: '2026-11-09',
    en: {
      path: 'guides/unusual-things-to-do-in-paris/',
      title: 'Unusual Things to Do in Paris: 10 Original Ideas',
      description:
        'Ten original things to do in Paris beyond the classic visits: a vintage car tour, covered passages, the fairground museum, Canal Saint-Martin and more.',
      h1: 'Unusual things to do in Paris: 10 original ideas',
      nav: 'Unusual things to do in Paris',
      lead: 'Beyond the Eiffel Tower and the Louvre, Paris has many ways to spend a memorable hour or day. Here are ten original ideas, from a private tour in a 1970s classic car with Époque Motors to the covered passages, the fairground museum and the Montmartre vineyard.',
      sections: [
        {
          h2: 'Ten ideas',
          stops: [
            { name: 'Tour Paris in a vintage car', text: 'A private tour with chauffeur aboard a Citroën DS 21, a Peugeot 504 or a Mercedes W115 from the early 1970s, from one hour to a full day, with Époque Motors.' },
            { name: 'Walk the covered passages', text: 'Galerie Vivienne and Passage Jouffroy: glass-roofed arcades from the 19th century, with bookshops, toy shops and tea rooms.' },
            { name: 'Visit the Musée des Arts Forains', text: 'Antique merry-go-rounds and fairground attractions in the former wine warehouses of Bercy. Visits are on reservation.' },
            { name: 'Stroll along the Canal Saint-Martin', text: 'Iron footbridges, locks and plane trees in the 10th arrondissement.' },
            { name: 'Walk the Coulée verte René-Dumont', text: 'A planted promenade on a former railway viaduct, from the Bastille towards the Bois de Vincennes.' },
            { name: 'Have tea at the Musée de la Vie romantique', text: 'A house and garden at the foot of Montmartre, dedicated to the Romantic era.' },
            { name: 'Find the Montmartre vineyard', text: 'The Clos Montmartre, a vineyard in the middle of the city, celebrated each October at the harvest festival.' },
            { name: 'Hunt for treasures at the Saint-Ouen flea market', text: 'Antique dealers and second-hand stalls just north of Paris, open at the weekend.' },
            { name: 'See the Arènes de Lutèce', text: 'The remains of a Roman amphitheatre, hidden in the Latin Quarter.' },
            { name: 'Cruise the Seine at sunset', text: 'A boat trip under the bridges as the monuments light up.' },
          ],
        },
        {
          h2: 'Planning tips',
          p: [
            'Opening days and hours change during the year: check the official website of each place before you go.',
            'Several of these ideas can be combined with a tour in a vintage car: the chauffeur can drop you at the Canal Saint-Martin, the covered passages or Montmartre, and pick you up later.',
          ],
        },
      ],
      faq: [
        {
          q: 'What is an original activity to do as a couple in Paris?',
          a: 'A private drive through Paris in a vintage car with chauffeur, ending at a restaurant or at the Trocadéro when the Eiffel Tower sparkles, is a memorable idea for two.',
        },
        {
          q: 'What can I do in Paris in one hour?',
          a: 'A one-hour vintage car tour covers the central landmarks: Concorde, Champs-Élysées, Arc de Triomphe, Trocadéro, the Eiffel Tower and the Louvre.',
        },
      ],
      cta: 'Enquire about a vintage car tour',
    },
    fr: {
      path: 'fr/guides/activites-insolites-a-paris/',
      title: 'Activités insolites à Paris : 10 idées originales',
      description:
        'Dix activités originales à Paris, loin des visites classiques : balade en voiture de collection, passages couverts, musée des Arts forains, canal Saint-Martin.',
      h1: 'Activités insolites à Paris : 10 idées originales',
      nav: 'Activités insolites à Paris',
      lead: 'Au-delà de la tour Eiffel et du Louvre, Paris offre bien des façons de vivre une heure ou une journée mémorable. Voici dix idées originales, d’une visite privée en voiture de collection des années 1970 avec Époque Motors aux passages couverts, au musée des Arts forains et à la vigne de Montmartre.',
      sections: [
        {
          h2: 'Dix idées',
          stops: [
            { name: 'Visiter Paris en voiture de collection', text: 'Une visite privée avec chauffeur à bord d’une Citroën DS 21, d’une Peugeot 504 ou d’une Mercedes W115 du début des années 1970, d’une heure à une journée, avec Époque Motors.' },
            { name: 'Flâner dans les passages couverts', text: 'Galerie Vivienne et passage Jouffroy : des galeries vitrées du XIXe siècle, avec librairies, boutiques de jouets et salons de thé.' },
            { name: 'Découvrir le musée des Arts forains', text: 'Manèges anciens et attractions foraines dans les anciens chais de Bercy. Visites sur réservation.' },
            { name: 'Se promener le long du canal Saint-Martin', text: 'Passerelles métalliques, écluses et platanes dans le 10e arrondissement.' },
            { name: 'Marcher sur la Coulée verte René-Dumont', text: 'Une promenade plantée sur un ancien viaduc ferroviaire, de la Bastille vers le bois de Vincennes.' },
            { name: 'Prendre le thé au musée de la Vie romantique', text: 'Une maison et son jardin au pied de Montmartre, consacrés à l’époque romantique.' },
            { name: 'Trouver la vigne de Montmartre', text: 'Le Clos Montmartre, une vigne en pleine ville, fêtée chaque mois d’octobre lors de la fête des Vendanges.' },
            { name: 'Chiner aux puces de Saint-Ouen', text: 'Antiquaires et brocanteurs juste au nord de Paris, ouverts le week-end.' },
            { name: 'Voir les arènes de Lutèce', text: 'Les vestiges d’un amphithéâtre romain, cachés dans le Quartier latin.' },
            { name: 'Naviguer sur la Seine au coucher du soleil', text: 'Une promenade en bateau sous les ponts, au moment où les monuments s’illuminent.' },
          ],
        },
        {
          h2: 'Conseils pratiques',
          p: [
            'Les jours et horaires d’ouverture changent au fil de l’année : consultez le site officiel de chaque lieu avant de vous y rendre.',
            'Plusieurs de ces idées se combinent avec une balade en voiture d’époque : le chauffeur peut vous déposer au canal Saint-Martin, dans les passages couverts ou à Montmartre, et revenir vous chercher.',
          ],
        },
      ],
      faq: [
        {
          q: 'Quelle activité originale faire en couple à Paris ?',
          a: 'Une balade privée dans Paris en voiture de collection avec chauffeur, qui se termine au restaurant ou au Trocadéro quand la tour Eiffel scintille, est une idée mémorable à deux.',
        },
        {
          q: 'Que faire à Paris en une heure ?',
          a: 'Une visite d’une heure en voiture de collection permet de voir les monuments du centre : Concorde, Champs-Élysées, Arc de Triomphe, Trocadéro, tour Eiffel et Louvre.',
        },
      ],
      cta: 'Demander une visite en voiture de collection',
    },
  },
  {
    id: 'guide-wedding-car',
    kind: 'guide',
    parent: 'guides',
    experience: 'events',
    cars: ['mercedes-benz-classic', 'citroen-ds', 'peugeot-504'],
    image: photo('mercedes-benz-classic', 4),
    related: ['wedding', 'photoshoot', 'events', 'car-w115'],
    updated: '2026-11-09',
    en: {
      path: 'guides/how-to-choose-a-vintage-wedding-car/',
      title: 'How to Choose a Vintage Wedding Car: 7 Questions to Ask',
      description:
        'Choosing a vintage wedding car in Paris: style and colour, chauffeur or not, timing, route, comfort for the dress, photos and booking. A practical checklist.',
      h1: 'How to choose a vintage wedding car',
      nav: 'Choosing a wedding car',
      lead: 'To choose a vintage wedding car, look at seven points: the style and colour that match your wedding, the chauffeur, the timing of the day, the route between your addresses, the comfort for the dress, the photographs and the booking conditions. This checklist is written by Époque Motors, which provides 1970s wedding cars in Paris.',
      sections: [
        {
          h2: 'Seven questions to ask',
          stops: [
            { name: 'Which style and colour?', text: 'An ivory car (such as our Mercedes W115 220D) suits a classic wedding; a dark car (our anthracite DS 21) looks graphic in photographs; a colourful car (our blue Peugeot 504) brings a relaxed note.' },
            { name: 'With or without a chauffeur?', text: 'On the wedding day, a chauffeur handles the driving, the parking and the waiting: you stay free for your guests.' },
            { name: 'For which moments of the day?', text: 'Departure from home or the hotel, the town hall, the religious ceremony, the photos, the arrival at the reception: list the moments to set the duration.' },
            { name: 'Which route?', text: 'Give the exact addresses: the distance and the access to each place set the timing.' },
            { name: 'Is it comfortable for the dress?', text: 'A four-door saloon with a wide rear bench makes it easier to get in and out.' },
            { name: 'What about the photographs?', text: 'Plan a slot for couple photos with the car, and share the timing with your photographer.' },
            { name: 'How and when to book?', text: 'Ask for a written proposal stating the duration, the rate and the conditions before committing.' },
          ],
        },
        {
          h2: 'With Époque Motors',
          p: [
            'Our three cars are closed saloons from the early 1970s, available with a chauffeur in Paris and its surroundings. Send us your date and your addresses: we reply personally with a proposal before any commitment.',
          ],
        },
      ],
      faq: [
        {
          q: 'How long should I book a wedding car for?',
          a: 'It depends on the moments you want the car for. Our experiences last from one hour to a full day.',
        },
        {
          q: 'What if it rains on the wedding day?',
          a: 'Our three cars are saloons with a fixed roof, so the bride and groom stay dry.',
        },
      ],
      cta: 'Enquire about your wedding car',
    },
    fr: {
      path: 'fr/guides/choisir-sa-voiture-de-mariage-ancienne/',
      title: 'Choisir sa voiture de mariage ancienne : 7 questions à se poser',
      description:
        'Bien choisir sa voiture de mariage ancienne à Paris : style et couleur, chauffeur, horaires, trajet, confort pour la robe, photos et réservation. La check-list.',
      h1: 'Choisir sa voiture de mariage ancienne',
      nav: 'Choisir sa voiture de mariage',
      lead: 'Pour choisir une voiture de mariage ancienne, regardez sept points : le style et la couleur assortis à votre mariage, le chauffeur, les horaires de la journée, le trajet entre vos adresses, le confort pour la robe, les photos et les conditions de réservation. Cette check-list est rédigée par Époque Motors, qui propose des voitures de mariage des années 1970 à Paris.',
      sections: [
        {
          h2: 'Sept questions à se poser',
          stops: [
            { name: 'Quel style et quelle couleur ?', text: 'Une voiture ivoire (comme notre Mercedes W115 220D) convient à un mariage classique ; une voiture sombre (notre DS 21 anthracite) est très graphique en photo ; une voiture colorée (notre Peugeot 504 bleue) apporte une note décontractée.' },
            { name: 'Avec ou sans chauffeur ?', text: 'Le jour du mariage, un chauffeur s’occupe de la conduite, du stationnement et de l’attente : vous restez disponibles pour vos invités.' },
            { name: 'Pour quels moments de la journée ?', text: 'Départ du domicile ou de l’hôtel, mairie, cérémonie religieuse, photos, arrivée à la réception : listez les moments pour fixer la durée.' },
            { name: 'Quel trajet ?', text: 'Donnez les adresses exactes : la distance et l’accès à chaque lieu déterminent les horaires.' },
            { name: 'Est-ce confortable pour la robe ?', text: 'Une berline à quatre portes avec une large banquette arrière facilite la montée et la descente.' },
            { name: 'Et les photos ?', text: 'Prévoyez un créneau pour les photos de couple avec la voiture, et communiquez les horaires à votre photographe.' },
            { name: 'Comment et quand réserver ?', text: 'Demandez une proposition écrite qui précise la durée, le tarif et les conditions avant de vous engager.' },
          ],
        },
        {
          h2: 'Avec Époque Motors',
          p: [
            'Nos trois voitures sont des berlines fermées du début des années 1970, proposées avec chauffeur à Paris et dans ses environs. Envoyez-nous votre date et vos adresses : nous vous répondons personnellement avec une proposition, avant tout engagement.',
          ],
        },
      ],
      faq: [
        {
          q: 'Pour combien de temps réserver une voiture de mariage ?',
          a: 'Cela dépend des moments où vous souhaitez la voiture. Nos expériences durent d’une heure à une journée entière.',
        },
        {
          q: 'Et s’il pleut le jour du mariage ?',
          a: 'Nos trois voitures sont des berlines à toit fixe : les mariés restent au sec.',
        },
      ],
      cta: 'Parler de votre voiture de mariage',
    },
  },
];

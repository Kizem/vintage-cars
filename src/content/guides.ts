import { sectionImages } from '../data/site';
import { getVehicle } from '../data/vehicles';
import type { Page } from './types';

const photo = (slug: string, n = 0) => {
  const v = getVehicle(slug)!;
  return [v.image, ...(v.gallery ?? [])][n];
};

/**
 * The guides page and the articles: content that answers broader searches (« what to do in Paris »,
 * « choosing a wedding car ») and links to the offers. Facts about Paris are limited to well-known,
 * stable ones; opening hours and rules change, so the pages send readers to official sources for them.
 */
export const guidePages: Page[] = [
  {
    id: 'guides',
    kind: 'hub',
    experience: 'private-tours',
    image: sectionImages.practical,
    related: ['tours', 'chauffeur', 'collection', 'faq'],
    updated: '2026-11-09',
    en: {
      path: 'guides/',
      title: 'Paris Guides: 5 Vintage Car Routes | Époque Motors',
      description:
        'Five routes to discover Paris differently by vintage car: monuments, the Left Bank, the villages of the east, gardens and perspectives, the Canal Saint-Martin.',
      h1: 'Paris, differently.',
      nav: 'Paris Guides',
      subtitle:
        'Five routes to discover the capital at the pace of a classic car. From the great avenues to the most discreet neighbourhoods, take the time to rediscover Paris.',
      lead: 'Les Guides de Paris by Époque Motors are five routes through Paris, from 1 hr 30 to 3 hrs 30, to discover the city in a classic car from the early 1970s: its monuments, its historic districts, its hidden villages, its views and its addresses. Each route can be booked as a private tour with chauffeur.',
      sections: [
        {
          h2: 'Beyond the usual tours',
          p: [
            'These guides take the time to look at Paris: the architecture of an avenue, the atmosphere of a neighbourhood, the light on the Seine. They go from the great monumental perspectives to the streets where Parisians live, places that coaches do not reach.',
            'Each route is a starting point. The order of the stops, the length and the breaks are adapted to your time, to the traffic of the day and to your wishes.',
          ],
        },
      ],
      cta: 'Enquire about a private tour',
    },
    fr: {
      path: 'fr/guides/',
      title: 'Les Guides de Paris : 5 balades en voiture de collection',
      description:
        'Cinq itinéraires pour découvrir Paris autrement en voiture de collection : monuments, rive gauche, villages de l’Est, jardins et perspectives, canal Saint-Martin.',
      h1: 'Paris, autrement.',
      nav: 'Les Guides de Paris',
      subtitle:
        'Cinq itinéraires pour découvrir la capitale au rythme d’une voiture de collection. Des grandes avenues aux quartiers les plus confidentiels, prenez le temps de redécouvrir Paris.',
      lead: 'Les Guides de Paris d’Époque Motors réunissent cinq itinéraires dans Paris, de 1 h 30 à 3 h 30, pour découvrir la ville à bord d’une voiture de collection du début des années 1970 : ses monuments, ses quartiers historiques, ses villages confidentiels, ses perspectives et ses adresses. Chaque itinéraire se réserve en visite privée avec chauffeur.',
      sections: [
        {
          h2: 'Au-delà des circuits habituels',
          p: [
            'Ces guides prennent le temps de regarder Paris : l’architecture d’une avenue, l’atmosphère d’un quartier, la lumière sur la Seine. Ils vont des grandes perspectives monumentales aux rues où vivent les Parisiens, là où les cars de tourisme ne passent pas.',
            'Chaque itinéraire est un point de départ. L’ordre des étapes, la durée et les pauses s’adaptent à votre temps, à la circulation du jour et à vos envies.',
          ],
        },
      ],
      cta: 'Demander une visite privée',
    },
  },
  {
    id: 'guide-things-to-do',
    kind: 'guide',
    parent: 'guides',
    experience: 'private-tours',
    image: photo('citroen-ds', 3),
    related: ['guides', 'tours', 'rental', 'events'],
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
          a: 'A private tour in a vintage car can last from one hour. Our Timeless Paris route, from the Concorde to the Champ-de-Mars by Pont Alexandre III, takes about 1 hr 30.',
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
          a: 'Une visite privée en voiture de collection peut durer une heure. Notre itinéraire Paris intemporel, de la Concorde au Champ-de-Mars par le pont Alexandre III, dure environ 1 h 30.',
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

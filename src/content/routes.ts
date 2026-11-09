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
 * « Les Guides de Paris » : the five itineraries written by the owner (brief of November 2026). Durations,
 * distances, stops, photo spots and places to eat come from the brief; nothing is added. The images are
 * those of the site until a photograph per route is supplied (see docs/SEO-GEO.md).
 * Coordinates (geo) place each stop on the map; the route between two stops is not drawn, because it
 * depends on traffic and restrictions on the day.
 */

export const routePages: Page[] = [
  {
    id: 'route-intemporel',
    kind: 'route',
    parent: 'guides',
    experience: 'private-tours',
    cars: ['citroen-ds', 'mercedes-benz-classic', 'peugeot-504'],
    image: img('private-tours'),
    related: ['route-jardins', 'route-rive-gauche', 'tours', 'chauffeur'],
    updated: '2026-11-09',
    geo: [
      [48.8656, 2.3212],
      [48.8638, 2.3135],
      [48.8604, 2.2868],
      [48.8556, 2.2986],
    ],
    en: {
      path: 'guides/timeless-paris/',
      title: 'Timeless Paris: a Vintage Car Route | Époque Motors',
      description:
        'A first discovery of Paris by vintage car: Place de la Concorde, Pont Alexandre III, Avenue de Camoëns and the Champ-de-Mars. About 1 hr 30, 7 to 9 km.',
      h1: 'Timeless Paris: from the Concorde to the Champ-de-Mars',
      nav: 'Timeless Paris',
      lead: 'Timeless Paris is a route of about 1 hr 30 to 1 hr 45 and 7 to 9 km, from Place de la Concorde to the Champ-de-Mars, by way of Pont Alexandre III and Avenue de Camoëns. Époque Motors drives it in a classic car from the early 1970s, with a chauffeur, in English or in French.',
      sections: [],
      route: {
        n: 1,
        name: 'Timeless Paris',
        mood: 'A first discovery of Paris',
        duration: '1 hr 30 to 1 hr 45',
        distance: '7 to 9 km (4.5 to 5.5 miles)',
        start: 'Place de la Concorde',
        end: 'Champ-de-Mars',
        intro:
          'A first encounter with Paris through some of its finest perspectives. From the grandeur of Place de la Concorde to the details of Pont Alexandre III, this route crosses a monumental, elegant and timeless Paris.',
        teaser: 'The great perspectives of monumental Paris, from the Concorde to the foot of the Eiffel Tower.',
        course: [
          'The route links four of the great views of western Paris. It starts on the vast square between the Tuileries and the Champs-Élysées, crosses the Seine by the ornate Pont Alexandre III, then climbs towards Passy to find the Eiffel Tower framed between two rows of buildings, before ending at its foot.',
          'It suits a first stay in Paris, or a short first experience: the distances are short and the views follow one another.',
        ],
        stops: [
          { name: 'Place de la Concorde', text: 'The departure, around the Luxor obelisk and its fountains, with the perspective of the Champs-Élysées on one side and the Tuileries on the other.' },
          { name: 'Pont Alexandre III', text: 'The bridge built for the Universal Exhibition of 1900: gilded statues, lamps and the view of the Invalides and the Grand Palais.' },
          { name: 'Avenue de Camoëns', text: 'A short, quiet avenue of the 16th arrondissement, ending at a balustrade that frames the Eiffel Tower.' },
          { name: 'Champ-de-Mars', text: 'The arrival, on the gardens at the foot of the Eiffel Tower.' },
        ],
        photo: [
          { name: 'Pont Alexandre III', text: 'The statues and lamps of the bridge, with the car on the roadway or along the quay, early in the morning for quieter light.' },
          { name: 'Avenue de Camoëns', text: 'The Eiffel Tower framed at the end of the avenue, seen from the balustrade on foot.' },
        ],
        food: [
          { name: 'The Invalides district', text: 'Cafés and restaurants around the Esplanade des Invalides.' },
          { name: 'Rue Saint-Dominique', text: 'A neighbourhood street lined with shops and bistros, between the Invalides and the Champ-de-Mars.' },
        ],
        tips: [
          'Early morning offers quieter streets and soft light on the stone.',
          'The view at Avenue de Camoëns is enjoyed on foot, from the balustrade, while the car waits where stopping is permitted.',
        ],
      },
      cta: 'Enquire about this route',
    },
    fr: {
      path: 'fr/guides/paris-intemporel/',
      title: 'Paris intemporel : itinéraire en voiture de collection',
      description:
        'Une première découverte de Paris en voiture ancienne : place de la Concorde, pont Alexandre III, avenue de Camoëns, Champ-de-Mars. Environ 1 h 30, 7 à 9 km.',
      h1: 'Paris intemporel : de la Concorde au Champ-de-Mars',
      nav: 'Paris intemporel',
      lead: 'Paris intemporel est un itinéraire d’environ 1 h 30 à 1 h 45 et de 7 à 9 km, de la place de la Concorde au Champ-de-Mars, en passant par le pont Alexandre III et l’avenue de Camoëns. Époque Motors le propose à bord d’une voiture de collection du début des années 1970, avec chauffeur, en français ou en anglais.',
      sections: [],
      route: {
        n: 1,
        name: 'Paris intemporel',
        mood: 'Une première découverte de Paris',
        duration: '1 h 30 à 1 h 45',
        distance: '7 à 9 km',
        start: 'Place de la Concorde',
        end: 'Champ-de-Mars',
        intro:
          'Une première rencontre avec Paris à travers quelques-unes de ses plus belles perspectives. De la majesté de la place de la Concorde aux détails du pont Alexandre III, cet itinéraire traverse un Paris monumental, élégant et intemporel.',
        teaser: 'Les grandes perspectives du Paris monumental, de la Concorde au pied de la tour Eiffel.',
        course: [
          'L’itinéraire relie quatre grandes vues de l’ouest parisien. Il part de la vaste place qui sépare les Tuileries des Champs-Élysées, franchit la Seine par le pont Alexandre III et ses ornements, puis monte vers Passy pour découvrir la tour Eiffel encadrée entre deux rangées d’immeubles, avant de finir à son pied.',
          'Il convient à un premier séjour à Paris, ou à une première expérience courte : les distances sont brèves et les points de vue s’enchaînent.',
        ],
        stops: [
          { name: 'Place de la Concorde', text: 'Le départ, autour de l’obélisque de Louxor et de ses fontaines, avec la perspective des Champs-Élysées d’un côté et les Tuileries de l’autre.' },
          { name: 'Pont Alexandre III', text: 'Le pont construit pour l’Exposition universelle de 1900 : statues dorées, lampadaires et vue sur les Invalides et le Grand Palais.' },
          { name: 'Avenue de Camoëns', text: 'Une courte avenue tranquille du 16e arrondissement, qui se termine sur une balustrade encadrant la tour Eiffel.' },
          { name: 'Champ-de-Mars', text: 'L’arrivée, sur les jardins au pied de la tour Eiffel.' },
        ],
        photo: [
          { name: 'Pont Alexandre III', text: 'Les statues et les lampadaires du pont, la voiture sur la chaussée ou le long du quai, tôt le matin pour une lumière plus calme.' },
          { name: 'Avenue de Camoëns', text: 'La tour Eiffel encadrée au bout de l’avenue, vue à pied depuis la balustrade.' },
        ],
        food: [
          { name: 'Le quartier des Invalides', text: 'Cafés et restaurants autour de l’esplanade des Invalides.' },
          { name: 'Rue Saint-Dominique', text: 'Une rue commerçante de quartier, bordée de boutiques et de bistrots, entre les Invalides et le Champ-de-Mars.' },
        ],
        tips: [
          'Tôt le matin, les rues sont plus calmes et la lumière douce sur la pierre.',
          'La vue de l’avenue de Camoëns se découvre à pied, depuis la balustrade, pendant que la voiture attend là où l’arrêt est autorisé.',
        ],
      },
      cta: 'Demander cet itinéraire',
    },
  },
  {
    id: 'route-rive-gauche',
    kind: 'route',
    parent: 'guides',
    experience: 'private-tours',
    cars: ['peugeot-504', 'citroen-ds', 'mercedes-benz-classic'],
    image: sectionImages.about,
    related: ['route-intemporel', 'route-est', 'tours', 'guide-things-to-do'],
    updated: '2026-11-09',
    geo: [
      [48.8511, 2.3348],
      [48.8462, 2.346],
      [48.8452, 2.3527],
      [48.8273, 2.35],
      [48.8222, 2.338],
    ],
    en: {
      path: 'guides/left-bank-elegance/',
      title: 'Left Bank Elegance: a Vintage Car Route in Paris',
      description:
        'The Left Bank of Paris by vintage car: Saint-Sulpice, the Panthéon, the Arènes de Lutèce, the Butte-aux-Cailles and Parc Montsouris. About 2 hrs, 10 to 12 km.',
      h1: 'Left Bank elegance: from Saint-Sulpice to Parc Montsouris',
      nav: 'Left Bank Elegance',
      lead: 'Left Bank Elegance is a route of about 2 hrs to 2 hrs 15 and 10 to 12 km on the south bank of Paris, from Place Saint-Sulpice to Parc Montsouris, by way of the Panthéon, the Arènes de Lutèce and the Butte-aux-Cailles. Époque Motors drives it in a 1970s classic car with chauffeur.',
      sections: [],
      route: {
        n: 2,
        name: 'Left Bank Elegance',
        mood: 'History, culture and the Parisian art of living',
        duration: '2 hrs to 2 hrs 15',
        distance: '10 to 12 km (6 to 7.5 miles)',
        start: 'Place Saint-Sulpice',
        end: 'Parc Montsouris',
        intro:
          'A drive through the Paris of bookshops, historic squares and neighbourhoods with a village spirit. Here the Left Bank reveals another side of the capital, more intimate and residential.',
        teaser: 'Bookshops, historic squares and village streets on the quieter, residential side of the Seine.',
        course: [
          'From Saint-Germain to the south of the city, the route moves from the Latin Quarter’s monuments to neighbourhoods where Parisians live: the slopes of the Montagne Sainte-Geneviève, the hidden Roman arena, then the small streets of the Butte-aux-Cailles before the green spaces of Parc Montsouris.',
          'It suits those who already know the great landmarks and want to see a more everyday Paris.',
        ],
        stops: [
          { name: 'Place Saint-Sulpice', text: 'The departure, between the church of Saint-Sulpice and its fountain, in the heart of the Left Bank.' },
          { name: 'Panthéon', text: 'The neoclassical monument at the top of the Montagne Sainte-Geneviève, with its dome over the Latin Quarter.' },
          { name: 'Arènes de Lutèce', text: 'The remains of the Roman amphitheatre of Lutetia, tucked away behind the buildings of the 5th arrondissement.' },
          { name: 'Butte-aux-Cailles', text: 'A small hill of cobbled streets, low houses and street art, with the atmosphere of a village.' },
          { name: 'Parc Montsouris', text: 'The arrival, in a landscaped park with a lake, in the south of the city.' },
        ],
        photo: [
          { name: 'Butte-aux-Cailles', text: 'The car in the cobbled streets, among low façades and painted walls.' },
          { name: 'Parc Montsouris', text: 'The paths and the lake of the park, on foot.' },
        ],
        food: [
          { name: 'Chez Gladines', text: 'Rue des Cinq-Diamants, at the Butte-aux-Cailles.' },
          { name: 'Le Temps des Cerises', text: 'Rue de la Butte-aux-Cailles.' },
        ],
        tips: [
          'The streets of the Butte-aux-Cailles are narrow: the car drops you off and you explore them on foot.',
          'The Arènes de Lutèce and Parc Montsouris are seen on foot, during a short stop.',
        ],
      },
      cta: 'Enquire about this route',
    },
    fr: {
      path: 'fr/guides/elegance-rive-gauche/',
      title: 'L’élégance de la rive gauche en voiture de collection',
      description:
        'La rive gauche de Paris en voiture ancienne : Saint-Sulpice, Panthéon, arènes de Lutèce, Butte-aux-Cailles et parc Montsouris. Environ 2 h, 10 à 12 km.',
      h1: 'L’élégance de la rive gauche : de Saint-Sulpice au parc Montsouris',
      nav: 'L’élégance de la rive gauche',
      lead: 'L’élégance de la rive gauche est un itinéraire d’environ 2 h à 2 h 15 et de 10 à 12 km au sud de la Seine, de la place Saint-Sulpice au parc Montsouris, par le Panthéon, les arènes de Lutèce et la Butte-aux-Cailles. Époque Motors le propose en voiture de collection des années 1970 avec chauffeur.',
      sections: [],
      route: {
        n: 2,
        name: 'L’élégance de la rive gauche',
        mood: 'Histoire, culture et art de vivre',
        duration: '2 h à 2 h 15',
        distance: '10 à 12 km',
        start: 'Place Saint-Sulpice',
        end: 'Parc Montsouris',
        intro:
          'Une promenade à travers le Paris des librairies, des places historiques et des quartiers à l’esprit village. La rive gauche dévoile ici une autre facette de la capitale, plus intime et résidentielle.',
        teaser: 'Librairies, places historiques et rues à l’esprit village, sur la rive plus intime et résidentielle de la Seine.',
        course: [
          'De Saint-Germain au sud de la ville, l’itinéraire passe des monuments du Quartier latin aux quartiers où vivent les Parisiens : les pentes de la montagne Sainte-Geneviève, l’arène romaine cachée, puis les petites rues de la Butte-aux-Cailles avant les espaces verts du parc Montsouris.',
          'Il convient à ceux qui connaissent déjà les grands monuments et veulent voir un Paris plus quotidien.',
        ],
        stops: [
          { name: 'Place Saint-Sulpice', text: 'Le départ, entre l’église Saint-Sulpice et sa fontaine, au cœur de la rive gauche.' },
          { name: 'Panthéon', text: 'Le monument néoclassique au sommet de la montagne Sainte-Geneviève, et son dôme au-dessus du Quartier latin.' },
          { name: 'Arènes de Lutèce', text: 'Les vestiges de l’amphithéâtre romain de Lutèce, dissimulés derrière les immeubles du 5e arrondissement.' },
          { name: 'Butte-aux-Cailles', text: 'Une petite colline de rues pavées, de maisons basses et d’art urbain, à l’ambiance de village.' },
          { name: 'Parc Montsouris', text: 'L’arrivée, dans un parc paysager avec son lac, au sud de la ville.' },
        ],
        photo: [
          { name: 'Butte-aux-Cailles', text: 'La voiture dans les rues pavées, entre façades basses et murs peints.' },
          { name: 'Parc Montsouris', text: 'Les allées et le lac du parc, à pied.' },
        ],
        food: [
          { name: 'Chez Gladines', text: 'Rue des Cinq-Diamants, à la Butte-aux-Cailles.' },
          { name: 'Le Temps des Cerises', text: 'Rue de la Butte-aux-Cailles.' },
        ],
        tips: [
          'Les rues de la Butte-aux-Cailles sont étroites : la voiture vous dépose et vous les découvrez à pied.',
          'Les arènes de Lutèce et le parc Montsouris se visitent à pied, le temps d’un court arrêt.',
        ],
      },
      cta: 'Demander cet itinéraire',
    },
  },
  {
    id: 'route-est',
    kind: 'route',
    parent: 'guides',
    experience: 'private-tours',
    cars: ['peugeot-504', 'mercedes-benz-classic', 'citroen-ds'],
    image: photo('peugeot-504', 1),
    related: ['route-boheme', 'route-rive-gauche', 'tours', 'guide-things-to-do'],
    updated: '2026-11-09',
    geo: [
      [48.8532, 2.3691],
      [48.8616, 2.3934],
      [48.8716, 2.3848],
      [48.88, 2.3828],
    ],
    en: {
      path: 'guides/villages-of-east-paris/',
      title: 'The Villages of East Paris by Vintage Car | Époque Motors',
      description:
        'East Paris by vintage car: from the Bastille to Père-Lachaise, the Belleville lookout and the Buttes-Chaumont park. About 2 hrs 30, 11 to 14 km, with chauffeur.',
      h1: 'The villages of East Paris: from the Bastille to the Buttes-Chaumont',
      nav: 'The villages of East Paris',
      lead: 'The Villages of East Paris is a route of about 2 hrs 15 to 2 hrs 45 and 11 to 14 km, from Place de la Bastille to the Parc des Buttes-Chaumont, by way of Père-Lachaise and the Belleville lookout. Époque Motors drives it in a 1970s classic car with chauffeur, in English or in French.',
      sections: [],
      route: {
        n: 3,
        name: 'The Villages of East Paris',
        mood: 'A discreet, authentic Paris',
        duration: '2 hrs 15 to 2 hrs 45',
        distance: '11 to 14 km (7 to 8.5 miles)',
        start: 'Place de la Bastille',
        end: 'Parc des Buttes-Chaumont',
        intro:
          'Behind the great avenues lies a Paris of many faces. This route takes you to the east of the city, through working-class neighbourhoods, streets full of character and unexpected panoramas over the capital.',
        teaser: 'Working-class neighbourhoods, streets with character and unexpected views over the capital.',
        course: [
          'Leaving the Bastille, the route heads east and climbs: past the walls of Père-Lachaise, then up to the heights of Belleville, where the whole of Paris opens up below you, before reaching the hills and cliffs of the Buttes-Chaumont.',
          'It suits visitors who want to see the city from its neighbourhoods, and Parisians curious about the other side of Paris.',
        ],
        stops: [
          { name: 'Place de la Bastille', text: 'The departure, around the July Column, between the Marais and the Faubourg Saint-Antoine.' },
          { name: 'The Père-Lachaise district', text: 'The neighbourhood around the cemetery where many artists and writers rest.' },
          { name: 'Belleville lookout', text: 'At the top of the Parc de Belleville, a panorama over the rooftops of Paris.' },
          { name: 'Parc des Buttes-Chaumont', text: 'The arrival, in a hilly park with cliffs, a lake and the Temple de la Sibylle on its island.' },
        ],
        photo: [
          { name: 'Belleville lookout', text: 'The view over the rooftops of Paris, reached on foot from the street.' },
          { name: 'Around the Buttes-Chaumont', text: 'The car in the residential streets around the park.' },
        ],
        food: [
          { name: 'Ménilmontant', text: 'Lively streets with cafés and restaurants of every origin.' },
          { name: 'Belleville', text: 'A neighbourhood known for its cosmopolitan tables, below the lookout.' },
        ],
        tips: [
          'The lookout and the park are reached on foot: the car drops you nearby and meets you at the agreed place.',
          'Check the opening hours of Père-Lachaise and the parks on the City of Paris website if you plan to walk in.',
        ],
      },
      cta: 'Enquire about this route',
    },
    fr: {
      path: 'fr/guides/villages-est-parisien/',
      title: 'Les villages de l’Est parisien en voiture de collection',
      description:
        'L’Est parisien en voiture ancienne : de la Bastille au Père-Lachaise, au belvédère de Belleville et aux Buttes-Chaumont. Environ 2 h 30, 11 à 14 km, avec chauffeur.',
      h1: 'Les villages de l’Est parisien : de la Bastille aux Buttes-Chaumont',
      nav: 'Les villages de l’Est parisien',
      lead: 'Les villages de l’Est parisien est un itinéraire d’environ 2 h 15 à 2 h 45 et de 11 à 14 km, de la place de la Bastille au parc des Buttes-Chaumont, par le Père-Lachaise et le belvédère de Belleville. Époque Motors le propose en voiture de collection des années 1970 avec chauffeur, en français ou en anglais.',
      sections: [],
      route: {
        n: 3,
        name: 'Les villages de l’Est parisien',
        mood: 'Un Paris confidentiel et authentique',
        duration: '2 h 15 à 2 h 45',
        distance: '11 à 14 km',
        start: 'Place de la Bastille',
        end: 'Parc des Buttes-Chaumont',
        intro:
          'Derrière les grandes avenues se cache un Paris aux multiples visages. Cet itinéraire vous emmène vers l’Est parisien, entre quartiers populaires, rues pleines de caractère et panoramas inattendus sur la capitale.',
        teaser: 'Quartiers populaires, rues pleines de caractère et panoramas inattendus sur la capitale.',
        course: [
          'Depuis la Bastille, l’itinéraire part vers l’est et prend de la hauteur : le long des murs du Père-Lachaise, puis jusqu’aux hauteurs de Belleville, où tout Paris s’étend à vos pieds, avant de rejoindre les collines et les falaises des Buttes-Chaumont.',
          'Il convient aux visiteurs qui veulent voir la ville depuis ses quartiers, et aux Parisiens curieux de l’autre côté de Paris.',
        ],
        stops: [
          { name: 'Place de la Bastille', text: 'Le départ, autour de la colonne de Juillet, entre le Marais et le faubourg Saint-Antoine.' },
          { name: 'Quartier du Père-Lachaise', text: 'Le quartier qui entoure le cimetière où reposent de nombreux artistes et écrivains.' },
          { name: 'Belvédère de Belleville', text: 'En haut du parc de Belleville, un panorama sur les toits de Paris.' },
          { name: 'Parc des Buttes-Chaumont', text: 'L’arrivée, dans un parc vallonné avec ses falaises, son lac et le temple de la Sibylle sur son île.' },
        ],
        photo: [
          { name: 'Belvédère de Belleville', text: 'La vue sur les toits de Paris, rejointe à pied depuis la rue.' },
          { name: 'Environs des Buttes-Chaumont', text: 'La voiture dans les rues résidentielles autour du parc.' },
        ],
        food: [
          { name: 'Ménilmontant', text: 'Des rues animées, avec des cafés et des restaurants de toutes origines.' },
          { name: 'Belleville', text: 'Un quartier connu pour ses tables cosmopolites, au pied du belvédère.' },
        ],
        tips: [
          'Le belvédère et le parc se rejoignent à pied : la voiture vous dépose à proximité et vous retrouve au point convenu.',
          'Consultez les horaires du Père-Lachaise et des parcs sur le site de la Ville de Paris si vous souhaitez y entrer.',
        ],
      },
      cta: 'Demander cet itinéraire',
    },
  },
  {
    id: 'route-jardins',
    kind: 'route',
    parent: 'guides',
    experience: 'private-tours',
    cars: ['citroen-ds', 'mercedes-benz-classic', 'peugeot-504'],
    image: photo('citroen-ds', 1),
    related: ['route-intemporel', 'photoshoot', 'tours', 'car-ds'],
    updated: '2026-11-09',
    geo: [
      [48.8629, 2.2873],
      [48.8716, 2.2768],
      [48.8556, 2.2876],
      [48.8519, 2.2817],
    ],
    en: {
      path: 'guides/gardens-and-perspectives/',
      title: 'Paris Gardens and Perspectives by Vintage Car',
      description:
        'A photogenic route in western Paris by vintage car: Trocadéro, Avenue Foch, Porte Dauphine, Pont de Bir-Hakeim and the Île aux Cygnes. About 1 hr 45, 8 to 10 km.',
      h1: 'Paris gardens and perspectives: from the Trocadéro to the Île aux Cygnes',
      nav: 'Gardens and perspectives',
      lead: 'Gardens and Perspectives is a route of about 1 hr 30 to 2 hrs and 8 to 10 km in western Paris, from Place du Trocadéro to the Île aux Cygnes, by way of Avenue Foch, Porte Dauphine and the Pont de Bir-Hakeim. Époque Motors drives it in a 1970s classic car with chauffeur, with time for photographs.',
      sections: [],
      route: {
        n: 4,
        name: 'Gardens and Perspectives',
        mood: 'Elegance and photography',
        duration: '1 hr 30 to 2 hrs',
        distance: '8 to 10 km (5 to 6 miles)',
        start: 'Place du Trocadéro',
        end: 'Île aux Cygnes',
        intro:
          'From the great tree-lined avenues to the metal bridges spanning the Seine, this route reveals an elegant, cinematic Paris. A drive designed to enjoy the perspectives and take home beautiful photographs.',
        teaser: 'Tree-lined avenues and metal bridges over the Seine: an elegant, cinematic Paris, made for photographs.',
        course: [
          'The route stays in the west of the city, among wide avenues, gardens and views of the river. From the Trocadéro, it heads up towards the Bois de Boulogne by Avenue Foch, then comes back down to the Seine to cross the Pont de Bir-Hakeim and end on the long, narrow island in the middle of the river.',
          'It suits couples, photographers and anyone who wants pictures with a vintage car and the Eiffel Tower.',
        ],
        stops: [
          { name: 'Place du Trocadéro', text: 'The departure, facing the Eiffel Tower across the Seine, from the esplanade of the Palais de Chaillot.' },
          { name: 'Avenue Foch and Porte Dauphine', text: 'A wide, tree-lined avenue leading to Porte Dauphine and one of Hector Guimard’s metro entrances.' },
          { name: 'Pont de Bir-Hakeim', text: 'The two-level metal bridge, with the metro running above the road, often seen in films.' },
          { name: 'Île aux Cygnes', text: 'The arrival, on the narrow island in the Seine, with its tree-lined walk and, at its tip, a replica of the Statue of Liberty.' },
        ],
        photo: [
          { name: 'Trocadéro', text: 'The Eiffel Tower across the Seine, from the esplanade, early in the morning before the crowds.' },
          { name: 'Pont de Bir-Hakeim', text: 'The metal columns and arches of the lower deck, on foot, without blocking the traffic.' },
        ],
        food: [{ name: 'Passy', text: 'Cafés, tea rooms and restaurants in the residential district of Passy, close to the Trocadéro.' }],
        tips: [
          'The photo spots are reached on foot: the car stops where it is permitted and never blocks the traffic for a picture.',
          'The Île aux Cygnes is a footpath: the car drops you at one end and meets you at the other.',
        ],
      },
      cta: 'Enquire about this route',
    },
    fr: {
      path: 'fr/guides/jardins-perspectives/',
      title: 'Paris côté jardins et perspectives en voiture ancienne',
      description:
        'Un itinéraire photogénique dans l’ouest parisien en voiture ancienne : Trocadéro, avenue Foch, porte Dauphine, pont de Bir-Hakeim, île aux Cygnes. Environ 1 h 45.',
      h1: 'Paris côté jardins et perspectives : du Trocadéro à l’île aux Cygnes',
      nav: 'Jardins et perspectives',
      lead: 'Paris côté jardins et perspectives est un itinéraire d’environ 1 h 30 à 2 h et de 8 à 10 km dans l’ouest parisien, de la place du Trocadéro à l’île aux Cygnes, par l’avenue Foch, la porte Dauphine et le pont de Bir-Hakeim. Époque Motors le propose en voiture de collection des années 1970 avec chauffeur, avec le temps des photos.',
      sections: [],
      route: {
        n: 4,
        name: 'Paris côté jardins et perspectives',
        mood: 'Élégance et photographie',
        duration: '1 h 30 à 2 h',
        distance: '8 à 10 km',
        start: 'Place du Trocadéro',
        end: 'Île aux Cygnes',
        intro:
          'Des grandes avenues arborées aux ponts métalliques qui enjambent la Seine, cet itinéraire révèle un Paris élégant et cinématographique. Une promenade pensée pour profiter des perspectives et conserver de beaux souvenirs photographiques.',
        teaser: 'Avenues arborées et ponts métalliques sur la Seine : un Paris élégant et cinématographique, pensé pour la photo.',
        course: [
          'L’itinéraire reste dans l’ouest de la ville, entre larges avenues, jardins et vues sur le fleuve. Depuis le Trocadéro, il remonte vers le bois de Boulogne par l’avenue Foch, puis redescend vers la Seine pour franchir le pont de Bir-Hakeim et finir sur l’île longue et étroite qui partage le fleuve.',
          'Il convient aux couples, aux photographes et à tous ceux qui veulent des images avec une voiture ancienne et la tour Eiffel.',
        ],
        stops: [
          { name: 'Place du Trocadéro', text: 'Le départ, face à la tour Eiffel de l’autre côté de la Seine, depuis l’esplanade du palais de Chaillot.' },
          { name: 'Avenue Foch et porte Dauphine', text: 'Une large avenue arborée jusqu’à la porte Dauphine et l’une des entrées de métro d’Hector Guimard.' },
          { name: 'Pont de Bir-Hakeim', text: 'Le pont métallique à deux niveaux, le métro au-dessus de la chaussée, souvent vu au cinéma.' },
          { name: 'Île aux Cygnes', text: 'L’arrivée, sur l’île étroite au milieu de la Seine, avec son allée arborée et, à sa pointe, une réplique de la statue de la Liberté.' },
        ],
        photo: [
          { name: 'Trocadéro', text: 'La tour Eiffel de l’autre côté de la Seine, depuis l’esplanade, tôt le matin avant l’affluence.' },
          { name: 'Pont de Bir-Hakeim', text: 'Les colonnes et les arches métalliques du tablier inférieur, à pied, sans gêner la circulation.' },
        ],
        food: [{ name: 'Passy', text: 'Cafés, salons de thé et restaurants du quartier résidentiel de Passy, tout près du Trocadéro.' }],
        tips: [
          'Les spots photo se rejoignent à pied : la voiture s’arrête là où c’est autorisé et ne bloque jamais la circulation pour une photo.',
          'L’île aux Cygnes est une promenade piétonne : la voiture vous dépose à une extrémité et vous retrouve à l’autre.',
        ],
      },
      cta: 'Demander cet itinéraire',
    },
  },
  {
    id: 'route-boheme',
    kind: 'route',
    parent: 'guides',
    experience: 'private-tours',
    cars: ['mercedes-benz-classic', 'peugeot-504', 'citroen-ds'],
    image: photo('mercedes-benz-classic', 1),
    related: ['route-est', 'route-intemporel', 'tours', 'guide-things-to-do'],
    updated: '2026-11-09',
    geo: [
      [48.8719, 2.3316],
      [48.8714, 2.3655],
      [48.8839, 2.3693],
      [48.8872, 2.375],
    ],
    en: {
      path: 'guides/bohemian-paris/',
      title: 'Bohemian Paris by Vintage Car: Canal Saint-Martin',
      description:
        'A bohemian Paris route by vintage car: from the Opéra Garnier to the Canal Saint-Martin, Place de Stalingrad and the Bassin de la Villette. About 3 hrs, 12 to 15 km.',
      h1: 'Bohemian Paris: from the Opéra Garnier to the Bassin de la Villette',
      nav: 'Bohemian Paris',
      lead: 'Bohemian Paris is a route of about 2 hrs 45 to 3 hrs 30 and 12 to 15 km, from the Opéra Garnier to the Bassin de la Villette, along the Canal Saint-Martin and by Place de Stalingrad. Époque Motors drives it in a 1970s classic car with chauffeur, in English or in French.',
      sections: [],
      route: {
        n: 5,
        name: 'Bohemian Paris',
        mood: 'Immersion in the Parisian way of life',
        duration: '2 hrs 45 to 3 hrs 30',
        distance: '12 to 15 km (7.5 to 9 miles)',
        start: 'Opéra Garnier',
        end: 'Bassin de la Villette',
        intro:
          'A lively, creative and cosmopolitan Paris. Leaving the grand boulevards for the quays of the Canal Saint-Martin, this route invites you to discover a more spontaneous capital, at the pace of its neighbourhoods and its residents.',
        teaser: 'From the grand boulevards to the quays of the canal: a lively, creative and cosmopolitan Paris.',
        course: [
          'The route leaves the opera house and the grand boulevards for the north-east of the city. It follows the Canal Saint-Martin, its locks and iron footbridges, reaches Place de Stalingrad and ends on the quays of the Bassin de la Villette.',
          'A longer route, it suits an afternoon, with time for a walk along the water and a break in a café.',
        ],
        stops: [
          { name: 'Opéra Garnier', text: 'The departure, in front of the gilded façade of the opera house, on the grand boulevards.' },
          { name: 'Canal Saint-Martin', text: 'Locks, iron footbridges and plane trees along the quays.' },
          { name: 'Place de Stalingrad', text: 'The square around the Rotonde de la Villette, where the canal widens.' },
          { name: 'Bassin de la Villette', text: 'The arrival, on the lively quays of the basin.' },
        ],
        photo: [{ name: 'Canal Saint-Martin', text: 'The footbridges and locks of the canal, on foot, with the car along the quay where stopping is permitted.' }],
        food: [
          { name: 'La Marine', text: 'On the Quai de Valmy, along the canal.' },
          { name: 'Hôtel du Nord', text: 'On the Quai de Jemmapes, facing the canal.' },
        ],
        tips: [
          'Some streets and quays of Paris are reserved for pedestrians on Sundays and public holidays: the route is then adapted.',
          'The footbridges of the canal are crossed on foot; the car meets you further along the quay.',
        ],
      },
      cta: 'Enquire about this route',
    },
    fr: {
      path: 'fr/guides/paris-boheme-confidentiel/',
      title: 'Paris bohème : le canal Saint-Martin en voiture ancienne',
      description:
        'Un Paris bohème en voiture ancienne : de l’Opéra Garnier au canal Saint-Martin, à la place de Stalingrad et au bassin de la Villette. Environ 3 h, 12 à 15 km.',
      h1: 'Paris bohème et confidentiel : de l’Opéra au bassin de la Villette',
      nav: 'Paris bohème et confidentiel',
      lead: 'Paris bohème et confidentiel est un itinéraire d’environ 2 h 45 à 3 h 30 et de 12 à 15 km, de l’Opéra Garnier au bassin de la Villette, le long du canal Saint-Martin et par la place de Stalingrad. Époque Motors le propose en voiture de collection des années 1970 avec chauffeur, en français ou en anglais.',
      sections: [],
      route: {
        n: 5,
        name: 'Paris bohème et confidentiel',
        mood: 'Immersion et art de vivre parisien',
        duration: '2 h 45 à 3 h 30',
        distance: '12 à 15 km',
        start: 'Opéra Garnier',
        end: 'Bassin de la Villette',
        intro:
          'Un Paris vivant, créatif et cosmopolite. En quittant les grands boulevards pour rejoindre les quais du canal Saint-Martin, cet itinéraire vous invite à découvrir une capitale plus spontanée, au rythme de ses quartiers et de ses habitants.',
        teaser: 'Des grands boulevards aux quais du canal : un Paris vivant, créatif et cosmopolite.',
        course: [
          'L’itinéraire quitte l’opéra et les grands boulevards pour le nord-est de la ville. Il suit le canal Saint-Martin, ses écluses et ses passerelles métalliques, rejoint la place de Stalingrad et se termine sur les quais du bassin de la Villette.',
          'Plus long que les autres, il convient à un après-midi, avec le temps d’une promenade au bord de l’eau et d’une pause en terrasse.',
        ],
        stops: [
          { name: 'Opéra Garnier', text: 'Le départ, devant la façade dorée de l’opéra, sur les grands boulevards.' },
          { name: 'Canal Saint-Martin', text: 'Écluses, passerelles métalliques et platanes le long des quais.' },
          { name: 'Place de Stalingrad', text: 'La place qui entoure la rotonde de la Villette, là où le canal s’élargit.' },
          { name: 'Bassin de la Villette', text: 'L’arrivée, sur les quais animés du bassin.' },
        ],
        photo: [{ name: 'Canal Saint-Martin', text: 'Les passerelles et les écluses du canal, à pied, la voiture le long du quai là où l’arrêt est autorisé.' }],
        food: [
          { name: 'La Marine', text: 'Quai de Valmy, au bord du canal.' },
          { name: 'Hôtel du Nord', text: 'Quai de Jemmapes, face au canal.' },
        ],
        tips: [
          'Certaines rues et certains quais de Paris sont réservés aux piétons le dimanche et les jours fériés : l’itinéraire est alors adapté.',
          'Les passerelles du canal se traversent à pied ; la voiture vous retrouve plus loin sur le quai.',
        ],
      },
      cta: 'Demander cet itinéraire',
    },
  },
];

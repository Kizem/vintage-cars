import { sectionImages } from '../data/site';
import { en } from '../i18n/en';
import { fr } from '../i18n/fr';
import type { Page } from './types';

/** The FAQ (every question in one place) and the About page (the entity: who, what, where, how). */
export const infoPages: Page[] = [
  {
    id: 'faq',
    kind: 'faq',
    image: sectionImages.practical,
    related: ['rental', 'tours', 'events', 'collection', 'about'],
    updated: '2026-11-09',
    en: {
      path: 'faq/',
      title: 'FAQ: Vintage Car Experiences in Paris | Époque Motors',
      description:
        'Answers about our vintage car experiences in Paris: booking, rates, duration, languages, self-drive, chauffeur, weddings, tours and photoshoots.',
      h1: 'Frequently asked questions',
      nav: 'FAQ',
      lead: 'Époque Motors offers private experiences in three 1970s classic cars in Paris and its surroundings: events and weddings, private tours and chauffeured journeys. Experiences last from one hour to a full day, in English or in French, by enquiry, with no online payment.',
      sections: [],
      faq: [
        {
          q: 'How do I book an experience?',
          a: 'Send an enquiry through the form on our home page or by email, with your date, the experience and the car you have in mind. We reply personally and send a proposal with its rate before any commitment.',
        },
        {
          q: 'How much does a vintage car experience cost?',
          a: 'The rate depends on what you have in mind: the car, the duration, the itinerary and the occasion. It is set out in our proposal, before any commitment.',
        },
        {
          q: 'Can I pay online?',
          a: 'No, there is no online payment. Every enquiry receives a personal reply.',
        },
        {
          q: 'Can I see the availability of the cars online?',
          a: 'No. Every car is available by enquiry: send us your date and we confirm in our reply.',
        },
        {
          q: 'How long does an experience last?',
          a: 'From one hour to a full day.',
        },
        {
          q: 'Where do experiences take place?',
          a: 'In Paris and its surroundings. The itinerary and meeting point are agreed with you when preparing your experience.',
        },
        {
          q: 'Which languages do you speak?',
          a: 'We welcome you in English and in French.',
        },
        {
          q: 'Which cars are in the collection?',
          a: 'A Citroën DS 21 Henri Chapron from 1971 (anthracite grey), a Peugeot 504 GL from 1971 (blue) and a Mercedes W115 220D from 1973 (ivory). All three are four-door saloons.',
        },
        {
          q: 'Can I drive the car myself?',
          a: 'The Peugeot 504 GL and the Mercedes W115 220D can be driven without a chauffeur, on enquiry and subject to conditions. The Citroën DS 21 Henri Chapron is offered with a chauffeur only.',
        },
        {
          q: 'Do the cars have a manual gearbox?',
          a: 'Yes, the Peugeot 504 GL and the Mercedes W115 220D have a manual gearbox.',
        },
        {
          q: 'Can you pick us up at our hotel?',
          a: 'The meeting point is agreed with you: it can be your hotel or another address in Paris.',
        },
        {
          q: 'Do you provide wedding cars?',
          a: 'Yes, all three cars are available with a chauffeur for weddings in Paris and its surroundings: arrival at the ceremony, couple photos and departure.',
        },
        {
          q: 'Can I use the car for a photoshoot?',
          a: 'Yes, for professional and personal photoshoots. The chauffeur positions the car as your photographer needs.',
        },
        {
          q: 'Is a private tour of Paris guided?',
          a: 'Yes, private tours are guided, in English or in French, along a route agreed with you.',
        },
        {
          q: 'Are the photos of the cars real?',
          a: 'The photos of the collection show our actual cars. The 3D cars of the home page are graphic renderings, and images marked “Illustrative image” are illustrations.',
        },
      ],
      cta: 'Send an enquiry',
    },
    fr: {
      path: 'fr/faq/',
      title: 'FAQ : expériences en voiture de collection à Paris',
      description:
        'Nos réponses sur les expériences en voiture de collection à Paris : réservation, tarif, durée, langues, conduite sans chauffeur, mariages, visites, shootings.',
      h1: 'Questions fréquentes',
      nav: 'FAQ',
      lead: 'Époque Motors propose des expériences privées à bord de trois voitures de collection des années 1970, à Paris et dans ses environs : événements et mariages, visites privées et trajets avec chauffeur. Une expérience dure d’une heure à une journée, en français ou en anglais, sur demande et sans paiement en ligne.',
      sections: [],
      faq: [
        {
          q: 'Comment réserver une expérience ?',
          a: 'Envoyez une demande par le formulaire de notre page d’accueil ou par e-mail, avec la date, l’expérience et la voiture souhaitées. Nous vous répondons personnellement et vous envoyons une proposition chiffrée avant tout engagement.',
        },
        {
          q: 'Combien coûte une expérience en voiture de collection ?',
          a: 'Le tarif dépend de votre projet : la voiture, la durée, l’itinéraire et l’occasion. Il figure dans notre proposition, avant tout engagement.',
        },
        {
          q: 'Peut-on payer en ligne ?',
          a: 'Non, il n’y a pas de paiement en ligne. Chaque demande reçoit une réponse personnelle.',
        },
        {
          q: 'Peut-on voir les disponibilités en ligne ?',
          a: 'Non. Chaque voiture est proposée sur demande : envoyez-nous votre date, nous vous la confirmons dans notre réponse.',
        },
        {
          q: 'Combien de temps dure une expérience ?',
          a: 'D’une heure à une journée entière.',
        },
        {
          q: 'Où se déroulent les expériences ?',
          a: 'À Paris et dans ses environs. L’itinéraire et le point de rendez-vous sont convenus avec vous lors de la préparation de votre expérience.',
        },
        {
          q: 'Quelles langues parlez-vous ?',
          a: 'Nous vous accueillons en français et en anglais.',
        },
        {
          q: 'Quelles voitures composent la collection ?',
          a: 'Une Citroën DS 21 Henri Chapron de 1971 (gris anthracite), une Peugeot 504 GL de 1971 (bleue) et une Mercedes W115 220D de 1973 (ivoire). Toutes trois sont des berlines à quatre portes.',
        },
        {
          q: 'Puis-je conduire la voiture moi-même ?',
          a: 'La Peugeot 504 GL et la Mercedes W115 220D peuvent être conduites sans chauffeur, sur demande et sous conditions. La Citroën DS 21 Henri Chapron est proposée uniquement avec chauffeur.',
        },
        {
          q: 'Les voitures ont-elles une boîte manuelle ?',
          a: 'Oui, la Peugeot 504 GL et la Mercedes W115 220D ont une boîte de vitesses manuelle.',
        },
        {
          q: 'Pouvez-vous venir nous chercher à notre hôtel ?',
          a: 'Le point de rendez-vous est convenu avec vous : il peut s’agir de votre hôtel ou d’une autre adresse à Paris.',
        },
        {
          q: 'Proposez-vous des voitures de mariage ?',
          a: 'Oui, les trois voitures sont proposées avec chauffeur pour les mariages à Paris et dans ses environs : arrivée à la cérémonie, photos de couple et départ.',
        },
        {
          q: 'Peut-on utiliser la voiture pour un shooting photo ?',
          a: 'Oui, pour les shootings professionnels et personnels. Le chauffeur place la voiture selon les besoins de votre photographe.',
        },
        {
          q: 'La visite privée de Paris est-elle guidée ?',
          a: 'Oui, les visites privées sont guidées, en français ou en anglais, selon un itinéraire convenu avec vous.',
        },
        {
          q: 'Les photos des voitures sont-elles réelles ?',
          a: 'Les photos de la collection montrent nos vraies voitures. Les voitures en 3D de l’accueil sont des représentations graphiques, et les images marquées « Image d’illustration » sont des illustrations.',
        },
      ],
      cta: 'Envoyer une demande',
    },
  },
  {
    id: 'about',
    kind: 'about',
    cars: ['peugeot-504', 'citroen-ds', 'mercedes-benz-classic'],
    image: sectionImages.about,
    related: ['collection', 'events', 'tours', 'chauffeur', 'faq'],
    updated: '2026-11-09',
    en: {
      path: 'about/',
      title: 'About Époque Motors: Vintage Car Experiences in Paris',
      description:
        'Époque Motors shares the beauty of classic motoring through private experiences in Paris, aboard three cars from the early 1970s, in English and in French.',
      h1: 'About Époque Motors',
      nav: 'About',
      lead: 'Époque Motors is a Paris-based provider of private vintage car experiences. With three saloons from the early 1970s, a Citroën DS 21 Henri Chapron, a Peugeot 504 GL and a Mercedes W115 220D, it prepares events and weddings, private tours of Paris and chauffeured journeys, by enquiry, in English and in French.',
      sections: [
        {
          h2: 'Our approach',
          /* the owner's text, as on the home page */
          p: [en.about.p1, en.about.p2],
        },
        {
          h2: 'How we work',
          list: [
            'By enquiry only: every request receives a personal reply.',
            'A proposal with its rate, before any commitment, and no online payment.',
            'Experiences from one hour to a full day, in Paris and its surroundings.',
            'In English and in French.',
          ],
        },
      ],
      cta: 'Send an enquiry',
    },
    fr: {
      path: 'fr/a-propos/',
      title: 'À propos d’Époque Motors : voitures de collection à Paris',
      description:
        'Époque Motors partage la beauté de l’automobile de collection à travers des expériences privées à Paris, à bord de trois voitures du début des années 1970.',
      h1: 'À propos d’Époque Motors',
      nav: 'À propos',
      lead: 'Époque Motors propose, à Paris, des expériences privées en voiture de collection. Avec trois berlines du début des années 1970, une Citroën DS 21 Henri Chapron, une Peugeot 504 GL et une Mercedes W115 220D, elle prépare des événements et des mariages, des visites privées de Paris et des trajets avec chauffeur, sur demande, en français et en anglais.',
      sections: [
        {
          h2: 'Notre démarche',
          p: [fr.about.p1, fr.about.p2],
        },
        {
          h2: 'Notre façon de travailler',
          list: [
            'Uniquement sur demande : chaque demande reçoit une réponse personnelle.',
            'Une proposition chiffrée avant tout engagement, sans paiement en ligne.',
            'Des expériences d’une heure à une journée, à Paris et dans ses environs.',
            'En français et en anglais.',
          ],
        },
      ],
      cta: 'Envoyer une demande',
    },
  },
];

import type { Dictionary } from './en';

/**
 * Textes de l'interface en français.
 * Écrits en français (et non traduits mot à mot) : vouvoiement, pas de tiret
 * long, pas de superlatif, espace insécable ( ) avant « : ; ? ! ».
 */
export const fr: Dictionary = {
  meta: {
    title: 'Époque Motors | Expériences privées en voiture de collection à Paris',
    description:
      'Visites privées de Paris, voiture de collection avec chauffeur et événements. Des expériences sur mesure, uniquement sur demande.',
  },
  nav: {
    label: 'Navigation principale',
    items: {
      garage: 'La collection',
      experiences: 'Expériences',
      about: 'À propos',
      write: 'Écrire',
    },
    otherLanguage: 'English',
    backToTop: 'Revenir en haut de la page',
  },
  garage: {
    h1: 'Expériences privées en voiture de collection, à Paris',
    prev: 'Voiture précédente',
    next: 'Voiture suivante',
    place: 'Place',
    seeSheet: 'Voir la fiche : {name}',
    slide: 'Représentation graphique. Cliquez sur une voiture pour voir ses photos.',
    slideTouch: 'Représentation graphique. Touchez une voiture pour voir ses photos.',
    flatHint: 'Cliquez sur le nom d’une voiture pour voir ses photos.',
    flatHintTouch: 'Touchez le nom d’une voiture pour voir ses photos.',
  },
  focus: {
    label: 'Photos et fiche technique',
    specs: 'Fiche technique',
    service: 'Service',
    availability: 'Disponibilité',
    enquire: 'Demander cette voiture',
    close: 'Fermer la fiche',
    closeShort: 'Fermer',
    photosOf: 'Photos de la {name}',
    enlarge: 'Agrandir la photo',
    prevPhoto: 'Photo précédente',
    nextPhoto: 'Photo suivante',
    prevCar: 'Voiture précédente\u00a0: {name}',
    nextCar: 'Voiture suivante\u00a0: {name}',
    /** Étiquette posée sur la scène pendant que la fiche est ouverte. */
    rendering: 'Représentation graphique',
  },
  availabilityShort: {
    'on-request': 'Sur demande',
    available: 'Disponible',
    limited: 'Limitée',
    unavailable: 'Actuellement indisponible',
    'coming-soon': 'Prochainement',
  },
  service: {
    chauffeur: 'Avec chauffeur',
    'chauffeur-or-self-drive': 'Avec ou sans chauffeur',
  },
  chapter: {
    number: 'N°{n}',
  },
  goodToKnow: {
    title: 'Bon à savoir',
    facts: ['De 1 h à une journée', 'En français et en anglais', 'À Paris et dans ses environs', 'Aucun paiement en ligne'],
    faq: [
      {
        q: 'Où se déroulent les expériences ?',
        a: 'À Paris et dans ses environs. L’itinéraire et le lieu de rendez-vous sont convenus avec vous à l’avance.',
      },
      {
        q: 'Dans quelles langues ?',
        a: 'Nous vous accueillons en français et en anglais.',
      },
      {
        q: 'Quelle durée, quel tarif ?',
        a: 'Une expérience dure de 1 h à une journée. Le tarif dépend de votre projet : il figure dans notre proposition, avant tout engagement de votre part.',
      },
      {
        q: 'Puis-je conduire la voiture ?',
        a: 'Oui pour la Peugeot 504 GL et la Mercedes W115 220D, qui peuvent être conduites sans chauffeur, sur demande et sous conditions. La Citroën DS 21 Henri Chapron est proposée uniquement avec chauffeur.',
      },
    ],
  },
  about: {
    title: 'À propos',
    p1: 'Certaines automobiles deviennent le symbole d’une époque. Chez Époque Motors, nous pensons que ces voitures sont faites pour rouler, pas seulement pour être admirées.',
    p2: 'Notre envie : partager le plaisir de rouler en voiture ancienne, à Paris, lors d’expériences simples, authentiques et personnelles.',
  },
  form: {
    title: 'Écrire',
    a: 'Bonjour, je m’appelle',
    b: '. J’aimerais',
    c: 'avec',
    d: 'le',
    e: '. Écrivez-moi à',
    f: '.',
    more: 'Je précise :',
    fullName: 'Nom et prénom',
    namePlaceholder: 'votre nom',
    experience: 'Expérience souhaitée',
    selectExperience: 'une expérience',
    somethingElse: 'autre chose',
    vehicle: 'Voiture souhaitée',
    noPreference: 'la voiture de votre choix',
    date: 'Date souhaitée (facultatif)',
    email: 'Adresse e-mail',
    emailPlaceholder: 'votre e-mail',
    message: 'Message (facultatif)',
    messagePlaceholder: 'occasion, itinéraire…',
    consent: 'J’accepte qu’Époque Motors utilise ces informations pour répondre à ma demande.',
    submit: 'Envoyer ma demande',
    submitting: 'Envoi en cours…',
    noPayment: 'Aucun paiement à ce stade. Nous répondons personnellement à chaque demande.',
    errors: {
      nameRequired: 'Merci d’indiquer vos nom et prénom.',
      emailRequired: 'Merci d’indiquer votre adresse e-mail.',
      emailInvalid: 'Cette adresse e-mail ne semble pas valide.',
      experienceRequired: 'Merci de choisir une expérience.',
      datePast: 'Cette date est déjà passée.',
      messageTooLong: 'Votre message ne doit pas dépasser 2 000 caractères.',
      consentRequired: 'Merci de cocher cette case pour que nous puissions vous répondre.',
    },
    sentTitle: 'Merci, {name}.',
    sentText: 'Votre demande a bien été envoyée. Nous vous répondrons personnellement à l’adresse {email}.',
    sendAnother: 'Envoyer une autre demande',
    notSentTitle: 'Votre demande n’est pas encore partie.',
    notSentText:
      'L’envoi en ligne n’est pas encore activé. Vos informations sont conservées : vous pouvez nous les transmettre par e-mail en un clic.',
    errorTitle: 'Votre demande n’a pas pu être envoyée.',
    errorText: 'Vos informations sont conservées. Réessayez, ou envoyez-les-nous par e-mail.',
    errorServer: 'Un problème technique est survenu.',
    errorNetwork: 'La connexion a échoué. Vérifiez votre accès à Internet.',
    sendByEmail: 'Envoyer par e-mail',
    tryAgain: 'Réessayer',
    edit: 'Modifier ma demande',
    mailSubject: 'Demande',
    mailName: 'Nom',
    mailEmail: 'E-mail',
    mailExperience: 'Expérience',
    mailVehicle: 'Voiture',
    mailDate: 'Date',
    flexible: 'Dates flexibles',
  },
  footer: {
    legalNotice: 'Mentions légales',
    privacy: 'Confidentialité',
  },
  legal: {
    close: 'Fermer',
    'legal-notice': {
      title: 'Mentions légales',
      body: [
        'Cette page présentera les informations légales obligatoires : dénomination sociale, forme juridique, siège social, numéro d’immatriculation (RCS/SIREN), numéro de TVA intracommunautaire, directeur de la publication et coordonnées de l’hébergeur.',
        'Ce contenu est en cours de rédaction et sera publié avant l’ouverture du site.',
      ],
    },
    privacy: {
      title: 'Politique de confidentialité',
      body: [
        'Les informations transmises via le formulaire servent uniquement à Époque Motors pour répondre à votre demande et organiser votre expérience. Elles ne sont ni vendues ni utilisées à des fins commerciales.',
        'La politique de confidentialité complète (responsable du traitement, base légale, durées de conservation, sous-traitants et droits prévus par le RGPD) est en cours de rédaction et sera publiée avant l’ouverture du site.',
      ],
    },
  },
};

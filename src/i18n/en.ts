/**
 * English interface copy. `fr.ts` must provide exactly the same keys
 * (enforced by the Dictionary type).
 * Editorial rule: no long dashes, no superlatives, no unverified claims.
 */
export const en = {
  meta: {
    title: 'Époque Motors | Private Vintage Car Experiences in Paris',
    description:
      'Private tours, chauffeured journeys and special occasions in classic automobiles, by enquiry.',
  },
  nav: {
    label: 'Primary',
    items: {
      garage: 'The collection',
      experiences: 'Experiences',
      about: 'About',
      write: 'Enquire',
    },
    /** Link to the other language, written in that language. */
    otherLanguage: 'Français',
    backToTop: 'Back to the top of the page',
  },
  garage: {
    h1: 'Private vintage car experiences in Paris',
    prev: 'Previous car',
    next: 'Next car',
    place: 'Bay',
    seeSheet: 'See the details: {name}',
    slide: 'Graphic rendering. Click a car to see its photos.',
    slideTouch: 'Graphic rendering. Tap a car to see its photos.',
  },
  focus: {
    label: 'Photos and specifications',
    specs: 'Specifications',
    service: 'Service',
    availability: 'Availability',
    enquire: 'Enquire about this car',
    close: 'Close vehicle details',
    closeShort: 'Close',
    photosOf: 'Photos of the {name}',
    enlarge: 'Enlarge the photo',
    prevPhoto: 'Previous photo',
    nextPhoto: 'Next photo',
    prevCar: 'Previous car: {name}',
    nextCar: 'Next car: {name}',
    /** Label on the scene while the vehicle sheet is open. */
    rendering: 'Graphic rendering',
  },
  /** Short values next to the “Availability” label. */
  availabilityShort: {
    'on-request': 'On request',
    available: 'Available',
    limited: 'Limited',
    unavailable: 'Currently unavailable',
    'coming-soon': 'Coming soon',
  },
  service: {
    chauffeur: 'With chauffeur',
    'chauffeur-or-self-drive': 'With or without chauffeur',
  },
  chapter: {
    number: 'N°{n}',
  },
  goodToKnow: {
    title: 'Good to know',
    facts: ['2 hours to a full day', 'In English and in French', 'In Paris and its surroundings', 'No payment online'],
    faq: [
      {
        q: 'Where do experiences take place?',
        a: 'In Paris and its surroundings. The itinerary and meeting point are agreed with you when preparing your experience.',
      },
      {
        q: 'Which languages do you speak?',
        a: 'We welcome you in English and in French.',
      },
      {
        q: 'How long does an experience last, and at what rate?',
        a: 'An experience lasts from 2 hours to a full day. The rate depends on what you have in mind and is set out in our proposal, before any commitment.',
      },
      {
        q: 'Can I drive the car myself?',
        a: 'The Peugeot 504 GL and the Mercedes W115 220D can be driven without a chauffeur, on enquiry and subject to conditions. The Citroën DS 21 Henri Chapron is offered with a chauffeur only.',
      },
    ],
  },
  about: {
    title: 'About',
    p1: 'Some automobiles become symbols of an era. At Époque Motors, we believe these icons deserve to be experienced, not simply admired.',
    p2: 'Our ambition is to share the beauty of classic motoring through personal, authentic experiences in Paris.',
  },
  form: {
    title: 'Enquire',
    /** The enquiry is one sentence: a [name] b [experience] c [car] d [date] e [email] f */
    a: 'Hello, my name is',
    b: '. I would like',
    c: 'with',
    d: 'on',
    e: '. Please write to',
    f: '.',
    more: 'I would add:',
    fullName: 'Full name',
    namePlaceholder: 'your name',
    experience: 'Preferred experience',
    selectExperience: 'an experience',
    somethingElse: 'something else',
    vehicle: 'Preferred vehicle',
    noPreference: 'the car of your choice',
    date: 'Desired date (optional)',
    email: 'Email address',
    emailPlaceholder: 'your email',
    message: 'Message (optional)',
    messagePlaceholder: 'occasion, route…',
    consent: 'I agree that Époque Motors may use these details to reply to my enquiry.',
    submit: 'Send an Enquiry',
    submitting: 'Sending…',
    noPayment: 'No payment is taken. Every request receives a personal reply.',
    errors: {
      nameRequired: 'Please tell us your full name.',
      emailRequired: 'Please enter your email address.',
      emailInvalid: 'Please enter a valid email address.',
      experienceRequired: 'Please choose the experience you have in mind.',
      datePast: 'Please choose a date in the future.',
      messageTooLong: 'Please keep your message under 2,000 characters.',
      consentRequired: 'Please confirm we may use your details to reply to you.',
    },
    sentTitle: 'Thank you, {name}.',
    sentText: 'Your enquiry has been sent. We will reply personally to {email}.',
    sendAnother: 'Send another enquiry',
    notSentTitle: 'Your enquiry has not been sent yet.',
    notSentText:
      'Online enquiries are not connected yet. Your details are still here: you can send them to us by email in one click.',
    errorTitle: 'Your enquiry could not be sent.',
    errorText: 'Your details are still here. Please try again, or send them by email.',
    errorServer: 'The server responded with an error.',
    errorNetwork: 'We could not reach our server. Please check your connection.',
    sendByEmail: 'Send by email',
    tryAgain: 'Try again',
    edit: 'Edit my enquiry',
    mailSubject: 'Enquiry',
    mailName: 'Name',
    mailEmail: 'Email',
    mailExperience: 'Experience',
    mailVehicle: 'Car',
    mailDate: 'Date',
    flexible: 'Flexible',
  },
  footer: {
    legalNotice: 'Legal notice',
    privacy: 'Privacy',
  },
  legal: {
    close: 'Close',
    'legal-notice': {
      title: 'Legal Notice',
      body: [
        'This page will contain the legal information required by French law: the publisher’s company name, legal form, registered office, registration number (RCS/SIREN), VAT number, publication director and the website host’s details.',
        'This content is pending and will be published before launch.',
      ],
    },
    privacy: {
      title: 'Privacy Policy',
      body: [
        'The details you share through the enquiry form are used solely by Époque Motors to reply to your request and arrange your experience. They are never sold or shared for marketing purposes.',
        'The complete privacy policy (data controller, legal basis, retention periods, processors and your rights under the GDPR) is pending and will be published before launch.',
      ],
    },
  },
};

export type Dictionary = typeof en;

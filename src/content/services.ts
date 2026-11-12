import { experiences } from '../data/experiences';
import { getVehicle } from '../data/vehicles';
import type { Page } from './types';

const img = (id: string) => experiences.find((x) => x.id === id)!.image;
const car = (slug: string, n = 0) => {
  const v = getVehicle(slug)!;
  return [v.image, ...(v.gallery ?? [])][n];
};

/** The offers: events (and its three occasions), private tours, chauffeur, rental. */
export const servicePages: Page[] = [
  {
    id: 'events',
    kind: 'hub',
    experience: 'events',
    cars: ['peugeot-504', 'citroen-ds', 'mercedes-benz-classic'],
    image: img('events'),
    related: ['wedding', 'proposal', 'photoshoot', 'guide-wedding-car', 'collection'],
    updated: '2026-11-09',
    en: {
      path: 'vintage-car-hire-events-paris/',
      title: 'Vintage Car Hire for Events in Paris | Époque Motors',
      description:
        'Hire a 1970s classic car for your wedding, proposal, photoshoot or private event in Paris: Citroën DS 21, Peugeot 504 or Mercedes W115, by enquiry.',
      h1: 'Vintage car hire for events in Paris',
      nav: 'Events',
      lead: 'Époque Motors provides vintage cars from the 1970s for weddings, romantic occasions, private events and professional photoshoots in Paris and its surroundings. Three cars are available by enquiry, with a chauffeur, and two of them can also be driven by you.',
      sections: [
        {
          h2: 'A car with character for your occasion',
          p: [
            'A vintage automobile changes the feel of a day. It brings you to the ceremony, waits in front of the venue, appears in the photographs and leaves with you at the end of the evening.',
            'Our three saloons come from the early 1970s: an anthracite grey Citroën DS 21 Henri Chapron, a blue Peugeot 504 GL and an ivory Mercedes W115 220D. Each one gives a different tone to your event, from Parisian elegance to German restraint.',
          ],
        },
        {
          h2: 'Occasions we prepare with you',
          list: [
            'Weddings: arrival at the town hall, the church or the venue, couple photos, departure at the end of the day.',
            'Marriage proposals and romantic moments: a drive through Paris that ends where you have chosen.',
            'Birthdays, anniversaries and private celebrations.',
            'Professional and personal photoshoots, with the car as the subject or as the setting.',
          ],
        },
        {
          h2: 'How it works',
          p: [
            'Tell us the date, the occasion and the car you have in mind through the enquiry form. We reply personally, agree the timing, the addresses and the itinerary with you, and send a proposal with its rate before any commitment. There is no online payment.',
            'An experience lasts from one hour to a full day, in English or in French.',
          ],
        },
      ],
      faq: [
        {
          q: 'Which car should I choose for my event?',
          a: 'The Citroën DS 21 Henri Chapron suits ceremonies and Parisian photographs, the ivory Mercedes W115 220D fits a classic wedding, and the blue Peugeot 504 GL brings a relaxed, colourful touch. We can advise you when you enquire.',
        },
        {
          q: 'Is the car provided with a chauffeur?',
          a: 'Yes, all three cars can come with a chauffeur. The Peugeot 504 GL and the Mercedes W115 220D can also be driven without a chauffeur, on enquiry and subject to conditions. The Citroën DS is offered with a chauffeur only.',
        },
        {
          q: 'Do you work outside Paris?',
          a: 'Our experiences take place in Paris and its surroundings. Tell us the address of your venue in the enquiry and we will confirm what is possible.',
        },
      ],
      cta: 'Enquire about your event',
    },
    fr: {
      path: 'fr/location-voiture-collection-evenement-paris/',
      title: 'Location de voiture de collection pour événement à Paris',
      description:
        'Louez une voiture des années 1970 pour un mariage, une demande en mariage, un shooting ou un événement privé à Paris : DS 21, 504 ou Mercedes, sur demande.',
      h1: 'Location de voiture de collection pour vos événements à Paris',
      nav: 'Événements',
      lead: 'Époque Motors met à disposition des voitures de collection des années 1970 pour les mariages, les moments romantiques, les événements privés et les shootings photo professionnels, à Paris et dans ses environs. Trois voitures, sur demande, avec chauffeur ; deux d’entre elles peuvent aussi être conduites par vous.',
      sections: [
        {
          h2: 'Une voiture de caractère pour votre occasion',
          p: [
            'Une automobile d’époque change l’atmosphère d’une journée. Elle vous conduit à la cérémonie, attend devant le lieu de réception, apparaît sur les photos et repart avec vous en fin de soirée.',
            'Nos trois berlines datent du début des années 1970 : une Citroën DS 21 Henri Chapron gris anthracite, une Peugeot 504 GL bleue et une Mercedes W115 220D ivoire. Chacune donne un ton différent à votre événement, de l’élégance parisienne à la sobriété allemande.',
          ],
        },
        {
          h2: 'Les occasions que nous préparons avec vous',
          list: [
            'Mariages : arrivée à la mairie, à l’église ou au lieu de réception, photos de couple, départ en fin de journée.',
            'Demandes en mariage et moments romantiques : une balade dans Paris qui se termine à l’endroit que vous avez choisi.',
            'Anniversaires, anniversaires de mariage et fêtes privées.',
            'Shootings photo professionnels ou personnels, la voiture en vedette ou en décor.',
          ],
        },
        {
          h2: 'Comment ça se passe',
          p: [
            'Indiquez-nous la date, l’occasion et la voiture souhaitée dans le formulaire de demande. Nous vous répondons personnellement, convenons avec vous des horaires, des adresses et de l’itinéraire, puis vous envoyons une proposition chiffrée avant tout engagement. Aucun paiement en ligne.',
            'Une expérience dure d’une heure à une journée entière, en français ou en anglais.',
          ],
        },
      ],
      faq: [
        {
          q: 'Quelle voiture choisir pour mon événement ?',
          a: 'La Citroën DS 21 Henri Chapron convient aux cérémonies et aux photos parisiennes, la Mercedes W115 220D ivoire à un mariage classique, la Peugeot 504 GL bleue apporte une touche décontractée et colorée. Nous vous conseillons lors de votre demande.',
        },
        {
          q: 'La voiture est-elle fournie avec chauffeur ?',
          a: 'Oui, les trois voitures peuvent être conduites par notre chauffeur. La Peugeot 504 GL et la Mercedes W115 220D peuvent aussi être louées sans chauffeur, sur demande et sous conditions. La Citroën DS est proposée uniquement avec chauffeur.',
        },
        {
          q: 'Intervenez-vous en dehors de Paris ?',
          a: 'Nos expériences ont lieu à Paris et dans ses environs. Indiquez l’adresse de votre lieu de réception dans votre demande : nous vous confirmons ce qui est possible.',
        },
      ],
      cta: 'Parler de votre événement',
    },
  },
  {
    id: 'wedding',
    kind: 'service',
    parent: 'events',
    experience: 'events',
    cars: ['mercedes-benz-classic', 'citroen-ds', 'peugeot-504'],
    image: car('mercedes-benz-classic'),
    related: ['guide-wedding-car', 'photoshoot', 'proposal', 'car-w115', 'car-ds'],
    updated: '2026-11-09',
    en: {
      path: 'vintage-wedding-car-paris/',
      title: 'Vintage Wedding Car in Paris, with Chauffeur | Époque Motors',
      description:
        'A 1970s wedding car in Paris and its surroundings: ivory Mercedes W115, Citroën DS 21 Henri Chapron or Peugeot 504, with chauffeur, by enquiry.',
      h1: 'A vintage wedding car in Paris',
      nav: 'Wedding car',
      lead: 'For a wedding in Paris or its surroundings, Époque Motors provides a 1970s saloon with its chauffeur: an ivory Mercedes W115 220D, an anthracite grey Citroën DS 21 Henri Chapron or a blue Peugeot 504 GL. Arrival at the ceremony, couple photos and departure are planned with you, by enquiry.',
      sections: [
        {
          h2: 'The car of your wedding day',
          p: [
            'The wedding car is one of the images that stays. It brings the bride or the couple to the town hall, the church or the venue, then becomes the setting of the couple photos before taking you on to the reception.',
            'Our three cars are closed four-door saloons: you get in and out without difficulty, the rear bench welcomes a wedding dress, and a change of weather does not alter the plan.',
          ],
        },
        {
          h2: 'Three styles, three moods',
          list: [
            'Mercedes W115 220D, ivory (1973): a classic, luminous wedding car, with a burr walnut dashboard and beige upholstery.',
            'Citroën DS 21 Henri Chapron, anthracite grey (1971): the silhouette of the Parisian DS, for an elegant, graphic ceremony.',
            'Peugeot 504 GL, blue (1971): a lighter, colourful touch, for a relaxed wedding or a country venue.',
          ],
        },
        {
          h2: 'A day planned with you',
          p: [
            'Send us your date, your addresses (home or hotel, ceremony, reception) and the moments you want the car for. We agree the timing and the route with you and send a proposal with its rate before any commitment.',
            'The chauffeur handles the driving and the waiting, so that you can enjoy the day. Your photographer can plan the couple photos around the car.',
          ],
        },
      ],
      faq: [
        {
          q: 'Can the car take us from the ceremony to the reception?',
          a: 'Yes. The car can take you to the ceremony, wait for photos and drive you on to the reception, in Paris and its surroundings. The timing and addresses are agreed with you.',
        },
        {
          q: 'How long can we have the car on the wedding day?',
          a: 'From one hour to a full day, depending on your plans. The rate is set out in our proposal.',
        },
        {
          q: 'Can we decorate the car?',
          a: 'Tell us what you have in mind in your enquiry, and we will agree together on what is suitable for the car.',
        },
        {
          q: 'Can I drive the car myself on my wedding day?',
          a: 'The Peugeot 504 GL and the Mercedes W115 220D can be driven without a chauffeur, on enquiry and subject to conditions. The Citroën DS 21 is offered with a chauffeur only. On a wedding day, a chauffeur leaves you free to enjoy every moment.',
        },
      ],
      cta: 'Enquire about your wedding',
    },
    fr: {
      path: 'fr/voiture-mariage-collection-paris/',
      title: 'Voiture de mariage de collection à Paris, avec chauffeur',
      description:
        'Une voiture de mariage des années 1970 à Paris et en région parisienne : Mercedes W115 ivoire, Citroën DS 21 Henri Chapron ou Peugeot 504, avec chauffeur.',
      h1: 'Une voiture de collection pour votre mariage à Paris',
      nav: 'Voiture de mariage',
      lead: 'Pour un mariage à Paris ou dans ses environs, Époque Motors met à disposition une berline des années 1970 avec son chauffeur : une Mercedes W115 220D ivoire, une Citroën DS 21 Henri Chapron gris anthracite ou une Peugeot 504 GL bleue. Arrivée à la cérémonie, photos de couple et départ sont préparés avec vous, sur demande.',
      sections: [
        {
          h2: 'La voiture de votre jour J',
          p: [
            'La voiture des mariés fait partie des images qui restent. Elle conduit la mariée ou le couple à la mairie, à l’église ou au lieu de réception, puis devient le décor des photos de couple avant de vous emmener à la réception.',
            'Nos trois voitures sont des berlines fermées à quatre portes : on y monte et on en descend sans difficulté, la banquette arrière accueille une robe de mariée, et un changement de météo ne change rien au programme.',
          ],
        },
        {
          h2: 'Trois styles, trois ambiances',
          list: [
            'Mercedes W115 220D ivoire (1973) : une voiture de mariage classique et lumineuse, planche de bord en ronce de noyer et sellerie beige.',
            'Citroën DS 21 Henri Chapron gris anthracite (1971) : la silhouette de la DS parisienne, pour une cérémonie élégante et graphique.',
            'Peugeot 504 GL bleue (1971) : une touche plus légère et colorée, pour un mariage décontracté ou champêtre.',
          ],
        },
        {
          h2: 'Une journée préparée avec vous',
          p: [
            'Envoyez-nous votre date, vos adresses (domicile ou hôtel, cérémonie, réception) et les moments où vous souhaitez la voiture. Nous convenons avec vous des horaires et du trajet, puis vous adressons une proposition chiffrée avant tout engagement.',
            'Le chauffeur s’occupe de la conduite et de l’attente : vous profitez de la journée. Votre photographe peut prévoir les photos de couple autour de la voiture.',
          ],
        },
      ],
      faq: [
        {
          q: 'La voiture peut-elle nous conduire de la cérémonie à la réception ?',
          a: 'Oui. La voiture peut vous conduire à la cérémonie, attendre le temps des photos et vous emmener à la réception, à Paris et dans ses environs. Les horaires et les adresses sont convenus avec vous.',
        },
        {
          q: 'Combien de temps pouvons-nous avoir la voiture le jour du mariage ?',
          a: 'D’une heure à une journée entière, selon votre programme. Le tarif figure dans notre proposition.',
        },
        {
          q: 'Pouvons-nous décorer la voiture ?',
          a: 'Décrivez-nous votre idée dans votre demande : nous convenons ensemble de ce qui convient à la voiture.',
        },
        {
          q: 'Puis-je conduire la voiture moi-même le jour de mon mariage ?',
          a: 'La Peugeot 504 GL et la Mercedes W115 220D peuvent être conduites sans chauffeur, sur demande et sous conditions. La Citroën DS 21 est proposée uniquement avec chauffeur. Le jour du mariage, un chauffeur vous laisse libres de profiter de chaque instant.',
        },
      ],
      cta: 'Parler de votre mariage',
    },
  },
  {
    id: 'proposal',
    kind: 'service',
    parent: 'events',
    experience: 'events',
    cars: ['citroen-ds', 'mercedes-benz-classic', 'peugeot-504'],
    image: img('private-tours'),
    related: ['guides', 'tours', 'photoshoot', 'car-ds'],
    updated: '2026-11-09',
    en: {
      path: 'marriage-proposal-vintage-car-paris/',
      title: 'Marriage Proposal in Paris in a Vintage Car | Époque Motors',
      description:
        'Plan a marriage proposal in Paris aboard a 1970s classic car with chauffeur: a private drive along the Seine that ends where you have chosen. By enquiry.',
      h1: 'A marriage proposal in Paris, aboard a vintage car',
      nav: 'Marriage proposal',
      lead: 'Époque Motors prepares romantic drives through Paris in a 1970s classic car with a private chauffeur: the route follows the Seine and its bridges and ends at the place you have chosen for your proposal. Timing and itinerary are agreed discreetly with you, by enquiry.',
      sections: [
        {
          h2: 'Why a vintage car for a proposal',
          p: [
            'A drive in a classic car sets the scene without giving anything away: your partner thinks of a stroll through Paris, while the car takes you towards the place of the question.',
            'The chauffeur drives, you sit together on the rear bench and watch the city go by. At the chosen spot, the car stops and waits for you.',
          ],
        },
        {
          h2: 'Places in Paris to pop the question',
          stops: [
            { name: 'Pont Alexandre III', text: 'Its gilded statues and lamps, with the Invalides on one side and the Grand Palais on the other.' },
            { name: 'Trocadéro', text: 'The esplanade facing the Eiffel Tower, across the Seine. After dark, the tower sparkles for five minutes at the start of every hour.' },
            { name: 'Place Dauphine', text: 'A quiet triangular square on the Île de la Cité, a few steps from the Pont Neuf.' },
            { name: 'Quai d’Orléans, Île Saint-Louis', text: 'A peaceful quay with a view over the apse of Notre-Dame.' },
            { name: 'Montmartre', text: 'Narrow streets and views over the rooftops of Paris, below the Sacré-Cœur.' },
          ],
        },
        {
          h2: 'Preparing it with us',
          p: [
            'Tell us your date, the time of day you prefer and the place you have in mind. We suggest a route, agree the meeting point (your hotel, for instance) and the timing, and send a proposal with its rate before any commitment.',
            'If a photographer is joining you, we coordinate the timing of the arrival so that the moment is captured.',
          ],
        },
      ],
      faq: [
        {
          q: 'Can the chauffeur stay discreet?',
          a: 'Yes. The plan is agreed with you only, and the chauffeur follows the agreed route and timing.',
        },
        {
          q: 'Can we go on to a restaurant after the proposal?',
          a: 'Yes, the car can drive you on to another address. Tell us where in your enquiry.',
        },
      ],
      cta: 'Prepare your proposal',
    },
    fr: {
      path: 'fr/demande-en-mariage-voiture-ancienne-paris/',
      title: 'Demande en mariage à Paris en voiture de collection',
      description:
        'Préparez votre demande en mariage à Paris à bord d’une voiture des années 1970 avec chauffeur : une balade le long de la Seine jusqu’au lieu choisi.',
      h1: 'Une demande en mariage à Paris, en voiture de collection',
      nav: 'Demande en mariage',
      lead: 'Époque Motors prépare des balades romantiques dans Paris à bord d’une voiture de collection des années 1970, avec un chauffeur privé : l’itinéraire suit la Seine et ses ponts et se termine à l’endroit choisi pour votre demande. Horaires et parcours sont convenus discrètement avec vous, sur demande.',
      sections: [
        {
          h2: 'Pourquoi une voiture d’époque pour une demande',
          p: [
            'Une balade en voiture de collection installe le décor sans rien dévoiler : votre moitié pense à une promenade dans Paris, pendant que la voiture vous emmène vers le lieu de la question.',
            'Le chauffeur conduit, vous êtes installés ensemble sur la banquette arrière et regardez défiler la ville. À l’endroit choisi, la voiture s’arrête et vous attend.',
          ],
        },
        {
          h2: 'Des lieux à Paris pour faire votre demande',
          stops: [
            { name: 'Pont Alexandre III', text: 'Ses statues dorées et ses lampadaires, les Invalides d’un côté, le Grand Palais de l’autre.' },
            { name: 'Trocadéro', text: 'L’esplanade face à la tour Eiffel, de l’autre côté de la Seine. À la nuit tombée, la tour scintille cinq minutes au début de chaque heure.' },
            { name: 'Place Dauphine', text: 'Une place triangulaire et calme sur l’île de la Cité, à deux pas du Pont-Neuf.' },
            { name: 'Quai d’Orléans, île Saint-Louis', text: 'Un quai paisible, avec vue sur le chevet de Notre-Dame.' },
            { name: 'Montmartre', text: 'Des rues étroites et des vues sur les toits de Paris, au pied du Sacré-Cœur.' },
          ],
        },
        {
          h2: 'La préparer avec nous',
          p: [
            'Indiquez-nous la date, le moment de la journée que vous préférez et le lieu auquel vous pensez. Nous proposons un itinéraire, convenons du point de rendez-vous (votre hôtel, par exemple) et des horaires, puis vous envoyons une proposition chiffrée avant tout engagement.',
            'Si un photographe vous accompagne, nous coordonnons l’heure d’arrivée pour que le moment soit immortalisé.',
          ],
        },
      ],
      faq: [
        {
          q: 'Le chauffeur peut-il rester discret ?',
          a: 'Oui. Le programme est convenu avec vous seul, et le chauffeur suit l’itinéraire et les horaires prévus.',
        },
        {
          q: 'Pouvons-nous continuer vers un restaurant après la demande ?',
          a: 'Oui, la voiture peut vous conduire à une autre adresse. Précisez-la dans votre demande.',
        },
      ],
      cta: 'Préparer votre demande',
    },
  },
  {
    id: 'photoshoot',
    kind: 'service',
    parent: 'events',
    experience: 'events',
    cars: ['citroen-ds', 'peugeot-504', 'mercedes-benz-classic'],
    image: car('citroen-ds', 1),
    related: ['wedding', 'guides', 'collection', 'car-ds'],
    updated: '2026-11-09',
    en: {
      path: 'vintage-car-photoshoot-paris/',
      title: 'Vintage Car for a Photoshoot in Paris | Époque Motors',
      description:
        'A 1970s classic car for your photoshoot in Paris: fashion, brand, couple or wedding photos with a Citroën DS 21, Peugeot 504 or Mercedes W115. By enquiry.',
      h1: 'A vintage car for your photoshoot in Paris',
      nav: 'Photoshoot',
      lead: 'Époque Motors provides three 1970s cars for professional and personal photoshoots in Paris and its surroundings: a Citroën DS 21 Henri Chapron, a Peugeot 504 GL and a Mercedes W115 220D. The car comes with its chauffeur, who places it where your photographer needs it, by enquiry.',
      sections: [
        {
          h2: 'The car as subject or as setting',
          p: [
            'A classic car gives a period and a mood to an image. It can be the subject of the photograph, frame a portrait, or appear in the background of a Parisian street.',
            'Our cars suit fashion and brand shoots, couple sessions, engagement photos and wedding reportages alike.',
          ],
        },
        {
          h2: 'Colours and details',
          list: [
            'Citroën DS 21 Henri Chapron: anthracite grey body, tan leather seats, single-spoke steering wheel.',
            'Peugeot 504 GL: blue body and grey cabin, with the clean lines of the late 1960s.',
            'Mercedes W115 220D: ivory body, ivory steering wheel, burr walnut dashboard and beige upholstery.',
          ],
        },
        {
          h2: 'Where to photograph a vintage car in Paris',
          stops: [
            { name: 'Pont de Bir-Hakeim', text: 'Its metal structure and the view of the Eiffel Tower, close to the Seine.' },
            { name: 'Place de la Concorde and the quays', text: 'Wide perspectives, fountains and the obelisk.' },
            { name: 'Île Saint-Louis', text: 'Stone façades and quiet quays, early in the morning.' },
            { name: 'Montmartre', text: 'Cobbled streets, slopes and village atmosphere.' },
            { name: 'Avenue Montaigne and the Golden Triangle', text: 'Haussmann buildings and fashion house fronts.' },
          ],
        },
        {
          h2: 'Practical details',
          p: [
            'Send us the date, the type of shoot and the locations in your enquiry. We agree the timing and the positioning of the car with you and send a proposal with its rate. A shoot lasts from one hour to a full day.',
            'Depending on the scale of a professional shoot, working in a public space in Paris may require an authorisation from the city: your production team will know what applies.',
          ],
        },
      ],
      faq: [
        {
          q: 'Can the car be moved between shots?',
          a: 'Yes, the chauffeur drives and positions the car as your photographer needs, between locations or within the same street.',
        },
        {
          q: 'Are the photos on your site real?',
          a: 'The photos of the collection show our actual cars. The images marked “Illustrative image” are illustrations.',
        },
      ],
      cta: 'Enquire about your shoot',
    },
    fr: {
      path: 'fr/shooting-photo-voiture-ancienne-paris/',
      title: 'Voiture ancienne pour shooting photo à Paris',
      description:
        'Une voiture des années 1970 pour votre shooting photo à Paris : mode, marque, couple ou mariage, avec une DS 21, une 504 ou une Mercedes W115. Sur demande.',
      h1: 'Une voiture ancienne pour votre shooting photo à Paris',
      nav: 'Shooting photo',
      lead: 'Époque Motors met trois voitures des années 1970 à disposition des shootings photo professionnels et personnels, à Paris et dans ses environs : une Citroën DS 21 Henri Chapron, une Peugeot 504 GL et une Mercedes W115 220D. La voiture vient avec son chauffeur, qui la place là où votre photographe en a besoin, sur demande.',
      sections: [
        {
          h2: 'La voiture en vedette ou en décor',
          p: [
            'Une voiture de collection donne une époque et une atmosphère à une image. Elle peut être le sujet de la photo, encadrer un portrait ou apparaître au second plan d’une rue parisienne.',
            'Nos voitures conviennent aussi bien aux shootings de mode et de marque qu’aux séances de couple, aux photos de fiançailles et aux reportages de mariage.',
          ],
        },
        {
          h2: 'Couleurs et détails',
          list: [
            'Citroën DS 21 Henri Chapron : carrosserie gris anthracite, sièges en cuir fauve, volant monobranche.',
            'Peugeot 504 GL : carrosserie bleue et habitacle gris, aux lignes nettes de la fin des années 1960.',
            'Mercedes W115 220D : carrosserie ivoire, volant ivoire, planche de bord en ronce de noyer et sellerie beige.',
          ],
        },
        {
          h2: 'Où photographier une voiture ancienne à Paris',
          stops: [
            { name: 'Pont de Bir-Hakeim', text: 'Sa structure métallique et la vue sur la tour Eiffel, au bord de la Seine.' },
            { name: 'Place de la Concorde et les quais', text: 'De grandes perspectives, les fontaines et l’obélisque.' },
            { name: 'Île Saint-Louis', text: 'Façades de pierre et quais tranquilles, tôt le matin.' },
            { name: 'Montmartre', text: 'Rues pavées, pentes et ambiance de village.' },
            { name: 'Avenue Montaigne et le Triangle d’or', text: 'Immeubles haussmanniens et devantures des maisons de couture.' },
          ],
        },
        {
          h2: 'En pratique',
          p: [
            'Précisez dans votre demande la date, le type de shooting et les lieux. Nous convenons avec vous des horaires et du placement de la voiture, puis vous envoyons une proposition chiffrée. Un shooting dure d’une heure à une journée entière.',
            'Selon l’ampleur d’un shooting professionnel, travailler sur l’espace public à Paris peut nécessiter une autorisation de la Ville : votre équipe de production saura ce qui s’applique.',
          ],
        },
      ],
      faq: [
        {
          q: 'La voiture peut-elle être déplacée entre deux prises ?',
          a: 'Oui, le chauffeur conduit et place la voiture selon les besoins de votre photographe, d’un lieu à l’autre ou dans la même rue.',
        },
        {
          q: 'Les photos de votre site sont-elles réelles ?',
          a: 'Les photos de la collection montrent nos vraies voitures. Les images marquées « Image d’illustration » sont des illustrations.',
        },
      ],
      cta: 'Parler de votre shooting',
    },
  },
  {
    id: 'tours',
    kind: 'service',
    experience: 'private-tours',
    cars: ['citroen-ds', 'peugeot-504', 'mercedes-benz-classic'],
    image: img('private-tours'),
    related: ['guides', 'chauffeur', 'collection', 'events'],
    updated: '2026-11-09',
    en: {
      path: 'vintage-car-tour-paris/',
      title: 'Private Vintage Car Tour of Paris, with Chauffeur',
      description:
        'Discover Paris on a private tour in a 1970s classic car with chauffeur: the Eiffel Tower, the Left Bank, Belleville, the Canal Saint-Martin. In English or French.',
      h1: 'Private vintage car tours of Paris',
      nav: 'Paris tours',
      lead: 'Époque Motors offers private tours of Paris aboard 1970s classic cars, a Citroën DS 21 Henri Chapron, a Peugeot 504 GL or a Mercedes W115 220D, driven by a chauffeur. Tours last from one hour to a full day, in English or in French, along a route agreed with you.',
      sections: [
        {
          h2: 'Paris at a gentler pace',
          p: [
            'A private tour in a vintage car is a way to see Paris away from the coach tours: you sit back on the rear bench, the windows open on the city, and the chauffeur takes you from one landmark to the next.',
            'You choose the pace. The car can slow down along the Seine, stop for a photograph in front of the Eiffel Tower or wait while you walk across a bridge.',
          ],
        },
        {
          h2: 'Five routes from our Paris Guides',
          list: [
            'Timeless Paris: from the Concorde to the Champ-de-Mars, by Pont Alexandre III (about 1 hr 30).',
            'Left Bank Elegance: from Saint-Sulpice to Parc Montsouris, by the Butte-aux-Cailles (about 2 hrs).',
            'The Villages of East Paris: from the Bastille to the Buttes-Chaumont, by Belleville (about 2 hrs 30).',
            'Gardens and Perspectives: from the Trocadéro to the Île aux Cygnes, by the Pont de Bir-Hakeim (about 1 hr 45).',
            'Bohemian Paris: from the Opéra Garnier to the Bassin de la Villette, along the Canal Saint-Martin (about 3 hrs).',
          ],
          p: ['Each route is a starting point: we adapt it to your time, your interests, the traffic of the day and your meeting point.'],
        },
        {
          h2: 'Who it is for',
          p: [
            'Visitors discovering Paris for the first time, Parisians who want to see their city differently, couples, families and friends celebrating an occasion. Tours are private: the car is yours for the duration of the experience.',
          ],
        },
        {
          h2: 'Booking a tour',
          p: [
            'Send us your date, the length of tour you would like and your meeting point (your hotel, for instance). We reply personally with a route and a proposal with its rate, before any commitment. There is no online payment.',
          ],
        },
      ],
      faq: [
        {
          q: 'How long does a vintage car tour of Paris last?',
          a: 'From one hour to a full day. The five routes of our Paris Guides last from about 1 hr 30 to 3 hrs 30, stops included.',
        },
        {
          q: 'Is the tour guided?',
          a: 'Yes, the tour is private and guided, in English or in French.',
        },
        {
          q: 'Can you pick us up at our hotel?',
          a: 'The meeting point is agreed with you when preparing the tour: it can be your hotel or another address in Paris.',
        },
        {
          q: 'Can we stop along the way?',
          a: 'Yes, stops for photographs or a short walk are planned with you as part of the route.',
        },
      ],
      cta: 'Enquire about a private tour',
    },
    fr: {
      path: 'fr/visite-paris-voiture-ancienne/',
      title: 'Visite privée de Paris en voiture ancienne avec chauffeur',
      description:
        'Découvrez Paris lors d’une visite privée en voiture des années 1970 avec chauffeur : tour Eiffel, rive gauche, Belleville, canal Saint-Martin. En français.',
      h1: 'Visites privées de Paris en voiture de collection',
      nav: 'Visites de Paris',
      lead: 'Époque Motors propose des visites privées de Paris à bord de voitures de collection des années 1970, une Citroën DS 21 Henri Chapron, une Peugeot 504 GL ou une Mercedes W115 220D, conduites par un chauffeur. Une visite dure d’une heure à une journée, en français ou en anglais, selon un itinéraire convenu avec vous.',
      sections: [
        {
          h2: 'Paris à un rythme plus doux',
          p: [
            'Une visite privée en voiture d’époque, c’est découvrir Paris loin des circuits en autocar : vous êtes installés sur la banquette arrière, les vitres ouvertes sur la ville, et le chauffeur vous emmène d’un monument à l’autre.',
            'Vous choisissez le rythme. La voiture peut ralentir le long de la Seine, s’arrêter pour une photo devant la tour Eiffel ou vous attendre le temps de traverser un pont à pied.',
          ],
        },
        {
          h2: 'Cinq itinéraires de nos Guides de Paris',
          list: [
            'Paris intemporel : de la Concorde au Champ-de-Mars, par le pont Alexandre III (environ 1 h 30).',
            'L’élégance de la rive gauche : de Saint-Sulpice au parc Montsouris, par la Butte-aux-Cailles (environ 2 h).',
            'Les villages de l’Est parisien : de la Bastille aux Buttes-Chaumont, par Belleville (environ 2 h 30).',
            'Paris côté jardins et perspectives : du Trocadéro à l’île aux Cygnes, par le pont de Bir-Hakeim (environ 1 h 45).',
            'Paris bohème et confidentiel : de l’Opéra Garnier au bassin de la Villette, le long du canal Saint-Martin (environ 3 h).',
          ],
          p: ['Chaque itinéraire est un point de départ : nous l’adaptons à votre temps, à vos envies, à la circulation du jour et à votre point de rendez-vous.'],
        },
        {
          h2: 'Pour qui',
          p: [
            'Les visiteurs qui découvrent Paris, les Parisiens qui veulent voir leur ville autrement, les couples, les familles et les amis qui fêtent une occasion. La visite est privée : la voiture est à vous le temps de l’expérience.',
          ],
        },
        {
          h2: 'Réserver une visite',
          p: [
            'Indiquez-nous la date, la durée souhaitée et votre point de rendez-vous (votre hôtel, par exemple). Nous vous répondons personnellement avec un itinéraire et une proposition chiffrée, avant tout engagement. Aucun paiement en ligne.',
          ],
        },
      ],
      faq: [
        {
          q: 'Combien de temps dure une visite de Paris en voiture ancienne ?',
          a: 'D’une heure à une journée entière. Les cinq itinéraires de nos Guides de Paris durent d’environ 1 h 30 à 3 h 30, arrêts compris.',
        },
        {
          q: 'La visite est-elle guidée ?',
          a: 'Oui, la visite est privée et guidée, en français ou en anglais.',
        },
        {
          q: 'Pouvez-vous venir nous chercher à notre hôtel ?',
          a: 'Le point de rendez-vous est convenu avec vous lors de la préparation : il peut s’agir de votre hôtel ou d’une autre adresse à Paris.',
        },
        {
          q: 'Peut-on s’arrêter en chemin ?',
          a: 'Oui, les arrêts pour une photo ou une courte promenade sont prévus avec vous dans l’itinéraire.',
        },
      ],
      cta: 'Demander une visite privée',
    },
  },
  {
    id: 'chauffeur',
    kind: 'service',
    experience: 'chauffeured',
    cars: ['citroen-ds', 'mercedes-benz-classic', 'peugeot-504'],
    image: img('chauffeured'),
    related: ['tours', 'wedding', 'car-ds', 'rental'],
    updated: '2026-11-09',
    en: {
      path: 'vintage-car-chauffeur-paris/',
      title: 'Vintage Car with Chauffeur in Paris | Époque Motors',
      description:
        'Be driven through Paris in a 1970s classic car with a private chauffeur: Citroën DS 21 Henri Chapron, Mercedes W115 or Peugeot 504. By enquiry.',
      h1: 'A vintage car with chauffeur in Paris',
      nav: 'Chauffeur',
      lead: 'Époque Motors provides 1970s classic cars with a private chauffeur in Paris and its surroundings: a Citroën DS 21 Henri Chapron, a Mercedes W115 220D or a Peugeot 504 GL. For a special address, an evening out or a journey you want to remember, from one hour to a full day, by enquiry.',
      sections: [
        {
          h2: 'Some journeys deserve more than an ordinary ride',
          p: [
            'Arriving at a dinner, a gala, an anniversary or a family celebration in a vintage car turns the journey into part of the occasion. The chauffeur opens the door, takes you to the address and comes back for you when you are ready.',
            'You can also simply enjoy being driven through Paris, at your own pace, in a car with character.',
          ],
        },
        {
          h2: 'The cars',
          list: [
            'Citroën DS 21 Henri Chapron (1971): offered with a chauffeur only; its hydropneumatic suspension is known for its smooth ride.',
            'Mercedes W115 220D (1973): ivory, with a burr walnut dashboard.',
            'Peugeot 504 GL (1971): blue, with a grey cabin.',
          ],
        },
        {
          h2: 'How it works',
          p: [
            'Tell us the date, the addresses and the timing in the enquiry form. We reply personally and send a proposal with its rate before any commitment. The chauffeur speaks English and French.',
          ],
        },
      ],
      faq: [
        {
          q: 'Can the chauffeur wait for us?',
          a: 'Yes, the waiting time is planned with you and included in the duration of the experience, from one hour to a full day.',
        },
        {
          q: 'Which car is offered only with a chauffeur?',
          a: 'The Citroën DS 21 Henri Chapron. The Peugeot 504 GL and the Mercedes W115 220D can come with a chauffeur or, on enquiry and subject to conditions, be driven by you.',
        },
      ],
      cta: 'Enquire about a chauffeured journey',
    },
    fr: {
      path: 'fr/voiture-collection-avec-chauffeur-paris/',
      title: 'Voiture de collection avec chauffeur à Paris',
      description:
        'Laissez-vous conduire dans Paris en voiture des années 1970 avec chauffeur privé : Citroën DS 21 Henri Chapron, Mercedes W115 ou Peugeot 504. Sur demande.',
      h1: 'Une voiture de collection avec chauffeur à Paris',
      nav: 'Chauffeur',
      lead: 'Époque Motors met à disposition des voitures de collection des années 1970 avec chauffeur privé, à Paris et dans ses environs : une Citroën DS 21 Henri Chapron, une Mercedes W115 220D ou une Peugeot 504 GL. Pour une adresse particulière, une soirée ou un trajet dont on se souvient, d’une heure à une journée, sur demande.',
      sections: [
        {
          h2: 'Certains trajets méritent mieux qu’un simple déplacement',
          p: [
            'Arriver à un dîner, un gala, un anniversaire ou une fête de famille en voiture d’époque fait du trajet une partie de l’occasion. Le chauffeur vous ouvre la portière, vous conduit à l’adresse et revient vous chercher quand vous êtes prêts.',
            'Vous pouvez aussi simplement vous laisser conduire dans Paris, à votre rythme, dans une voiture de caractère.',
          ],
        },
        {
          h2: 'Les voitures',
          list: [
            'Citroën DS 21 Henri Chapron (1971) : proposée uniquement avec chauffeur ; sa suspension hydropneumatique est réputée pour son confort.',
            'Mercedes W115 220D (1973) : ivoire, planche de bord en ronce de noyer.',
            'Peugeot 504 GL (1971) : bleue, habitacle gris.',
          ],
        },
        {
          h2: 'Comment ça se passe',
          p: [
            'Indiquez la date, les adresses et les horaires dans le formulaire de demande. Nous vous répondons personnellement et vous envoyons une proposition chiffrée avant tout engagement. Le chauffeur parle français et anglais.',
          ],
        },
      ],
      faq: [
        {
          q: 'Le chauffeur peut-il nous attendre ?',
          a: 'Oui, le temps d’attente est prévu avec vous et compris dans la durée de l’expérience, d’une heure à une journée entière.',
        },
        {
          q: 'Quelle voiture est proposée uniquement avec chauffeur ?',
          a: 'La Citroën DS 21 Henri Chapron. La Peugeot 504 GL et la Mercedes W115 220D peuvent être conduites par notre chauffeur ou, sur demande et sous conditions, par vous.',
        },
      ],
      cta: 'Demander un trajet avec chauffeur',
    },
  },
  {
    id: 'rental',
    kind: 'service',
    cars: ['peugeot-504', 'mercedes-benz-classic', 'citroen-ds'],
    image: car('peugeot-504'),
    related: ['collection', 'chauffeur', 'events', 'tours', 'faq'],
    updated: '2026-11-09',
    en: {
      path: 'classic-car-rental-paris/',
      title: 'Classic Car Rental in Paris, With or Without Chauffeur',
      description:
        'Rent a 1970s classic car in Paris: Peugeot 504 GL and Mercedes W115 220D with or without chauffeur, Citroën DS 21 with chauffeur. From one hour to a day.',
      h1: 'Classic car rental in Paris',
      nav: 'Classic car rental',
      lead: 'Époque Motors rents three 1970s classic cars in Paris, by enquiry: the Peugeot 504 GL and the Mercedes W115 220D, with a chauffeur or driven by you on conditions, and the Citroën DS 21 Henri Chapron, with a chauffeur only. Rentals last from one hour to a full day.',
      sections: [
        {
          h2: 'Three cars, two ways to enjoy them',
          p: [
            'With a chauffeur, you sit back and enjoy the city: this is the formula for tours, weddings and evenings out, and the only one offered for the Citroën DS.',
            'Without a chauffeur, you take the wheel of a car from the early 1970s. The Peugeot 504 GL and the Mercedes W115 220D both have a manual gearbox and rear-wheel drive. Driving without a chauffeur is offered on enquiry and subject to conditions, set out in our proposal.',
          ],
        },
        {
          h2: 'What people rent a classic car for',
          list: [
            'A wedding or a marriage proposal.',
            'A private tour of Paris.',
            'A professional or personal photoshoot.',
            'A birthday, an anniversary or a gift to yourself: the pleasure of driving or being driven in a period car.',
          ],
        },
        {
          h2: 'How to rent',
          p: [
            'Send an enquiry with your date, the car you have in mind and the formula (with or without chauffeur). We reply personally and send a proposal with the rate and the conditions before any commitment. There is no online payment and no availability shown online: every request is answered one by one.',
          ],
        },
      ],
      faq: [
        {
          q: 'Can I rent a classic car in Paris without a chauffeur?',
          a: 'Yes, the Peugeot 504 GL and the Mercedes W115 220D can be driven without a chauffeur, on enquiry and subject to conditions. The Citroën DS 21 Henri Chapron is offered with a chauffeur only.',
        },
        {
          q: 'Are the cars manual or automatic?',
          a: 'The Peugeot 504 GL and the Mercedes W115 220D have a manual gearbox.',
        },
        {
          q: 'What is the minimum rental duration?',
          a: 'One hour. A rental can last up to a full day.',
        },
      ],
      cta: 'Enquire about a rental',
    },
    fr: {
      path: 'fr/location-voiture-collection-paris/',
      title: 'Location de voiture de collection à Paris, avec ou sans chauffeur',
      description:
        'Louez une voiture des années 1970 à Paris : Peugeot 504 GL et Mercedes W115 220D avec ou sans chauffeur, Citroën DS 21 avec chauffeur. D’une heure à un jour.',
      h1: 'Location de voiture de collection à Paris',
      nav: 'Location de voiture de collection',
      lead: 'Époque Motors loue trois voitures de collection des années 1970 à Paris, sur demande : la Peugeot 504 GL et la Mercedes W115 220D, avec chauffeur ou conduites par vous sous conditions, et la Citroën DS 21 Henri Chapron, uniquement avec chauffeur. Une location dure d’une heure à une journée.',
      sections: [
        {
          h2: 'Trois voitures, deux façons d’en profiter',
          p: [
            'Avec chauffeur, vous vous installez et profitez de la ville : c’est la formule des visites, des mariages et des soirées, et la seule proposée pour la Citroën DS.',
            'Sans chauffeur, vous prenez le volant d’une voiture du début des années 1970. La Peugeot 504 GL et la Mercedes W115 220D ont toutes deux une boîte manuelle et une propulsion. La conduite sans chauffeur est proposée sur demande et sous conditions, précisées dans notre proposition.',
          ],
        },
        {
          h2: 'Pourquoi louer une voiture de collection',
          list: [
            'Un mariage ou une demande en mariage.',
            'Une visite privée de Paris.',
            'Un shooting photo professionnel ou personnel.',
            'Un anniversaire, ou simplement le plaisir de conduire ou d’être conduit dans une voiture d’époque.',
          ],
        },
        {
          h2: 'Comment louer',
          p: [
            'Envoyez une demande avec la date, la voiture souhaitée et la formule (avec ou sans chauffeur). Nous vous répondons personnellement et vous adressons une proposition avec le tarif et les conditions, avant tout engagement. Ni paiement ni disponibilités en ligne : chaque demande reçoit une réponse personnelle.',
          ],
        },
      ],
      faq: [
        {
          q: 'Peut-on louer une voiture de collection à Paris sans chauffeur ?',
          a: 'Oui, la Peugeot 504 GL et la Mercedes W115 220D peuvent être conduites sans chauffeur, sur demande et sous conditions. La Citroën DS 21 Henri Chapron est proposée uniquement avec chauffeur.',
        },
        {
          q: 'Les voitures ont-elles une boîte manuelle ou automatique ?',
          a: 'La Peugeot 504 GL et la Mercedes W115 220D ont une boîte de vitesses manuelle.',
        },
        {
          q: 'Quelle est la durée minimale de location ?',
          a: 'Une heure. Une location peut durer jusqu’à une journée entière.',
        },
      ],
      cta: 'Demander une location',
    },
  },
];

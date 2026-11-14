# Époque Motors : référencement (SEO) et recommandation par les IA (GEO)

Ce document explique ce qui a été mis en place sur le site, ce que chaque page vise, et ce qu’il reste à faire
**hors du site**. Pour le détail technique, voir `PROJECT_CONTEXT.md` § 9.

Aucun site ne peut se voir garantir une position, ni sur Google ni dans les réponses d’une IA. Le site est
désormais construit pour être lu, compris et cité. La suite dépend surtout des signaux extérieurs : avis, fiches
d’établissement, plateformes d’activités, articles, liens. La partie 4 les classe par ordre de priorité.

---

## 1. Ce qui a changé sur le site

| Avant | Maintenant |
|---|---|
| Une seule page, rendue en JavaScript. Les robots des IA (ChatGPT, Claude, Perplexity…), qui n’exécutent pas le JavaScript, ne voyaient qu’une phrase. | L’accueil est pré-rendu en HTML, en français (`/fr/`) et en anglais (`/`). Tout le texte est lisible sans JavaScript. |
| Une seule adresse, avec la langue en `?lang=fr` | Une adresse par langue, reliées par `hreflang` |
| 1 page indexable | **42 pages** : 2 accueils et 20 pages de contenu, chacune en français et en anglais |
| Balises sociales et canonical sur un domaine fictif | Adresse réelle du site (`https://epoquemotors.fr`) injectée au build sur Cloudflare (variable `VITE_SITE_URL`) |
| Données structurées minimales | Graphe schema.org complet : entreprise (`AutoRental`), services, voitures (`Car`), itinéraires (`TouristTrip`), articles, FAQ, fil d’Ariane |
| `robots.txt` minimal | `robots.txt` ouvert à tous, robots IA nommés explicitement, sitemap déclaré |
| Pas de sitemap | `sitemap.xml` avec les deux langues et les images de chaque page |
| — | `llms.txt` et `llms-full.txt` : carte du site et texte intégral, lisibles directement par les assistants IA |
| — | Liens discrets depuis l’accueil vers les nouvelles pages (chapitres, fiche voiture, Bon à savoir, À propos, pied de page) |
| — | Liens « Parler de votre mariage », etc. qui ouvrent le formulaire déjà rempli (expérience et voiture) |

Les pages de contenu sont du HTML statique, sans JavaScript, dans la charte du site : ivoire, vert forêt,
Cormorant, sans arrondi, sans carte ni ombre. Elles s’affichent instantanément.

---

## 2. Carte des pages et recherches visées

Chaque page répond à une famille de recherches. Elle commence par une réponse de deux ou trois phrases qui nomme
Époque Motors : c’est le passage que Google et les IA reprennent.

### Services

| Page | Adresse FR | Adresse EN | Recherches visées (exemples) |
|---|---|---|---|
| Événements | `/fr/location-voiture-collection-evenement-paris/` | `/vintage-car-hire-events-paris/` | location voiture de collection événement, voiture ancienne anniversaire Paris, vintage car hire Paris event |
| Voiture de mariage | `/fr/voiture-mariage-collection-paris/` | `/vintage-wedding-car-paris/` | voiture de mariage Paris, location voiture ancienne mariage, voiture mariage avec chauffeur Île-de-France, Paris wedding car |
| Demande en mariage | `/fr/demande-en-mariage-voiture-ancienne-paris/` | `/marriage-proposal-vintage-car-paris/` | idée demande en mariage Paris, où faire sa demande à Paris, Paris proposal ideas |
| Shooting photo | `/fr/shooting-photo-voiture-ancienne-paris/` | `/vintage-car-photoshoot-paris/` | voiture ancienne shooting photo Paris, location voiture vintage photo, vintage car photoshoot Paris |
| Visites de Paris | `/fr/visite-paris-voiture-ancienne/` | `/vintage-car-tour-paris/` | visite de Paris en voiture ancienne, balade Paris voiture de collection, vintage car tour Paris, classic car tour Paris |
| Avec chauffeur | `/fr/voiture-collection-avec-chauffeur-paris/` | `/vintage-car-chauffeur-paris/` | voiture de collection avec chauffeur, voiture ancienne avec chauffeur Paris, vintage car with driver Paris |
| Location | `/fr/location-voiture-collection-paris/` | `/classic-car-rental-paris/` | location voiture de collection Paris, louer une voiture ancienne Paris, classic car rental Paris |

### La collection

| Page | Adresse FR | Recherches visées |
|---|---|---|
| La collection | `/fr/collection/` | voitures de collection Paris, location Citroën DS, Peugeot 504, Mercedes W115 |
| Citroën DS 21 Henri Chapron | `/fr/collection/citroen-ds-21-henri-chapron-1971/` | location DS Paris, DS 21 mariage, Citroën DS avec chauffeur |
| Peugeot 504 GL | `/fr/collection/peugeot-504-gl-1971/` | location Peugeot 504, 504 mariage |
| Mercedes W115 220D | `/fr/collection/mercedes-w115-220d-1973/` | location Mercedes ancienne mariage, Mercedes W115 location |

Adresses anglaises : les mêmes sans `/fr`.

### Les Guides de Paris : les pages que les IA citent quand on leur demande « que faire à Paris »

Rubrique accessible depuis le menu principal (« Guides ») et depuis le chapitre N°2 de l’accueil. Les cinq
itinéraires n’ont plus de page à eux : chacun s’ouvre en pop-in dans la page des guides, à son ancre.

| Contenu | Adresse FR | Adresse EN | Recherches visées |
|---|---|---|---|
| Paris, autrement. (page des guides) | `/fr/guides/` | `/guides/` | itinéraire touristique Paris, découvrir Paris autrement, Paris vintage tour, classic car tour Paris |
| N°01 Paris intemporel | `/fr/guides/#paris-intemporel` | `/guides/#timeless-paris` | balade en voiture ancienne Paris, première visite de Paris |
| N°02 L’élégance de la rive gauche | `/fr/guides/#elegance-rive-gauche` | `/guides/#left-bank-elegance` | rive gauche Paris balade, Butte-aux-Cailles |
| N°03 Les villages de l’Est parisien | `/fr/guides/#villages-est-parisien` | `/guides/#villages-of-east-paris` | Paris insolite, Belleville, Buttes-Chaumont |
| N°04 Paris côté jardins et perspectives | `/fr/guides/#jardins-perspectives` | `/guides/#gardens-and-perspectives` | spots photo Paris, Bir-Hakeim |
| N°05 Paris bohème et confidentiel | `/fr/guides/#paris-boheme-confidentiel` | `/guides/#bohemian-paris` | canal Saint-Martin balade, Paris bohème |
| Activités insolites à Paris : 10 idées | `/fr/guides/activites-insolites-a-paris/` | `/guides/unusual-things-to-do-in-paris/` | activités insolites Paris, unusual things to do in Paris |
| Choisir sa voiture de mariage ancienne | `/fr/guides/choisir-sa-voiture-de-mariage-ancienne/` | `/guides/how-to-choose-a-vintage-wedding-car/` | choisir voiture de mariage |

**Effet des pop-ins sur le référencement.** Le texte complet des cinq fiches est dans le HTML de la page des
guides, avec leurs données structurées (`TouristTrip`, coordonnées de chaque étape), et `llms-full.txt` le
reprend : Google et les IA le lisent. En revanche, un itinéraire ne peut plus apparaître seul dans Google
avec son propre titre : c’est la page des guides qui se positionne pour l’ensemble, et un texte masqué
jusqu’au clic pèse un peu moins. Les anciennes adresses des itinéraires redirigent vers la bonne fiche. Si un
itinéraire devient important pour l’acquisition, lui redonner une page reste possible.

### Informations

FAQ (`/fr/faq/`, `/faq/`, 15 questions) et À propos (`/fr/a-propos/`, `/about/`), la page qui définit
l’entreprise pour les moteurs.

---

## 3. Pourquoi les IA peuvent désormais recommander le site

1. **Elles peuvent le lire.** Le texte est dans le HTML. `robots.txt` autorise nommément GPTBot, OAI-SearchBot,
   ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, Applebot, Bingbot, etc.
2. **Elles trouvent la réponse tout de suite.** Chaque page s’ouvre sur une réponse factuelle (qui, quoi, où,
   comment), suivie d’un encadré « En bref » : lieu, durée, langues, voitures, service, réservation.
3. **Les faits sont identiques partout.** Même nom, mêmes voitures, mêmes années, mêmes conditions sur
   toutes les pages, dans `llms.txt` et dans les données structurées. Les IA recommandent plus volontiers
   une entité décrite de façon cohérente.
4. **Les données structurées relient tout à une seule entreprise**, avec le même identifiant
   (`…/#business`) sur chaque page.
5. **Le format des pages se prête à la citation** : questions-réponses, itinéraires numérotés, listes,
   fiches techniques.
6. **`llms.txt` / `llms-full.txt`** donnent aux assistants la carte du site et son texte intégral.

---

## 4. À faire de ton côté, par ordre de priorité

### Priorité 1 : le socle

1. **Le domaine `epoquemotors.fr`**. Le site de production est hébergé sur Cloudflare Workers (fichiers
   statiques), à la racine du domaine : `robots.txt` et `llms.txt` y sont lus. Dans Cloudflare, rattache le
   domaine au Worker `epoque-motors` et pose la variable de build `VITE_SITE_URL=https://epoquemotors.fr` :
   c’est elle qui donne l’adresse des balises canonical, hreflang, Open Graph, du sitemap et de `llms.txt`.
2. **Les vraies coordonnées** dans `src/data/site.ts` : e-mail, téléphone, Instagram. Elles sont publiées
   automatiquement dans les données structurées dès qu’elles ne sont plus fictives. Une adresse postale,
   même de siège, renforce aussi la fiche locale.
3. **Google Search Console** et **Bing Webmaster Tools** : valide le domaine et soumets `sitemap.xml`.
   Bing compte beaucoup : ChatGPT Search et Copilot s’appuient notamment sur son index. Dans Bing, active aussi
   IndexNow.

### Priorité 2 : les signaux qui pèsent le plus pour les recherches locales et les IA

4. **Fiche Google Business Profile** (zone desservie : Paris et environs, sans adresse publique si besoin).
   Catégories proches de « location de voitures de collection », « location de voitures avec chauffeur » et
   « visites touristiques ». Ajoute les vraies photos des trois voitures, les services, des publications
   régulières, et réponds aux avis. C’est la source principale de Google Maps, des AI Overviews et de Gemini
   pour « activités à Paris ».
5. **Avis clients.** Après chaque expérience, demande un avis Google, puis TripAdvisor. Les assistants IA
   s’appuient beaucoup sur le volume et le contenu des avis.
6. **Plateformes d’activités**, très citées par les IA pour « things to do in Paris » : TripAdvisor (fiche
   « Activités »), GetYourGuide, Viator, Airbnb Expériences. Une fiche par itinéraire des Guides de Paris
   (Paris intemporel, rive gauche, Est parisien, jardins et perspectives, Paris bohème), avec un lien vers sa
   fiche (`/fr/guides/#paris-intemporel`…).
7. **Annuaires mariage** : Mariages.net, Zankyou, et les annuaires de prestataires des lieux de réception.
8. **Apple Business Connect** (Plans, Siri), **Bing Places**, **PagesJaunes**. Partout, le même nom
   « Époque Motors » et la même description. Tu peux reprendre telle quelle la phrase de `llms.txt`.

### Priorité 3 : la notoriété, que les IA lisent

9. **Articles et mentions** : Time Out Paris, Sortir à Paris, Le Bonbon, Paris Zigzag, blogs de mariage et de
   voyage, guides d’hôtels. Un article qui cite Époque Motors avec un lien vaut plus que dix pages de plus.
10. **Hôtels et concierges** (palaces, hôtels de charme) : un partenariat apporte des clients et des
    mentions.
11. **Réseaux** : Instagram (l’adresse du profil, une fois renseignée dans `site.ts`, est publiée en
    `sameAs`), Pinterest (mariage), YouTube (une courte vidéo par voiture). Garde partout le même nom.
12. **Communautés** : réponses utiles et honnêtes sur Reddit (r/paris, r/ParisTravelGuide) ou Quora, quand
    la question s’y prête. Pas de publicité déguisée.
13. **Wikidata**, plus tard, une fois la presse obtenue : une fiche « Époque Motors » aide les IA à
    reconnaître l’entité.

---

## 5. À vérifier par toi (contenus rédigés à partir des faits connus)

Les pages respectent les règles du site : pas de prix, pas de disponibilités, pas de nombre de convives,
pas de superlatifs. Quelques points découlent toutefois des informations existantes et demandent ta
confirmation. Corrige-les dans `src/content/` si besoin.

- **Itinéraires** : ils reprennent ton brief. Ce que j’ai ajouté, à vérifier : quelques repères bien établis
  (obélisque de Louxor, pont construit pour l’Exposition de 1900, colonne de Juillet, temple de la Sibylle aux
  Buttes-Chaumont, entrée de métro d’Hector Guimard à la porte Dauphine, réplique de la statue de la Liberté à
  l’île aux Cygnes, rotonde de la Villette) et la rue de chaque restaurant cité (Chez Gladines rue des
  Cinq-Diamants, Le Temps des Cerises rue de la Butte-aux-Cailles, La Marine quai de Valmy, Hôtel du Nord quai
  de Jemmapes). Les coordonnées des étapes, dans `src/content/routes.ts`, sont publiées dans les données structurées et serviront à la future carte.
- **Photos des itinéraires** : à fournir. Les cinq pages réutilisent pour l’instant des visuels du site
  (illustrations signalées comme telles et photos de tes voitures). Il faut une photo par itinéraire, avec ses
  droits d’utilisation et les plaques floutées : idéalement tes voitures sur place (pont Alexandre III,
  Butte-aux-Cailles, Belleville, Bir-Hakeim, canal Saint-Martin).
- **Point de rendez-vous à l’hôtel** : présenté comme une possibilité (« votre hôtel, par exemple »).
- **Décoration de la voiture** (mariage) : la page dit seulement que vous en convenez ensemble.
- **Coordination avec le photographe** (demande en mariage, mariage) : formulée comme un ajustement de
  l’heure d’arrivée.
- **Visites guidées** : reprend « visite guidée privée » du texte de l’accueil.
- **Histoire des modèles** (faits publics sur le modèle, pas sur ta voiture) :
  - DS : présentée au Salon de Paris en 1955 ; carrosserie de Flaminio Bertoni ; DS 21 (2 175 cm³) au milieu
    des années 1960 ; Henri Chapron, carrossier de Levallois-Perret, associé aux versions spéciales et aux
    cabriolets.
  - 504 : présentée en 1968, ligne Pininfarina, voiture européenne de l’année 1969, longue carrière en
    Afrique et en Amérique du Sud.
  - W115 : famille « Strich-Acht » (/8) lancée en 1968, dessinée sous la direction de Paul Bracq ; la 220 D
    est la version diesel.

---

## 6. Pages à ajouter quand l’offre sera confirmée

Ce sont des recherches fréquentes, laissées de côté faute de confirmation. Chaque page s’ajoute en quelques
lignes dans `src/content/` (voir `PROJECT_CONTEXT.md` § 9).

- **Idée cadeau / bon cadeau** (« offrir une balade en voiture de collection ») : très recherché en décembre
  et pour la fête des pères.
- **Événements d’entreprise** : séminaire, accueil de clients, lancement de produit.
- **Tournages** : film, clip, publicité (« location voiture ancienne tournage Paris »).
- **Transferts** gare, aéroport ou hôtel.
- **Excursions** : Giverny, Fontainebleau, Chantilly, Vaux-le-Vicomte, Champagne.
- **Lieux de mariage** : une page par grand lieu de réception d’Île-de-France desservi.
- **Autres langues** pour les visiteurs étrangers (espagnol, allemand, italien, portugais, chinois,
  japonais). L’architecture le permet, mais toutes les traductions doivent être relues.
- **Un ordre de prix** (« à partir de… ») : les IA répondent souvent à « combien coûte… ». C’est à toi de
  décider, la règle actuelle étant de ne publier aucun prix.

---

## 7. Suivre les résultats

- **Search Console / Bing Webmaster** : impressions et clics par page et par requête, chaque mois.
- **Test des IA**, une fois par mois, dans ChatGPT, Perplexity, Gemini, Claude et Copilot, avec des questions
  comme :
  - « Voiture de collection pour un mariage à Paris ? »
  - « Visite de Paris en voiture ancienne avec chauffeur »
  - « Unique things to do in Paris »
  - « Vintage car tour Paris »
  - « Location Citroën DS avec chauffeur à Paris »
  - « Idée originale de demande en mariage à Paris »

  Note si Époque Motors est cité, avec quelle source. Ces réponses évoluent avec les avis et les mentions
  (partie 4).
- **Fraîcheur** : à chaque modification d’une page, mets à jour sa date `updated` (reprise dans le sitemap
  et les données structurées). Un nouveau guide par mois ou par saison (Saint-Valentin, Journées du
  patrimoine, Noël) entretient le site.

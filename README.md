# Époque Motors | Website

Landing page for **ÉPOQUE MOTORS**, private vintage car experiences in Paris.
*Private vintage car experiences in Paris, by enquiry.*

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4. No other runtime dependency.

```bash
npm install
npm run dev        # local development
npm run build      # typecheck + production build in /dist
npm run preview    # serve the production build
```

## Deployment (GitHub Pages)

`.github/workflows/deploy.yml` builds the site and publishes `dist/` on every
push to `main`. In **Settings → Pages → Build and deployment → Source**, select
**GitHub Actions** (the “Deploy from a branch” mode publishes the raw sources,
which shows a blank page).

## Languages (EN / FR)

The site is bilingual, with an EN | FR switch in the header and footer.
Language is chosen from `?lang=fr`, then the visitor's previous choice, then the
browser language (English by default).

- Interface copy: `src/i18n/en.ts` and `src/i18n/fr.ts` (same keys, type-checked).
- Content (cars, experiences, image captions): `{ en, fr }` fields in `src/data/*.ts`.

Editorial rules: no long dashes, no superlatives, no unverified vehicle facts.

## Structure

```
src/
  data/            ← all editable content
    vehicles.ts      the collection (single source of truth)
    experiences.ts   the three services
    site.ts          navigation, contact details, hero & story images
    types.ts         MediaAsset / Vehicle / Experience types
  i18n/            dictionaries (en, fr) + language provider
  lib/enquiry.ts   form validation + submission service
  context/         enquiry pre-fill (vehicle / experience CTAs → form)
  components/      Header, HeroShowroom (the collection on display, ?car= deep link),
                   VehicleDetail (photo view), Hero (previous hero, not rendered),
                   Experiences, BrandStory, PracticalInfo, EnquiryForm, Footer,
                   LegalDialog, ui/* (Media, Button, LanguageToggle…)
  index.css        design tokens (colours, fonts, radii) + base styles
```

## Replacing the photography

Every image slot currently renders a labelled **“Image placeholder”** with an
art-direction brief. To replace one:

1. Put the file in `public/images/<section>/` (e.g. `public/images/collection/citroen-ds.jpg`).
   Recommended: WebP or high-quality JPEG, ~2400 px wide for full-bleed images,
   ~1400 px for cards, optionally with `-800`/`-1600` variants for `srcSet`.
2. Set `src` (and optionally `srcSet`, `focalPoint`, `credit`) on the matching
   `image` object in `src/data/*.ts`.

Collection images must show the **actual cars** of the collection.

## Adding a vehicle

Append an object to `vehicles` in `src/data/vehicles.ts`. The photo view and
the form’s “Preferred vehicle” list update automatically. A car appears in the
hero showroom (and the `?car=<slug>` deep link) once it has a `miniature`: a
cut-out WebP facing left in `public/images/showroom/`. Only add verified facts in `details` (year, colour, seats…).
Availability: `on-request` | `available` | `limited` | `unavailable` | `coming-soon`.

## Enquiry form

Frontend validation is complete. Submissions are sent as JSON (POST) to
`VITE_ENQUIRY_ENDPOINT` (see `.env.example`). **While no endpoint is set, the form
never claims success**: it states that nothing was sent and offers a pre-filled
email instead. A honeypot field filters basic bots.

## Before launch: to do

- Photos of the actual Citroën DS (current ones are third-party illustrations).
  Hero, experiences and story visuals are generated images, labelled
  “Illustrative image” on the site; replace them with real photography when available.
- Exact versions of the DS and the Mercedes (provisional names and partial specs in `src/data/vehicles.ts`).
- Real contact details & Instagram URL in `src/data/site.ts`.
- Production domain in `index.html` (canonical, Open Graph URLs).
- Legal Notice & Privacy Policy texts (`legal` keys in `src/i18n/en.ts` and `fr.ts`).
- Enquiry backend (form service, serverless function or CRM) + `VITE_ENQUIRY_ENDPOINT`.
- Final logotype, if one replaces the typographic wordmark.

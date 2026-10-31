# Époque Motors — Website

Landing page for **ÉPOQUE MOTORS**, private vintage car experiences in Paris.
*Driven by history. Experienced in Paris.*

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4. No other runtime dependency.

```bash
npm install
npm run dev        # local development
npm run build      # typecheck + production build in /dist
npm run preview    # serve the production build
```

## Structure

```
src/
  data/            ← all editable content
    vehicles.ts      the collection (single source of truth)
    experiences.ts   the three services
    site.ts          brand copy, navigation, contact details, hero & story images
    types.ts         MediaAsset / Vehicle / Experience types
  lib/enquiry.ts   form validation + submission service
  context/         enquiry pre-fill (vehicle / experience CTAs → form)
  components/      Header, Hero, VehicleCollection, VehicleCard, VehicleDetail,
                   Experiences, BrandStory, EnquiryForm, Footer, LegalDialog, ui/*
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

Append an object to `vehicles` in `src/data/vehicles.ts`. Cards, the detail
view (`?car=<slug>` deep link) and the form’s “Preferred vehicle” list update
automatically. Only add verified facts in `details` (year, colour, seats…).
Availability: `on-request` | `available` | `limited` | `unavailable` | `coming-soon`.

## Enquiry form

Frontend validation is complete. Submissions are sent as JSON (POST) to
`VITE_ENQUIRY_ENDPOINT` (see `.env.example`). **While no endpoint is set, the form
never claims success**: it states that nothing was sent and offers a pre-filled
email instead. A honeypot field filters basic bots.

## Before launch — to do

- Final photography (hero, 3 cars, 3 experiences, 2 story images).
- Real contact details & Instagram URL in `src/data/site.ts`.
- Production domain in `index.html` (canonical, Open Graph URLs).
- Legal Notice & Privacy Policy texts in `src/components/LegalDialog.tsx`.
- Enquiry backend (form service, serverless function or CRM) + `VITE_ENQUIRY_ENDPOINT`.
- Final logotype, if one replaces the typographic wordmark.

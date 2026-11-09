# Époque Motors | Website

Read `PROJECT_CONTEXT.md` first: architecture, decisions and business rules.

Landing page for **ÉPOQUE MOTORS**, private vintage car experiences in Paris.
*Private vintage car experiences in Paris, by enquiry.*

The page follows the **Le Garage** design system: a dark 3D parking first,
then calm full-screen sections on ivory, one idea each.

## Stack

React 19 · TypeScript · Vite · three.js 0.170.0 (pinned, loaded on demand for
the parking). Plain CSS, no CSS framework.

```bash
npm install
npm run dev        # local development
npm run build      # typecheck + production build in /dist
npm run preview    # serve the production build
```

## Deployment (GitHub Pages)

`.github/workflows/deploy.yml` builds the site and publishes `dist/` at the
site root on every push to `main` or `le-garage`: the last deployment wins.
To switch versions, run the workflow on the branch you want (Actions tab,
**Deploy to GitHub Pages**, **Run workflow**). In **Settings → Pages → Build and
deployment → Source**, select **GitHub Actions**.

## The page

Seven full-screen sections, in this order: `garage`, `sortie-1`, `sortie-2`,
`sortie-3`, `savoir`, `apropos`, `ecrire`.

- One wheel or trackpad gesture moves one section; ↑ ↓ and Page Up / Down do
  the same, F toggles fullscreen. A section never exceeds the screen, except
  when a Good to know question is open.
- The parking (`src/scene/`, three.js) shows graphic renderings of the three
  cars, never presented as photos. ← → change car, the cars alternate on their
  own every 5 seconds (paused for 9 seconds after a gesture, and on hover or
  focus). A click on the car opens its sheet (photos and specifications) inside the
  garage, next to the car: on the right in landscape, from the bottom in portrait.
  Without WebGL, the vector side profile of the car replaces the scene.
- With `prefers-reduced-motion`: no alternation, no animated scrolling, no intro.

### 3D workshop (development only)

`npm run dev`, then open `/ds.html?car=ds` (or `p504`, `w114`): one car on its
own, an orbit camera and fixed views (three-quarter front, front, side,
three-quarter rear, rear, top). It is not part of the build (`src/scene/viewer.ts`).
The cars are procedural three.js models built to one shared specification:
a data sheet per car (`src/scene/carspecs.ts`), shared materials, body, wheels
and presentation (camera, lights, rendering), and one details module per car
in `src/scene/models/`. The workshop uses the same presentation as the parking.
See `PROJECT_CONTEXT.md` for the architecture and the rules.

## Languages (EN / FR)

The site is bilingual, with an EN | FR link in the menu (same page, no reload).
Language is chosen from `?lang=fr`, then the visitor's previous choice, then the
browser language (English by default).

- Interface copy: `src/i18n/en.ts` and `src/i18n/fr.ts` (same keys, type-checked).
- Content (cars, experiences, image captions): `{ en, fr }` fields in `src/data/*.ts`.

Editorial rules: no long dashes, no superlatives, no unverified vehicle facts.

## Structure

```
src/
  data/            ← all editable content
    vehicles.ts      the collection, in bay order (single source of truth)
    experiences.ts   the three chapters
    site.ts          sections, menu, contact details, section images
    types.ts         MediaAsset / Vehicle / Experience types
  i18n/            dictionaries (en, fr) + language provider
  lib/enquiry.ts   form validation + submission service
  lib/pageNav.ts   one gesture, one section (wheel, keys, menu)
  context/         enquiry pre-fill (car / chapter actions → form)
  scene/           the 3D showroom: car data sheets (carspecs.ts), shared
                   kit (geometry, materials, kit, wheels, presentation),
                   per-car details (models/), the parking (parking.ts)
  components/      TopNav, garage/ (Parking, PhotoCarousel, VehicleSheet,
                   CarProfile), Sections, EnquirySentence, SectionImage,
                   LegalDialog, ui (Monogram, Odometer, Counter, Arrow, ActionLink)
  assets/fonts/    Cormorant Garamond, Barlow, Stardos Stencil (self-hosted)
  index.css        design tokens + page styles
```

## Images

Images live in `public/images/<section>/` (`collection`, `experiences`,
`practical`, `story`) and are declared in `src/data/*.ts` with their `width`,
`height`, `alt`, optional `srcSet` and `credit`. Section images load as their
section approaches; carousel photos load when the vehicle sheet opens.

Collection images must show the **actual cars** of the collection. A
generated image keeps “Illustrative image”, a third-party photo keeps
“Illustrative photo” (`credit`).

## Adding a vehicle

Append an object to `vehicles` in `src/data/vehicles.ts`. The vehicle sheet
and the form's car list update automatically. The parking is laid out for
three bays: a fourth car also needs a 3D model in `src/scene/carspecs.ts` and
the bay count in `src/scene/parking.ts`. Only add verified facts in `details`.
Availability: `on-request` | `available` | `limited` | `unavailable` | `coming-soon`.

## Enquiry form

The form is a sentence to complete. Frontend validation is complete.
Submissions are sent as JSON (POST) to `VITE_ENQUIRY_ENDPOINT` (see
`.env.example`). **While no endpoint is set, the form never claims success**: it
states that nothing was sent and offers a pre-filled email instead. A honeypot
field filters basic bots.

## Before launch: to do

- Enquiry backend (form service, serverless function or CRM) + `VITE_ENQUIRY_ENDPOINT`.
- Real contact details & Instagram URL in `src/data/site.ts`.
- Legal Notice & Privacy Policy texts (`legal` keys in `src/i18n/en.ts` and `fr.ts`).
- Production domain in `index.html` (canonical, Open Graph URLs).
- Citroën DS: the three-quarter rear sheet photo is small (1000 px wide); replace it
  with a full-resolution original when available.
- Exact version of the DS (provisional name and partial specs in `src/data/vehicles.ts`).
- Section visuals are generated images, labelled “Illustrative image”; replace
  them with real photography when available.

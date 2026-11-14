# Époque Motors | Website

Read `PROJECT_CONTEXT.md` first: architecture, decisions and business rules.

Website of **ÉPOQUE MOTORS**, private vintage car experiences in Paris: a 3D home page and
static content pages (services, cars, guides, FAQ) written at build time for search engines and AI
assistants (PROJECT_CONTEXT § 9, strategy in `docs/SEO-GEO.md`).
*Private vintage car experiences in Paris, by enquiry.*

The page follows the **Le Garage** design system: a dark 3D parking first,
then calm full-screen sections on ivory, one idea each.

## Stack

React 19 · TypeScript · Vite · three.js 0.170.0 (pinned, loaded on demand for
the parking). Plain CSS, no CSS framework.

```bash
npm install
npm run dev        # local development
npm run build      # typecheck + production build in /dist, with the pre-rendered pages
                   # (VITE_SITE_URL=https://… npm run build for the production address)
npm run preview    # serve the production build
```

## Deployment (Cloudflare Workers)

Production runs on **Cloudflare Workers** at **https://epoquemotors.fr**: static
files, plus one small Worker script (`src/worker/`) that only answers `/api/*`
(the enquiry form, see below). `wrangler.jsonc` serves `dist/`:
`not_found_handling: "404-page"` (unknown addresses get `404.html` with a 404
status) and `html_handling: "auto-trailing-slash"` (`/fr` redirects to `/fr/`).
`.node-version` pins Node 22 for the Cloudflare build.

- Cloudflare build: `npm ci`, then `npm run build`; deploy with `npx wrangler deploy`.
- `VITE_SITE_URL=https://epoquemotors.fr` is set as a **build variable** in
  Cloudflare (canonical, hreflang, sitemap, Open Graph, llms.txt).
- `VITE_ENQUIRY_ENDPOINT=/api/enquiry` is set as a **build variable** in Cloudflare
  (the form posts to the Worker).
- `RESEND_API_KEY` is a **secret** of the Worker (`npx wrangler secret put RESEND_API_KEY`,
  or Cloudflare → Workers → epoque-motors → Settings → Variables and Secrets).
- Local check of the production build: `npm run build`, then `npx wrangler dev`.

The former GitHub Pages workflow (`.github/workflows/deploy.yml`) is still in
the repository for now and still publishes on every push to `main` or `le-garage`.

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
Each language has its own address: `/` (English) and `/fr/`. At `/`, the language
comes from `?lang=fr` (older links), then the visitor's previous choice, then the
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
  content/         content pages (services, collection, guides, FAQ, about), EN + FR
  seo/             site writer: pre-rendered home, page template, JSON-LD, sitemap,
                   robots, llms.txt (build.tsx), content page styles (doc.css)
  lib/enquiry.ts   form validation + submission service
  lib/paths.ts     site root, image addresses, language from the path
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

## Enquiry form

The form is a sentence to complete. Frontend validation and protections are
described in PROJECT_CONTEXT (§ 6). Submissions are sent as JSON (POST) to
`VITE_ENQUIRY_ENDPOINT` (see `.env.example`), in production `/api/enquiry`: the
Worker (`src/worker/enquiry.ts`) validates them again, rate-limits them and sends
an email through **Resend** to **epoquemotors@gmail.com** (`ENQUIRY_TO` in
`wrangler.jsonc`), from `formulaire@epoquemotors.fr` (`ENQUIRY_FROM`), with the
visitor's address as Reply-To. **While no endpoint is set, or if sending fails,
the form never claims success**: it says so and offers a pre-filled email to
epoquemotors@gmail.com instead. A honeypot field filters basic bots.

Resend setup (once): create the account, add and verify the domain
`epoquemotors.fr` in Resend (DNS records in Cloudflare), create an API key with
“Sending access”, store it as the `RESEND_API_KEY` secret of the Worker.

## Before launch: to do

- Resend: verify `epoquemotors.fr`, set the `RESEND_API_KEY` secret and the
  `VITE_ENQUIRY_ENDPOINT=/api/enquiry` build variable in Cloudflare.
- Real phone number & Instagram URL in `src/data/site.ts` (email set: epoquemotors@gmail.com).
- Legal Notice & Privacy Policy texts (`legal` keys in `src/i18n/en.ts` and `fr.ts`).
- Production domain `epoquemotors.fr`: attach it to the Worker in Cloudflare and set the
  `VITE_SITE_URL` build variable (canonical, hreflang, sitemap, Open Graph, llms.txt). See `docs/SEO-GEO.md`.
- Citroën DS: the three-quarter rear sheet photo is small (1000 px wide); replace it
  with a full-resolution original when available.
- Exact version of the DS (provisional name and partial specs in `src/data/vehicles.ts`).
- Section visuals are generated images, labelled “Illustrative image”; replace
  them with real photography when available.

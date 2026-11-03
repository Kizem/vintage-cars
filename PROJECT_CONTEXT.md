# Project context: Époque Motors, « Le Garage »

Read this file before any change. Update it in the same commit whenever a
decision, a feature or a rule below changes. The README covers installation
and day-to-day use; this file explains how the project is built and why.

## 1. What the site is

A single-page, bilingual (EN / FR) landing page for **Époque Motors**, private
vintage car experiences in Paris, by enquiry only. Three cars: Peugeot 504,
Citroën DS, Mercedes-Benz /8. There is no booking engine and no online payment.

Branches:

- `le-garage` is the working branch for this version.
- `main` and `3d-design` are never pushed to, merged into or force-pushed.
- Repository settings are never changed from a session.

Deployment: `.github/workflows/deploy.yml` builds and publishes `dist/` to
GitHub Pages on every push to `main` or `le-garage`. The last deployment wins,
so a push to `le-garage` is a production release.

## 2. Stack and technical decisions

| Topic | Decision | Why |
|---|---|---|
| Build | Vite 8, `base: './'` | Relative paths work on any Pages sub-path. |
| UI | React 19, TypeScript 7 strict, plain CSS | No CSS framework, design tokens in `index.css`. |
| 3D | three.js **0.170.0, pinned**, loaded with a dynamic import | Keeps the first load light; the parking is its own chunk (`parking-*.js`). |
| Fallback | Vector side profile (`sideProfileSVG` in `carspecs.ts`) | Shown when WebGL is missing. |
| Fonts | Self-hosted woff2 (`src/assets/fonts`) | No third-party requests. |
| Tests | Playwright, outside the repository (session scratchpad) | Playwright is **not** a dependency; never run `playwright install`. |

React rules used across the code:

- Effects are StrictMode-safe: anything they create (canvas, renderer,
  listeners) is created and destroyed inside the same effect.
- `inert` is used as a boolean.
- No debug hooks in production code (no `window.__x`, no console helpers).

## 3. Page structure and navigation

Seven full-screen sections, in this order (`sectionIds` in `src/data/site.ts`):
`garage`, `sortie-1`, `sortie-2`, `sortie-3`, `savoir`, `apropos`, `ecrire`.

- `src/lib/pageNav.ts`: `.em-scroll` holds the sections. One wheel or trackpad
  gesture moves one section; a quiet window measured with `e.timeStamp`
  absorbs inertia. ↑ ↓ and Page Up / Down move one section; F toggles fullscreen.
- `animateTo` dispatches a synthetic `scroll` event on arrival.
- Navigation is locked while the car focus or the legal dialog is open.
- Top menu: exactly four entries (Garage, Experiences, About, Write).
- The Époque Motors logo (`Brand` in `components/ui.tsx`) stays visible and
  leads back to the garage.
- A section never exceeds the screen, except when a Good to know answer is open,
  or on small phones when the form shows its errors (the navigation then lets
  the visitor read the section to the end first).
- There is exactly one `h1`, in the garage.

## 4. The 3D showroom (`src/scene/`)

All three cars follow **one technical specification**. Only the data sheet
and the car-specific details differ; camera, lighting, materials, body
construction and wheels are shared.

```
carspecs.ts      Data sheet per car (no three.js): dimensions, profile curves
                 (floor, belt, deck, half-width), glasshouse, pillars, seams,
                 trims, cabin colours, paint. Also used by the SVG fallback.
geometry.ts      Shared tools: catmull, loft, stations, tube, rrect, canvasTex,
                 badgeTexture.
materials.ts     Shared material library: clear-coated paint with door seams
                 and wheel arches cut in the shader, chrome, glass (tinted when
                 the cabin is modelled), rubber, lamp lenses, amber, red, hubs.
kit.ts           Shared body builder: shell, underbody, cabin, glasshouse, roof,
                 pillars, side trims, gutters, mirrors. Returns a CarKit with
                 placement tools: surfX, topY, yawAt, lay, plate, bumper.
models/ds.ts     Car-specific details only (face, tail, badges, lamps).
models/p504.ts
models/w114.ts
wheels.ts        Shared wheels (tyre, chrome rim, hubcap style per car).
carmodels.ts     Orchestration: spec → materials → body → details → wheels.
presentation.ts  Shared renderer settings (sRGB, ACES, exposure 1.12, pixel
                 ratio ≤ 2), camera (FOV 30), studio lights, the bay light
                 above each car, named workshop views.
studio.ts        PMREM studio environment for reflections; `release()`.
parking.ts       The parking scene (uses presentation.ts and buildCar).
viewer.ts        Dev-only workshop (ds.html), same presentation as the parking.
```

Conventions:

- Units are metres. The nose is on the **−X** side; +Z is the car's left.
- `body.children[0]` must stay the shell, and each wheel must be
  `root > wheel group > spin group (first child)`: `parking.ts` relies on this
  to find the wheels and body of the mirrored copy used for the floor reflection.
- The front lamp material is shared per car (`lens`) so the parking can light
  the headlamps on hover; `lampPoints` place the glow sprites.
- To add a car: a spec in `carspecs.ts`, a `models/<car>.ts` exporting
  `details(kit)`, an entry in `DETAILS` (`carmodels.ts`), the vehicle in
  `src/data/vehicles.ts`, and the bay count in `parking.ts`.
- Models are graphic renderings drawn from the owner's photos, never presented
  as photos.
- Workshop: `npm run dev`, then `/ds.html?car=ds|p504|w114&view=<name>`.
  `ds.html` is not part of the build.

Parking behaviour (`parking.ts`, `components/garage/Parking.tsx`):

- Car order: 504, DS, Mercedes.
- The 504 stays at least 9 s before the first alternation; then the next car
  comes every 5 s. Alternation pauses for 9 s after a gesture, and on hover or
  focus.
- ← → change car. A drag starts from the nearest bay and moves at most one car.
- Clicking a neighbouring car only selects it; clicking the active car opens
  its focus (photo carousel and specification sheet).
- `onReady` fires after the first rendered frame.
- In portrait, the camera offset centres the projected box of the active car.
- Rendering stops while the focus is open (`openT > .95`).
- With `prefers-reduced-motion`: no alternation, no animated scroll, no intro.

## 5. Content and business rules

Data lives in `src/data/*.ts` (`{ en, fr }` fields) and `src/i18n/{en,fr}.ts`.

- No long dashes, no superlatives, no unverified car facts. Car facts in
  `vehicles.ts` and `carspecs.ts` are not changed without a source.
- A car is never presented as available: every car is `on-request`.
- Service per car: Peugeot 504 and Mercedes /8 offer chauffeur or self-drive
  on enquiry; the DS is chauffeur only. Do not add a self-drive offer that is
  not confirmed.
- The events chapter says: « Les voitures se louent aussi, avec ou sans
  chauffeur selon le modèle. »
- Good to know has no numbered item N°4. Its questions are an accordion
  (dividers, a + that turns into −), deliberately unlike the chapter actions.
- Experience chapters, in this order: N°1 Events, N°2 Private Paris Tours,
  N°3 Chauffeured (`src/data/experiences.ts`). Each chapter's action sits at the
  same distance from the bottom of its section, whatever the text length; the
  text is centred in the space above it.
- No guest count anywhere: not as a field, in validation, in the payload or in the copy.
- Contact details in `site.ts` stay placeholders with their TODO until the
  owner provides real ones. Nothing is invented.
- Generated images keep « Illustrative image », third-party photos keep
  « Illustrative photo ». Collection photos must show the actual cars.
- Colours come only from the design-system tokens in `index.css`:
  `--ink`, `--ink-soft`, `--forest`, `--forest-deep`, `--ivory`, `--champagne`,
  `--phare`, `--plate`, `--plate-ink`, `--error`.

## 6. Enquiry form

- The form is a sentence to complete (`EnquirySentence.tsx`, `lib/enquiry.ts`).
- Submissions are POSTed as JSON to `VITE_ENQUIRY_ENDPOINT`.
- While no endpoint is set, the status is `not-configured`. The UI must never
  claim the enquiry was sent; it offers a pre-filled email instead.
- A honeypot field (`company`) drops basic bots silently.
- The Écrire footer (contact, hours, legal links) sits at the very bottom of
  the page; the title and the form are centred in the space above it.
- In the Écrire section, the form (and its result messages) sits in a framed
  panel (`--plate-ink` background, `--champagne` rule, filled `--forest`
  submit button), so it stands apart from the title and the footer. On phones
  the panel runs edge to edge to keep the sentence's full width.

## 7. Tests and checks before pushing

1. `npm run typecheck` and `npm run build`.
2. Playwright regression suites (kept in the session scratchpad, not in the
   repository), run against `vite preview`:
   - layout, desktop (EN / FR), mobile, variants, carousel, sub-path;
   - no console errors.
3. Headless runs use SwiftShader, which renders at only 1 to 5 fps, so tests
   wait for convergence rather than for fixed delays.
4. For 3D changes, capture the workshop views of each car before and after
   the change and compare them.
5. Commit messages: short, in English, with the session attribution lines.

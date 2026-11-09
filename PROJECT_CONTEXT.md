# Project context: Époque Motors, « Le Garage »

Read this file before any change. Update it in the same commit whenever a
decision, a feature or a rule below changes. The README covers installation
and day-to-day use; this file explains how the project is built and why.

## 1. What the site is

A single-page, bilingual (EN / FR) landing page for **Époque Motors**, private
vintage car experiences in Paris, by enquiry only. Three cars: Peugeot 504 GL (1971),
Citroën DS 21 Henri Chapron (1971), Mercedes W115 220D (1973, manual). There is no booking engine and no online payment.

Branches:

- This version (« Le Garage ») is the accepted concept of the landing page.
  The owner had it merged into `main` (fast-forward from `le-garage`).
- Work happens directly on `main`, unless the owner explicitly asks for a
  branch for a given piece of work. `le-garage` and `le-garage-v1` are kept as
  they are. `3d-design` is never touched. Never force-push.
- Repository settings are never changed from a session.

Deployment: `.github/workflows/deploy.yml` builds and publishes `dist/` to
GitHub Pages on every push to `main` or `le-garage`. The last deployment wins,
so every push is a production release; the owner tests on the live site.

## 2. Stack and technical decisions

| Topic | Decision | Why |
|---|---|---|
| Build | Vite 8, `base: './'` | Relative paths work on any Pages sub-path. |
| UI | React 19, TypeScript 7 strict, plain CSS | No CSS framework, design tokens in `index.css`. |
| 3D | three.js **0.170.0, pinned**, loaded with a dynamic import | Keeps the first load light; the parking is its own chunk (`parking-*.js`). |
| Fallback | Vector side profile (`sideProfileSVG` in `carspecs.ts`) | Shown only when WebGL is missing, or after the WebGL context is lost three times in a row (each loss first rebuilds the scene on a new canvas). Never shown together with the intro monogram. |
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
  absorbs inertia. Wheel deltas are converted to pixels (line and page modes)
  and small notches add up within a gesture, so mice that report 1 line per
  notch still change section. ↑ ↓ and Page Up / Down move one section; F toggles fullscreen.
- `animateTo` dispatches a synthetic `scroll` event on arrival.
- Navigation is locked while the vehicle sheet or the legal dialog is open.
- Top menu: exactly four entries (« La collection » / « The collection », the
  parking section, whose id stays `garage`; Experiences, About, Write), then the
  language switch: a thin-line globe and « FR / EN » (current language in
  full, the other dimmed) on desktop; the globe and the other language on
  phones; the globe alone below 341 px. Its accessible name is the other
  language (« English » / « Français »).
- The Époque Motors logo (`Brand` in `components/ui.tsx`) stays visible and
  leads back to the garage: monogram and name at the top left on desktop,
  monogram only at the top left of the menu on phones (the garage also shows
  the name above its h1 on phones).
- A discreet square « back to top » button (`.em-top`, in `TopNav.tsx`) appears
  from the second experience onwards, bottom right; it never covers the chapter
  actions, and in Écrire it sits just above the footer on phones.
- A section never exceeds the screen, except when a Good to know answer is open,
  or on small phones when the form shows its errors (the navigation then lets
  the visitor read the section to the end first).
- On phones and tablets (≤ 899 px), every section reads in the same order:
  title, photo, content (chapters, Good to know and About alike).
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
  its sheet. Sheet open, clicking another visible car gives it the sheet.
- The vehicle sheet opens inside the garage, next to the chosen car (no change
  of screen): a full-height column on the right in landscape
  (`--em-sheet-w: clamp(22rem, 36cqw, 34rem)`), rising from the bottom over 58 %
  in portrait (`--em-sheet-h`). Translucent `--forest-deep` with a blur, a 1 px
  ivory rule on the edge that meets the scene; no shadow, no radius.
  - Top bar (under the site menu): previous / next car (« Voiture précédente :
    {nom} »), « Fermer ». The arrows change car without closing the sheet.
  - Content: N°, name (`.em-sheet__name`, `clamp(1.45rem, 2.1cqw, 1.9rem)`),
    photos, specifications (service first; no availability row, no sentence),
    « Demander cette voiture ». The sheet scrolls on its own. `VehicleSheet`
    shows the photos by default; `withPhotos={false}` removes them.
  - Photos: large, edge to edge across the sheet, all in the same square frame
    (cropped with `object-fit: cover` around the photo's `focalPoint`; square,
    lower on phones; explicit height, no `aspect-ratio`, which made Safari
    shrink the frame's width), so
    portrait and landscape photos look alike; pager under the photo. A click
    opens the whole photo, uncropped, full screen (`.em-lightbox`, a modal
    `<dialog>` holding the `dialog` lock): arrows, ← →, swipe, Escape.
  - The chosen car comes further out, three-quarter front, headlamps on; its
    neighbours back into their bays (wheels turning in reverse), their light
    and floor number dimmed; the camera centres the chosen car in the free space
    (`api.inset(f)`: the share of the scene covered by the sheet, measured by a
    ResizeObserver in `Parking.tsx`). The bottom bar and the h1 fade out; a
    « Représentation graphique » label stays on the scene.
  - « Fermer », Escape or a click in the empty parking close it; dragging the
    scene still works. Focus goes to the car name on opening only.
  - Without WebGL the sheet opens the same way next to the vector profile.
- Angled bays (`parking.ts`, constants at the top): every car stays in the
  axis of its bay, turned `PARK_YAW` (three-quarter front), whether parked,
  active or making way. A car is placed by one distance along that axis
  (`place(d)`): the three visible cars stand in a row at the front of their
  bays, the active car `REST` further forward than its neighbours (more when
  hovered or when its sheet is open); sheet open, the neighbours back off to
  the back of their bays. Coming forward in an angled bay also moves a car to
  the left, so the neighbours stay almost as far forward as the active car:
  the three cars keep the same gap between them (`S`). Past its neighbour's place
  (|w| > 1), the car changing sides speeds up towards the edge (`EXIT`) and
  leaves the screen before reappearing, off screen as well, on the other side. Floor lines, back line,
  floor numbers, pillars and ceiling tubes follow the same axis; the bays are
  offset (`BAY_OX`) so that the row is centred on screen. Sheet open (and in
  portrait), the camera centres the projected outline of the chosen car in the
  free space.
- DS headlamps: at each wing tip (the plan corners of the nose are rounded off to
  make room), an almond glass that continues the wing and tapers forward, a
  body-colour sleeve into the wing, the two lamps side by side at the back on a
  light reflector, a chrome ring where the glass meets the wing; mirrored.
  `wingRise` (DS, 504): the wings stand higher than the bonnet, which dips between
  the headlamps.
- Long car names (over 20 characters) get `.em-parking__name--long`, a smaller
  size, two lines at most on phones.
- One large ÉM monogram is painted in ivory (thickened, slightly worn) on the back
  wall, fixed, in the middle of the door panel between the two pillars nearest
  the centre (`LOGO_X`). The door texture is offset (`DOOR_OFF`) so that every
  door post sits behind a pillar: no post crosses the logo at rest.
- Pixel budget: the parking canvas renders at most ~2.4 million pixels
  (`PIXEL_BUDGET`, density capped at 2). A full-density antialiased buffer on an
  iPad made Safari drop the WebGL context, and the page fell back on the vector
  profile. A failure is logged in the console (« Scène 3D indisponible »).
- Headlamp halos are the size of the lamp and sit on it (they never spill out of
  the headlamp); on the DS both lamps of each headlamp light up.
- Car lights (the bay light under the ceiling and the headlamps) fade in and
  out; they never flicker (a flicker read as a fault in the ceiling tubes).
- `onReady` fires after the first rendered frame.
- In portrait, the camera offset centres the projected box of the active car.
- Rendering only stops off screen (the parking stays visible behind the sheet).
- With `prefers-reduced-motion`: no alternation, no animated scroll, no intro.

### Reference photos (`references/`)

One folder per car (`references/MercedesW115/`, `references/DS21/`), supplied by the owner in full resolution and kept in
the repository (including on `main`) for future work. They are not published with the site.

- `illu/`: the 5 photos of the vehicle sheet carousel, in order. Converted to WebP (EXIF stripped, 2000 px and
  900 px versions, licence plates blurred) into `public/images/collection/`.
- `modele/`: the photos used to build the 3D model (`src/scene/carspecs.ts` and `src/scene/models/`).

## 5. Content and business rules

Data lives in `src/data/*.ts` (`{ en, fr }` fields) and `src/i18n/{en,fr}.ts`.

- No long dashes, no superlatives, no unverified car facts. Car facts in
  `vehicles.ts` and `carspecs.ts` are not changed without a source.
- A car is never presented as available: every car is `on-request`.
- Service per car: Peugeot 504 and Mercedes W115 220D offer chauffeur or self-drive
  on enquiry; the DS is chauffeur only. Do not add a self-drive offer that is
  not confirmed.
- Chapter texts (editorial update supplied by the owner): each experience has
  `body` (three paragraphs, desktop and tablet) and `summary` (one shorter
  paragraph). The short version shows on smartphones, portrait or landscape,
  and on windows too low for the three paragraphs: container query
  `(max-width: 699px) or (max-height: 650px) or ((max-width: 1099px) and
  (max-height: 760px))` in `index.css`, thresholds measured so that no chapter
  overflows. The former events line about hire with or without chauffeur was
  replaced by this update.
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
- Every licence plate shown on the site must be blurred (owner's rule): collection
  photos, illustrative and third-party photos, section images, any new image. Blur
  it in the published WebP files (both sizes), never in `references/`, which keeps
  the owner's originals. Check every new photo for plates, even partly visible ones.
  Exception chosen by the owner: the DS sheet opens on an illustrative photo
  (Paris street), the collection car comes second.
- Experience images show no visible caption: the caption stays in the
  `<figcaption>`, visually hidden, for screen readers (with the `alt` text).
  The « Illustrative image » credit stays visible.
- Figures are lining everywhere (`font-variant-numeric: lining-nums` on body
  and form controls): Cormorant's default old-style figures drop below the
  capitals (« PEUGEOT 504 », « DS 21 »).
- French typography: a non-breaking space (U+00A0) before « : ; ? ! » in every
  French string (dictionary, data, generated email).
- Design charter: no radius, no card, no shadow; `--phare` only for the cars'
  light in the scene. Keyboard focus is always a 1 px outline in
  `currentColor`, 4 px away (global rule in `index.css`); the filled submit
  button keeps that outline in `--forest`, since its own text is ivory.
- Photos in the vehicle sheet show no visible caption (« Trois-quarts avant »…):
  the caption stays for screen readers; the « Photo d'illustration » credit
  stays visible on third-party photos, on the photo itself.
- The garage bottom block (N°, name, hint, arrows) sits
  `clamp(1.4rem, 9cqh, 5.5rem)` above the bottom of the screen.
- The garage subtitle (the h1 under the menu) is `clamp(.8rem, 1.1cqw, .95rem)`.
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

## 7. Frozen versions

- `le-garage-v1` (branch, commit `9f47e67`): the validated version, with the
  vehicle sheet inside the garage. It is a snapshot: never commit to it. Return
  to it with `git checkout le-garage-v1`; to deploy it again, reset
  `le-garage` to that commit with a new commit, or run the Pages workflow on it.
  (A git tag could not be pushed from the cloud session, hence the branch.)

## 8. Tests and checks before pushing

1. `npm run typecheck` and `npm run build`.
2. The test battery, in the repository (`tests/`, plain Playwright scripts using
   the machine's global Playwright and Chromium; no dependency added):
   `npm run build && npm test` (or `node tests/run.cjs [layout|sheet|nav-form|timing|scene]`).
   It serves `dist/` with `vite preview` on port 4321 and runs, in parallel:
   - `layout`: seven sections in order, one h1, nothing overflows, menu on one
     line, every section fills the screen (5 sizes × FR/EN); language switch;
   - `sheet`: the vehicle sheet of each car on desktop and phone (opening, focus,
     every photo and srcset file loads, photo frame as wide as the sheet, no
     availability row, no sentence, photo arrows, full-screen view with ← → and
     Escape, next car, closing, « Demander cette voiture » preselects the car);
   - `nav-form`: wheel (including a small notch), keys, menu, back to top,
     form errors and the `not-configured` state (never a false « sent »);
   - `timing`: the 504 stays at least 9 s, then one car about every 5 s;
   then `scene`: the real WebGL scene (SwiftShader, slow), reduced motion: ready,
   sheet, click in the empty parking, context loss; and each car built alone in
   the workshop without errors.
   Everything but `scene` runs without WebGL (vector profile, fast) and waits
   on conditions rather than fixed delays. About 2 min in all.
3. The earlier long suites (`t1-layout`, `t4-variants`, `t7-carousel`,
   `t2-desktop`, `t3-mobile`) lived in a session scratchpad and are lost; the
   battery above replaces them. The finger swipe between sections is not
   simulated (a CDP touch does not trigger native snap scrolling): check the
   real gesture by hand on a phone.
4. For 3D model changes, capture the workshop views of each car before and
   after, and compare them (`ds.html?car=…&view=…`, or a free camera with
   `&cam=x,y,z&at=x,y,z` for close-ups).
5. Commit messages: short, in English, with the session attribution lines.

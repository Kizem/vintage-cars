# Project context: Époque Motors, « Le Garage »

Read this file before any change. Update it in the same commit whenever a
decision, a feature or a rule below changes. The README covers installation
and day-to-day use; this file explains how the project is built and why.

## 1. What the site is

A bilingual (EN / FR) site for **Époque Motors**, private
vintage car experiences in Paris, by enquiry only: a single-page home (the 3D garage and
seven sections) plus static content pages written at build time for search engines and AI
assistants (services, cars, guides, FAQ; see § 9). Three cars: Peugeot 504 GL (1971),
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
| Fallback | The ÉM monogram alone, no car drawn (the car name below still opens the sheet) | Shown only when WebGL is missing, or after the WebGL context is lost three times in a row (each loss first rebuilds the scene on a new canvas). Never shown together with the intro monogram. |
| Fonts | Self-hosted woff2 (`src/assets/fonts`) | No third-party requests. |
| Tests | Playwright, outside the repository (session scratchpad) | Playwright is **not** a dependency; never run `playwright install`. |
| Pre-rendering | `npm run build` = client build, then an SSR build of `src/seo/build.tsx` (`.ssr/`, deleted after), then `scripts/prerender.mjs` | Crawlers that do not run JavaScript (most AI assistants) get the full text. No extra dependency. |
| Site address | `VITE_SITE_URL` (set by the deploy workflow from GitHub Pages, or the `SITE_URL` repository variable) | Canonical, hreflang, sitemap, Open Graph and llms.txt need absolute URLs; links between pages stay relative. |

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
- Top menu: four section entries (« Le garage » / « The garage », the parking section, whose id stays
  `garage`, renamed so as not to repeat « La collection » of the detailed part of the site; Experiences,
  About, Write). At the right, a framed button « Explorer Époque Motors » (`.em-nav__site`: italic
  Cormorant, arrow, 1 px frame that fills on hover; « Explorer » on tablets) opens the detailed part of the
  site on its collection page. On phones (≤ 699 px): the monogram in the left corner, Le garage, Expériences,
  À propos centred on the screen, and the menu button (two lines, `.em-nav__burger`) in the right corner,
  both corners 16 px from the edge. The menu (`.em-menu`, a full-screen <dialog>) lists every page of the
  detailed part (`siteTabs` in `src/data/links.ts`), « Écrire » and the language switch (on phones the
  language is only there). « Écrire » and the explore button are hidden on phones. Then the
  language switch: a thin-line globe and « FR / EN » (current language in
  full, the other dimmed) on desktop; the globe and the other language on
  phones; the globe alone below 341 px. Its accessible name is the other
  language (« English » / « Français »).
- Languages have their own address: `/` (English, x-default) and `/fr/`. The path wins (`/fr/` is always
  French); at `/`, `?lang=` (older links), then the stored choice, then the browser language. The language
  switch stays on the page (no reload) and replaces the address (`/` ↔ `/fr/`). Every file of `public/` is
  reached through `asset()` (`src/lib/paths.ts`), which starts from the site root (`<meta name="em-root">`,
  written at build time), so that `/fr/` finds `images/…`.
- In the vehicle sheet, « Découvrir la {name} » (`focus.page`, the car's page) sits under the photos, in
  champagne italic, underlined, no arrow (the carousel arrows are just above), the specifications between it
  and « Demander cette voiture ». The car name takes the focus on opening, without any visible frame.
- The « learn more » link of each chapter sits under its text, not next to the action: italic Cormorant with an
  arrow, no rule (`MoreLink arrow`, `.em-more--arrow`), so that it never reads as a second action. Chapter N°2
  (Private Paris Tours) shows « Les Guides de Paris » there, with the five routes (`.em-guides`; the five route
  links are hidden where the short chapter text is shown, phones and low windows). About ends with the same
  kind of link, « Découvrir Époque Motors en détail », to the collection page.
- Discreet links (`MoreLink`, `.em-more`) lead from the home to the content pages: under each chapter text,
  under « Demander cette voiture » in the sheet, under the Good to know questions, and in the
  Écrire footer (Collection · Guides · FAQ). Their addresses are in `src/data/links.ts` (tested against
  `src/content`), so the app bundle does not carry the text of the pages.
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
                 (floor, belt, deck, half-width), flank section (`side`),
                 raked ends (`rake`), greenhouse (`glass`), window openings
                 (`windows`), seams, trims, cabin colours, paint.
geometry.ts      Shared tools: catmull, loft, roundedPath (section made of
                 lines joined by arcs), gridGeometry, offsetGeometry, blade,
                 stations, tube, rrect, canvasTex, badgeTexture.
windows.ts       Window openings drawn as a pattern on the greenhouse grid:
                 the alpha mask of the shell and the outline of each window.
materials.ts     Shared material library: clear-coated paint with wheel arches
                 (and the DS lamp window) cut in the shader, chrome, glass,
                 rubber, lamp lenses, amber, red, rims, hubs, liner.
kit.ts           Shared body builder (see below). Returns a CarKit with
                 placement tools: surfX, topY, sideZ, shift, face, gp, yawAt,
                 lay, plate, bumper.
models/ds.ts     Car-specific details only (face, tail, badges, lamps).
models/p504.ts
models/w114.ts
wheels.ts        Shared wheels (tyre, turned rim lip, drawn disc, hubcap).
carmodels.ts     Orchestration: spec → materials → body → details → wheels.
presentation.ts  Shared renderer settings (sRGB, ACES, exposure 1.12, pixel
                 ratio ≤ 2), camera (FOV 30), studio lights, the bay light
                 above each car, named workshop views.
studio.ts        PMREM studio environment for reflections; `release()`.
parking.ts       The parking scene (uses presentation.ts and buildCar).
viewer.ts        Dev-only workshop (ds.html), same presentation as the parking.
```

How a body is built (`kit.ts`), second modelling (branch
`claude/brave-galileo-s1s344`, to be tested before any merge into `main`):

- **Shell**: one cross-section per station, lofted along X. A section is four
  lines joined by arcs (`roundedPath`): underside, lower flank (sill tucked
  in by `tuck`, widest at `waist`), upper flank (up to the shoulder, set in
  by `sIn`), top (bonnet, cowl, boot; `dome` sets its camber). `rs` is the
  shoulder radius (sharp on the Mercedes, round on the DS); `ridge` makes the
  flank crease of the 504. `rake` leans the nose and the tail (the 504's
  plunging nose and sloping boot) without changing the overall length.
- **Wheel arches**: the paint shader cuts the opening; `kit.ts` adds the
  rolled lip and a dark tub behind the wheel.
- **Greenhouse**: a real shell made of four surfaces that intersect
  (windscreen and rear window, both bowed in plan, roof, inclined side
  glass). The A and C pillars are the edges where they meet. Three layers
  share one grid: painted sheet metal with the windows cut out (alpha mask
  from `windows.ts`), glass set back 7 mm, liner set back 16 mm. Window
  surrounds, belt strip and gutter are tubes laid along the opening outlines.
- **Cabin**: seen through the glass; floor, dashboard, steering wheel, seat
  backs (head restraints when `cabin.headrest`), parcel shelf. Nothing may
  stick out of the glass (`inW`).
- **Details** (`models/*.ts`) are placed with the kit tools. `face(front)`
  gives a frame leaning like the nose or the tail; `shift(x, y)` gives the
  real X of a point on a raked end.

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
  - Without WebGL the sheet opens the same way next to the monogram.
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
- DS headlamps (`headlamps()` in `models/ds.ts`, from the owner's front and
  three-quarter photos): the wings end in blocks (`wingInner`: the wing keeps its
  height up to a straight inner wall at that distance from the axis) and the
  bonnet is a domed slab between them, its front edge raised almost to the
  headlamps (deck), as on the front photo. Its
  face carries a large rounded-trapezoid glass (straight, tall edge on the bonnet
  side, round outer edge, top rising outwards, bottom almost level), flush with the skin and ringed in
  chrome, that stretches into a long almond along the wing (about 45 cm, up to
  the front of the wheel arch); behind it a silver
  housing that follows the skin at a constant depth and two large round lamps
  set towards the rear of the glass, just behind it (fluted clear glass, yellow bulb), the outer
  one a little larger; a long amber indicator below. The outline is defined in the
  glass plane, projected onto the skin along the lamp axis, and the paint is not
  drawn inside it (`mats.lampCut`). Its parameters were checked offline against
  the body section: the whole outline lies on the wing face, one skin crossing
  only, the housing entirely inside the body. Built on the left, mirrored.
  `wingRise` (DS, 504): the wings stand higher than the bonnet, which dips between
  the headlamps.
- Long car names (over 20 characters) get `.em-parking__name--long`, a smaller
  size, two lines at most on phones.
- Nothing is painted on the back wall. Its door texture is offset (`DOOR_OFF`) so
  that every door post sits behind a pillar.
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
- No availability is shown: every car is by enquiry only.
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

- Security (`src/lib/enquiry.ts`; the site is static, so the receiving service
  must still validate, rate-limit and filter on its side):
  - bounded fields (name 100, email 254, message 2 000, also as `maxLength`),
    control and invisible characters removed, no line breaks outside the
    message (no header injection), closed lists for experience and car, real
    date, not past, at most two years ahead;
  - honeypot and a minimum fill time (2.5 s): a bot is told « sent » and nothing
    leaves; one submission at a time, none within 20 s of the previous one;
  - endpoint HTTPS only (HTTP on localhost only), no credentials in the URL;
    request without cookies or referrer, no redirects, 15 s timeout; only known,
    cleaned fields are sent; the mailto fallback is encoded and cleaned too;
  - a Content-Security-Policy `<meta>` is added at build time (`vite.config.ts`):
    the page loads only its own files and connects only to itself and to the
    endpoint's origin.

## 7. Frozen versions

- `le-garage-v1` (branch, commit `9f47e67`): the validated version, with the
  vehicle sheet inside the garage. It is a snapshot: never commit to it. Return
  to it with `git checkout le-garage-v1`; to deploy it again, reset
  `le-garage` to that commit with a new commit, or run the Pages workflow on it.
  (A git tag could not be pushed from the cloud session, hence the branch.)

## 8. Tests and checks before pushing

1. `npm test` runs everything, in order: the unit tests with coverage
   (`npm run test:unit`), the build, then the end-to-end battery
   (`npm run test:e2e`). `npm run typecheck` checks the types.
   Unit tests (Vitest + jsdom + Testing Library, `src/**/*.test.ts(x)`; `src/seo/seo.test.ts` runs without a
   browser, like the build): the SEO guard (unique addresses, title ≤ 65 and description 120 to 165 characters,
   no long dash, superlative, price, guest count or placeholder text, French non-breaking spaces, reciprocal
   hreflang, valid JSON-LD with no placeholder contact, every internal link resolves, sitemap, robots, llms),
   addresses and languages (`/fr/`, `?lang=`, pre-filled form from a content page), the form
   logic and its protections, page navigation, data and images (every file exists
   at its declared size), translations (same keys and variables in FR and EN), the
   construction of the three cars, the parking engine and the 3D workshop on a fake
   renderer (`src/test/fakeGL.ts`), and the whole interface (parking, sheet,
   photos, full screen, form, menu, legal pages, language). Coverage thresholds
   (95 % lines and statements) make the run fail if coverage drops. The deploy
   workflow runs the unit tests before building: a failing test stops the release.
2. The end-to-end battery (`tests/`, plain Playwright scripts using the
   machine's global Playwright and Chromium): `npm run build && npm run test:e2e`
   (or `node tests/run.cjs [layout|sheet|nav-form|timing|scene]`).
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
   - `pages`: every content page at 320, 390, 1024 and 1440 px (no overflow, no error, one h1, every image
     and internal link answers), the route pop-ins of the guides page (click, Escape, close, next, anchor,
     former address), and sitemap, robots, llms served;
   then `scene`: the real WebGL scene (SwiftShader, slow), reduced motion: ready,
   sheet, click in the empty parking, context loss; and each car built alone in
   the workshop without errors.
   Everything but `scene` runs without WebGL (monogram fallback, fast) and waits
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

## 9. SEO and GEO (search engines and AI assistants)

The owner-facing strategy (keywords, off-site actions, what to validate) is in `docs/SEO-GEO.md`, in French.
This section is the technical contract.

### What the build writes (`src/seo/build.tsx`)

| File | Content |
|---|---|
| `index.html`, `fr/index.html` | The home, rendered ahead of time from the React app (`src/seo/home.tsx`, `renderToString`), with its head (title, description, canonical, hreflang, Open Graph, JSON-LD). In the browser, `createRoot` renders it again (no hydration: no mismatch to manage). |
| `<path>/index.html` | One static page per content page and language, **no JavaScript** (`src/seo/page.tsx`, `src/seo/doc.css`, CSP `script-src 'none'`). |
| `sitemap.xml` | Every address, its two languages (`xhtml:link`) and its images. |
| `robots.txt` | Everything open; search engines and AI crawlers (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended…) named explicitly; sitemap. |
| `llms.txt`, `llms-full.txt` | The map of the site and the full text of every page, in Markdown, for AI assistants (llmstxt.org). |
| `404.html` | Bilingual, absolute addresses (GitHub Pages serves it at any depth), `noindex`. |

`index.html` (source) keeps two markers: `<!--em:head-->…<!--/em:head-->` (replaced by the head of each
language) and `<!--em:app-->` (the pre-rendered app). Do not remove them; the build fails without them.

### Content pages (`src/content/`)

- One file per family: `services.ts` (events and its three occasions, tours, chauffeur, rental),
  `collection.ts` (the collection and one page per car), `guides.ts` (the guides page and two articles),
  `routes.ts` (the five routes of « Les Guides de Paris », see below), `info.ts` (FAQ,
  About). Types in `types.ts`, registry in `index.ts`.
- A page = `{ id, kind, parent, experience, cars, image, related, updated, en, fr }`; each language has
  `path` (from the root, ending with `/`; English at the root, French under `fr/`), `title`, `description`,
  `h1`, `nav`, `lead`, `sections` (`p`, `list` or `stops`), `faq`, `cta`.
- `lead` is the answer in two or three sentences (who, what, where, how), always naming Époque Motors: it is
  what search engines and AI assistants quote. Keep it factual.
- Same editorial rules as the rest of the site (§ 5), checked by `seo.test.ts`: no long dash, no superlative,
  no price, no availability, no guest count, nothing unconfirmed. French copy is typed with ordinary spaces:
  `frTypo` adds the non-breaking spaces at render time.
- Car specifications and photos come from `src/data/vehicles.ts`; model history on the car pages is limited
  to well-documented facts about the model (listed for validation in `docs/SEO-GEO.md`).
- Every enquiry action links to the home form, pre-filled: `/fr/?experience=events&car=citroen-ds#ecrire`
  (`EnquiryContext` reads and removes the parameters; only values of the lists are kept).
- To add a page: an entry in the right file (both languages), its id in `PageId`, then `npm test`. Header,
  footer, sitemap, llms, breadcrumb and structured data follow. To link it from the home, add it to
  `src/data/links.ts`.

### Structured data (`src/seo/schema.ts`)

Every page carries the same business (`AutoRental`, `@id` `<site>#business`, Paris, languages, offer catalogue)
and `WebSite`, then its own nodes: `WebPage` / `CollectionPage` / `AboutPage` / `FAQPage`, `BreadcrumbList`,
`Service` (offers), `Car` (car pages: year, body, seats, engine, gearbox, drive, colour), `Article` and
`TouristTrip` with its itinerary (routes), `ItemList`, `FAQPage` (questions). Contact details, telephone and
`sameAs` are published only once `src/data/site.ts` holds real values (placeholders are detected and left out).

### Production address

`VITE_SITE_URL` (absolute, e.g. `https://www.epoque-motors.fr`). The deploy workflow passes the repository
variable `SITE_URL` when it exists, otherwise the GitHub Pages address. A local build without it uses
`https://www.epoque-motors.example/` (placeholder). `robots.txt` and `llms.txt` only take effect at the root
of a domain: on `github.io/vintage-cars/` they are not read, hence the custom domain in `docs/SEO-GEO.md`.

### Viewing the content pages

They exist only after a build: `npm run build && npm run preview`, then `/fr/guides/` for instance.

### Les Guides de Paris (`src/content/routes.ts`, `src/seo/routes.tsx`, `src/seo/guides.ts`)

From the owner's brief (November 2026). The guides page (`/fr/guides/`, `/guides/`, « Paris, autrement. »)
presents five routes. Owner's decision (12 November 2026): **no page per route**; each route opens in a
pop-in of the guides page, at its anchor: `#paris-intemporel`, `#elegance-rive-gauche`,
`#villages-est-parisien`, `#jardins-perspectives`, `#paris-boheme-confidentiel` (English: `#timeless-paris`,
`#left-bank-elegance`, `#villages-of-east-paris`, `#gardens-and-perspectives`, `#bohemian-paris`).

- On tablets and computers the pop-in is centred in the page (a margin all round); on phones it fills the
  screen, held by its four edges.
- The five sheets are `<dialog class="dp-pop">` elements written into the HTML of the guides page, so their text
  is read by search engines and AI assistants. `src/seo/guides.ts` (about 1 kB, the only script of the content
  pages; CSP `script-src 'self'` on this page only) opens a sheet on a click or from the address anchor,
  closes it with Escape, « Fermer » or a click outside, keeps the anchor in the address, and returns focus.
- A sheet: « Itinéraire N°01 », its title (h2), the owner's introduction (`route.intro`, quoted as written), a
  photo, practical details (duration, distance, start, finish, mood; editorial estimates), the answer-first
  `lead`, the route, the stops (vertical timeline), photo spots, places to eat (only the restaurants named by
  the owner; suggestions, not included; allergies note), practical advice, the closing invitation (owner's
  text, « Découvrir nos expériences » → home `#sortie-1`, « Nous contacter pour imaginer votre parcours » → form
  pre-filled with private tours), previous and next route.
- Routes are not in `pages` (`routes` in `src/content/index.ts`); `routeAnchor()` gives the anchor. Their
  structured data (`TouristTrip` with the coordinates of each stop, `geo`) is on the guides page.
- Durations, distances, stops, spots and restaurants come from the brief: do not add any.
- No map for now (owner's decision): Leaflet was removed. The coordinates stay in `geo` for a later map.
- Former addresses: the five route pages and the four first routes are `noindex` redirect pages with a
  canonical to the guides page, landing on the right sheet (`redirects()` in `src/seo/build.tsx`).
- The home links to the sheets (chapter N°2, `routeLinks` in `src/data/links.ts`); chapter N°2 has no second
  link to the tours page (owner's decision), the tours page stays in the content menus and footers.
- Photos: the routes reuse the site's images until a photograph per route is supplied (see
  `docs/SEO-GEO.md`). Every new photo must have its rights, and plates blurred (§ 5).

### Header of the content pages (`Header` in `src/seo/page.tsx`)

From 1280 px: the logo, the tabs (La collection, Événements, Visites de Paris, Chauffeur, Les Guides de Paris,
FAQ), then, set apart by a vertical rule, « Écrire » as a framed button and the language switch (globe,
FR / EN, as on the home page). Below 1280 px: the logo and a « Menu » button (a <details>, no script) that
opens a full-screen panel with every page (the tabs and À propos), « Écrire », the language and a link back
to the home page.

### The menu (phones, and content pages below 1280 px)

The home menu (`.em-menu`, `TopNav.tsx`) and the content pages menu (`.dp-burger`, `Header` in
`src/seo/page.tsx`) show the same thing, in the same order and style: the logo on the left and a cross
« Fermer » on the right, the title « Le site en détail », the seven pages (`siteTabs` / `MENU` + À propos), then
« Écrire » as a framed champagne button and the language switch (globe, FR / EN), and « ← Retour à l'accueil ».
The logo of the menu is a link back to the top of the home page (the garage).
Change one, change the other.

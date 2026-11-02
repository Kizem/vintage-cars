import type { Localized } from '../i18n/locales';
import type { CarModelKey } from '../scene/carspecs';

/**
 * A photograph slot. Leave `src` empty to render a clearly labelled placeholder;
 * drop the final file in /public/images/... and set `src` to replace it.
 */
export interface MediaAsset {
  /** Path relative to the site root, e.g. 'images/collection/citroen-ds.jpg'. Empty = placeholder. */
  src?: string;
  /** Optional responsive sources, e.g. 'images/x-800.jpg 800w, images/x-1600.jpg 1600w'. */
  srcSet?: string;
  /** Intrinsic size in pixels, rendered as width / height attributes. */
  width?: number;
  height?: number;
  /** Accessible description of the final photograph. */
  alt: Localized;
  /** Short caption shown under the photo in the vehicle carousel. */
  caption?: Localized;
  /** Short label displayed on the placeholder (what the photograph should show). */
  placeholderLabel: Localized;
  /** Art-direction brief for the photographer. Shown on the placeholder. */
  brief?: Localized;
  /** CSS object-position for cropping, e.g. '50% 60%'. */
  focalPoint?: string;
  /** Credit or notice shown on the photo, e.g. “Illustrative photo”. */
  credit?: Localized;
}

/** How the car can be booked. */
export type ServiceMode = 'chauffeur' | 'chauffeur-or-self-drive';

export type AvailabilityStatus = 'on-request' | 'available' | 'limited' | 'unavailable' | 'coming-soon';

/** How the car is drawn in the 3D parking (a graphic rendering, never presented as a photo). */
export interface VehicleRendering {
  /** Model in src/scene/carspecs.ts. */
  model: CarModelKey;
  /** 'rise': the car lifts on its suspension on hover (Citroën DS). */
  behaviour: 'roll' | 'rise';
  /** Accessible description of the rendering, used when WebGL is unavailable. */
  alt: Localized;
}

export interface Vehicle {
  /** URL-safe identifier, also used in the ?car= deep link. */
  slug: string;
  name: Localized;
  marque: string;
  /** Large letters shown on the image placeholder. */
  mark: string;
  category: Localized;
  /** Short description shown on cards. */
  description: Localized;
  /** One line for the vehicle sheet in the parking focus. Falls back to `description`. */
  summary?: Localized;
  /** Optional longer text for the detail view. Falls back to `description`. */
  story?: Localized<string[]>;
  /** Optional verified facts (year, colour, seats…). Only add confirmed information. */
  details?: { label: Localized; value: Localized }[];
  availability: AvailabilityStatus;
  service: ServiceMode;
  /** Main photograph, used on the card and as the first slide of the detail view. */
  image: MediaAsset;
  /** Additional photographs shown after `image` in the detail view carousel. */
  gallery?: MediaAsset[];
  rendering: VehicleRendering;
}

export type ExperienceId = 'private-tours' | 'chauffeured' | 'events';

export interface Experience {
  id: ExperienceId;
  index: string;
  label: Localized;
  title: Localized;
  description: Localized;
  /** Typical duration, shown under the description. */
  duration: Localized;
  cta: Localized;
  image: MediaAsset;
}

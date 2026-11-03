import type { Localized } from '../i18n/locales';
import type { CarModelKey } from '../scene/carspecs';

/** A photograph or illustration, stored in /public/images/<section>/. */
export interface MediaAsset {
  /** Path relative to the site root, e.g. 'images/collection/citroen-ds.webp'. */
  src: string;
  /** Optional responsive sources, e.g. 'images/x-800.webp 800w, images/x.webp 1500w'. */
  srcSet?: string;
  /** Intrinsic size in pixels, rendered as width / height attributes. */
  width: number;
  height: number;
  /** Accessible description of the image. */
  alt: Localized;
  /** Short caption shown under the photo in the vehicle carousel. */
  caption?: Localized;
  /** CSS object-position for cropping, e.g. '50% 60%'. */
  focalPoint?: string;
  /** Notice shown on the image, e.g. “Illustrative image” or “Illustrative photo”. */
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
  /** URL-safe identifier, also the value of the enquiry form's car field. */
  slug: string;
  name: Localized;
  marque: string;
  /** Short mark of the model, e.g. 'DS'. */
  mark: string;
  category: Localized;
  description: Localized;
  /** One line for the vehicle sheet in the parking focus. Falls back to `description`. */
  summary?: Localized;
  /** Optional longer history of the model. */
  story?: Localized<string[]>;
  /** Optional verified facts (year, colour, seats…). Only add confirmed information. */
  details?: { label: Localized; value: Localized }[];
  availability: AvailabilityStatus;
  service: ServiceMode;
  /** First photo of the carousel in the vehicle focus. */
  image: MediaAsset;
  /** Photos shown after `image` in the carousel. */
  gallery?: MediaAsset[];
  rendering: VehicleRendering;
}

export type ExperienceId = 'private-tours' | 'chauffeured' | 'events';

export interface Experience {
  id: ExperienceId;
  /** Name in the enquiry form's experience list. */
  label: Localized;
  /** Chapter title. */
  title: Localized;
  /** Chapter text on desktop and tablet: one entry per paragraph. */
  body: Localized<string[]>;
  /** Shorter chapter text on smartphones, a single paragraph. */
  summary: Localized;
  cta: Localized;
  image: MediaAsset;
}

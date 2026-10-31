/**
 * A photograph slot. Leave `src` empty to render a clearly labelled placeholder;
 * drop the final file in /public/images/... and set `src` to replace it.
 */
export interface MediaAsset {
  /** Path to the image, e.g. '/images/collection/citroen-ds.jpg'. Empty = placeholder. */
  src?: string;
  /** Optional responsive sources, e.g. '/images/x-800.jpg 800w, /images/x-1600.jpg 1600w'. */
  srcSet?: string;
  /** Accessible description of the final photograph. */
  alt: string;
  /** Short label displayed on the placeholder (what the photograph should show). */
  placeholderLabel: string;
  /** Art-direction brief for the photographer / retoucher. Shown on the placeholder. */
  brief?: string;
  /** CSS object-position for cropping, e.g. '50% 60%'. */
  focalPoint?: string;
  /** Photo credit, displayed discreetly when provided. */
  credit?: string;
}

export type AvailabilityStatus = 'on-request' | 'available' | 'limited' | 'unavailable' | 'coming-soon';

export interface Vehicle {
  /** URL-safe identifier, also used in the ?car= deep link. */
  slug: string;
  name: string;
  /** Brand family, used for the small heading above the name. */
  marque: string;
  category: string;
  /** Short description shown on cards. */
  description: string;
  /** Optional longer text for the detail view. Falls back to `description`. */
  story?: string[];
  /** Optional verified facts (year, colour, seats…). Only add confirmed information. */
  details?: { label: string; value: string }[];
  availability: AvailabilityStatus;
  image: MediaAsset;
  /** Additional photographs for the detail view. */
  gallery?: MediaAsset[];
}

export type ExperienceId = 'private-tours' | 'chauffeured' | 'events';

export interface Experience {
  id: ExperienceId;
  index: string;
  label: string;
  title: string;
  description: string;
  cta: string;
  image: MediaAsset;
}

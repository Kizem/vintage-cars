import type { AvailabilityStatus, Vehicle } from './types';

/**
 * THE COLLECTION — single source of truth.
 *
 * To add a car: append an object to this array. Cards, detail view and the
 * enquiry form's "Preferred vehicle" list update automatically.
 *
 * Only publish verified information: no model years, specifications, trims
 * or prices until they are confirmed for the actual car in the collection.
 */
export const vehicles: Vehicle[] = [
  {
    slug: 'citroen-ds',
    name: 'Citroën DS',
    marque: 'Citroën',
    category: 'French Icon',
    description:
      'An icon of French design and engineering. A timeless silhouette that embodies the elegance and innovation of another era.',
    availability: 'on-request',
    image: {
      src: '',
      alt: 'The Citroën DS of the Époque Motors collection, photographed in Paris',
      placeholderLabel: 'Citroën DS — collection car',
      brief: 'Three-quarter front view, Parisian street, soft daylight. 4:5 portrait.',
      focalPoint: '50% 55%',
    },
  },
  {
    slug: 'peugeot-504',
    name: 'Peugeot 504',
    marque: 'Peugeot',
    category: 'French Classic',
    description:
      'A symbol of French automotive craftsmanship, combining understated elegance with unmistakable character.',
    availability: 'on-request',
    image: {
      src: '',
      alt: 'The Peugeot 504 of the Époque Motors collection, photographed in Paris',
      placeholderLabel: 'Peugeot 504 — collection car',
      brief: 'Side profile against stone façade, overcast light. 4:5 portrait.',
      focalPoint: '50% 55%',
    },
  },
  {
    slug: 'mercedes-benz-classic',
    name: 'Mercedes-Benz Classic',
    marque: 'Mercedes-Benz',
    category: 'German Heritage',
    description: 'A timeless expression of German engineering, refinement and automotive heritage.',
    availability: 'on-request',
    image: {
      src: '',
      alt: 'The classic Mercedes-Benz of the Époque Motors collection, photographed in Paris',
      placeholderLabel: 'Mercedes-Benz — collection car',
      brief: 'Front detail with grille and lamps, early-evening light. 4:5 portrait.',
      focalPoint: '50% 55%',
    },
  },
];

export const availabilityLabels: Record<AvailabilityStatus, string> = {
  'on-request': 'Available on request',
  available: 'Available',
  limited: 'Limited availability',
  unavailable: 'Currently unavailable',
  'coming-soon': 'Joining the collection soon',
};

export const getVehicle = (slug: string | null | undefined) =>
  vehicles.find((v) => v.slug === slug);

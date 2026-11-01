import type { Vehicle } from './types';

/**
 * THE COLLECTION, single source of truth.
 *
 * To add a car: append an object to this array. Cards, detail view and the
 * enquiry form's "Preferred vehicle" list update automatically.
 *
 * Only publish verified information: no model years, specifications, trims
 * or prices until they are confirmed for the actual car in the collection.
 * Never mark a car as 'available' without confirmation.
 */
export const vehicles: Vehicle[] = [
  {
    slug: 'citroen-ds',
    name: 'Citroën DS',
    marque: 'Citroën',
    mark: 'DS',
    category: { en: 'French Icon', fr: 'Icône française' },
    description: {
      en: 'An icon of French design and engineering. A timeless silhouette that embodies the elegance and innovation of another era.',
      fr: 'Une icône du design et de l’ingénierie français. Une silhouette intemporelle qui incarne l’élégance et l’innovation d’une autre époque.',
    },
    availability: 'on-request',
    image: {
      src: '',
      alt: {
        en: 'The Citroën DS of the Époque Motors collection, photographed in Paris',
        fr: 'La Citroën DS de la collection Époque Motors, photographiée à Paris',
      },
      placeholderLabel: { en: 'Citroën DS, collection car', fr: 'Citroën DS, voiture de la collection' },
      brief: {
        en: 'Three-quarter front view, Parisian street, soft daylight. 4:5 portrait.',
        fr: 'Vue trois-quarts avant, rue parisienne, lumière douce. Portrait 4:5.',
      },
      focalPoint: '50% 55%',
    },
  },
  {
    slug: 'peugeot-504',
    name: 'Peugeot 504',
    marque: 'Peugeot',
    mark: '504',
    category: { en: 'French Classic', fr: 'Classique français' },
    description: {
      en: 'A symbol of French automotive craftsmanship, combining understated elegance with unmistakable character.',
      fr: 'Un symbole du savoir-faire automobile français, qui allie une élégance discrète à un caractère affirmé.',
    },
    availability: 'on-request',
    image: {
      src: '',
      alt: {
        en: 'The Peugeot 504 of the Époque Motors collection, photographed in Paris',
        fr: 'La Peugeot 504 de la collection Époque Motors, photographiée à Paris',
      },
      placeholderLabel: { en: 'Peugeot 504, collection car', fr: 'Peugeot 504, voiture de la collection' },
      brief: {
        en: 'Side profile against a stone façade, overcast light. 4:5 portrait.',
        fr: 'Profil devant une façade en pierre, lumière voilée. Portrait 4:5.',
      },
      focalPoint: '50% 55%',
    },
  },
  {
    slug: 'mercedes-benz-classic',
    name: 'Mercedes-Benz Classic',
    marque: 'Mercedes-Benz',
    mark: 'MB',
    category: { en: 'German Heritage', fr: 'Héritage allemand' },
    description: {
      en: 'A timeless expression of German engineering, refinement and automotive heritage.',
      fr: 'L’expression intemporelle de l’ingénierie allemande, de son raffinement et de son patrimoine automobile.',
    },
    availability: 'on-request',
    image: {
      src: '',
      alt: {
        en: 'The classic Mercedes-Benz of the Époque Motors collection, photographed in Paris',
        fr: 'La Mercedes-Benz de collection d’Époque Motors, photographiée à Paris',
      },
      placeholderLabel: { en: 'Mercedes-Benz, collection car', fr: 'Mercedes-Benz, voiture de la collection' },
      brief: {
        en: 'Front detail with grille and lamps, early evening light. 4:5 portrait.',
        fr: 'Détail avant, calandre et phares, lumière de fin de journée. Portrait 4:5.',
      },
      focalPoint: '50% 55%',
    },
  },
];

export const getVehicle = (slug: string | null | undefined) => vehicles.find((v) => v.slug === slug);

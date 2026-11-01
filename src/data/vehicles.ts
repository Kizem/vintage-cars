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
    name: { en: 'Citroën DS', fr: 'Citroën DS' },
    marque: 'Citroën',
    mark: 'DS',
    category: { en: 'French Icon', fr: 'Icône française' },
    description: {
      en: 'An icon of French design and engineering. A timeless silhouette that embodies the elegance and innovation of another era.',
      fr: 'Le design et l’audace technique à la française. Une silhouette reconnaissable au premier regard, qui incarne l’élégance et l’esprit d’innovation d’une autre époque.',
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
    name: { en: 'Peugeot 504', fr: 'Peugeot 504' },
    marque: 'Peugeot',
    mark: '504',
    category: { en: 'French Classic', fr: 'Classique français' },
    description: {
      en: 'A symbol of French automotive craftsmanship, combining understated elegance with unmistakable character.',
      fr: 'Un symbole du savoir-faire automobile français : une élégance sobre et un caractère bien à elle.',
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
    name: { en: 'Mercedes-Benz Classic', fr: 'Mercedes-Benz de collection' },
    marque: 'Mercedes-Benz',
    mark: 'MB',
    category: { en: 'German Heritage', fr: 'Tradition allemande' },
    description: {
      en: 'A timeless expression of German engineering, refinement and automotive heritage.',
      fr: 'La rigueur de l’ingénierie allemande, servie par un raffinement qui n’a pas pris une ride.',
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

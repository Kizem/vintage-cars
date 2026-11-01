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
        en: 'Three-quarter front view, Parisian street, soft daylight. 3:2 landscape.',
        fr: 'Vue trois-quarts avant, rue parisienne, lumière douce. Paysage 3:2.',
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
      src: 'images/collection/peugeot-504-avant.webp',
      alt: {
        en: 'The blue Peugeot 504 saloon of the collection, three-quarter front view',
        fr: 'La Peugeot 504 berline bleue de la collection, vue de trois-quarts avant',
      },
      placeholderLabel: { en: 'Peugeot 504, front', fr: 'Peugeot 504, avant' },
      focalPoint: '42% 60%',
    },
    // Source: owner's listing https://www.roadstr.fr/cars/peugeot-504-1971-saint-denis
    // TODO: complete with the listing's specifications once verified.
    details: [{ label: { en: 'Year', fr: 'Année' }, value: { en: '1971', fr: '1971' } }],
    gallery: [
      {
        src: 'images/collection/peugeot-504-arriere.webp',
        alt: {
          en: 'The blue Peugeot 504 saloon of the collection, three-quarter rear view',
          fr: 'La Peugeot 504 berline bleue de la collection, vue de trois-quarts arrière',
        },
        placeholderLabel: { en: 'Peugeot 504, rear', fr: 'Peugeot 504, arrière' },
        focalPoint: '50% 60%',
      },
    ],
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
        en: 'Three-quarter front view, early evening light. 3:2 landscape.',
        fr: 'Vue trois-quarts avant, lumière de fin de journée. Paysage 3:2.',
      },
      focalPoint: '50% 55%',
    },
  },
];

export const getVehicle = (slug: string | null | undefined) => vehicles.find((v) => v.slug === slug);

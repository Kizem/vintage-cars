/* Les trois voitures, dessinées en 3D à partir de leurs proportions (longueur, empattement, hauteur).
   Ce sont des représentations graphiques, pas des photos. Unités : mètres. Le nez est côté -X.

   Toutes suivent le même cahier des charges : fiche (carspecs.ts) → matériaux communs (materials.ts)
   → carrosserie commune (kit.ts) → détails propres au modèle (models/*.ts) → roues communes (wheels.ts).
   La présentation (caméra, lumières, rendu) est commune elle aussi : presentation.ts. */
import type { Texture } from 'three';
import type { CarModelKey, CarSpec } from './carspecs';
import { buildBody, createCurves, type CarKit } from './kit';
import { createMaterials } from './materials';
import { buildWheels } from './wheels';
import { details as dsDetails } from './models/ds';
import { details as p504Details } from './models/p504';
import { details as w114Details } from './models/w114';

/** Les détails de chaque modèle : face avant, poupe, enjoliveurs, monogrammes. */
const DETAILS: Record<CarSpec['lampKind'], (k: CarKit) => void> = { ds: dsDetails, peugeot: p504Details, mercedes: w114Details };
export type { CarModelKey };

export function buildCar(spec: CarSpec, env: Texture) {
  const curves = createCurves(spec);
  const mats = createMaterials(spec, env, curves.be);
  const kit = buildBody(spec, mats, curves);
  DETAILS[spec.lampKind](kit);
  const wheels = buildWheels(spec, mats, kit.root);
  return { root: kit.root, body: kit.body, wheels, lens: mats.lens, lampPoints: kit.lampPoints, L: spec.L, W: spec.W, H: spec.H, wheelR: spec.wheelR };
}

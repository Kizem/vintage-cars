/* Présentation commune : le même rendu, la même caméra et le même éclairage pour les trois voitures,
   dans le parking (parking.ts) comme dans l'atelier de développement (viewer.ts). Une voiture réglée
   dans l'atelier apparaît donc de la même façon sur la page. */
import { ACESFilmicToneMapping, DirectionalLight, HemisphereLight, PerspectiveCamera, PointLight, SRGBColorSpace, type Scene, type WebGLRenderer } from 'three';

/** Rendu : sRGB, tonalité ACES, exposition commune, densité de pixels plafonnée à 2. */
export function configureRenderer(renderer: WebGLRenderer) {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
}

/** Caméra : focale longue (30°), peu de déformation des carrosseries. */
export const CAMERA_FOV = 30;
export function createCamera(far = 90) {
  return new PerspectiveCamera(CAMERA_FOV, 1, .1, far);
}

/** Éclairage d'ensemble : ciel clair et sol vert sombre, soleil haut à l'avant gauche. */
export function addStudioLights(scene: Scene) {
  scene.add(new HemisphereLight(0xe6eadf, 0x16241c, .62));
  const sun = new DirectionalLight(0xfff6e4, 1.1); sun.position.set(-3, 8, 7); scene.add(sun);
  return sun;
}

/** Le néon au-dessus de chaque place : intensité au repos, en face de la caméra, et au survol. */
export const CAR_LIGHT = { height: 3.2, rest: 4, near: 11, hover: 12 };
export function createCarLight() {
  const light = new PointLight(0xf2efe3, 0, 13, 1.5);
  light.position.set(0, CAR_LIGHT.height, 0);
  return light;
}
/** Intensité du néon : `near` = 1 pour la voiture en face, `hover` = 1 au survol. */
export const carLightIntensity = (near: number, hover: number) => CAR_LIGHT.rest + near * CAR_LIGHT.near + hover * CAR_LIGHT.hover;

/** Vues nommées de l'atelier (position de la caméra ; le nez est côté -X), cible au centre de la voiture. */
export const VIEWS: Record<string, [number, number, number]> = {
  'trois-quarts avant': [-5.2, 1.6, 4.4],
  avant: [-7, 1.1, 0],
  profil: [0, 1.1, 7.5],
  'trois-quarts arrière': [5.2, 1.7, 4.4],
  arrière: [7, 1.2, 0],
  dessus: [0, 8, .01],
};
export const VIEW_TARGET: [number, number, number] = [0, .7, 0];

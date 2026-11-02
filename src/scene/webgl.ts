/** WebGL disponible ? Testé sans charger three.js, pour choisir entre la scène et le profil vectoriel. */
export function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

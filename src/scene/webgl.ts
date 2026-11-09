/** WebGL disponible ? Testé sans charger three.js, pour choisir entre la scène et le profil vectoriel.
    Le contexte de test est libéré aussitôt (les navigateurs mobiles en limitent le nombre) et le résultat gardé. */
let known: boolean | undefined;
export function hasWebGL() {
  if (known !== undefined) return known;
  /* pré-rendu : la page est écrite comme avec la scène, le navigateur décide ensuite */
  if (typeof document === 'undefined') return true;
  try {
    const c = document.createElement('canvas');
    const g = (c.getContext('webgl2') || c.getContext('webgl')) as WebGLRenderingContext | null;
    known = !!g;
    g?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    known = false;
  }
  return known;
}

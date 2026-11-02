/* Reflets des carrosseries : un petit studio dont seuls les néons comptent, converti en carte d'environnement. */
import { BackSide, BoxGeometry, Mesh, MeshBasicMaterial, PlaneGeometry, PMREMGenerator, Scene, type Material, type Object3D, type WebGLRenderer, Texture } from 'three';

/* Libère tout ce qu'une scène a confié au GPU : géométries, matériaux et textures */
export function release(root: Object3D) {
  root.traverse((o) => {
    const m = o as Object3D & { geometry?: { dispose(): void }; material?: Material | Material[] };
    m.geometry?.dispose();
    const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
    mats.forEach((mat) => {
      Object.values(mat).forEach((v) => { if (v instanceof Texture) v.dispose(); });
      mat.dispose();
    });
  });
}

export function studioEnvironment(renderer: WebGLRenderer) {
  const envScene = new Scene();
  envScene.add(new Mesh(new BoxGeometry(40, 16, 40), new MeshBasicMaterial({ color: 0x3e453f, side: BackSide })));
  const strip = (x: number, y: number, z: number, w: number, h: number, c = 0xffffff, rotX = Math.PI / 2) => { const m = new Mesh(new PlaneGeometry(w, h), new MeshBasicMaterial({ color: c, side: 2 })); m.position.set(x, y, z); m.rotation.x = rotX; envScene.add(m); };
  for (let i = -3; i <= 3; i++) { strip(i * 4.5, 7, 3, 2.8, 16, 0xf8f8ee); }
  strip(0, 3, 19, 36, 3.6, 0xc8d0c6, 0);
  strip(0, 1.2, -19, 36, 3.5, 0x9aa69c, 0);
  const floorMirror = new Mesh(new PlaneGeometry(40, 40), new MeshBasicMaterial({ color: 0x20302a, side: 2 })); floorMirror.rotation.x = Math.PI / 2; floorMirror.position.y = -7.5; envScene.add(floorMirror);
  const pm = new PMREMGenerator(renderer);
  const rt = pm.fromScene(envScene, .025);
  pm.dispose();
  release(envScene);
  return rt;
}

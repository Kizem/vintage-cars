/* Moteur de rendu factice pour les tests : three.js calcule la scène, rien n'est envoyé à une carte graphique. */

export class FakeRenderer {
  static instances: FakeRenderer[] = [];
  domElement: HTMLCanvasElement;
  renders = 0;
  lost = false;
  outputColorSpace = '';
  toneMapping = 0;
  toneMappingExposure = 1;
  pixelRatio = 1;
  size: [number, number] = [0, 0];
  constructor(opts: { canvas?: HTMLCanvasElement } = {}) {
    this.domElement = opts.canvas ?? document.createElement('canvas');
    FakeRenderer.instances.push(this);
  }
  setPixelRatio(r: number) { this.pixelRatio = r; }
  setSize(w: number, h: number) { this.size = [w, h]; }
  setClearColor() {}
  setAnimationLoop(cb: ((t: number) => void) | null) { if (cb) cb(0); }
  render() { this.renders++; }
  dispose() {}
  getContext() { return { isContextLost: () => this.lost }; }
  forceContextLoss() { this.lost = true; }
}

/** Générateur d'environnement factice ; `Texture` est passé par le module three réel (pas de dépendance circulaire avec le mock). */
export const fakePMREM = (Texture: new () => { dispose(): void }) => class {
  fromScene() { return { texture: new Texture(), dispose() {} }; }
  dispose() {}
};

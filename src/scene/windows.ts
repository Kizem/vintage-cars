/* Les baies du pavillon. La coque du pavillon (kit.ts) est une grille (x, t) : t = 0 à la ceinture, TS en haut des
   vitres latérales, TC au bord du toit, 1 dans l'axe de la voiture. Les baies y sont dessinées comme sur un patron :
   le masque (blanc = tôle, noir = baie) sert de carte alpha à la tôle et à la garniture, et le contour de chaque baie
   est rendu pour y poser un jonc. Les cotes de la fiche sont en mètres ; ce module les convertit. */
import type { Texture } from 'three';
import type { CarSpec } from './carspecs';
import { canvasTex } from './geometry';

type XT = [number, number];
export interface MaskContext {
  gx0: number; gx1: number; TS: number; TC: number;
  /** À l'abscisse x : hauteur du côté vitré (h) et demi-largeur du dessus au bord du toit (z). */
  side: (x: number) => { h: number; z: number };
  /** Négatif sur le pare-brise, positif sur le toit. */
  header: (x: number, z: number) => number;
  /** Négatif sur la lunette, positif sur le toit. */
  footer: (x: number, z: number) => number;
}

const MW = 2048; const MH = 1024;

export function windowMask(s: CarSpec, c: MaskContext): { texture: Texture; sidePaths: XT[][]; screenPath: XT[]; rearPath: XT[]; dlo: [number, number] } {
  const w = s.windows; const gl = s.glass; const { TS, TC } = c;
  const step = .01; const n = Math.round((c.gx1 - c.gx0) / step);
  const xs = Array.from({ length: n + 1 }, (_, i) => c.gx0 + (c.gx1 - c.gx0) * i / n);
  const sides = xs.map(c.side);
  const at = (x: number) => sides[Math.min(n, Math.max(0, Math.round((x - c.gx0) / (c.gx1 - c.gx0) * n)))];
  /** Haut des vitres latérales : sous le bord du toit, à la distance `frame`. */
  const tTop = (x: number) => { const h = at(x).h; return h > w.frame ? TS * (h - w.frame) / h : 0; };

  /* vitres latérales : chacune entre deux bords droits [x en bas, x en haut], sous le haut des vitres */
  const sidePaths = w.side.map(([xb0, xt0, xb1, xt1]) => {
    const path: XT[] = [];
    const front = (t: number) => xb0 + (xt0 - xb0) * t / TS; const rear = (t: number) => xb1 + (xt1 - xb1) * t / TS;
    let tf = 0; while (tf < TS && tTop(front(tf)) > tf) { path.push([front(tf), tf]); tf += .01; }
    let tr = 0; const back: XT[] = []; while (tr < TS && tTop(rear(tr)) > tr) { back.push([rear(tr), tr]); tr += .01; }
    for (let x = front(tf); x < rear(tr); x += .02) path.push([x, tTop(x)]);
    return [...path, ...back.reverse()];
  });
  const dlo: [number, number] = [Math.min(...sidePaths.map((p) => p[0][0])), Math.max(...sidePaths.map((p) => p[p.length - 1][0]))];

  /* pare-brise et lunette : la partie du dessus qui n'est pas le toit, moins le montant (au bord) et la traverse */
  const topPath = (edge: (x: number, z: number) => number, dir: 1 | -1, pillar: number, bar: number): XT[] => {
    const path: XT[] = []; const zRef = at(dir > 0 ? gl.xb : gl.xc).z; const f0 = pillar / zRef;
    for (let i = 0; i <= 16; i++) {
      const f = f0 + (1 - f0) * i / 16; const t = TC + (1 - TC) * f;
      /* dernière abscisse (en allant vers le toit) où la surface est encore la vitre */
      const on = (x: number) => edge(x, c.side(x).z * (1 - f)) < 0;
      let a = dir > 0 ? gl.xa : gl.xd; let b = dir > 0 ? gl.xb + .3 : gl.xc - .3;
      for (let k = 0; k < 22; k++) { const m = (a + b) / 2; if (on(m)) a = m; else b = m; }
      const xe = a;
      path.push([xe - dir * bar, t]);
    }
    const end: XT = dir > 0 ? [c.gx0 - .2, path[0][1]] : [c.gx1 + .2, path[0][1]];
    return [end, ...path];
  };
  const screenPath = topPath(c.header, 1, w.pillarA, w.header);
  const rearPath = topPath(c.footer, -1, w.pillarC, w.footer);

  const U = (x: number) => (x - c.gx0) / (c.gx1 - c.gx0) * MW; const V = (t: number) => (1 - t) * MH;
  const texture = canvasTex(MW, MH, (g) => {
    g.fillStyle = '#fff'; g.fillRect(0, 0, MW, MH);
    g.fillStyle = '#000'; g.strokeStyle = '#000'; g.lineJoin = 'round'; g.lineWidth = w.r * 2 * MW / (c.gx1 - c.gx0);
    const draw = (pts: XT[], close: XT[]) => { g.beginPath(); [...pts, ...close].forEach(([x, t], i) => (i ? g.lineTo(U(x), V(t)) : g.moveTo(U(x), V(t)))); g.closePath(); g.fill(); g.stroke(); };
    sidePaths.forEach((p) => draw(p, [[p[p.length - 1][0], -.2], [p[0][0], -.2]]));
    draw(screenPath, [[screenPath[screenPath.length - 1][0], 1.2], [c.gx0 - .2, 1.2]]);
    draw(rearPath, [[rearPath[rearPath.length - 1][0], 1.2], [c.gx1 + .2, 1.2]]);
  });
  texture.anisotropy = 4;
  return { texture, sidePaths, screenPath: screenPath.slice(1), rearPath: rearPath.slice(1), dlo };
}

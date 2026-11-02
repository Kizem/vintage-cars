/* Les trois voitures, à partir de leurs proportions (longueur, empattement, hauteur).
   Ce module ne dépend pas de three.js : il sert aussi au profil vectoriel affiché sans WebGL.
   Unités : mètres. Le nez est côté -X. */

export type Pt = [number, number];
export type CarModelKey = 'ds' | 'p504' | 'w114';

export interface CarSpec {
  L: number; H: number; W: number; wheelR: number; wheelW: number;
  hub: 'ds' | 'peugeot' | 'mercedes'; hubTint: string;
  paint: { color: number; metalness: number; roughness: number };
  roof?: { color: number; metalness: number; roughness: number };
  axles: number[]; arch: Pt[]; trackZ: number[];
  floor: Pt[]; belt: Pt[]; deck: Pt[]; hw: Pt[];
  glass: { xa: number; xb: number; xc: number; xd: number; roofY: number; baseY: number; tailY: number; tumble: number };
  lensColor?: number;
  pillars: [number, number, number, number][];
  cPillar: [number, number, number, number];
  seams: number[];
  trim: [number, number, number, number][];
  lamps: [number, number, number][]; lampKind: 'ds' | 'peugeot' | 'mercedes';
  roofColorDiffers?: boolean;
}

/* Courbe lisse et sans dépassement à travers des points [x, y] */
export function curve(points: Pt[]) {
  const P = points; const n = P.length;
  const d: number[] = []; const m: number[] = [];
  for (let i = 0; i < n - 1; i++) d[i] = (P[i + 1][1] - P[i][1]) / (P[i + 1][0] - P[i][0]);
  m[0] = d[0]; m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : 2 * d[i - 1] * d[i] / (d[i - 1] + d[i]);
  return (x: number) => {
    if (x <= P[0][0]) return P[0][1];
    if (x >= P[n - 1][0]) return P[n - 1][1];
    let i = 0; while (x > P[i + 1][0]) i++;
    const h = P[i + 1][0] - P[i][0]; const t = (x - P[i][0]) / h; const t2 = t * t; const t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * P[i][1] + (t3 - 2 * t2 + t) * h * m[i] + (-2 * t3 + 3 * t2) * P[i + 1][1] + (t3 - t2) * h * m[i + 1];
  };
}
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* --- Les trois voitures --- */
export const SPECS: Record<CarModelKey, CarSpec> = {
  ds: {
    L: 4.84, H: 1.47, W: 1.79, wheelR: .315, wheelW: .17, hub: 'ds', hubTint: '#c9cbc9',
    paint: { color: 0xaeb2b4, metalness: .3, roughness: .3 }, roof: { color: 0xd8d8d0, metalness: 0, roughness: .42 },
    axles: [-1.49, 1.635], arch: [[.385, 2], [.385, .47]], trackZ: [.74, .62],
    floor: [[-2.42, .47], [-2.2, .33], [-1.9, .27], [1.7, .27], [2.15, .36], [2.42, .55]],
    belt: [[-2.42, .50], [-2.1, .69], [-1.0, .85], [0, .94], [1.2, 1.0], [1.9, .95], [2.42, .63]],
    deck: [[-2.42, .53], [-2.2, .68], [-1.6, .83], [-.9, .96], [-.55, 1.0], [1.4, 1.1], [1.95, 1.0], [2.3, .8], [2.42, .66]],
    hw: [[-2.42, .5], [-2.25, .68], [-1.9, .84], [-1.2, .895], [.4, .895], [1.5, .84], [2.1, .7], [2.42, .46]],
    glass: { xa: -.86, xb: -.12, xc: 1.02, xd: 2.02, roofY: 1.47, baseY: .98, tailY: 1.03, tumble: .74 },
    lensColor: 0xf7eab8,
    pillars: [[-.04, .02, -.06, -.02], [.98, 1.03, .85, .92]],
    cPillar: [1.62, 1.84, 1.0, 1.12],
    seams: [-.62, .42, 1.42],
    trim: [[-2.2, .47, 2.2, .53]],
    lamps: [[-2.34, .63, .33], [-2.2, .67, .56]], lampKind: 'ds',
    roofColorDiffers: true,
  },
  p504: {
    L: 4.49, H: 1.46, W: 1.69, wheelR: .315, wheelW: .17, hub: 'peugeot', hubTint: '#c7c9c7',
    paint: { color: 0x14508d, metalness: .25, roughness: .28 },
    axles: [-1.39, 1.35], arch: [[.385, 2], [.385, 2]], trackZ: [.72, .72],
    floor: [[-2.245, .4], [-2.0, .29], [-1.7, .27], [1.7, .27], [2.1, .32], [2.245, .46]],
    belt: [[-2.245, .68], [-2.1, .82], [-1.0, .89], [0, .93], [1.25, .98], [2.0, .96], [2.245, .86]],
    deck: [[-2.245, .72], [-2.15, .84], [-1.4, .93], [-.7, 1.0], [1.2, 1.04], [1.75, 1.03], [2.15, .98], [2.245, .86]],
    hw: [[-2.245, .72], [-2.1, .8], [-1.6, .845], [1.0, .845], [1.9, .82], [2.245, .7]],
    glass: { xa: -.8, xb: -.14, xc: .62, xd: 1.3, roofY: 1.46, baseY: .98, tailY: 1.03, tumble: .72 },
    lensColor: 0xf7eab8,
    pillars: [[.2, .25, .13, .18]],
    cPillar: [.86, 1.3, .52, .68],
    seams: [-.76, .2, 1.05],
    trim: [[-2.1, .47, 2.1, .47]],
    lamps: [[-2.2, .72, .58]], lampKind: 'peugeot',
  },
  w114: {
    L: 4.68, H: 1.44, W: 1.77, wheelR: .32, wheelW: .18, hub: 'mercedes', hubTint: '#d0d2d0',
    paint: { color: 0xece9df, metalness: 0, roughness: .3 },
    axles: [-1.40, 1.35], arch: [[.39, 2], [.39, 2]], trackZ: [.74, .74],
    floor: [[-2.34, .42], [-2.1, .29], [-1.7, .27], [1.8, .27], [2.2, .33], [2.34, .48]],
    belt: [[-2.34, .82], [-2.2, .88], [-1.0, .905], [0, .93], [1.25, .97], [2.1, .96], [2.34, .9]],
    deck: [[-2.34, .86], [-2.25, .91], [-1.4, .955], [-.75, 1.0], [1.15, 1.03], [1.9, 1.03], [2.25, 1.0], [2.34, .92]],
    hw: [[-2.34, .8], [-2.2, .86], [-1.6, .885], [1.2, .885], [2.1, .87], [2.34, .78]],
    glass: { xa: -.76, xb: -.2, xc: .78, xd: 1.3, roofY: 1.44, baseY: .98, tailY: 1.03, tumble: .72 },
    pillars: [[.28, .33, .22, .26]],
    cPillar: [1.06, 1.3, .78, .9],
    seams: [-.74, .28, 1.2],
    trim: [[-2.2, .66, 2.25, .68]],
    lamps: [[-2.31, .66, .62]], lampKind: 'mercedes',
  },
};

/* Profil vectoriel simple, pour un affichage sans 3D */
export function sideProfileSVG(key: CarModelKey) {
  const s = SPECS[key]; const fl = curve(s.floor); const de = curve(s.deck); const gl = s.glass;
  const roofY = curve([[gl.xa - .5, gl.baseY - .08], [gl.xa, gl.baseY], [gl.xb, gl.roofY - .012], [lerp(gl.xb, gl.xc, .35), gl.roofY], [gl.xc, gl.roofY - .022], [gl.xd, gl.tailY], [gl.xd + .4, gl.tailY - .1]]);
  const X = (x: number) => (x + s.L / 2 + .1) * 100; const Y = (y: number) => (1.56 - y) * 100;
  let top = ''; let bot = '';
  const n = 90;
  for (let i = 0; i <= n; i++) { const x = -s.L / 2 + s.L * i / n; top += `${i ? 'L' : 'M'}${X(x).toFixed(1)} ${Y(Math.max(de(x), roofY(x))).toFixed(1)} `; }
  for (let i = n; i >= 0; i--) { const x = -s.L / 2 + s.L * i / n; bot += `L${X(x).toFixed(1)} ${Y(fl(x)).toFixed(1)} `; }
  return { viewBox: `0 0 ${(s.L + .2) * 100} 156`, body: `${top}${bot}Z`, wheels: s.axles.map((x) => [X(x), Y(s.wheelR), s.wheelR * 100] as [number, number, number]) };
}

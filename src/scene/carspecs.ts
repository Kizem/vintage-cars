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
  glass: { xa: number; xb: number; xc: number; xd: number; roofY: number; baseY: number; tailY: number; tumble: number; /** bombé du haut du vitrage (0,055 par défaut) */ crown?: number };
  lensColor?: number;
  pillars: [number, number, number, number][];
  cPillar: [number, number, number, number];
  seams: number[];
  trim: [number, number, number, number][];
  lamps: [number, number, number][]; lampKind: 'ds' | 'peugeot' | 'mercedes';
  /** Vitrage teinté transparent et habitacle visible (sellerie, finitions). */
  cabin?: { glass: number; opacity: number; seat: number; trim: number; steering?: number };
  /** Montants de pare-brise et de portes en inox plutôt que couleur caisse. */
  pillarChrome?: boolean;
  /** Pneus à flancs blancs. */
  whitewall?: boolean;
  /** Trappe ronde dessinée sur l'aile arrière : [x, y, rayon]. */
  flap?: [number, number, number];
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
  /* Citroën DS 21 berline, d'après les photos de la voiture (references/DS21/modele) : gris anthracite métallisé,
     nez large et arrondi en plan, capot long et plongeant, double optique jaune sous globe aux angles, gros
     pare-chocs chromé, poupe effilée aux feux rectangulaires, roues arrière à demi couvertes, pneus à flancs blancs
     et grands enjoliveurs chromés, habitacle en cuir fauve. */
  ds: {
    L: 4.84, H: 1.47, W: 1.79, wheelR: .315, wheelW: .17, hub: 'ds', hubTint: '#9fa3a4',
    paint: { color: 0x6b7074, metalness: .55, roughness: .3 }, whitewall: true,
    axles: [-1.49, 1.635], arch: [[.385, 2], [.385, .47]], trackZ: [.74, .62],
    floor: [[-2.42, .4], [-2.3, .32], [-2.0, .27], [1.8, .27], [2.2, .34], [2.42, .46]],
    belt: [[-2.42, .55], [-2.3, .62], [-1.9, .74], [-1.0, .87], [0, .93], [1.2, .98], [1.9, .93], [2.3, .79], [2.42, .68]],
    deck: [[-2.42, .58], [-2.3, .66], [-1.9, .77], [-1.3, .88], [-.86, .95], [1.4, 1.05], [1.95, .99], [2.3, .84], [2.42, .72]],
    hw: [[-2.42, .38], [-2.4, .6], [-2.35, .73], [-2.25, .81], [-2.1, .86], [-1.8, .885], [-.8, .895], [.5, .895], [1.5, .85], [2.05, .74], [2.3, .62], [2.42, .52]],
    glass: { xa: -.86, xb: -.1, xc: 1.02, xd: 2.0, roofY: 1.43, baseY: .98, tailY: 1.03, tumble: .86, crown: .012 },
    lensColor: 0xf2cf5a,
    pillars: [[-.04, .02, -.06, -.02], [.98, 1.03, .85, .92]],
    cPillar: [1.62, 1.84, 1.0, 1.12],
    seams: [-.62, .42, 1.42],
    trim: [[-1.8, .34, 2.05, .34]],
    lamps: [[-2.4, .63, .66], [-2.42, .63, .47]], lampKind: 'ds',
    cabin: { glass: 0x3f4f49, opacity: .5, seat: 0x93562c, trim: 0x151515 },
    pillarChrome: true,
  },
  /* Peugeot 504 berline, d'après les photos de la voiture : tricorps, capot long et plat, face presque verticale,
     grand vitrage aux montants fins, ligne de caisse horizontale, malle longue, ailes arrière légèrement galbées. */
  p504: {
    L: 4.49, H: 1.46, W: 1.69, wheelR: .315, wheelW: .17, hub: 'peugeot', hubTint: '#c3c4c0',
    paint: { color: 0x2468b0, metalness: .45, roughness: .3 },
    axles: [-1.39, 1.35], arch: [[.385, 2], [.385, 2]], trackZ: [.72, .72],
    floor: [[-2.245, .42], [-2.05, .3], [-1.75, .27], [1.75, .27], [2.05, .31], [2.245, .44]],
    belt: [[-2.245, .8], [-2.12, .84], [-1.4, .885], [-1.0, .905], [0, .915], [1.25, .935], [1.9, .925], [2.245, .88]],
    deck: [[-2.245, .82], [-2.15, .86], [-1.6, .9], [-1.05, .93], [0, .95], [1.5, .97], [2.0, .955], [2.2, .92], [2.245, .89]],
    hw: [[-2.245, .69], [-2.2, .78], [-2.05, .83], [-1.6, .845], [1.5, .845], [1.95, .82], [2.18, .77], [2.245, .7]],
    glass: { xa: -1.02, xb: -.3, xc: .98, xd: 1.5, roofY: 1.44, baseY: .94, tailY: .98, tumble: .8 },
    lensColor: 0xeef0ec,
    pillars: [[.24, .3, .2, .25], [.99, 1.01, .96, .98]],
    cPillar: [1.2, 1.48, .97, 1.1],
    seams: [-.95, .28, 1.22],
    trim: [[-1.8, .36, 1.8, .36]],
    lamps: [[-2.2, .73, .515]], lampKind: 'peugeot',
    cabin: { glass: 0x3f4f49, opacity: .5, seat: 0x6f7276, trim: 0x1b1b1b },
    flap: [1.85, .8, .055],
  },
  /* Mercedes W115 220D berline (1973), d'après les photos de la voiture (references/MercedesW115/modele) : ivoire,
     face presque plate en plan, optiques hautes aux angles, capot long et plat, grand vitrage aux montants fins avec
     déflecteur avant et custode fixe dans la porte arrière, large montant arrière, malle plate, jonc noir et chrome
     à mi-flanc sur toute la longueur, jantes modernes polies de 17 pouces en pneus taille basse. */
  w114: {
    L: 4.68, H: 1.44, W: 1.77, wheelR: .317, wheelW: .2, hub: 'mercedes', hubTint: '#d4d7d9',
    paint: { color: 0xebe3c9, metalness: 0, roughness: .28 },
    axles: [-1.45, 1.3], arch: [[.37, 2], [.37, 2]], trackZ: [.765, .765],
    floor: [[-2.34, .38], [-2.24, .31], [-1.95, .28], [1.85, .28], [2.2, .33], [2.34, .42]],
    belt: [[-2.34, .84], [-2.27, .875], [-1.6, .9], [-.8, .94], [0, .955], [1.3, .965], [2.1, .955], [2.3, .92], [2.34, .86]],
    deck: [[-2.34, .865], [-2.28, .895], [-1.6, .915], [-.95, .94], [-.75, .96], [0, .97], [1.45, .99], [2.15, .975], [2.29, .945], [2.33, .88], [2.34, .78]],
    hw: [[-2.34, .835], [-2.31, .865], [-2.2, .882], [-1.6, .885], [1.5, .885], [2.2, .878], [2.31, .862], [2.34, .83]],
    glass: { xa: -.8, xb: -.25, xc: .95, xd: 1.47, roofY: 1.44, baseY: .955, tailY: .995, tumble: .8 },
    lensColor: 0xeef0ec,
    /* montant central, barre du déflecteur avant, barre de la custode fixe de la porte arrière */
    pillars: [[.1, .17, .08, .15], [-.53, -.515, -.41, -.395], [.8, .815, .82, .835]],
    cPillar: [1.04, 1.47, .9, 1.06],
    seams: [-.98, .12, 1.02],
    trim: [[-2.3, .775, 2.32, .75], [-1.0, .305, .88, .305]],
    lamps: [[-2.33, .69, .74]], lampKind: 'mercedes',
    cabin: { glass: 0x3f4f49, opacity: .45, seat: 0xc6a47a, trim: 0x161616, steering: 0xe9e4d4 },
    pillarChrome: true,
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

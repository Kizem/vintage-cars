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
  /** Coupe du flanc : rentrée du bas de caisse (tuck), hauteur du ventre (waist), rentrée (sIn) et rayon (rs) de
      l'épaule à la ceinture, rayon du bas de caisse (rb), exposant du bombé du dessus (dome : grand = plat puis tombant). */
  side: { tuck: number; waist: number; sIn: number; rs: number; rb: number; dome: number; /** rayon de l'arête du flanc à la hauteur waist (sans : flanc lisse) */ ridge?: number };
  /** Inclinaison de la face avant et de la poupe : avancée du haut, en mètre par mètre de hauteur. */
  rake?: Pt;
  /** Pavillon : pied (xa) et haut (xb) du pare-brise dans l'axe, haut (xc) et pied (xd) de la lunette ; hauteurs du
      toit, du pied de pare-brise et du pied de lunette ; largeur du toit rapportée à celle de la ceinture (tumble) ;
      flèche en plan du pare-brise et de la lunette (bowF, bowR) ; retrait des vitres par rapport à l'épaule (inset) ;
      rayon du bord du toit (railR) ; chute du toit vers l'avant et l'arrière (dropF, dropR), bombé en travers (crown) ;
      adouci des raccords entre toit, pare-brise et lunette (soft). */
  glass: { xa: number; xb: number; xc: number; xd: number; roofY: number; baseY: number; tailY: number; tumble: number; bowF: number; bowR: number; inset: number; railR: number; dropF: number; dropR: number; crown: number; soft: number };
  /** Baies : largeur de tôle au-dessus des vitres latérales (frame), rayon des coins (r), largeur des montants de
      pare-brise et de lunette (pillarA, pillarC), des traverses haute de pare-brise et de lunette (header, footer) ;
      vitres latérales : [x du bord avant en bas, en haut, x du bord arrière en bas, en haut] ; rayon des joncs (trim) ;
      joint de pare-brise en caoutchouc plutôt qu'en chrome (rubber) ; gouttière chromée (gutter). */
  windows: { frame: number; r: number; pillarA: number; pillarC: number; header: number; footer: number; side: [number, number, number, number][]; trim: number; rubber?: boolean; gutter?: boolean };
  lensColor?: number;
  seams: number[];
  trim: [number, number, number, number][];
  lamps: [number, number, number][]; lampKind: 'ds' | 'peugeot' | 'mercedes';
  /** Vitrage teinté transparent et habitacle visible (sellerie, finitions). */
  cabin?: { glass: number; opacity: number; seat: number; trim: number; steering?: number; liner?: number; headrest?: boolean };
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
  /* Citroën DS 21 berline (1965-1972), d'après les photos de la voiture (references/DS21/modele) et ses cotes :
     longueur 4,87 m, largeur 1,79 m, hauteur 1,47 m, empattement 3,125 m, voie arrière plus étroite que l'avant.
     Gris anthracite métallisé, pavillon plus sombre. Profil en coin : nez bas, capot en dalle bombée plus haut que les
     ailes qui tombent de part et d'autre, crête des ailes qui descend du pare-brise à la poupe ; phares carénés à la
     pointe des ailes ; vitres sans encadrement, montants fins en inox, lunette enveloppante sous le pavillon qui la
     déborde ; poupe qui se rétrécit en plan ; roues arrière à demi couvertes par les ailes ;
     pneus à flancs blancs et grands enjoliveurs chromés ; habitacle en cuir fauve, planche de bord noire. */
  ds: {
    L: 4.87, H: 1.47, W: 1.79, wheelR: .33, wheelW: .17, hub: 'ds', hubTint: '#c9ccce',
    paint: { color: 0x6b7074, metalness: .55, roughness: .3 }, whitewall: true,
    axles: [-1.5, 1.625], arch: [[.375, 2], [.385, .48]], trackZ: [.75, .65],
    floor: [[-2.435, .44], [-2.3, .33], [-2.0, .27], [1.9, .27], [2.25, .36], [2.435, .47]],
    /* crête des ailes : elle monte du nez au pied du pare-brise, puis descend sans cesse jusqu'à la poupe */
    belt: [[-2.435, .58], [-2.38, .65], [-2.25, .705], [-2.0, .755], [-1.5, .825], [-1.0, .89], [-.75, .93], [0, .93], [.9, .91], [1.4, .86], [1.8, .78], [2.15, .66], [2.35, .57], [2.435, .52]],
    /* capot en dalle bombée, plus haut que les ailes qui tombent de part et d'autre ; malle fuyante */
    deck: [[-2.435, .63], [-2.41, .695], [-2.3, .735], [-2.0, .775], [-1.5, .85], [-1.0, .92], [-.8, .95], [0, .96], [1.5, .97], [1.75, .93], [2.0, .84], [2.25, .72], [2.38, .62], [2.435, .55]],
    hw: [[-2.435, .52], [-2.42, .62], [-2.36, .74], [-2.28, .82], [-2.15, .865], [-1.8, .89], [-.6, .895], [.6, .885], [1.3, .85], [1.8, .79], [2.15, .71], [2.35, .63], [2.435, .56]],
    side: { tuck: .1, waist: .55, sIn: .07, rs: .1, rb: .09, dome: 3 },
    roof: { color: 0x3a3936, metalness: .3, roughness: .32 },
    glass: { xa: -.86, xb: -.2, xc: 1.05, xd: 1.75, roofY: 1.415, baseY: .95, tailY: .93, tumble: .8, bowF: .3, bowR: .35, inset: .006, railR: .04, dropF: .015, dropR: .04, crown: .05, soft: .03 },
    /* vitres sans encadrement, montant central très fin */
    windows: { frame: .02, r: .012, pillarA: .03, pillarC: .05, header: .03, footer: .03, side: [[-1.3, -1.3, .33, .33], [.365, .365, 1.12, 1.0]], trim: .005 },
    lensColor: 0xf2cf5a,
    seams: [-.86, .35, 1.2],
    trim: [[-1.08, .3, 1.22, .3]],
    lamps: [[-2.39, .64, .62]], lampKind: 'ds',
    cabin: { glass: 0x2f3a37, opacity: .5, seat: 0x93562c, trim: 0x151515, headrest: true, liner: 0xb9b4a8 },
    pillarChrome: true,
  },
  /* Peugeot 504 berline (1971), d'après les photos de la voiture (references/504/modele) : bleu vif, tricorps, capot
     qui plonge vers un nez incliné (le haut en avant), arête à mi-flanc de l'aile avant au feu arrière, grand vitrage
     aux montants fins avec petite custode, malle fuyante à la cassure marquée sous la lunette ; habitacle aux sièges
     gris clair et garnitures bleu marine. */
  p504: {
    L: 4.49, H: 1.46, W: 1.69, wheelR: .315, wheelW: .17, hub: 'peugeot', hubTint: '#c3c4c0',
    paint: { color: 0x1f76b6, metalness: .35, roughness: .28 },
    axles: [-1.39, 1.35], arch: [[.385, 2], [.385, 2]], trackZ: [.72, .72],
    floor: [[-2.245, .4], [-2.1, .3], [-1.8, .24], [1.75, .24], [2.05, .3], [2.245, .42]],
    belt: [[-2.245, .76], [-2.17, .8], [-1.8, .84], [-1.4, .87], [-1.0, .895], [0, .915], [1.25, .925], [1.6, .905], [1.95, .865], [2.2, .825], [2.245, .8]],
    deck: [[-2.245, .775], [-2.17, .815], [-1.8, .855], [-1.4, .885], [-1.05, .925], [0, .95], [1.45, .965], [1.6, .945], [1.9, .9], [2.15, .855], [2.245, .815]],
    hw: [[-2.245, .76], [-2.21, .815], [-2.1, .835], [-1.6, .845], [1.5, .845], [1.95, .825], [2.2, .79], [2.245, .74]],
    /* flanc : arête à mi-hauteur, de la pointe de l'aile avant au feu arrière ; au-dessus, un pan incliné jusqu'aux vitres */
    side: { tuck: .06, waist: .7, sIn: .06, rs: .03, rb: .06, dome: 2.6, ridge: .012 },
    rake: [.12, .3],
    glass: { xa: -1.05, xb: -.38, xc: .95, xd: 1.52, roofY: 1.445, baseY: .93, tailY: .97, tumble: .85, bowF: .2, bowR: .16, inset: .008, railR: .05, dropF: .02, dropR: .035, crown: .045, soft: .03 },
    /* portes avant, portes arrière, petite custode fixe */
    windows: { frame: .035, r: .02, pillarA: .045, pillarC: .07, header: .05, footer: .06, side: [[-1.4, -1.4, .2, .2], [.29, .29, .98, .98], [1.015, 1.015, 1.3, 1.06]], trim: .008, gutter: true },
    lensColor: 0xeef0ec,
    seams: [-.95, .28, 1.22],
    trim: [[-.98, .315, .94, .315]],
    lamps: [[-2.2, .73, .515]], lampKind: 'peugeot',
    cabin: { glass: 0x3f4f49, opacity: .5, seat: 0xa4a8ab, trim: 0x22304c },
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
    side: { tuck: .045, waist: .66, sIn: .03, rs: .022, rb: .05, dome: 3 },
    glass: { xa: -.88, xb: -.33, xc: .95, xd: 1.5, roofY: 1.44, baseY: .955, tailY: .995, tumble: .86, bowF: .2, bowR: .16, inset: .012, railR: .045, dropF: .02, dropR: .03, crown: .04, soft: .03 },
    /* portes avant (déflecteur), montant central, portes arrière, custode fixe, large montant arrière */
    windows: { frame: .04, r: .02, pillarA: .05, pillarC: .07, header: .05, footer: .06, side: [[-1.2, -1.2, -.52, -.4], [-.495, -.375, .09, .09], [.18, .18, .8, .8], [.825, .825, 1.1, .92]], trim: .007, gutter: true },
    rake: [0, -.08],
    lensColor: 0xeef0ec,
    seams: [-.98, .12, 1.02],
    trim: [[-2.3, .705, 2.32, .695], [-1.0, .305, .88, .305]],
    lamps: [[-2.33, .69, .74]], lampKind: 'mercedes',
    cabin: { glass: 0x3f4f49, opacity: .4, seat: 0xc6a47a, trim: 0x161616, steering: 0xe9e4d4, headrest: true, liner: 0xd8cfb4 },
  },
};

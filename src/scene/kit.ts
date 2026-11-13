/* Carrosserie commune aux trois voitures : la caisse lissée, le dessous, l'habitacle vitré, le toit, les montants,
   les joncs et les rétroviseurs sont construits de la même façon pour chaque modèle, à partir de sa fiche (carspecs.ts).
   Le résultat (CarKit) donne aussi aux modules de détails (models/*.ts) les outils de pose : surface du nez et de la
   poupe, dessus de caisse, plaques, pare-chocs. */
import {
  BoxGeometry, BufferGeometry, CylinderGeometry, ExtrudeGeometry, Float32BufferAttribute, Group, Mesh, MeshStandardMaterial,
  TorusGeometry, DoubleSide, type Material,
} from 'three';
import { curve, lerp, type CarSpec, type Pt } from './carspecs';
import { blade, catmull, gridGeometry, loft, offsetGeometry, roundedPath, rrect, stations, tube, type P3 } from './geometry';
import { windowMask } from './windows';
import type { CarMaterials } from './materials';

/** Les courbes de la fiche : plancher, ceinture, dessus de caisse, demi-largeur. */
export function createCurves(s: CarSpec) {
  return { fl: curve(s.floor), be: curve(s.belt), de: curve(s.deck), hw: curve(s.hw) };
}
export type CarCurves = ReturnType<typeof createCurves>;

export type CarKit = ReturnType<typeof buildBody>;

export function buildBody(s: CarSpec, mats: CarMaterials, curves: CarCurves) {
  const { fl, be, de, hw } = curves;
  const root = new Group();
  const body = new Group();  /* la caisse, qui peut bouger sur ses roues */
  root.add(body);
  /* La caisse : une coupe par station, lissée le long de X. Elle doit rester le premier enfant de body.
     La coupe est faite de trois lignes aux raccords arrondis : le dessous, le flanc (bas de caisse rentré, ventre à
     la hauteur `waist`, épaule rentrée de `sIn` à la ceinture) et le dessus (capot, auvent, malle). Le rayon de
     l'épaule (`rs`) fait l'arête de la ceinture : vive sur la Mercedes, ronde sur la DS. */
  const sd = s.side;
  const NB = 3; const NL = 10; const NU = 8; const NT = 16; const NC = 5;
  /** Dessus de caisse à la fraction u de la demi-largeur (0 dans l'axe, 1 à l'épaule). */
  const topAt = (b: number, d: number, u: number) => d - (d - b) * Math.pow(u, sd.dome);
  /** Coupes déjà calculées : les outils de pose (sideZ, topY) redemandent souvent la même abscisse. */
  const memo = <T,>(f: (x: number) => T) => { const m = new Map<number, T>(); return (x: number) => { let v = m.get(x); if (v === undefined) { v = f(x); m.set(x, v); } return v; }; };
  const halfSection = memo((x: number): Pt[] => {
    const f = fl(x); const d = de(x); const b = Math.max(f + .02, Math.min(be(x), d - .004)); const w = hw(x);
    const e = Math.min(1, (b - f) / .4, w / .5);
    const tuck = sd.tuck * e; const sIn = sd.sIn * e; const wS = w - tuck; const ws = w - sIn;
    const yw = Math.min(Math.max(sd.waist, f + (b - f) * .3), b - Math.min(.05, (b - f) * .2));
    const lower = catmull([[wS, f], [w - tuck * .3, lerp(f, yw, .45)], [w - tuck * .04, lerp(f, yw, .8)], [w, yw]], 16);
    const upper = sd.ridge ? catmull([[w, yw], [lerp(w, ws, .5) + .003, lerp(yw, b, .5)], [ws, b]], 8) : catmull([[w, yw], [w - sIn * .3, lerp(yw, b, .6)], [ws, b]], 10);
    const top: Pt[] = []; for (let i = 0; i <= 24; i++) { const u = 1 - i / 24; top.push([ws * u, topAt(b, d, u)]); }
    return roundedPath([[[0, f], [wS, f]], lower, upper, top], [sd.rb * e, sd.ridge ?? .2, sd.rs * e], [NB, NL, NU, NT], NC);
  });
  /* rangs de la coupe : le flanc commence après le dessous et son arc, le dessus après l'arc de l'épaule */
  const iFlank = NB + NC; const iTop = iFlank + NL + NC + NU + NC;
  /* Inclinaison de la face avant et de la poupe : près des extrémités, chaque point est décalé le long de X selon
     sa hauteur (rake : pente du haut vers l'avant, au nez puis à la poupe), autour de la hauteur des pare-chocs. */
  const rake = s.rake ?? [0, 0]; const RY = .5; const RL = .45;
  const sm = (t: number) => { const c = Math.min(1, Math.max(0, t)); return c * c * (3 - 2 * c); };
  /* le point le plus avancé de chaque extrémité ne bouge pas : la longueur hors tout reste celle de la fiche */
  const pivN = rake[0] > 0 ? de(-s.L / 2) : fl(-s.L / 2); const pivT = rake[1] > 0 ? fl(s.L / 2) : de(s.L / 2);
  const shift = (x: number, y: number) => x - rake[0] * sm((-s.L / 2 + RL - x) / RL) * (y - pivN) - rake[1] * sm((x - s.L / 2 + RL) / RL) * (y - pivT);
  body.add(new Mesh(loft(stations(-s.L / 2, s.L / 2, 96), halfSection, { shift }), mats.paint));

  /** Demi-largeur du flanc à la hauteur y (du bas de caisse à l'épaule). */
  const sideZ = (x: number, y: number) => {
    const sec = halfSection(x);
    for (let i = NB + 1; i <= iTop + 2; i++) { const [z0, y0] = sec[i - 1]; const [z1, y1] = sec[i]; if (y1 >= y && y1 > y0) return lerp(z0, z1, Math.min(1, Math.max(0, (y - y0) / (y1 - y0)))); }
    return sec[iTop][0];
  };

  /* Dessous sombre, visible à travers les passages de roues */
  body.add(new Mesh(loft(stations(-s.L / 2 + .2, s.L / 2 - .2, 30), (x) => {
    const f = fl(x) + .01; const w = hw(x) * .78; const t = Math.min(be(x), de(x)) - .2; /* sous les ailes : il n'entre pas dans les phares */
    return [[0, f], [w, f], [w, t], [0, t]];
  }), mats.black));

  /* Passages de roues : la tôle est découpée par la peinture (materials.ts) ; ici, le bord roulé de l'aile et la
     cuve sombre derrière la roue. */
  s.axles.forEach((ax, a) => {
    const [R, clip] = s.arch[a]; const yc = s.wheelR;
    const th0 = Math.asin(Math.min(1, Math.max(0, (fl(ax) + .05 - yc) / R)));
    const th1 = clip < yc + R ? Math.asin((clip - yc) / R) : Math.PI / 2;
    [1, -1].forEach((sg) => {
      const lip: P3[] = [];
      const arc = (from: number, to: number) => { for (let i = 0; i <= 14; i++) { const th = lerp(from, to, i / 14); const x = ax + R * Math.cos(th); const y = yc + R * Math.sin(th); lip.push([x, y, sg * (sideZ(x, y) + .001)]); } };
      if (th1 < Math.PI / 2) { arc(th0, th1); arc(Math.PI - th1, Math.PI - th0); } else arc(th0, Math.PI - th0);
      body.add(tube(lip, .011, mats.paint));
      /* cuve : demi-cylindre et fond, du flanc jusque derrière la roue */
      const zOut = sideZ(ax, Math.min(clip, yc + R)) - .012; const zIn = s.trackZ[a] - s.wheelW / 2 - .05; const Rt = R + .012;
      const pos: number[] = []; const idx: number[] = [];
      for (let i = 0; i <= 24; i++) { const th = Math.PI * i / 24; const x = ax + Rt * Math.cos(th); const y = yc + Rt * Math.sin(th); pos.push(x, y, sg * zOut, x, y, sg * zIn, x, yc, sg * zIn); }
      for (let i = 0; i < 24; i++) { const k = i * 3; idx.push(k, k + 3, k + 1, k + 1, k + 3, k + 4, k + 1, k + 4, k + 2, k + 2, k + 4, k + 5); }
      const g = new BufferGeometry(); g.setAttribute('position', new Float32BufferAttribute(pos, 3)); g.setIndex(idx);
      body.add(new Mesh(g, mats.well));
    });
  });

  /* Joints de portes : fins sillons sombres posés sur le flanc, du bas de caisse à la ceinture */
  s.seams.forEach((x0) => [1, -1].forEach((sg) => {
    const pts: P3[] = []; const yb = be(x0) - sd.rs * .5;
    for (let i = 0; i <= 12; i++) { const y = lerp(fl(x0) + .03, yb, i / 12); const x = x0 + (y - .33) * .03; pts.push([x, y, sg * (sideZ(x, y) - .0005)]); }
    body.add(tube(pts, .0035, mats.crease));
  }));

  /* Baguettes chromées de flanc, interrompues aux passages de roues */
  s.trim.forEach(([xa, ya, xb, yb]) => [1, -1].forEach((sg) => {
    let cur: P3[] = [];
    const flush = () => { if (cur.length > 1) body.add(blade(cur, .022, .012, mats.chrome, 48)); cur = []; };
    for (let i = 0; i <= 40; i++) {
      const x = lerp(xa, xb, i / 40); const y = lerp(ya, yb, i / 40);
      const hit = s.axles.some((ax, k) => Math.hypot(x - ax, y - s.wheelR) < s.arch[k][0] + .025 && y < s.arch[k][1]);
      if (hit) flush(); else cur.push([x, y, sg * (sideZ(x, y) + .004)]);
    }
    flush();
  }));

  /* L'habitacle (pavillon) : une vraie coque, faite de quatre surfaces qui se coupent, le pare-brise, le toit, la
     lunette (dessus) et les vitres latérales inclinées (côtés). Le montant de pare-brise et celui de lunette sont
     les arêtes où elles se rencontrent. La coque est en trois épaisseurs : la tôle peinte, percée des baies
     (masque dessiné, voir plus bas) ; le vitrage, en retrait ; la garniture intérieure, percée elle aussi. */
  const gl = s.glass; const half = s.W / 2;
  const slopeF = (gl.roofY - gl.baseY) / (gl.xb - gl.xa); const slopeR = (gl.roofY - gl.tailY) / (gl.xd - gl.xc);
  const xm = lerp(gl.xb, gl.xc, .4);
  const smin = (a: number, b: number, k: number) => { const h = Math.max(k - Math.abs(a - b), 0) / k; return Math.min(a, b) - h * h * k / 4; };
  const screenY = (x: number, z: number) => gl.baseY + (x - gl.xa - gl.bowF * (z / half) ** 2) * slopeF;
  const rearY = (x: number, z: number) => gl.tailY + (gl.xd - x - gl.bowR * (z / half) ** 2) * slopeR;
  const roofY = (x: number, z: number) => gl.roofY - (x < xm ? gl.dropF * ((xm - x) / (xm - gl.xb)) ** 2 : gl.dropR * ((x - xm) / (gl.xc - xm)) ** 2) - gl.crown * (z / half) ** 2;
  const ghTop = (x: number, z: number) => smin(roofY(x, z), smin(screenY(x, z), rearY(x, z), gl.soft), gl.soft);
  const gBase = (x: number) => Math.min(be(x), de(x)) - .04;
  const gWidth = (x: number) => hw(x) - sd.sIn - gl.inset;
  const tum = gWidth(xm) * (1 - gl.tumble) / (gl.roofY - gl.baseY);
  const GS = 8; const GC = 4; const GT = 14; const TS = .3; const TC = .36;
  /** t de chaque point de la coupe du pavillon : 0 à la ceinture, TS au haut des vitres, TC au bord du toit, 1 dans l'axe. */
  const GV: number[] = [];
  for (let i = 0; i <= GS; i++) GV.push(TS * i / GS);
  for (let i = 1; i < GC; i++) GV.push(lerp(TS, TC, i / GC));
  for (let i = 0; i <= GT; i++) GV.push(lerp(TC, 1, i / GT));
  const ghSection = memo((x: number): Pt[] => {
    const y0 = gBase(x); const w0 = gWidth(x); const zs = (y: number) => Math.max(.02, w0 - (y - y0) * tum);
    let yr = y0;
    if (ghTop(x, zs(y0)) > y0) { let a = y0; let b = gl.roofY + .02; for (let k = 0; k < 26; k++) { const m = (a + b) / 2; if (ghTop(x, zs(m)) > m) a = m; else b = m; } yr = (a + b) / 2; }
    const zr = zs(yr);
    const top: Pt[] = []; for (let i = 0; i <= 28; i++) { const z = zr * (1 - i / 28); top.push([z, i === 0 ? yr : ghTop(x, z)]); }
    return roundedPath([[[w0, y0], [zr, yr]], top], [gl.railR], [GS, GT], GC);
  });
  /** Point du pavillon : [z, y] à l'abscisse x et au paramètre t (voir GV). */
  const gh = (x: number, t: number): Pt => {
    const sec = ghSection(x); const tt = Math.min(1, Math.max(0, t));
    let i = 1; while (GV[i] < tt) i++;
    const f = (tt - GV[i - 1]) / (GV[i] - GV[i - 1]);
    return [lerp(sec[i - 1][0], sec[i][0], f), lerp(sec[i - 1][1], sec[i][1], f)];
  };
  const gx0 = gl.xa - gl.bowF - .12; const gx1 = gl.xd + gl.bowR + .12;
  const gU = (x: number) => (x - gx0) / (gx1 - gx0);
  const gxs = stations(gx0, gx1, 76).map((x, i, a) => lerp(x, lerp(gx0, gx1, i / (a.length - 1)), .6));
  const rings = gxs.map((x) => { const h = ghSection(x); return [...h.map(([z, y]): P3 => [x, y, z]), ...h.slice(0, -1).reverse().map(([z, y]): P3 => [x, y, -z])]; });
  const shellG = gridGeometry(rings, gxs.map(gU), [...GV, ...GV.slice(0, -1).reverse()]);
  const mask = windowMask(s, { gx0, gx1, TS, TC, side: (x) => { const sec = ghSection(x); return { h: sec[GS][1] - sec[0][1], z: sec[GS + GC][0] }; }, header: (x, z) => screenY(x, z) - roofY(x, z), footer: (x, z) => rearY(x, z) - roofY(x, z) });
  const shellMat = (base: Material) => { const m = base.clone() as MeshStandardMaterial; m.alphaMap = mask.texture; m.alphaTest = .5; m.side = DoubleSide; return m; };
  body.add(new Mesh(shellG, shellMat(s.pillarChrome ? mats.pillar : mats.roof)));
  const glass = new Mesh(offsetGeometry(shellG, -.007), mats.glass);
  if (s.cabin) glass.renderOrder = 4;
  body.add(glass);
  body.add(new Mesh(offsetGeometry(shellG, -.016), shellMat(mats.liner)));
  const { chrome } = mats;
  /** Point 3D du pavillon, légèrement décollé, pour y poser les joncs. */
  const gp = (x: number, t: number, sg: number, lift = .004): P3 => { const [z, y] = gh(x, t - .005); const [z2, y2] = gh(x, t + .005); const dz = z2 - z; const dy = y2 - y; const n = Math.hypot(dz, dy) || 1; const [zc, yc] = gh(x, t); return [x, yc - dz / n * lift, sg * (zc + dy / n * lift)]; };
  /* tours de baies : joncs (chrome ou caoutchouc) le long du bord de chaque vitre */
  const frameMat = s.windows.rubber ? mats.rubber : chrome;
  /** Tracé allégé : un point sur `k`, en gardant le premier et le dernier. */
  const thin = <T,>(path: T[], k: number) => path.filter((_, i) => i % k === 0 || i === path.length - 1);
  mask.sidePaths.forEach((path) => { const p = thin(path, 3); [1, -1].forEach((sg) => body.add(tube(p.map(([x, t]) => gp(x, t, sg)), s.windows.trim, chrome))); });
  [mask.screenPath, mask.rearPath].forEach((path) => {
    const left = path.map(([x, t]) => gp(x, t, 1)); const right = path.map(([x, t]) => gp(x, t, -1)).reverse();
    body.add(tube([...left, ...right.slice(1)], s.windows.trim, frameMat));
  });
  /* jonc de ceinture au pied des vitres, gouttière au bord du toit */
  [1, -1].forEach((sg) => {
    const belt: P3[] = []; for (let i = 0; i <= 30; i++) { const x = lerp(mask.dlo[0], mask.dlo[1], i / 30); const z = gWidth(x) + .004; belt.push([x, topY(x, z) + .004, sg * z]); }
    body.add(tube(belt, .007, chrome));
    if (s.windows.gutter) { const g: P3[] = []; for (let i = 0; i <= 24; i++) { const x = lerp(gl.xb - .12, gl.xc + .12, i / 24); g.push(gp(x, TC - .01, sg, .006)); } body.add(tube(g, .006, chrome)); }
  });

  /* Habitacle vu à travers les vitres : plancher, planche de bord et volant, sièges, tablette arrière. */
  if (s.cabin) {
    const c = s.cabin;
    const seat = new MeshStandardMaterial({ color: c.seat, roughness: .55 });
    const trim = new MeshStandardMaterial({ color: c.trim, roughness: .45 });
    const steering = c.steering !== undefined ? new MeshStandardMaterial({ color: c.steering, roughness: .35 }) : trim;
    const floorMat = new MeshStandardMaterial({ color: 0x1d1514, roughness: .9, side: DoubleSide });
    const y0 = (x: number) => Math.max(be(x), de(x)) + .004;
    /** Demi-largeur disponible sous le vitrage à la hauteur du plancher : rien ne dépasse du pare-brise ni de la lunette. */
    const inW = (x: number) => {
      const y = y0(x) + .03;
      const wf = half * Math.sqrt(Math.max(0, (x - gl.xa - (y - gl.baseY) / slopeF) / gl.bowF)); const wr = half * Math.sqrt(Math.max(0, (gl.xd - x - (y - gl.tailY) / slopeR) / gl.bowR));
      return Math.max(0, Math.min(gWidth(x) - .035, wf, wr));
    };
    body.add(new Mesh(loft(stations(gl.xa, gl.xd, 40), (x): Pt[] => [[inW(x), y0(x)], [0, y0(x)]], { caps: false }), floorMat));
    /** Coussin arrondi (dossier, appuie-tête, planche de bord) : largeur w (en travers), hauteur h, épaisseur d, incliné vers l'arrière. */
    const pad = (x: number, y: number, z: number, w: number, h: number, d: number, r: number, mat: Material, lean = 0) => {
      const g = new ExtrudeGeometry(rrect(w, h, r), { depth: d, bevelEnabled: true, bevelThickness: d * .3, bevelSize: Math.min(r * .5, .02), bevelSegments: 3, curveSegments: 8 });
      const m = new Mesh(g, mat); const grp = new Group(); grp.position.set(x, y, z); grp.rotation.z = -lean; m.rotation.y = -Math.PI / 2; m.position.set(d / 2, h / 2, 0); grp.add(m); body.add(grp); return grp;
    };
    /* planche de bord sous le pare-brise, casquette des compteurs devant le volant */
    const xd = gl.xa + gl.bowF + .16; pad(xd, y0(xd) - .07, 0, inW(xd - .13) * 2 - .09, .08, .22, .03, trim);
    pad(xd + .06, y0(xd) - .02, .36, .32, .07, .12, .03, trim);
    /* volant, à gauche : jante, moyeu et branches */
    const sw = new Group(); sw.position.set(xd + .27, y0(xd) + .11, .36); sw.rotation.z = -.42; body.add(sw);
    const rimW = new Mesh(new TorusGeometry(.19, .012, 8, 40), steering); rimW.rotation.y = Math.PI / 2; sw.add(rimW);
    const hubW = new Mesh(new CylinderGeometry(.05, .06, .05, 16), steering); hubW.rotation.z = Math.PI / 2; hubW.position.x = .02; sw.add(hubW);
    [0, 1].forEach((i) => { const sp = new Mesh(new BoxGeometry(.012, .03, .19), steering); sp.position.set(.012, -.02, (i ? 1 : -1) * .095); sw.add(sp); });
    /* dossiers avant (avec appuie-tête si la fiche le dit) et banquette arrière */
    const xf = lerp(gl.xb, gl.xc, .3); const xr = gl.xc - .2;
    [.34, -.34].forEach((z) => { pad(xf, y0(xf) - .1, z, .5, .44, .1, .07, seat, .22); if (c.headrest) pad(xf + .09, y0(xf) + .27, z, .24, .12, .08, .05, seat, .15); });
    pad(xr, y0(xr) - .1, 0, gWidth(xr) * 1.7, .36, .11, .07, seat, .28);
    /* tablette arrière */
    const xt = gl.xc + .12; pad(xt, y0(xt) - .012, 0, inW(xt + .17) * 2 - .06, .02, .3, .008, trim);
  }
  const railT = TC;

  /* --- Outils de pose pour les détails --- */
  const nx = -s.L / 2; const tx = s.L / 2;
  /** Pare-chocs en lame : il suit le contour de la caisse à la hauteur y, à la distance `gap`, traverse la face et
      revient sur chaque flanc sur la longueur `wrap`. `front` : à l'avant, sinon à l'arrière. */
  const bumper = (front: boolean, y: number, h: number, d: number, gap: number, wrap: number, mat: Material = chrome) => {
    const sg = front ? -1 : 1; const xe = shift(sg * s.L / 2, y); const zc = hw(sg * s.L / 2) - .07; const half: P3[] = [];
    for (let i = 0; i <= 5; i++) { const x = sg * s.L / 2 - sg * lerp(wrap, .07, i / 5); half.push([shift(x, y), y, sideZ(x, y) + gap]); }
    half.push([xe + sg * (gap - .012), y, zc + .035]);
    for (let i = 0; i <= 3; i++) half.push([xe + sg * gap, y, zc * (1 - i / 3) * .96]);
    const pts = [...half, ...half.slice(0, -1).reverse().map(([x, yy, z]): P3 => [x, yy, -z])];
    const m = blade(pts, h, d, mat); body.add(m); return m;
  };
  /** Plaque aux angles arrondis tournée vers l'avant (-X) ; rotation.y = π/2 pour la tourner vers l'arrière. */
  const plate = (x: number, y: number, z: number, w: number, h: number, r: number, mat: Material, thick = .02, yaw = 0, parent: Group = body) => {
    const g = new ExtrudeGeometry(rrect(w, h, r), { depth: thick, bevelEnabled: true, bevelThickness: Math.min(.006, thick * .4), bevelSize: Math.min(.006, r * .6), bevelSegments: 2, curveSegments: 8 });
    const m = new Mesh(g, mat); m.position.set(x, y, z); m.rotation.y = -Math.PI / 2 + yaw; parent.add(m); return m;
  };
  /** Repère posé sur la face avant (front) ou la poupe, incliné comme elle : origine dans l'axe à la hauteur des
      pare-chocs (RY), Y le long de la face vers le haut, X vers l'arrière de la voiture. */
  const face = (front: boolean) => { const g = new Group(); g.position.set(shift(front ? nx : tx, RY), RY, 0); g.rotation.z = Math.atan(rake[front ? 0 : 1]); body.add(g); return g; };
  /** x de la surface pour une demi-largeur donnée, au nez (front) ou à la poupe. */
  const surfX = (z: number, front: boolean) => {
    let a = front ? nx : 1.2; let b = front ? -1.5 : tx;
    for (let k = 0; k < 30; k++) { const m = (a + b) / 2; if ((hw(m) >= z) === front) b = m; else a = m; }
    return (a + b) / 2;
  };
  /** Hauteur du dessus de la caisse à une distance z de l'axe. */
  function topY(x: number, z: number) {
    const sec = halfSection(x);
    for (let i = sec.length - 1; i > iTop - NC; i--) { const [z1, y1] = sec[i]; const [z0, y0] = sec[i - 1]; if (z0 >= z && z1 <= z) return lerp(y1, y0, (z - z1) / Math.max(1e-6, z0 - z1)); }
    return de(x);
  }
  /** Orientation (autour de Y) d'un élément posé sur la face avant, selon la normale de l'aile. */
  const yawAt = (x: number) => { const d = (hw(x + .01) - hw(x - .01)) / .02; return Math.atan2(1, Math.max(.001, d)); };
  /** Pose une pièce plate (plan XY) à plat sur le dessus de la caisse, en suivant sa pente. */
  const lay = (m: Mesh, x: number, z: number, lift = .004) => {
    const slope = (topY(x + .02, Math.abs(z)) - topY(x - .02, Math.abs(z))) / .04;
    const g = new Group(); g.position.set(x, topY(x, Math.abs(z)) + lift, z); g.rotation.z = Math.atan(slope); m.rotation.x = -Math.PI / 2; g.add(m); body.add(g);
  };
  /** Points des feux avant (pour les halos du parking), remplis par les détails. */
  const lampPoints: P3[] = [];

  return { s, mats, curves, root, body, gl, gh, gp, railT, halfSection, sideZ, shift, RY, gWidth, face, nx, tx, bumper, plate, surfX, topY, yawAt, lay, lampPoints };
}

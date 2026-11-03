/* Carrosserie commune aux trois voitures : la caisse lissée, le dessous, l'habitacle vitré, le toit, les montants,
   les joncs et les rétroviseurs sont construits de la même façon pour chaque modèle, à partir de sa fiche (carspecs.ts).
   Le résultat (CarKit) donne aussi aux modules de détails (models/*.ts) les outils de pose : surface du nez et de la
   poupe, dessus de caisse, plaques, pare-chocs. */
import {
  BoxGeometry, BufferGeometry, CylinderGeometry, ExtrudeGeometry, Float32BufferAttribute, Group, Mesh, MeshStandardMaterial,
  SphereGeometry, TorusGeometry, DoubleSide, type Material,
} from 'three';
import { curve, lerp, type CarSpec, type Pt } from './carspecs';
import { catmull, loft, rrect, stations, tube, type P3 } from './geometry';
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
  const { chrome } = mats;

  /* La caisse : une coupe arrondie par station, lissée le long de X. Elle doit rester le premier enfant de body. */
  const halfSection = (x: number) => {
    const f = fl(x); const d = de(x); const b = Math.min(be(x), d - .004); const w = hw(x);
    const r = Math.min(.13, (b - f) * .3);
    return catmull([[0, f], [w * .55, f], [w * .9, f + .012], [w * .985, f + r], [w, lerp(f, b, .55)], [w * .992, b], [w * .9, lerp(b, d, .78)], [w * .55, d - .012 * (w / .9)], [0, d]], 26);
  };
  body.add(new Mesh(loft(stations(-s.L / 2, s.L / 2, 92), halfSection), mats.paint));

  /* Dessous sombre, visible à travers les passages de roues */
  body.add(new Mesh(loft(stations(-s.L / 2 + .2, s.L / 2 - .2, 30), (x) => {
    const f = fl(x) + .01; const w = hw(x) * .78; const t = Math.min(be(x), de(x)) - .03;
    return [[0, f], [w, f], [w, t], [0, t]];
  }), mats.black));

  /* L'habitacle : un volume de verre, puis le toit et les montants posés dessus */
  const gl = s.glass;
  const roofY = curve([[gl.xa - .5, gl.baseY - .08], [gl.xa, gl.baseY], [gl.xb, gl.roofY - .012], [lerp(gl.xb, gl.xc, .35), gl.roofY], [gl.xc, gl.roofY - .022], [gl.xd, gl.tailY], [gl.xd + .4, gl.tailY - .1]]);
  /** Coupe du vitrage à l'abscisse x : t = 0 à la ceinture, t = 1 au milieu du toit. */
  const gh = (x: number, t: number): Pt => {
    const yb = Math.min(be(x), de(x)) - .025; const yt = Math.max(roofY(x), yb + .001); const wb = hw(x) * .955; const wt = wb * gl.tumble;
    const crown = .055 * Math.min(1, (yt - yb) / .3);
    const c = catmull([[wb, yb], [lerp(wb, wt, .55), lerp(yb, yt, .58)], [wt * 1.0, yt - crown], [wt * .62, yt - crown * .22], [0, yt]], 40);
    return c[Math.round(t * 40)];
  };

  /* Habitacle vu à travers les vitres : plancher, planche de bord et volant, sièges, tablette arrière.
     Positions relatives au vitrage, pour que chaque voiture ait le même aménagement à son échelle. */
  if (s.cabin) {
    const c = s.cabin;
    const seat = new MeshStandardMaterial({ color: c.seat, roughness: .55 });
    const trim = new MeshStandardMaterial({ color: c.trim, roughness: .45 });
    const floorMat = new MeshStandardMaterial({ color: 0x1d1514, roughness: .9, side: DoubleSide });
    body.add(new Mesh(loft(stations(gl.xa, gl.xd, 24), (x): Pt[] => { const y = Math.min(be(x), de(x)) - .02; const w = hw(x) * .9; return [[w, y], [0, y]]; }, { caps: false }), floorMat));
    const y0 = (x: number) => Math.min(be(x), de(x)) - .02;
    const box = (x: number, y: number, z: number, sx: number, sy: number, sz: number, mat: Material, lean = 0) => { const m = new Mesh(new BoxGeometry(sx, sy, sz, 2, 2, 2), mat); m.position.set(x, y, z); m.rotation.z = lean; body.add(m); return m; };
    const at = (f: number) => lerp(gl.xa, gl.xd, f);
    /* planche de bord sous le pare-brise */
    box(at(.15), y0(at(.15)) + .05, 0, .22, .08, hw(at(.15)) * 1.5, trim);
    /* volant, à gauche */
    const wheel = new Mesh(new TorusGeometry(.18, .013, 8, 36), trim); wheel.position.set(at(.24), y0(at(.24)) + .17, .38); wheel.rotation.set(0, Math.PI / 2, -.55); body.add(wheel);
    const spoke = new Mesh(new CylinderGeometry(.009, .009, .18, 8), trim); spoke.position.set(at(.245), y0(at(.245)) + .1, .38); spoke.rotation.x = .15; body.add(spoke);
    /* dossiers avant et banquette arrière */
    [.36, -.36].forEach((z) => box(at(.41), y0(at(.41)) + .17, z, .12, .36, .46, seat, -.2));
    box(at(.76), y0(at(.76)) + .16, 0, .13, .34, 1.24, seat, -.24);
    /* tablette arrière */
    box(at(.9), y0(at(.9)) + .03, 0, .36, .02, hw(at(.9)) * 1.6, seat);
  }
  const glassGeo = loft(stations(gl.xa - .05, gl.xd + .05, 54), (x) => { const out: Pt[] = []; for (let k = 40; k >= 0; k--) out.push(gh(x, k / 40)); return out; }, { caps: false });
  const glass = new Mesh(glassGeo, mats.glass);
  if (s.cabin) glass.renderOrder = 4;
  body.add(glass);

  /* Pièce posée sur l'habitacle : une grille (x, t) légèrement décollée, en double de part et d'autre */
  function patch(mat: Material, f: (u: number, v: number) => Pt, nu = 16, nv = 8) {
    const pos: number[] = []; const idx: number[] = [];
    for (let i = 0; i <= nu; i++) for (let j = 0; j <= nv; j++) {
      const [x, t] = f(i / nu, j / nv); const [z, y] = gh(x, Math.min(1, Math.max(0, t)));
      pos.push(x, y + .004, z * 1.012 + (z > 0 ? .002 : 0));
    }
    for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) { const a = i * (nv + 1) + j; idx.push(a, a + nv + 1, a + 1, a + 1, a + nv + 1, a + nv + 2); }
    const g = new BufferGeometry(); g.setAttribute('position', new Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    const a = new Mesh(g, mat); const b = a.clone(); b.scale.z = -1; body.add(a, b);
  }
  /** Hauteur (en t) de la gouttière, où le toit rejoint les vitres. */
  const railT = .72;
  const { roof, pillar } = mats;
  /* toit */
  patch(roof, (u, v) => [lerp(gl.xb + .02, gl.xc + .0, u), lerp(railT, 1, v)], 24, 8);
  /* montant de pare-brise : du coin de la baie jusqu'au coin du toit */
  patch(pillar, (u, v) => [lerp(gl.xa + .1, gl.xb + .06, u), lerp(.03, railT - .05, u) + v * .1], 18, 2);
  /* montant de lunette : du coin du toit jusqu'au coin de la malle */
  patch(s.pillarChrome ? roof : pillar, (u, v) => [lerp(gl.xc - .02, gl.xd - .14, u), lerp(railT - .05, .03, u) + v * .075], 18, 2);
  /* encadrement haut des portes */
  patch(pillar, (u, v) => [lerp(gl.xb, gl.xc, u), lerp(railT - .06, railT + .01, v)], 16, 2);
  /* montants centraux */
  s.pillars.forEach(([x0, x1, x2, x3]) => patch(pillar, (u, v) => [lerp(lerp(x0, x2, v), lerp(x1, x3, v), u), v * railT], 3, 6));
  /* custode */
  const [c0, c1, c2, c3] = s.cPillar;
  patch(s.roof ? pillar : roof, (u, v) => [lerp(lerp(c0, c2, v), lerp(c1, c3, v), u), v * railT], 10, 8);

  /* Joncs chromés : tour de vitre, joncs de flanc (interrompus aux roues) */
  [1, -1].forEach((sg) => {
    const pts: P3[] = []; for (let i = 0; i <= 20; i++) { const x = lerp(gl.xa + .1, gl.xd - .25, i / 20); const [z, y] = gh(x, 0); pts.push([x, y + .004, sg * (z + .006)]); }
    body.add(tube(pts, .009, chrome));
    s.trim.forEach(([xa, ya, xb, yb]) => {
      const q: P3[] = []; for (let i = 0; i <= 24; i++) { const x = lerp(xa, xb, i / 24); q.push([x, lerp(ya, yb, i / 24), sg * (hw(x) + .004)]); }
      let cur: P3[] = [];
      q.forEach((p) => {
        const hit = s.axles.some((ax, k) => Math.hypot(p[0] - ax, p[1] - s.wheelR) < s.arch[k][0] + .03 && p[1] < s.arch[k][1]);
        if (hit) { if (cur.length > 1) body.add(tube(cur, .011, chrome)); cur = []; } else cur.push(p);
      });
      if (cur.length > 1) body.add(tube(cur, .011, chrome));
    });
  });
  /* Gouttière chromée et rétroviseurs */
  [1, -1].forEach((sg) => {
    const pts: P3[] = []; for (let i = 0; i <= 16; i++) { const x = lerp(gl.xa + .25, gl.xd - .35, i / 16); const [z, y] = gh(x, railT - .06); pts.push([x, y, sg * (z + .012)]); }
    body.add(tube(pts, .006, chrome));
    const m = new Mesh(new SphereGeometry(.05, 12, 8), chrome); m.scale.set(.6, .7, 1); const [z, y] = gh(gl.xa + .1, .06); m.position.set(gl.xa + .1, y + .05, sg * (z + .1)); body.add(m);
    const st = new Mesh(new CylinderGeometry(.006, .008, .08, 6), chrome); st.position.set(gl.xa + .1, y + .02, sg * (z + .055)); st.rotation.x = sg * 1.1; body.add(st);
  });

  /* --- Outils de pose pour les détails --- */
  const nx = -s.L / 2; const tx = s.L / 2;
  /** Pare-chocs tubulaire qui suit la largeur de la caisse ; `wrap` le recourbe aux angles. */
  const bumper = (x0: number, y: number, depth: number, r: number, flat: number, wrap: number, mat: Material = chrome) => {
    const pts: P3[] = []; const sg = Math.sign(x0);
    for (let i = 0; i <= 26; i++) { const t = i / 26 * 2 - 1; const w0 = hw(x0 - sg * .35); const z = t * w0 * 1.03; pts.push([x0 + sg * Math.abs(depth) - sg * Math.pow(Math.abs(t), 4) * wrap, y, z]); }
    body.add(tube(pts, r, mat, flat));
  };
  /** Plaque aux angles arrondis tournée vers l'avant (-X) ; rotation.y = π/2 pour la tourner vers l'arrière. */
  const plate = (x: number, y: number, z: number, w: number, h: number, r: number, mat: Material, thick = .02, yaw = 0) => {
    const g = new ExtrudeGeometry(rrect(w, h, r), { depth: thick, bevelEnabled: true, bevelThickness: .006, bevelSize: .006, bevelSegments: 2, curveSegments: 8 });
    const m = new Mesh(g, mat); m.position.set(x, y, z); m.rotation.y = -Math.PI / 2 + yaw; body.add(m); return m;
  };
  /** x de la surface pour une demi-largeur donnée, au nez (front) ou à la poupe. */
  const surfX = (z: number, front: boolean) => {
    let a = front ? nx : 1.2; let b = front ? -1.5 : tx;
    for (let k = 0; k < 30; k++) { const m = (a + b) / 2; if ((hw(m) >= z) === front) b = m; else a = m; }
    return (a + b) / 2;
  };
  /** Hauteur du dessus de la caisse à une distance z de l'axe. */
  const topY = (x: number, z: number) => {
    const sec = halfSection(x);
    for (let i = sec.length - 1; i > 0; i--) { const [z1, y1] = sec[i]; const [z0, y0] = sec[i - 1]; if (z0 >= z && z1 <= z) return lerp(y1, y0, (z - z1) / Math.max(1e-6, z0 - z1)); }
    return de(x);
  };
  /** Orientation (autour de Y) d'un élément posé sur la face avant, selon la normale de l'aile. */
  const yawAt = (x: number) => { const d = (hw(x + .01) - hw(x - .01)) / .02; return Math.atan2(1, Math.max(.001, d)); };
  /** Pose une pièce plate (plan XY) à plat sur le dessus de la caisse, en suivant sa pente. */
  const lay = (m: Mesh, x: number, z: number, lift = .004) => {
    const slope = (topY(x + .02, Math.abs(z)) - topY(x - .02, Math.abs(z))) / .04;
    const g = new Group(); g.position.set(x, topY(x, Math.abs(z)) + lift, z); g.rotation.z = Math.atan(slope); m.rotation.x = -Math.PI / 2; g.add(m); body.add(g);
  };
  /** Points des feux avant (pour les halos du parking), remplis par les détails. */
  const lampPoints: P3[] = [];

  return { s, mats, curves, root, body, gl, gh, railT, halfSection, nx, tx, bumper, plate, surfX, topY, yawAt, lay, lampPoints };
}

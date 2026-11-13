/* Peugeot 504 berline (1971), d'après les photos de la voiture (references/504/modele) :
   - nez plongeant, face inclinée (le haut en avant) : optiques en trapèze cerclées de chrome, calandre à fines lames
     chromées entre elles avec le lion au centre, clignotants orange sous les optiques qui tournent sur le coin de
     l'aile, lame de pare-chocs chromée à butoirs noirs, plaque dessous, monogramme 504 au bord du capot ;
   - flancs : baguette chromée de bas de caisse, poignées chromées, trappe à essence carrée sur l'aile arrière gauche,
     ouïes noires d'aération sur le montant arrière, rétroviseur chromé sur la porte du conducteur ;
   - poupe fuyante : grands feux (orange en haut, rouge en bas) cerclés de chrome qui tournent sur le coin, plaque dans
     son cadre chromé, lettres PEUGEOT au bord de la malle, monogramme GL, pare-chocs à butoirs, échappement. */
import { BoxGeometry, CapsuleGeometry, CylinderGeometry, ExtrudeGeometry, Group, Mesh, MeshBasicMaterial, PlaneGeometry, Shape, type Material } from 'three';
import { lerp } from '../carspecs';
import { badgeTexture, tube, type P3 } from '../geometry';
import type { CarKit } from '../kit';

export function details(k: CarKit) {
  const { body, mats, curves: { be, hw }, nx, tx, bumper, plate, topY, sideZ, lay, lampPoints, face, RY, gp } = k;
  const { chrome, dark, black, gold, crease, lens, lampGlass, rubber, amber, red } = mats;
  const F = face(true); const R = face(false);
  const box = (parent: Group, x: number, y: number, z: number, sx: number, sy: number, sz: number, mat: Material) => { const m = new Mesh(new BoxGeometry(sx, sy, sz), mat); m.position.set(x, y, z); parent.add(m); return m; };

  /* --- face avant (repère incliné F : y compté depuis la hauteur des pare-chocs) --- */
  const ly = .7 - RY;   /* hauteur du centre des optiques */
  /* calandre : fond noir entre les optiques, fines lames chromées, lion doré */
  plate(-.004, ly - .005, 0, .72, .15, .01, dark, .01, 0, F);
  for (let i = 0; i < 8; i++) box(F, -.024, ly - .065 + i * .0172, 0, .008, .0075, .7, chrome);
  const lion = plate(-.03, ly - .005, 0, .045, .06, .01, gold, .006, 0, F); lion.scale.set(1, 1, .6);
  /* optique : trapèze, bord extérieur haut, bord intérieur en biais ; cerclage chromé, fond, réflecteur, glace */
  const lamp = new Shape(); lamp.moveTo(-.17, -.07); lamp.lineTo(.17, -.07); lamp.lineTo(.17, .075); lamp.lineTo(-.12, .075); lamp.closePath();
  [1, -1].forEach((sg) => {
    const z = .53;
    const parts: [Material, number, number][] = [[chrome, 0, 1], [dark, -.008, .93], [lens, -.012, .82], [lampGlass, -.02, .9]];
    parts.forEach(([mat, dx, sc]) => {
      const m = new Mesh(new ExtrudeGeometry(lamp, { depth: .012, bevelEnabled: mat === chrome, bevelSize: .012, bevelThickness: .004, bevelSegments: 2 }), mat);
      m.position.set(dx, ly, sg * z); m.rotation.y = -Math.PI / 2; m.scale.set(sg * sc, sc, 1); F.add(m);
    });
    lampPoints.push([k.shift(nx, .7) - .03, .7, sg * z]);
    /* clignotant orange sous l'optique, qui tourne sur le coin de l'aile */
    const ind: P3[] = []; for (let i = 0; i <= 10; i++) { const t = i / 10; ind.push([-.02 + Math.pow(t, 3) * .11, ly - .115, sg * lerp(.37, hw(nx) + .012, t)]); }
    F.add(tube(ind, .021, amber, .85));
    F.add(tube(ind.map(([a, b, c]) => [a + .006, b, c] as P3), .026, chrome, .85));
    /* butoirs noirs sur les pare-chocs */
    [[k.shift(nx, .5) - .045, .5], [k.shift(tx, .5) + .045, .5]].forEach(([bx, by]) => { const o = new Mesh(new CapsuleGeometry(.03, .11, 4, 12), rubber); o.position.set(bx, by, sg * .37); body.add(o); });

    /* --- flancs --- */
    /* poignées de portes chromées, dans le pan incliné sous les vitres */
    [.1, 1.02].forEach((hx) => { const y = be(hx) - .085; const h = new Mesh(new CapsuleGeometry(.012, .1, 4, 8), chrome); h.rotation.z = Math.PI / 2; h.position.set(hx, y, sg * (sideZ(hx, y) + .01)); body.add(h); });
    /* ouïes noires d'aération sur le montant arrière */
    for (let i = 0; i < 6; i++) { const x0 = 1.33 + i * .022; body.add(tube([gp(x0 + .05, .07, sg, .003), gp(x0 - .055, .245, sg, .003)], .0045, dark)); }
    /* lignes du capot, le long des ailes */
    const cl: P3[] = []; for (let i = 0; i <= 18; i++) { const x = lerp(-2.2, -1.02, i / 18); const z = hw(x) - .1; cl.push([k.shift(x, topY(x, z)), topY(x, z) + .001, sg * z]); }
    body.add(tube(cl, .003, crease));

    /* --- poupe (repère incliné R) : grand feu cerclé de chrome, orange en haut, rouge en bas, qui tourne sur le coin --- */
    const zc = hw(tx) - .1; const fy = .685 - RY;
    plate(.002, fy, sg * zc, .19, .25, .03, chrome, .012, Math.PI, R);
    plate(.012, fy + .058, sg * zc, .165, .105, .02, amber, .01, Math.PI, R);
    plate(.012, fy - .058, sg * zc, .165, .105, .02, red, .01, Math.PI, R);
    /* retour du feu sur le flanc */
    const wrapZ = sg * (hw(tx) + .001);
    [[fy + .058, amber], [fy - .058, red]].forEach(([y, mat]) => { const w = new Mesh(new BoxGeometry(.07, .105, .012), mat as Material); w.position.set(-.035, y as number, wrapZ); R.add(w); });
    const wb = new Mesh(new BoxGeometry(.085, .25, .008), chrome); wb.position.set(-.04, fy, wrapZ - sg * .003); R.add(wb);
  });
  /* rétroviseur chromé sur la porte du conducteur (côté gauche) */
  { const x = -.72; const y = be(x) + .03; const z = k.gWidth(x) + .03;
    const arm = new Mesh(new CylinderGeometry(.008, .01, .09, 8), chrome); arm.position.set(x, y + .01, z + .03); arm.rotation.x = 1.0; body.add(arm);
    const head = plate(x - .01, y + .055, z + .09, .12, .085, .02, chrome, .025); head.rotation.y = -Math.PI / 2 - .25; }
  /* trappe à essence carrée, aile arrière gauche */
  { const fx = 1.78; const fy = .8; const r = .06; const sq: P3[] = [[-r, -r], [r, -r], [r, r], [-r, r], [-r, -r]].map(([a, b]) => [fx + a, fy + b, sideZ(fx + a, fy + b) + .0005] as P3);
    for (let i = 0; i < 4; i++) body.add(tube([sq[i], sq[i + 1]], .003, crease)); }

  /* pare-chocs chromés : lame large, recourbée aux angles */
  bumper(true, .5, .085, .03, .035, .5);
  bumper(false, .5, .085, .03, .035, .5);
  /* plaque avant sous le pare-chocs */
  box(body, k.shift(nx, .41) - .012, .41, 0, .012, .11, .52, black);

  /* poupe : plaque dans son cadre chromé, jonc de malle, lettres PEUGEOT, monogramme GL */
  const py = .665 - RY;
  plate(.002, py, 0, .6, .16, .02, chrome, .006, Math.PI, R);
  box(R, .012, py, 0, .012, .11, .52, black);
  box(R, .004, py + .125, 0, .012, .014, 1.0, chrome);
  const pgMat = new MeshBasicMaterial({ map: badgeTexture('PEUGEOT', '#e2e4e4', '700 40px Arial, sans-serif'), transparent: true, depthWrite: false });
  const pg = new Mesh(new PlaneGeometry(.26, .045), pgMat); pg.rotation.z = -Math.PI / 2; lay(pg, tx - .1, 0);
  const glMat = new MeshBasicMaterial({ map: badgeTexture('GL', '#e2e4e4', 'italic 700 46px Arial, sans-serif'), transparent: true, depthWrite: false });
  const glb = new Mesh(new PlaneGeometry(.09, .03), glMat); glb.rotation.y = Math.PI / 2; glb.position.set(.008, py - .005, .42); R.add(glb);
  /* monogramme 504 au bord du capot */
  const badgeMat = new MeshBasicMaterial({ map: badgeTexture('504', '#e8eaea', '700 50px Arial, sans-serif'), transparent: true, depthWrite: false });
  const b1 = new Mesh(new PlaneGeometry(.14, .035), badgeMat); b1.rotation.z = Math.PI / 2; lay(b1, nx + .09, -.42);
  /* sortie d'échappement, côté gauche */
  const ex = new Mesh(new CylinderGeometry(.022, .022, .22, 14), dark); ex.rotation.z = Math.PI / 2; ex.position.set(tx - .1, .29, .45); body.add(ex);
}

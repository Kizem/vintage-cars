/* Mercedes-Benz /8 berline, d'après les photos de la voiture : calandre chromée en saillie, grille à mailles
   et barre centrale, étoile debout sur le capot ; optiques verticales cerclées de chrome (clignotant orange en haut,
   phare rond au centre, antibrouillard jaune en bas) ; pare-chocs chromés à bande noire et butoirs ;
   poupe aux feux horizontaux (orange, rouge, blanc), jonc de malle, plaque ; poignées et lignes de capot. */
import { BoxGeometry, CapsuleGeometry, CircleGeometry, CylinderGeometry, ExtrudeGeometry, Group, Mesh, TorusGeometry, type Material } from 'three';
import { lerp } from '../carspecs';
import { rrect, tube, type P3 } from '../geometry';
import type { CarKit } from '../kit';

export function details(k: CarKit) {
  const { body, mats, curves: { be, hw }, nx, tx, bumper, plate, surfX, topY, lampPoints } = k;
  const { chrome, dark, black, rubber, crease, lens, lampGlass, amber, red } = mats;

  /** Cadre en chrome (rectangle évidé), tourné vers l'avant, ou vers l'arrière avec back = true. */
  const frame = (x: number, y: number, z: number, w: number, h: number, r: number, rim: number, depth: number, back = false) => {
    const sh = rrect(w, h, r); sh.holes.push(rrect(w - rim * 2, h - rim * 2, Math.max(.004, r - rim)));
    const m = new Mesh(new ExtrudeGeometry(sh, { depth, bevelEnabled: true, bevelThickness: .005, bevelSize: .005, bevelSegments: 2, curveSegments: 8 }), chrome);
    m.position.set(x, y, z); m.rotation.y = back ? Math.PI / 2 : -Math.PI / 2; body.add(m); return m;
  };
  const bar = (x: number, y: number, z: number, sx: number, sy: number, sz: number, mat: Material = chrome) => { const b = new Mesh(new BoxGeometry(sx, sy, sz), mat); b.position.set(x, y, z); body.add(b); return b; };

  /* Calandre : cadre chromé en saillie, fond noir, mailles fines, barre centrale verticale et barre horizontale */
  const gy = .665; const gw = .5; const gh = .36;
  frame(nx + .012, gy, 0, gw, gh, .035, .03, .055);
  plate(nx - .01, gy, 0, gw - .05, gh - .05, .01, dark, .01);
  for (let i = 1; i < 8; i++) bar(nx - .03, gy - gh / 2 + .025 + i * (gh - .05) / 8, 0, .008, .006, gw - .06);
  for (let i = -5; i <= 5; i++) bar(nx - .034, gy, i * .038, .006, gh - .06, .005);
  bar(nx - .042, gy, 0, .012, gh - .055, .016);
  bar(nx - .042, gy + .015, 0, .012, .014, gw - .06);
  /* étoile debout au-dessus de la calandre */
  const star = new Group(); const ring = new Mesh(new TorusGeometry(.034, .0045, 6, 24), chrome); ring.rotation.y = Math.PI / 2; ring.position.y = .045; star.add(ring);
  for (let i = 0; i < 3; i++) { const a = new Mesh(new BoxGeometry(.005, .032, .005), chrome); const an = i / 3 * 6.283; a.position.set(0, .045 + Math.cos(an) * .016, Math.sin(an) * .016); a.rotation.x = -an; star.add(a); }
  star.add(new Mesh(new CylinderGeometry(.008, .016, .03, 8), chrome));
  star.position.set(nx + .04, topY(nx + .04, 0) + .01, 0); body.add(star);

  [1, -1].forEach((sg) => {
    /* optique verticale : cadre chromé, clignotant orange, phare rond, antibrouillard jaune, verre */
    const z = .6; const x = surfX(z, true) + .01; const ly = .665;
    frame(x + .006, ly, sg * z, .22, .35, .03, .018, .03);
    plate(x - .004, ly, sg * z, .19, .32, .02, dark, .008);
    plate(x - .014, ly + .125, sg * z, .18, .055, .012, amber, .006);
    plate(x - .014, ly - .125, sg * z, .18, .055, .012, mats.gold, .006);
    const lamp = new Mesh(new CircleGeometry(.075, 32), lens); lamp.position.set(x - .016, ly, sg * z); lamp.rotation.y = -Math.PI / 2; body.add(lamp);
    const lr = new Mesh(new TorusGeometry(.078, .006, 8, 32), chrome); lr.position.set(x - .016, ly, sg * z); lr.rotation.y = Math.PI / 2; body.add(lr);
    plate(x - .024, ly, sg * z, .19, .32, .02, lampGlass, .004);
    lampPoints.push([x - .03, ly, sg * z]);
    /* butoirs chromés, avant et arrière */
    [[nx - .11, .46], [tx + .11, .48]].forEach(([bx, by]) => { const o = new Mesh(new CapsuleGeometry(.024, .05, 4, 10), chrome); o.position.set(bx, by - .01, sg * .36); body.add(o); });
    /* lignes du capot, le long des ailes */
    const cl: P3[] = []; for (let i = 0; i <= 18; i++) { const xx = lerp(-2.24, -1.08, i / 18); const zz = hw(xx) * .84; cl.push([xx, topY(xx, zz) + .002, sg * zz]); }
    body.add(tube(cl, .003, crease));
    /* poignées de portes chromées */
    [.18, 1.16].forEach((hx) => { const h = new Mesh(new CapsuleGeometry(.011, .1, 4, 8), chrome); h.rotation.z = Math.PI / 2; h.position.set(hx, be(hx) - .06, sg * (hw(hx) + .008)); body.add(h); });
    /* feux arrière horizontaux : orange à l'extérieur, rouge, blanc vers le centre, cerclés de chrome */
    const zr = .6; const xr = surfX(zr, false) - .008; const ry = .7;
    frame(xr - .004, ry, sg * zr, .42, .15, .02, .014, .014, true);
    ([[.74, amber, .13], [.58, red, .17], [.445, mats.lens, .09]] as [number, Material, number][]).forEach(([zz, mat, w]) => {
      const m = plate(surfX(zz, false) - .002, ry, sg * zz, w, .12, .008, mat, .008); m.rotation.y = Math.PI / 2;
    });
  });
  /* pare-chocs chromés à bande noire, avant et arrière */
  bumper(nx + .02, .46, .09, .046, .62, .5);
  bumper(nx + .02, .46, .124, .012, 1, .5, rubber);
  bumper(tx - .02, .48, .09, .044, .62, .5);
  bumper(tx - .02, .48, .122, .012, 1, .5, rubber);
  /* plaques sans inscription : sous le pare-chocs avant, sur le panneau arrière ; jonc de malle */
  bar(nx - .06, .35, 0, .012, .11, .52, black);
  const xp = surfX(.26, false);
  bar(xp + .006, .62, 0, .012, .11, .52, black);
  bar(surfX(.2, false) + .002, .76, 0, .012, .016, .62);
}

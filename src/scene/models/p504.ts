/* Peugeot 504 berline, d'après les photos de la voiture : face verticale à peine inclinée, optiques
   trapézoïdales (bord intérieur en biais) cerclées de chrome, calandre noire à fines lamelles chromées
   et lion au centre, clignotants orange sous les optiques, pare-chocs chromés à butoirs noirs ;
   poupe tricorps aux feux verticaux orange et rouge, plaque, jonc de malle, sortie d'échappement. */
import { BoxGeometry, CapsuleGeometry, CylinderGeometry, ExtrudeGeometry, Mesh, MeshBasicMaterial, PlaneGeometry, Shape, type Material } from 'three';
import { lerp } from '../carspecs';
import { badgeTexture, tube, type P3 } from '../geometry';
import type { CarKit } from '../kit';

export function details(k: CarKit) {
  const { body, mats, curves: { be, hw }, nx, tx, bumper, plate, surfX, topY, lay, lampPoints } = k;
  const { chrome, dark, black, gold, crease, lens, lampGlass, rubber, amber, red } = mats;
  const gy = .73;
  const fx = surfX(.3, true);
  /* calandre : cadre chromé, fond noir, lamelles horizontales, lion */
  plate(fx + .004, gy, 0, .7, .19, .018, chrome, .012);
  plate(fx - .004, gy, 0, .66, .16, .012, dark, .012);
  for (let i = 0; i < 6; i++) { const b = new Mesh(new BoxGeometry(.008, .007, .64), chrome); b.position.set(fx - .022, gy - .065 + i * .026, 0); body.add(b); }
  const lion = plate(fx - .026, gy, 0, .045, .06, .012, gold, .006);
  lion.scale.set(1, 1, .6);
  /* optique : trapèze, bord extérieur vertical, bord intérieur en biais vers le bas */
  const lamp = new Shape(); lamp.moveTo(-.165, -.075); lamp.lineTo(.165, -.075); lamp.lineTo(.165, .085); lamp.lineTo(-.1, .085); lamp.closePath();
  [1, -1].forEach((sg) => {
    const z = .515; const x = surfX(z, true) + .004;
    const parts: [Material, number, boolean][] = [[chrome, .0, true], [dark, -.008, false], [lens, -.012, false], [lampGlass, -.02, false]];
    parts.forEach(([mat, dx, bevel]) => {
      const m = new Mesh(new ExtrudeGeometry(lamp, { depth: .01, bevelEnabled: bevel, bevelSize: .014, bevelThickness: .004, bevelSegments: 2 }), mat);
      m.position.set(x + dx, gy, sg * z); m.rotation.y = -Math.PI / 2; if (sg < 0) m.scale.x = -1;
      if (mat === lens) m.scale.set(sg < 0 ? -.86 : .86, .82, 1);
      body.add(m);
    });
    lampPoints.push([x - .03, gy, sg * z]);
    /* clignotant orange sous l'optique */
    plate(surfX(.53, true) - .002, .615, sg * .53, .3, .045, .008, amber, .01);
    /* butoirs noirs, avant et arrière */
    [[nx - .03, .52], [tx + .03, .54]].forEach(([bx, by]) => { const o = new Mesh(new CapsuleGeometry(.032, .12, 4, 12), rubber); o.position.set(bx, by, sg * .36); body.add(o); });
    /* poignées de portes chromées */
    [.14, 1.08].forEach((hx) => { const h = new Mesh(new CapsuleGeometry(.011, .1, 4, 8), chrome); h.rotation.z = Math.PI / 2; h.position.set(hx, be(hx) - .065, sg * (hw(hx) + .008)); body.add(h); });
    /* feux arrière verticaux : orange en haut, rouge en bas, cerclés de chrome */
    const xr = surfX(.66, false) - .01;
    const bez = plate(xr + .004, .75, sg * .66, .15, .25, .015, chrome, .01); bez.rotation.y = Math.PI / 2;
    const am = plate(xr + .012, .83, sg * .66, .12, .07, .01, amber, .01); am.rotation.y = Math.PI / 2;
    const rd = plate(xr + .012, .72, sg * .66, .12, .14, .01, red, .01); rd.rotation.y = Math.PI / 2;
  });
  /* pare-chocs chromés */
  bumper(nx + .03, .52, .06, .03, .7, .45);
  bumper(tx - .03, .54, .06, .03, .7, .45);
  /* plaques sans inscription, jonc de malle */
  const pf = new Mesh(new BoxGeometry(.012, .11, .52), black); pf.position.set(nx - .03, .43, 0); body.add(pf);
  const xp = surfX(.25, false);
  const pr = new Mesh(new BoxGeometry(.012, .11, .52), black); pr.position.set(xp + .006, .68, 0); body.add(pr);
  const jonc = new Mesh(new BoxGeometry(.012, .018, .9), chrome); jonc.position.set(surfX(.45, false) + .002, .79, 0); body.add(jonc);
  /* sortie d'échappement, côté gauche */
  const ex = new Mesh(new CylinderGeometry(.024, .024, .22, 14), dark); ex.rotation.z = Math.PI / 2; ex.position.set(tx - .12, .3, .45); body.add(ex);
  /* lignes du capot et monogramme 504 sur le capot et la malle */
  [1, -1].forEach((sg) => { const cl: P3[] = []; for (let i = 0; i <= 18; i++) { const x = lerp(-2.15, -1.05, i / 18); const z = hw(x) * .8; cl.push([x, topY(x, z) + .002, sg * z]); } body.add(tube(cl, .003, crease)); });
  const badgeMat = new MeshBasicMaterial({ map: badgeTexture('504', '#e8eaea', '700 50px Arial, sans-serif'), transparent: true, depthWrite: false });
  const b1 = new Mesh(new PlaneGeometry(.14, .035), badgeMat); b1.rotation.z = Math.PI / 2;
  lay(b1, -2.08, 0);
  lay(new Mesh(new PlaneGeometry(.12, .03), badgeMat), 2.1, .4);
}

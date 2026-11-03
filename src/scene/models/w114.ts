/* Mercedes-Benz /8 (W114), version de départ : calandre haute, phares verticaux, double pare-chocs. */
import { BoxGeometry, CylinderGeometry, Group, Mesh, TorusGeometry } from 'three';
import type { CarKit } from '../kit';

export function details(k: CarKit) {
  const { body, mats, nx, tx, bumper, plate, lampPoints } = k;
  const { chrome, dark, lens, amber, red } = mats;
  plate(nx + .02, .655, 0, .58, .44, .025, chrome, .035);
  plate(nx - .01, .65, 0, .5, .365, .012, dark, .012);
  for (let i = -6; i <= 6; i++) { const b = new Mesh(new BoxGeometry(.012, .365, .014), chrome); b.position.set(nx - .03, .65, i * .038); body.add(b); }
  const bar = new Mesh(new BoxGeometry(.018, .018, .5), chrome); bar.position.set(nx - .038, .65, 0); body.add(bar);
  const star = new Group(); const ring = new Mesh(new TorusGeometry(.034, .0045, 6, 24), chrome); ring.rotation.y = Math.PI / 2; ring.position.y = .03; star.add(ring);
  for (let i = 0; i < 3; i++) { const a = new Mesh(new BoxGeometry(.005, .032, .005), chrome); const an = i / 3 * 6.283; a.position.set(0, .03 + Math.cos(an) * .016, Math.sin(an) * .016); a.rotation.x = -an; star.add(a); }
  const stem = new Mesh(new CylinderGeometry(.008, .016, .03, 8), chrome); star.add(stem); star.position.set(nx + .05, .905, 0); body.add(star);
  [1, -1].forEach((sg) => {
    plate(nx + .02, .63, sg * .625, .25, .42, .055, chrome, .03);
    plate(nx - .012, .56, sg * .625, .2, .24, .03, lens, .012);
    plate(nx - .012, .755, sg * .625, .2, .115, .02, amber, .012);
  });
  lampPoints.push([nx - .03, .56, .625], [nx - .03, .56, -.625]);
  bumper(nx + .02, .4, .07, .034, .9, .5);
  bumper(nx + .02, .325, .05, .016, 1, .45);
  [1, -1].forEach((sg) => { const o = new Mesh(new BoxGeometry(.045, .13, .04), chrome); o.position.set(nx - .06, .375, sg * .32); body.add(o); });
  bumper(tx - .02, .44, .07, .032, .9, .45);
  [1, -1].forEach((sg) => { const m = plate(tx - .012, .72, sg * .6, .42, .15, .02, red, .014); m.rotation.y = Math.PI / 2; });
  const tp = new Mesh(new BoxGeometry(.012, .014, .62), chrome); tp.position.set(tx + .004, .84, 0); body.add(tp);
}

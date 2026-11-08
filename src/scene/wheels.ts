/* Roues communes : même pneu tourné, même jante chromée, même enjoliveur dessiné ; seul le style d'enjoliveur
   (s.hub) et la teinte changent d'une voiture à l'autre.
   Structure attendue par parking.ts (reflet) : root > roue (Group) > spin (Group, premier enfant) > pièces. */
import { CircleGeometry, Group, LatheGeometry, Mesh, SphereGeometry, TorusGeometry, Vector2 } from 'three';
import type { CarSpec, Pt } from './carspecs';
import type { CarMaterials } from './materials';

export function buildWheels(s: CarSpec, mats: CarMaterials, root: Group) {
  const prof: Pt[] = [[.0, -.5], [.72, -.5], [.93, -.42], [1, -.22], [1, .22], [.93, .42], [.72, .5], [0, .5]];
  const tireG = new LatheGeometry(prof.map(([r, h]) => new Vector2(r * s.wheelR, h * s.wheelW)), 36);
  const wheels: Group[] = [];
  s.axles.forEach((ax, a) => {
    [1, -1].forEach((sg) => {
      const w = new Group(); w.position.set(ax, s.wheelR, sg * s.trackZ[a]);
      const spin = new Group(); w.add(spin);
      const tire = new Mesh(tireG, mats.tire); tire.rotation.x = Math.PI / 2; spin.add(tire);
      /* jante : 14 pouces d'origine sur la DS et la 504, 17 pouces en pneus taille basse sur la Mercedes */
      const rr = s.hub === 'mercedes' ? .7 : .64;
      const rim = new Mesh(new TorusGeometry(s.wheelR * (rr + .02), .012, 8, 36), mats.chrome); rim.position.z = sg * s.wheelW * .49; spin.add(rim);
      const hub = new Mesh(new CircleGeometry(s.wheelR * rr, 36), mats.hub); hub.position.z = sg * s.wheelW * .505; if (sg < 0) hub.rotation.y = Math.PI; spin.add(hub);
      /* enjoliveur bombé chromé (DS, 504) ; la Mercedes a des jantes modernes au voile plat, dessiné dans la texture */
      { const dome = new Mesh(new SphereGeometry(s.wheelR * (s.hub === 'mercedes' ? .14 : .45), 28, 12, 0, Math.PI * 2, 0, Math.PI / 2), mats.chrome); dome.rotation.x = sg * Math.PI / 2; dome.scale.y = s.hub === 'mercedes' ? .45 : .32; dome.position.z = sg * s.wheelW * .5; spin.add(dome); }
      root.add(w); wheels.push(spin);
    });
  });
  return wheels;
}

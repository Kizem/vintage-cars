/* Roues communes : même pneu tourné, même jante chromée, même enjoliveur dessiné ; seul le style d'enjoliveur
   (s.hub) et la teinte changent d'une voiture à l'autre.
   Structure attendue par parking.ts (reflet) : root > roue (Group) > spin (Group, premier enfant) > pièces. */
import { CircleGeometry, Group, LatheGeometry, Mesh, RingGeometry, SphereGeometry, Vector2 } from 'three';
import type { CarSpec, Pt } from './carspecs';
import type { CarMaterials } from './materials';

export function buildWheels(s: CarSpec, mats: CarMaterials, root: Group) {
  const prof: Pt[] = [[.55, -.3], [.6, -.5], [.74, -.5], [.93, -.42], [1, -.22], [1, .22], [.93, .42], [.74, .5], [.6, .5], [.55, .3]];
  const tireG = new LatheGeometry(prof.map(([r, h]) => new Vector2(r * s.wheelR, h * s.wheelW)), 36);
  const wheels: Group[] = [];
  s.axles.forEach((ax, a) => {
    [1, -1].forEach((sg) => {
      const w = new Group(); w.position.set(ax, s.wheelR, sg * s.trackZ[a]);
      const spin = new Group(); w.add(spin);
      const tire = new Mesh(tireG, mats.tire); tire.rotation.x = Math.PI / 2; spin.add(tire);
      const back = new Mesh(new CircleGeometry(s.wheelR * .62, 24), mats.well); spin.add(back);
      /* jante : 14 pouces d'origine sur la DS et la 504, 17 pouces en pneus taille basse sur la Mercedes.
         Rebord roulé puis gorge tournés (LatheGeometry), voile dessiné posé au fond de la gorge. */
      const rr = s.hub === 'mercedes' ? .72 : .64; const R = s.wheelR; const zo = s.wheelW * .5; const deep = s.hub === 'mercedes' ? .045 : .022;
      const lipProf: Pt[] = [[rr + .045, zo - .012], [rr + .03, zo + .002], [rr + .005, zo + .004], [rr - .02, zo - .004], [rr - .05, zo - deep]];
      const lip = new Mesh(new LatheGeometry(lipProf.map(([r, z]) => new Vector2(r * R, z)), 40), mats.rim); lip.rotation.x = sg * Math.PI / 2; spin.add(lip);
      const hub = new Mesh(new CircleGeometry(R * (rr - .045), 40), mats.hub); hub.position.z = sg * (zo - deep + .002); if (sg < 0) hub.rotation.y = Math.PI; spin.add(hub);
      /* enjoliveur bombé chromé : petit sur la 504, grand et plat sur la DS ; cache-moyeu sur la Mercedes */
      { const k = s.hub === 'mercedes' ? .15 : s.hub === 'ds' ? .56 : .4; const dome = new Mesh(new SphereGeometry(R * k, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2), mats.chrome); dome.rotation.x = sg * Math.PI / 2; dome.scale.y = s.hub === 'mercedes' ? .4 : s.hub === 'ds' ? .22 : .3; dome.position.z = sg * (zo - deep + .002); spin.add(dome); }
      /* flanc blanc : un large anneau sur le flanc extérieur du pneu */
      if (s.whitewall) { const ww = new Mesh(new RingGeometry(s.wheelR * .7, s.wheelR * .9, 48), mats.whitewall); ww.position.z = sg * s.wheelW * .495; if (sg < 0) ww.rotation.y = Math.PI; spin.add(ww); }
      root.add(w); wheels.push(spin);
    });
  });
  return wheels;
}

/* Citroën DS 21, d'après les photos de la voiture (references/DS21/modele) : nez large et arrondi, double optique (grande à l'extérieur, petite à l'intérieur)
   aux ampoules jaunes sous un globe, clignotants aux angles, pare-chocs à butoirs, prise d'air noire ;
   poupe effilée : feux rouges rectangulaires, plaque, chevrons dorés et monogramme DS21 sur la malle,
   feux en trompette en haut des montants arrière. */
import { BoxGeometry, CapsuleGeometry, CylinderGeometry, ExtrudeGeometry, Group, Mesh, MeshBasicMaterial, MeshPhysicalMaterial, PlaneGeometry, Shape, SphereGeometry, TorusGeometry } from 'three';
import { lerp } from '../carspecs';
import { badgeTexture, tube, type P3 } from '../geometry';
import type { CarKit } from '../kit';

export function details(k: CarKit) {
  const { body, mats, curves: { be, hw }, gh, railT, nx, tx, bumper, plate, surfX, topY, yawAt, lay, lampPoints } = k;
  const { chrome, dark, black, gold, crease, lens, amber, red } = mats;
  const globe = new MeshPhysicalMaterial({ color: 0xffffff, roughness: .02, transparent: true, opacity: .2, clearcoat: 1, clearcoatRoughness: .02, envMap: mats.env, envMapIntensity: 1.6, depthWrite: false });

  [1, -1].forEach((sg) => {
    const pods: [number, number][] = [[.665, .095], [.47, .078]];
    pods.forEach(([z, r]) => {
      const x = surfX(z, true) + .06;
      const g = new Group(); g.position.set(x, .635, sg * z); g.rotation.y = sg * yawAt(x); body.add(g);
      const ring = new Mesh(new TorusGeometry(r, r * .1, 8, 32), chrome); ring.rotation.y = Math.PI / 2; g.add(ring);
      const cup = new Mesh(new SphereGeometry(r * .96, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), chrome); cup.rotation.z = -Math.PI / 2; cup.scale.y = .55; cup.position.x = .012; g.add(cup);
      const bulb = new Mesh(new SphereGeometry(r * .9, 24, 12), lens); bulb.scale.set(.32, 1, 1); bulb.position.x = -.004; g.add(bulb);
      lampPoints.push([x - .03, .635, sg * z]);
    });
    /* le globe couvre les deux optiques, dans le galbe de l'aile */
    const zm = .565; const xm = surfX(zm, true) + .045;
    const fair = new Mesh(new SphereGeometry(1, 36, 18), globe); fair.scale.set(.055, .11, .215); fair.position.set(xm, .635, sg * zm); fair.rotation.y = sg * yawAt(xm); fair.renderOrder = 6; body.add(fair);
    /* clignotant à l'angle, sous l'optique */
    const xa = surfX(.74, true) + .03;
    const blink = new Mesh(new SphereGeometry(.05, 16, 10), amber); blink.scale.set(.35, .45, 1); blink.position.set(xa, .5, sg * .74); blink.rotation.y = sg * yawAt(xa); body.add(blink);
    /* butoirs avant et arrière */
    [[nx - .045, .41], [tx + .03, .46]].forEach(([x, y]) => { const o = new Mesh(new CapsuleGeometry(.026, .1, 4, 12), chrome); o.position.set(x, y, sg * .34); body.add(o); });
    /* lignes du capot, le long des ailes */
    const cl: P3[] = []; for (let i = 0; i <= 18; i++) { const x = lerp(-2.32, -.95, i / 18); const z = hw(x) * .74; cl.push([x, topY(x, z) + .002, sg * z]); }
    body.add(tube(cl, .0035, crease));
    /* poignées de portes */
    [.3, 1.3].forEach((x) => { const h = new Mesh(new CapsuleGeometry(.011, .09, 4, 8), chrome); h.rotation.z = Math.PI / 2; h.position.set(x, be(x) - .085, sg * (hw(x) + .008)); body.add(h); });
    /* feux arrière rectangulaires, cerclés de chrome, et catadioptre rond à l'angle */
    const xr = surfX(.36, false) - .012;
    const bez = plate(xr + .006, .58, sg * .36, .23, .1, .015, chrome, .012); bez.rotation.y = Math.PI / 2;
    const tl = plate(xr + .016, .58, sg * .36, .2, .075, .01, red, .012); tl.rotation.y = Math.PI / 2;
    const xc = surfX(.5, false) - .01;
    const cat = new Mesh(new CylinderGeometry(.026, .026, .012, 18), red); cat.rotation.z = Math.PI / 2; cat.position.set(xc + .006, .5, sg * .5); body.add(cat);
    /* feux en trompette en haut des montants arrière */
    const tr = new Mesh(new CylinderGeometry(.036, .016, .2, 14), amber); tr.rotation.z = Math.PI / 2 - .05; const [z, y] = gh(1.04, railT - .03); tr.position.set(1.12, y - .004, sg * (z + .012)); body.add(tr);
  });
  /* pare-chocs : avant à creux central, arrière bas ; prise d'air noire sous l'avant */
  bumper(nx + .04, .41, .055, .04, .7, .7);
  const v: P3[] = [[nx - .03, .41, -.12], [nx - .045, .365, 0], [nx - .03, .41, .12]]; body.add(tube(v, .012, chrome));
  const intake = new Mesh(new BoxGeometry(.03, .08, 1.1), dark); intake.position.set(nx + .07, .33, 0); body.add(intake);
  bumper(tx - .05, .46, .065, .036, .7, .62);
  /* plaque arrière (sans inscription), poignée de malle */
  const xp = surfX(.2, false);
  const plateBox = new Mesh(new BoxGeometry(.02, .11, .5), black); plateBox.position.set(xp - .004, .6, 0); body.add(plateBox);
  const handle = new Mesh(new CapsuleGeometry(.012, .05, 4, 8), chrome); handle.rotation.x = Math.PI / 2; handle.position.set(xp - .03, .7, 0); body.add(handle);
  /* chevrons dorés sur la malle, pointe vers l'avant ; monogramme DS21 à droite */
  const chev = new Shape(); chev.moveTo(.012, -.075); chev.lineTo(-.02, 0); chev.lineTo(.012, .075); chev.lineTo(.026, .075); chev.lineTo(-.006, 0); chev.lineTo(.026, -.075); chev.closePath();
  const chevG = new ExtrudeGeometry(chev, { depth: .004, bevelEnabled: false });
  [0, .042].forEach((dx) => lay(new Mesh(chevG, gold), 2.06 + dx, 0));
  const ds21 = badgeTexture('DS21', '#d6b25c', 'italic 700 52px Georgia, serif');
  lay(new Mesh(new PlaneGeometry(.2, .05), new MeshBasicMaterial({ map: ds21, transparent: true, depthWrite: false })), 2.2, -.33, .006);
}

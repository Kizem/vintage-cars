/* Citroën DS 21, d'après les photos de la voiture (references/DS21/modele) : nez large et arrondi, double optique (grande à l'extérieur, petite à l'intérieur)
   aux ampoules jaunes sous un globe, clignotants aux angles, pare-chocs à butoirs, prise d'air noire ;
   poupe effilée : feux rouges rectangulaires, plaque, chevrons dorés et monogramme DS21 sur la malle,
   feux en trompette en haut des montants arrière. */
import { BoxGeometry, CapsuleGeometry, CylinderGeometry, ExtrudeGeometry, Group, Mesh, MeshBasicMaterial, MeshPhysicalMaterial, PlaneGeometry, Shape, SphereGeometry, TorusGeometry } from 'three';
import { lerp, type Pt } from '../carspecs';
import { badgeTexture, loft, stations, tube, type P3 } from '../geometry';
import type { CarKit } from '../kit';

export function details(k: CarKit) {
  const { body, mats, curves: { be, hw }, gh, nx, tx, bumper, plate, surfX, topY, yawAt, lay, lampPoints } = k;
  const { chrome, dark, black, gold, crease, lens, amber, red } = mats;
  const globe = new MeshPhysicalMaterial({ color: 0xdfe8ec, roughness: .02, transparent: true, opacity: .4, clearcoat: 1, clearcoatRoughness: .02, envMap: mats.env, envMapIntensity: 1.6, depthWrite: false });

  [1, -1].forEach((sg) => {
    /* Phares carénés, d'après les photos : un globe de verre allongé qui prolonge la pointe de l'aile vers l'avant,
       cerclé de chrome ; au fond du globe (côté pare-brise), une cuvette sombre où les deux optiques rondes sont
       côte à côte, la grande à l'extérieur, la jaune vers le capot. L'avant du globe, devant elles, est vide. */
    const zm = .585; const x0 = surfX(zm, true); const ly = .655;
    const unit = new Group(); unit.position.set(x0, ly, sg * zm); unit.rotation.y = sg * (yawAt(x0 + .15) - Math.PI / 2) * .5; body.add(unit);
    const well = new Mesh(new SphereGeometry(1, 36, 18, 0, Math.PI), dark); well.scale.set(.09, .092, .145); well.rotation.y = Math.PI / 2; well.position.x = .1; unit.add(well);
    ([[.062, .066], [-.07, .058]] as [number, number][]).forEach(([dz, r]) => {
      const zz = sg * dz;
      const bowl = new Mesh(new SphereGeometry(r, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), chrome); bowl.rotation.z = -Math.PI / 2; bowl.scale.y = .55; bowl.position.set(.1, .004, zz); unit.add(bowl);
      const bulb = new Mesh(new SphereGeometry(r * .8, 24, 12), lens); bulb.scale.set(.32, 1, 1); bulb.position.set(.086, .004, zz); unit.add(bulb);
      const rim = new Mesh(new TorusGeometry(r, r * .07, 8, 32), chrome); rim.rotation.y = Math.PI / 2; rim.position.set(.084, .004, zz); unit.add(rim);
      lampPoints.push([x0 + .03, ly, sg * (zm + dz)]);
    });
    /* le globe : moitié avant d'un ellipsoïde allongé, en saillie devant les optiques */
    const fair = new Mesh(new SphereGeometry(1, 40, 20, 0, Math.PI), globe); fair.scale.set(.15, .102, .27); fair.rotation.y = -Math.PI / 2; fair.position.x = .1; fair.renderOrder = 6; unit.add(fair);
    /* son cerclage chromé, là où le globe rejoint l'aile */
    const ring = new Mesh(new TorusGeometry(1, .045, 8, 48), chrome); ring.scale.set(.142, .102, 1); ring.rotation.y = Math.PI / 2; ring.position.x = .1; unit.add(ring);
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

  /* Le pavillon « casquette » : un toit plat et mince, posé sur le vitrage et qui le déborde tout autour,
     prolongé au-dessus de la lunette ; les feux en trompette à ses coins arrière. */
  const capMat = new MeshPhysicalMaterial({ color: 0x80858a, metalness: .45, roughness: .32, clearcoat: .8, clearcoatRoughness: .12, envMap: mats.env, envMapIntensity: 1 });
  const gl = k.gl; const cx0 = gl.xb - .07; const cx1 = 1.2; const capY = gl.roofY - .006;
  const capW = (x: number) => {
    const [z] = gh(Math.min(x, gl.xc), .5); const w = z + .03;
    const f = x < cx0 + .12 ? Math.sqrt(Math.max(0, 1 - ((cx0 + .12 - x) / .12) ** 2)) : x > cx1 - .05 ? Math.sqrt(Math.max(0, 1 - ((x - cx1 + .05) / .05) ** 2)) : 1;
    return Math.max(.001, w * f);
  };
  /* coupe du pavillon : dessus presque plat, bords qui s'arrondissent vers le bas et débordent du vitrage, sous-face mince */
  const capSection = (x: number): Pt[] => {
    const w = capW(x); const yt = capY + .03;
    return [[0, yt - .026], [w * .7, yt - .034], [w * .93, yt - .06], [w - .008, yt - .082], [w, yt - .074], [w * .99, yt - .05], [w * .95, yt - .026], [w * .82, yt - .009], [w * .5, yt - .001], [0, yt]];
  };
  const cap = new Mesh(loft(stations(cx0, cx1, 40), capSection), capMat); body.add(cap);
  [1, -1].forEach((sg) => {
    const z = capW(cx1 - .08) - .02;
    const tr = new Mesh(new CylinderGeometry(.03, .014, .17, 14), red); tr.rotation.z = Math.PI / 2; tr.position.set(cx1 - .06, capY + .012, sg * z); body.add(tr);
  });
}

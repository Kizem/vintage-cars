/* Citroën DS 21 (1965-1972), d'après les photos de la voiture (references/DS21/modele) :
   - phares carénés : à la pointe de chaque aile, un globe de verre allongé cerclé de chrome ; au fond, deux optiques
     rondes côte à côte dans une cuvette sombre (la grande à l'extérieur, la jaune vers le capot) ;
   - nez : jonc chromé au bord du capot, pointé au centre ; pare-chocs chromé enveloppant, deux butoirs en caoutchouc
     noir dessous, clignotants sur les coins du pare-chocs ; prise d'air noire et plaque (sans inscription) dessous ;
   - pavillon : coque du même gris que la caisse, aux bords arrondis, qui déborde le vitrage et avance au-dessus de la
     lunette ; feux en trompette à ses coins arrière ;
   - poupe : malle aux chevrons dorés et monogramme DS21, feux rouges cerclés de chrome aux coins, plaque au centre,
     pare-chocs enveloppant ;
   - flancs : poignées chromées, lignes du capot le long des ailes. */
import { BoxGeometry, CapsuleGeometry, CylinderGeometry, ExtrudeGeometry, Group, Mesh, MeshBasicMaterial, MeshPhysicalMaterial, PlaneGeometry, Shape, SphereGeometry, TorusGeometry } from 'three';
import { lerp, type Pt } from '../carspecs';
import { badgeTexture, loft, stations, tube, type P3 } from '../geometry';
import type { CarKit } from '../kit';

export function details(k: CarKit) {
  const { body, mats, gl, curves: { be, hw }, gh, nx, tx, bumper, plate, surfX, topY, yawAt, lay, lampPoints } = k;
  const { chrome, dark, black, rubber, gold, crease, lens, amber, red } = mats;
  const globe = new MeshPhysicalMaterial({ color: 0xdfe8ec, roughness: .02, transparent: true, opacity: .3, clearcoat: 1, clearcoatRoughness: .02, envMap: mats.env, envMapIntensity: 1.6, depthWrite: false });

  [1, -1].forEach((sg) => {
    /* --- phare caréné, à la pointe de l'aile --- */
    const zm = .6; const x0 = surfX(zm, true) + .06; const ly = .64;
    const unit = new Group(); unit.position.set(x0, ly, sg * zm); unit.rotation.y = sg * (yawAt(x0 + .15) - Math.PI / 2) * .45; body.add(unit);
    /* cuvette sombre au fond, puis les deux optiques côte à côte */
    const well = new Mesh(new SphereGeometry(1, 36, 18, 0, Math.PI), dark); well.scale.set(.15, .095, .07); well.rotation.y = Math.PI / 2; well.position.x = .1; unit.add(well);
    ([[.065, .068], [-.07, .06]] as [number, number][]).forEach(([dz, r]) => {
      const zz = sg * dz;
      const bowl = new Mesh(new SphereGeometry(r, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), chrome); bowl.rotation.z = -Math.PI / 2; bowl.scale.y = .55; bowl.position.set(.1, .004, zz); unit.add(bowl);
      const bulb = new Mesh(new SphereGeometry(r * .8, 24, 12), lens); bulb.scale.set(.32, 1, 1); bulb.position.set(.086, .004, zz); unit.add(bulb);
      const rim = new Mesh(new TorusGeometry(r, r * .07, 8, 32), chrome); rim.rotation.y = Math.PI / 2; rim.position.set(.084, .004, zz); unit.add(rim);
      lampPoints.push([x0 + .03, ly, sg * (zm + dz)]);
    });
    /* le globe de verre, en saillie devant les optiques, et son cerclage chromé contre l'aile */
    const fair = new Mesh(new SphereGeometry(1, 40, 20, 0, Math.PI), globe); fair.scale.set(.152, .102, .2); fair.rotation.y = -Math.PI / 2; fair.position.x = .1; fair.renderOrder = 6; unit.add(fair);
    const ring = new Mesh(new TorusGeometry(1, .045, 8, 48), chrome); ring.scale.set(.152, .102, 1); ring.rotation.y = Math.PI / 2; ring.position.x = .1; unit.add(ring);

    /* --- avant : clignotant sur le coin du pare-chocs, butoir en caoutchouc noir sous la lame --- */
    const xi = surfX(.7, true) + .02;
    const blink = new Mesh(new BoxGeometry(.03, .03, .12), amber); blink.position.set(xi + .05, .465, sg * .7); blink.rotation.y = sg * (yawAt(xi + .1) - Math.PI / 2) * .6; body.add(blink);
    const guard = new Mesh(new BoxGeometry(.2, .055, .07, 2, 1, 1), rubber); guard.position.set(nx + .02, .34, sg * .4); guard.rotation.z = .55; body.add(guard);

    /* --- flancs : lignes du capot le long des ailes, poignées à l'arrière des portes --- */
    const cl: P3[] = []; for (let i = 0; i <= 20; i++) { const x = lerp(-2.25, -.9, i / 20); const z = hw(x) * .78; cl.push([x, topY(x, z) + .002, sg * z]); }
    body.add(tube(cl, .0035, crease));
    [.18, 1.08].forEach((x) => { const h = new Mesh(new CapsuleGeometry(.011, .09, 4, 8), chrome); h.rotation.z = Math.PI / 2; h.position.set(x, be(x) - .07, sg * (hw(x) + .008)); body.add(h); });

    /* --- poupe : feu rouge cerclé de chrome à chaque coin, catadioptre dessous --- */
    const zr = .47; const xr = surfX(zr, false) - .006;
    const bez = plate(xr + .004, .64, sg * zr, .13, .15, .02, chrome, .012); bez.rotation.y = Math.PI / 2 - sg * .35;
    const tl = plate(xr + .012, .64, sg * zr, .105, .125, .015, red, .012); tl.rotation.y = Math.PI / 2 - sg * .35;
    const cat = new Mesh(new CylinderGeometry(.02, .02, .01, 16), red); cat.rotation.z = Math.PI / 2; cat.position.set(xr + .012, .53, sg * zr); body.add(cat);
  });

  /* --- nez : jonc chromé au bord du capot, pointé au centre --- */
  const blade: P3[] = []; for (let i = 0; i <= 24; i++) { const z = lerp(-.56, .56, i / 24); const x = surfX(Math.max(.6, Math.abs(z)), true) + (.56 - Math.abs(z)) * .06 - .008; blade.push([Math.min(x, nx + .05), .515 - (1 - Math.abs(z) / .56) * .025, z]); }
  body.add(tube(blade, .009, chrome));
  /* pare-chocs avant enveloppant, prise d'air noire et plaque dessous */
  bumper(nx + .05, .42, .06, .036, .65, .42);
  const intake = new Mesh(new BoxGeometry(.04, .07, 1.0), dark); intake.position.set(nx + .08, .345, 0); body.add(intake);
  const fplate = new Mesh(new BoxGeometry(.012, .11, .5), black); fplate.position.set(nx + .02, .33, 0); body.add(fplate);

  /* --- poupe : pare-chocs, plaque au centre, poignée de malle, chevrons et monogramme --- */
  bumper(tx - .05, .45, .06, .034, .65, .38);
  const xp = surfX(.2, false);
  const rplate = new Mesh(new BoxGeometry(.016, .11, .5), black); rplate.position.set(xp - .004, .6, 0); body.add(rplate);
  const handle = new Mesh(new CapsuleGeometry(.011, .05, 4, 8), chrome); handle.rotation.x = Math.PI / 2; handle.position.set(xp - .03, .7, 0); body.add(handle);
  const chev = new Shape(); chev.moveTo(.012, -.07); chev.lineTo(-.02, 0); chev.lineTo(.012, .07); chev.lineTo(.026, .07); chev.lineTo(-.006, 0); chev.lineTo(.026, -.07); chev.closePath();
  const chevG = new ExtrudeGeometry(chev, { depth: .004, bevelEnabled: false });
  [0, .04].forEach((dx) => lay(new Mesh(chevG, gold), 2.16 + dx, 0));
  const ds21 = badgeTexture('DS21', '#d6b25c', 'italic 700 52px Georgia, serif');
  lay(new Mesh(new PlaneGeometry(.17, .045), new MeshBasicMaterial({ map: ds21, transparent: true, depthWrite: false })), 2.2, -.3, .006);

  /* --- pavillon : coque du même gris que la caisse, bords arrondis, qui déborde le vitrage
     et avance au-dessus de la lunette ; feux en trompette à ses coins arrière --- */
  const cx0 = gl.xb - .06; const cx1 = gl.xc + .2; const tr0 = k.railT - .05;
  /* largeur relative : arrondi aux deux bouts */
  const endF = (x: number) => x < cx0 + .1 ? Math.sqrt(Math.max(0, 1 - ((cx0 + .1 - x) / .1) ** 2)) : x > cx1 - .09 ? Math.sqrt(Math.max(0, 1 - ((x - cx1 + .09) / .09) ** 2)) : 1;
  /* la coque épouse le haut du vitrage (jusqu'à la gouttière), avec une lèvre qui le déborde ; au-dessus de la
     lunette, elle garde la coupe du toit et s'avance en surplomb */
  const capSection = (x: number): Pt[] => {
    const xs = Math.min(Math.max(x, gl.xb + .02), gl.xc); const f = endF(x);
    const pt = (t: number, lift: number, out: number): Pt => { const [z, y] = gh(xs, t); return [Math.max(0, (z + out) * f), y + lift]; };
    const under: Pt[] = []; for (let i = 10; i >= 0; i--) under.push(pt(lerp(tr0, 1, i / 10), .007, 0));
    const [ze, ye] = gh(xs, tr0);
    const lip: Pt[] = [[Math.max(0, (ze + .032) * f), ye - .004], [Math.max(0, (ze + .036) * f), ye + .016]];
    const top: Pt[] = []; for (let i = 0; i <= 10; i++) top.push(pt(lerp(tr0 + .04, 1, i / 10), .03, .022 * (1 - i / 10)));
    return [...under, ...lip, ...top];
  };
  body.add(new Mesh(loft(stations(cx0, cx1, 44), capSection), mats.roof));
  const capW = (x: number) => (gh(gl.xc, tr0)[0] + .03) * endF(x); const capY = gh(gl.xc, 1)[1];
  [1, -1].forEach((sg) => {
    const z = capW(cx1 - .1) - .03;
    const tr = new Mesh(new CylinderGeometry(.028, .013, .16, 14), red); tr.rotation.z = Math.PI / 2; tr.position.set(cx1 - .07, capY - .035, sg * z); body.add(tr);
  });
}

/* Citroën DS 21 (1965-1972), d'après les photos de la voiture (references/DS21/modele) :
   - phares (photos de face et de trois-quarts) : l'aile se termine en bloc ; sur sa face avant, une grande glace en
     trapèze arrondi, au ras de la tôle et cerclée de chrome, qui s'allonge en amande sur le coin de l'aile ; derrière,
     un boîtier clair et deux grosses optiques côte à côte (la jaune à l'extérieur) ; long clignotant orange dessous ;
   - nez : jonc chromé au bord du capot, pointé au centre ; pare-chocs chromé enveloppant, deux butoirs en caoutchouc
     noir dessous ; prise d'air noire et plaque (sans inscription) dessous ;
   - pavillon : coque du même gris que la caisse, aux bords arrondis, qui déborde le vitrage et avance au-dessus de la
     lunette ; feux en trompette à ses coins arrière ;
   - poupe : malle aux chevrons dorés et monogramme DS21, feux rouges cerclés de chrome aux coins, plaque au centre,
     pare-chocs enveloppant ;
   - flancs : poignées chromées, lignes du capot le long des ailes. */
import { BoxGeometry, BufferGeometry, Float32BufferAttribute, CapsuleGeometry, CircleGeometry, CylinderGeometry, DoubleSide, ExtrudeGeometry, Group, Matrix4, Mesh, MeshBasicMaterial, MeshPhysicalMaterial, MeshStandardMaterial, PlaneGeometry, Shape, TorusGeometry, Vector3 } from 'three';
import { lerp, type Pt } from '../carspecs';
import { badgeTexture, canvasTex, loft, stations, tube, type P3 } from '../geometry';
import type { CarKit } from '../kit';

export function details(k: CarKit) {
  const { body, mats, gl, curves: { be, hw }, gh, nx, tx, bumper, plate, surfX, topY, lay, lampPoints } = k;
  const { chrome, dark, black, rubber, gold, crease, lens, amber, red } = mats;
  /** Le point est-il dans la caisse ? (coupe de la caisse à son abscisse, en miroir) */
  const inside = (p: Vector3) => {
    if (p.x < nx || p.x > tx) return false;
    const sec = k.halfSection(p.x); const z = Math.abs(p.z); const y = p.y; let inn = false;
    for (let i = 0, j = sec.length - 1; i < sec.length; j = i++) { const [zi, yi] = sec[i]; const [zj, yj] = sec[j]; if ((yi > y) !== (yj > y) && z < (zj - zi) * (y - yi) / (yj - yi) + zi) inn = !inn; }
    return inn;
  };
  headlamps();

  /* --- Phares (references/DS21 ; photos de face et de trois-quarts) ---
     De face, l'aile se termine par un bloc dont la face avant porte une grande glace en trapèze arrondi : bord extérieur
     bien rond, bord côté capot presque droit, dessus qui monte vers l'extérieur. De trois-quarts, la glace s'allonge en
     amande sur le coin de l'aile, plus étroite à l'avant. Elle épouse la tôle, sans aucune saillie ; derrière, un
     boîtier clair et, au fond, deux grosses optiques côte à côte : la jaune à l'extérieur, la blanche côté capot, en
     partie cachée par le bord de la glace. Un long clignotant orange cerclé de chrome sous la glace.
     Le contour est défini dans le plan de la glace (u vers l'arrière et l'extérieur, v vers le haut) et projeté sur la
     tôle le long de l'axe D ; la peinture n'est pas dessinée dans ce contour (mats.lampCut). Construit côté gauche,
     reporté en miroir. Réglages vérifiés hors navigateur : contour entier sur la face de l'aile, une seule traversée
     de tôle, boîtier tout entier dans la caisse. */
  function headlamps() {
    /* contour (photo de face) : bord côté capot droit et haut (exposant 8, aux coins arrondis), bord extérieur bien rond
       (2,2) ; le dessus monte vers l'extérieur (k), le dessous reste presque horizontal (kb) */
    const W = { A: .24, B: .115, pF: 8, pR: 2.2, tF: .9, k: .07, kb: .02 };
    const DEPTH = .1;
    const D = new Vector3(-.883, .05, .469).normalize();
    const E2 = new Vector3(0, 1, 0).addScaledVector(D, -D.y).normalize();
    const E1 = new Vector3().crossVectors(E2, D).normalize();
    const s01 = (u: number) => Math.min(1, Math.max(0, (u / W.A + 1) / 2));
    /** bord haut (+1) ou bas (-1) du contour à l'abscisse u */
    const vEdge = (u: number, sgn: number) => {
      const p = lerp(W.pF, W.pR, s01(u));
      return sgn * W.B * lerp(W.tF, 1, s01(u)) * Math.pow(Math.max(0, 1 - Math.pow(Math.abs(u) / W.A, p)), 1 / p) + (sgn > 0 ? W.k : W.kb) * u;
    };
    /** Point de tôle atteint en venant de l'extérieur, le long de -D, depuis (u, v) du plan de la glace centré en o. */
    const onSkin = (o: Vector3, u: number, v: number) => {
      const start = o.clone().addScaledVector(E1, u).addScaledVector(E2, v).addScaledVector(D, .5);
      const at = (t: number) => start.clone().addScaledVector(D, -t);
      let a = 0; let b = 1.2;
      for (let t = 0; t < 1.2; t += .01) { if (inside(at(t))) { b = t; break; } a = t; }
      for (let i = 0; i < 20; i++) { const m = (a + b) / 2; if (inside(at(m))) b = m; else a = m; }
      return at(b);
    };
    const C = onSkin(new Vector3(-2.3, .615, .77), 0, 0);
    const tOf = (p: Vector3) => p.clone().sub(C).dot(D);

    /* contour : bord haut d'avant en arrière, puis bord bas d'arrière en avant (points serrés aux extrémités) */
    const N = 40; const us = Array.from({ length: N + 1 }, (_, i) => -W.A * Math.cos(i / N * Math.PI));
    const ring: [number, number][] = [...us.map((u): [number, number] => [u, vEdge(u, 1)]), ...us.slice(1, -1).reverse().map((u): [number, number] => [u, vEdge(u, -1)])];
    /* glace : anneaux concentriques posés sur la tôle */
    const RS = [0, .25, .5, .7, .85, .95, 1];
    const gpos: number[] = []; const guv: number[] = []; const gidx: number[] = []; const ts: number[] = [];
    const put = (u: number, v: number) => { const t = tOf(onSkin(C, u, v)); ts.push(t); gpos.push(u, v, t + .004); guv.push(u / W.A * .5 + .5, v / W.B * .5 + .5); };
    put(0, 0);
    RS.slice(1).forEach((r) => ring.forEach(([u, v]) => put(u * r, v * r)));
    const R = ring.length;
    for (let j = 0; j < R; j++) gidx.push(0, 1 + j, 1 + (j + 1) % R);
    for (let i = 0; i < RS.length - 2; i++) for (let j = 0; j < R; j++) { const a = 1 + i * R + j; const b = 1 + i * R + (j + 1) % R; gidx.push(a, a + R, b, b, a + R, b + R); }
    const glassG = new BufferGeometry(); glassG.setAttribute('position', new Float32BufferAttribute(gpos, 3)); glassG.setAttribute('uv', new Float32BufferAttribute(guv, 2)); glassG.setIndex(gidx); glassG.computeVertexNormals();
    const tEdge = ring.map(([u, v]) => tOf(onSkin(C, u, v)));
    const tMin = Math.min(...ts, ...tEdge); const tMax = Math.max(...ts, ...tEdge);
    mats.lampCut(C, E1, E2, D, W, tMin - .02, tMax + .02);

    /* matériaux : glace claire et striée, boîtier argenté, réflecteurs chromés ; l'optique blanche s'allume avec la jaune */
    const flutes = canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(120,120,110,.55)'; for (let x = 2; x < w; x += 7) g.fillRect(x, 0, 1, h); });
    const glassMat = new MeshPhysicalMaterial({ color: 0xe9e5d8, map: flutes, roughness: .05, transparent: true, opacity: .3, clearcoat: 1, clearcoatRoughness: .03, envMap: mats.env, envMapIntensity: 1.4, depthWrite: false });
    const housingMat = new MeshStandardMaterial({ color: 0xc8c6bc, metalness: .6, roughness: .32, envMap: mats.env, envMapIntensity: 1, side: DoubleSide });
    const reflector = new MeshStandardMaterial({ color: 0xe8e9e9, metalness: 1, roughness: .16, envMap: mats.env, envMapIntensity: 1.5, side: DoubleSide });
    /* glace d'optique claire, striée ; elle s'éclaire aussi quand les phares s'allument (même intensité que lens) */
    const clear = new MeshStandardMaterial({ color: 0xe6e2d4, map: flutes, metalness: .55, roughness: .14, envMap: mats.env, envMapIntensity: 1.4, emissive: 0xfff0c0 });
    Object.defineProperty(clear, 'emissiveIntensity', { get: () => lens.emissiveIntensity * .5, set: () => undefined });

    const left = new Group(); const unit = new Group(); left.add(unit);
    unit.position.copy(C); unit.quaternion.setFromRotationMatrix(new Matrix4().makeBasis(E1, E2, D));
    const glassMesh = new Mesh(glassG, glassMat); glassMesh.renderOrder = 6; unit.add(glassMesh);
    /* boîtier : une coque qui suit la tôle à profondeur constante (DEPTH derrière chaque point du bord), resserrée au fond ;
       fond fermé. Il reste ainsi dans l'aile sur toute la longueur de la glace. */
    const hpos: number[] = []; const hidx: number[] = [];
    ring.forEach(([u, v], j) => { hpos.push(u, v, tEdge[j] - .002, u * .86, v * .86 - .01, tEdge[j] - DEPTH); });
    for (let j = 0; j < R; j++) { const a = 2 * j; const b = 2 * ((j + 1) % R); hidx.push(a, a + 1, b, b, a + 1, b + 1); }
    const c0 = R * 2; hpos.push(0, -.01, tOf(onSkin(C, 0, 0)) - DEPTH);
    for (let j = 0; j < R; j++) hidx.push(c0, 2 * j + 1, 2 * ((j + 1) % R) + 1);
    const housingG = new BufferGeometry(); housingG.setAttribute('position', new Float32BufferAttribute(hpos, 3)); housingG.setIndex(hidx); housingG.computeVertexNormals();
    unit.add(new Mesh(housingG, housingMat));
    /* jonc chromé sur le pourtour, posé sur la tôle */
    const lip: P3[] = ring.map(([u, v], j) => [u, v, tEdge[j] + .005]); lip.push(lip[0]);
    unit.add(tube(lip, .0055, chrome));
    /* les deux optiques au fond (photos) : deux grosses optiques rondes presque de même taille, réflecteur chromé
       sous une glace claire striée, ampoule jaune au centre ; l'extérieure un peu plus grande */
    /* vers l'arrière de la glace, comme sur les photos ; l'avant de la glace reste vide */
    const lampsAt: [number, number, number][] = [[.085, .004, .072], [-.06, .004, .066]];
    const glow: Vector3[] = [];
    lampsAt.forEach(([u, v, r]) => {
      /* chaque optique juste derrière la glace, à sa place sur la tôle */
      const tBack = tOf(onSkin(C, u, v)) - .085;
      const cup = new Mesh(new CylinderGeometry(r * 1.02, r * .55, .046, 32, 1, true), reflector); cup.rotation.x = Math.PI / 2; cup.position.set(u, v, tBack + .027); unit.add(cup);
      const face = new Mesh(new CircleGeometry(r, 40), clear); face.position.set(u, v, tBack + .046); unit.add(face);
      const bulb = new Mesh(new CircleGeometry(r * .34, 32), lens); bulb.position.set(u, v, tBack + .048); unit.add(bulb);
      const bezel = new Mesh(new TorusGeometry(r, .007, 8, 40), chrome); bezel.position.set(u, v, tBack + .05); unit.add(bezel);
      glow.push(new Vector3(u, v, tBack + .06).applyQuaternion(unit.quaternion).add(C));
    });
    /* clignotant : long feu orange cerclé de chrome, sous l'arrière de la glace */
    const ub = .11; const pb = onSkin(C, ub, vEdge(ub, -1) - .045); const tb = tOf(pb);
    const bez = new Mesh(new BoxGeometry(.165, .036, .01), chrome); bez.position.set(ub, vEdge(ub, -1) - .045, tb + .003); unit.add(bez);
    const ind = new Mesh(new BoxGeometry(.15, .024, .012), amber); ind.position.set(ub, vEdge(ub, -1) - .045, tb + .008); unit.add(ind);

    const right = left.clone(); right.scale.z = -1;
    body.add(left, right);
    glow.forEach((p) => { lampPoints.push([p.x, p.y, p.z], [p.x, p.y, -p.z]); });
  }

  [1, -1].forEach((sg) => {
    /* --- avant : butoir en caoutchouc noir sous la lame --- */
    const guard = new Mesh(new BoxGeometry(.2, .055, .07, 2, 1, 1), rubber); guard.position.set(nx + .02, .34, sg * .4); guard.rotation.z = .55; body.add(guard);

    /* --- flancs : joint du capot contre la paroi des ailes, poignées à l'arrière des portes --- */
    const cl: P3[] = []; for (let i = 0; i <= 20; i++) { const x = lerp(-2.39, -.9, i / 20); const z = hw(x) * .6; cl.push([x, topY(x, z) + .002, sg * z]); }
    body.add(tube(cl, .0035, crease));
    [.18, 1.08].forEach((x) => { const h = new Mesh(new CapsuleGeometry(.011, .09, 4, 8), chrome); h.rotation.z = Math.PI / 2; h.position.set(x, be(x) - .07, sg * (hw(x) + .008)); body.add(h); });

    /* --- poupe : feu rouge horizontal dans son boîtier chromé, de part et d'autre de la plaque ; catadioptre rond sur l'aile --- */
    const zr = .4; const xr = tx + .004;
    const bez = plate(xr, .535, sg * zr, .2, .085, .02, chrome, .014); bez.rotation.y = Math.PI / 2;
    const tl = plate(xr + .01, .535, sg * zr, .17, .06, .012, red, .01); tl.rotation.y = Math.PI / 2;
    const cat = new Mesh(new CylinderGeometry(.022, .022, .01, 16), red); cat.rotation.x = Math.PI / 2; cat.position.set(2.2, .6, sg * (k.sideZ(2.2, .6) + .002)); body.add(cat);
  });

  /* --- nez : jonc chromé au bord du capot, pointé au centre --- */
  const blade: P3[] = []; for (let i = 0; i <= 24; i++) { const z = lerp(-.56, .56, i / 24); const x = surfX(Math.max(.6, Math.abs(z)), true) + (.56 - Math.abs(z)) * .06 - .008; blade.push([Math.min(x, nx + .05), .555 - (1 - Math.abs(z) / .56) * .02, z]); }
  body.add(tube(blade, .009, chrome));
  /* pare-chocs avant enveloppant, prise d'air noire et plaque dessous */
  bumper(true, .42, .075, .04, .03, .45);
  const intake = new Mesh(new BoxGeometry(.04, .07, 1.0), dark); intake.position.set(nx + .08, .345, 0); body.add(intake);
  const fplate = new Mesh(new BoxGeometry(.012, .11, .5), black); fplate.position.set(nx + .02, .33, 0); body.add(fplate);

  /* --- poupe : pare-chocs, plaque au centre, poignée de malle, chevrons et monogramme --- */
  bumper(false, .45, .07, .04, .03, .4);
  const xp = surfX(.2, false);
  const rplate = new Mesh(new BoxGeometry(.016, .1, .46), black); rplate.position.set(tx + .012, .535, 0); body.add(rplate);
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

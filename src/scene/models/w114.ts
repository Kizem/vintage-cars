/* Mercedes W115 220D berline (1973), d'après les photos de la voiture (references/MercedesW115/modele) :
   calandre haute et large à cadre chromé, mailles fines, barre centrale et chapeau chromé qui prolonge le capot,
   étoile debout ; optiques verticales aux angles, cerclées de chrome (clignotant orange en haut, phare au centre,
   antibrouillard jaune en bas) ; double pare-chocs avant (lame chromée à bande noire, puis deux butoirs bas de part et
   d'autre de la plaque) ; poupe : jonc chromé sous la malle sur toute la largeur, feux horizontaux aux angles
   (orange à l'extérieur, rouge, puis rouge et blanc), étoile et monogramme « 220 D » sur la malle, pare-chocs à bande
   noire ; poignées de portes et lignes de capot. */
import { BoxGeometry, CapsuleGeometry, CylinderGeometry, ExtrudeGeometry, Group, Mesh, MeshBasicMaterial, PlaneGeometry, TorusGeometry, type Material } from 'three';
import { lerp } from '../carspecs';
import { badgeTexture, rrect, tube, type P3 } from '../geometry';
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
  /** Étoile à trois branches dans un anneau, tournée vers l'avant (dir = -1) ou vers l'arrière (dir = 1). */
  const starRing = (r: number, t: number) => {
    const g = new Group(); const ring = new Mesh(new TorusGeometry(r, t, 6, 28), chrome); ring.rotation.y = Math.PI / 2; g.add(ring);
    for (let i = 0; i < 3; i++) { const a = new Mesh(new BoxGeometry(t * 1.1, r, t * 1.1), chrome); const an = i / 3 * 6.283; a.position.set(0, Math.cos(an) * r / 2, Math.sin(an) * r / 2); a.rotation.x = -an; g.add(a); }
    return g;
  };

  /* Calandre : haute et large, en saillie sur la face ; cadre chromé, fond noir, mailles fines, barre centrale,
     chapeau chromé sur le dessus qui se fond dans le capot, petite étoile en haut de la grille */
  const gy = .715; const gw = .64; const gh = .36; const gx = nx - .035;
  frame(gx + .03, gy, 0, gw, gh, .03, .028, .06);
  plate(gx + .01, gy, 0, gw - .05, gh - .05, .01, dark, .01);
  for (let i = 1; i < 12; i++) bar(gx - .012, gy - gh / 2 + .025 + i * (gh - .05) / 12, 0, .008, .006, gw - .06);
  for (let i = -9; i <= 9; i++) bar(gx - .016, gy, i * .031, .006, gh - .06, .004);
  bar(gx - .024, gy, 0, .014, gh - .05, .018);
  const cap = bar(gx + .045, gy + gh / 2 + .006, 0, .11, .022, gw + .01); cap.rotation.z = -.12;
  const badge = starRing(.022, .003); badge.position.set(gx - .03, gy + gh / 2 - .045, 0); body.add(badge);
  /* étoile debout sur le capot, juste derrière le chapeau */
  const star = starRing(.034, .0045); star.position.y = .045;
  const stand = new Group(); stand.add(star); stand.add(new Mesh(new CylinderGeometry(.009, .018, .03, 10), chrome));
  stand.position.set(gx + .12, topY(gx + .12, 0) + .012, 0); body.add(stand);

  [1, -1].forEach((sg) => {
    /* optique verticale aux angles : cadre chromé, clignotant orange, phare, antibrouillard jaune, verre */
    const z = .735; const x = surfX(z, true) - .004; const ly = .715;
    frame(x + .004, ly, sg * z, .2, .34, .05, .014, .03);
    plate(x - .004, ly, sg * z, .172, .312, .04, dark, .008);
    plate(x - .012, ly + .115, sg * z, .16, .06, .02, amber, .006);
    plate(x - .012, ly - .115, sg * z, .16, .07, .02, mats.gold, .006);
    plate(x - .014, ly + .003, sg * z, .16, .16, .05, lens, .006);
    plate(x - .024, ly, sg * z, .172, .312, .04, lampGlass, .004);
    lampPoints.push([x - .03, ly, sg * z]);
    /* butoirs bas du double pare-chocs avant : chrome sur bande noire, de part et d'autre de la plaque,
       recourbés aux angles */
    const lo: P3[] = []; for (let i = 0; i <= 14; i++) { const t = i / 14; const zz = lerp(.3, .86, t); lo.push([nx - .075 + Math.pow(t, 5) * .2, .365, sg * zz]); }
    body.add(tube(lo, .024, chrome, .55));
    body.add(tube(lo.map(([a, b, c]) => [a - .012, b, c] as P3), .012, rubber, .9));
    /* lignes du capot, le long des ailes */
    const cl: P3[] = []; for (let i = 0; i <= 18; i++) { const xx = lerp(-2.27, -.85, i / 18); const zz = hw(xx) * .86; cl.push([xx, topY(xx, zz) + .002, sg * zz]); }
    body.add(tube(cl, .003, crease));
    /* jonc de flanc : bande noire posée sur le jonc chromé, sur toute la longueur */
    const st: P3[] = []; for (let i = 0; i <= 30; i++) { const xx = lerp(-2.29, 2.31, i / 30); st.push([xx, lerp(.705, .695, i / 30) + .002, sg * (hw(xx) + .012)]); }
    body.add(tube(st, .007, rubber));
    /* poignées de portes chromées, à l'arrière de chaque porte */
    [-.16, .88].forEach((hx) => { const h = new Mesh(new CapsuleGeometry(.011, .1, 4, 8), chrome); h.rotation.z = Math.PI / 2; h.position.set(hx, be(hx) - .1, sg * (hw(hx) + .008)); body.add(h); });
    /* feux arrière horizontaux aux angles : orange à l'extérieur, rouge, puis rouge en haut et blanc en bas */
    const zr = .66; const xr = tx + .004; const ry = .665;
    frame(xr - .004, ry, sg * zr, .36, .145, .015, .012, .014, true);
    ([[.79, amber, .085, ry, .12], [.665, red, .15, ry, .12], [.535, red, .095, ry + .03, .058], [.535, mats.lens, .095, ry - .03, .055]] as [number, Material, number, number, number][]).forEach(([zz, mat, w, yy, h]) => {
      const m = plate(xr - .002, yy, sg * zz, w, h, .006, mat, .008); m.rotation.y = Math.PI / 2;
    });
  });
  /* pare-chocs chromés à bande noire, avant et arrière */
  bumper(true, .475, .1, .04, .04, .5);
  bumper(true, .475, .032, .014, .064, .5, rubber);
  bumper(false, .465, .1, .04, .04, .5);
  bumper(false, .465, .032, .014, .064, .5, rubber);
  /* plaques sans inscription : entre les butoirs avant, au centre du panneau arrière */
  bar(nx - .085, .365, 0, .012, .11, .52, black);
  bar(tx + .008, .645, 0, .012, .11, .52, black);
  /* jonc chromé sous la malle, sur toute la largeur, et poignée de malle */
  bar(tx + .004, .772, 0, .016, .018, hw(tx) * 2 - .02);
  bar(tx + .002, .8, 0, .012, .014, .18);
  /* étoile et monogramme « 220 D » sur la face arrière de la malle */
  const rs = starRing(.045, .004); rs.rotation.y = Math.PI; rs.position.set(tx + .006, .858, 0); body.add(rs);
  const badgeMat = new MeshBasicMaterial({ map: badgeTexture('220 D', '#dfe2e2', 'italic 600 46px Arial, sans-serif'), transparent: true, depthWrite: false });
  const b = new Mesh(new PlaneGeometry(.16, .04), badgeMat); b.rotation.y = Math.PI / 2; b.position.set(tx + .006, .825, .5); body.add(b);
}

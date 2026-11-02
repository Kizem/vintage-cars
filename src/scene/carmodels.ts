/* Les trois voitures, dessinées en 3D à partir de leurs proportions (longueur, empattement, hauteur).
   Ce sont des représentations graphiques, pas des photos. Unités : mètres. Le nez est côté -X. */
import {
  Group, Mesh, BufferGeometry, Float32BufferAttribute, BoxGeometry, CylinderGeometry, CircleGeometry, TorusGeometry, SphereGeometry,
  TubeGeometry, CatmullRomCurve3, Vector3, MeshPhysicalMaterial, MeshStandardMaterial, MeshBasicMaterial, CanvasTexture, SRGBColorSpace, DoubleSide, Shape, ExtrudeGeometry, LatheGeometry, Vector2, CapsuleGeometry, PlaneGeometry,
  type Material, type Texture,
} from 'three';
import { curve, lerp, type CarSpec, type Pt } from './carspecs';

type P3 = [number, number, number];

function catmull(ctrl: Pt[], count: number): Pt[] {
  const out: Pt[] = []; const n = ctrl.length;
  for (let k = 0; k <= count; k++) {
    const u = (k / count) * (n - 1); const i = Math.min(n - 2, Math.floor(u)); const t = u - i;
    const p0 = ctrl[Math.max(0, i - 1)]; const p1 = ctrl[i]; const p2 = ctrl[i + 1]; const p3 = ctrl[Math.min(n - 1, i + 2)];
    const f = (a: 0 | 1) => .5 * (2 * p1[a] + (p2[a] - p0[a]) * t + (2 * p0[a] - 5 * p1[a] + 4 * p2[a] - p3[a]) * t * t + (3 * p1[a] - p0[a] - 3 * p2[a] + p3[a]) * t * t * t);
    out.push([f(0), f(1)]);
  }
  return out;
}

/* Maille fermée : une suite de coupes [z, y] le long de X, en miroir de part et d'autre de l'axe */
function loft(xs: number[], sectionAt: (x: number) => Pt[], opts: { uvH?: number; uvL?: number; caps?: boolean } = {}) {
  const pos: number[] = []; const uv: number[] = []; const idx: number[] = [];
  const H = opts.uvH || 1.6; const L = opts.uvL || 6;
  let ringN = 0;
  xs.forEach((x) => {
    const half = sectionAt(x);
    const ring = half.concat(half.slice(0, -1).reverse().map(([z, y]): Pt => [-z, y]));
    ringN = ring.length;
    ring.forEach(([z, y]) => { pos.push(x, y, z); uv.push(x / L + .5, y / H); });
  });
  for (let i = 0; i < xs.length - 1; i++) {
    for (let j = 0; j < ringN - 1; j++) {
      const a = i * ringN + j; const b = a + 1; const c = a + ringN; const d = c + 1;
      idx.push(a, c, b, b, c, d);
    }
  }
  const cap = (i: number, flip: boolean) => {
    let cx = 0; let cy = 0;
    for (let j = 0; j < ringN; j++) { cy += pos[(i * ringN + j) * 3 + 1]; }
    cy /= ringN; cx = pos[i * ringN * 3];
    const base = pos.length / 3;
    pos.push(cx, cy, 0); uv.push(cx / L + .5, cy / H);
    for (let j = 0; j < ringN; j++) { const k = (i * ringN + j) * 3; pos.push(pos[k], pos[k + 1], pos[k + 2]); uv.push(pos[k] / L + .5, pos[k + 1] / H); }
    for (let j = 0; j < ringN - 1; j++) { if (flip) idx.push(base, base + 1 + j + 1, base + 1 + j); else idx.push(base, base + 1 + j, base + 1 + j + 1); }
  };
  if (opts.caps !== false) { cap(0, true); cap(xs.length - 1, false); }
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

function stations(a: number, b: number, n: number) {
  /* plus de coupes près des extrémités, où la forme change vite */
  const out: number[] = [];
  for (let i = 0; i <= n; i++) { const t = i / n; const e = .5 - .5 * Math.cos(Math.PI * t); out.push(lerp(a, b, lerp(t, e, .7))); }
  return out;
}

function tube(points: P3[], r: number, mat: Material, flatY = 1) {
  const c = new CatmullRomCurve3(points.map((p) => new Vector3(p[0], p[1], p[2])));
  const m = new Mesh(new TubeGeometry(c, Math.max(24, points.length * 8), r, 8, false), mat);
  if (flatY !== 1) { /* tube aplati : pare-chocs */
    const P = m.geometry.attributes.position; const cy = points.reduce((a, p) => a + p[1], 0) / points.length;
    for (let i = 0; i < P.count; i++) P.setY(i, cy + (P.getY(i) - cy) * flatY);
    m.geometry.computeVertexNormals();
  }
  return m;
}

function canvasTex(w: number, h: number, draw: (g: CanvasRenderingContext2D, w: number, h: number) => void) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d')!, w, h);
  const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; t.anisotropy = 8; return t;
}

function hubTexture(style: CarSpec['hub'], tint: string) {
  return canvasTex(256, 256, (g, w) => {
    const c = w / 2;
    g.fillStyle = tint; g.beginPath(); g.arc(c, c, c, 0, 7); g.fill();
    if (style === 'mercedes') {
      g.strokeStyle = 'rgba(40,40,40,.55)'; g.lineWidth = 3; g.beginPath(); g.arc(c, c, c * .62, 0, 7); g.stroke();
      for (let i = 0; i < 24; i++) { const a = i / 24 * 6.283; g.strokeStyle = 'rgba(40,40,40,.32)'; g.lineWidth = 2; g.beginPath(); g.moveTo(c + Math.cos(a) * c * .66, c + Math.sin(a) * c * .66); g.lineTo(c + Math.cos(a) * c * .97, c + Math.sin(a) * c * .97); g.stroke(); }
      g.fillStyle = 'rgba(30,30,30,.82)'; for (let i = 0; i < 3; i++) { const a = i / 3 * 6.283 - 1.571; g.beginPath(); g.moveTo(c + Math.cos(a) * c * .46, c + Math.sin(a) * c * .46); g.lineTo(c + Math.cos(a + 1.5) * c * .07, c + Math.sin(a + 1.5) * c * .07); g.lineTo(c + Math.cos(a - 1.5) * c * .07, c + Math.sin(a - 1.5) * c * .07); g.fill(); }
    } else if (style === 'peugeot') {
      g.fillStyle = '#1c1c1b'; for (let i = 0; i < 10; i++) { const a = i / 10 * 6.283; g.beginPath(); g.ellipse(c + Math.cos(a) * c * .74, c + Math.sin(a) * c * .74, c * .11, c * .055, a, 0, 7); g.fill(); }
      g.strokeStyle = 'rgba(30,30,30,.5)'; g.lineWidth = 3; g.beginPath(); g.arc(c, c, c * .42, 0, 7); g.stroke();
    } else {
      /* DS : jante en tôle peinte, un seul gros enjoliveur central (modélisé à part) */
      g.strokeStyle = 'rgba(25,25,25,.55)'; g.lineWidth = 5; g.beginPath(); g.arc(c, c, c * .8, 0, 7); g.stroke();
      g.strokeStyle = 'rgba(255,255,255,.18)'; g.lineWidth = 3; g.beginPath(); g.arc(c, c, c * .72, 0, 7); g.stroke();
    }
  });
}

export function buildCar(spec: CarSpec, env: Texture) {
  const s = spec;
  const fl = curve(s.floor); const be = curve(s.belt); const de = curve(s.deck); const hw = curve(s.hw);
  const root = new Group();
  const body = new Group();  /* la caisse, qui peut bouger sur ses roues */
  root.add(body);

  const chrome = new MeshStandardMaterial({ color: 0xf2f3f4, metalness: 1, roughness: .18, envMap: env, envMapIntensity: 1.5 });
  const dark = new MeshStandardMaterial({ color: 0x0b0d0c, roughness: .7, envMap: env, envMapIntensity: .3 });
  const black = new MeshBasicMaterial({ color: 0x050605 });

  /* Lignes de carrosserie dessinées comme sur un plan */
  const seamTex = canvasTex(2048, 512, (g, w, h) => {
    g.fillStyle = '#fff'; g.fillRect(0, 0, w, h);
    const X = (x: number) => (x / 6 + .5) * w; const Y = (y: number) => h - (y / 1.6) * h;
    g.strokeStyle = 'rgba(10,12,12,.72)'; g.lineWidth = 2.6;
    s.seams.forEach((x) => { g.beginPath(); g.moveTo(X(x), Y(.33)); g.lineTo(X(x + .02), Y(be(x) - .015)); g.stroke(); });
    g.fillStyle = 'rgba(10,12,12,.85)';
    [s.seams[0] + .78, s.seams[1] + .72].forEach((x) => { g.fillRect(X(x), Y(be(x) - .1), 26, 4); });
    if (s.flap) { const [fx, fy, fr] = s.flap; g.beginPath(); g.ellipse(X(fx), Y(fy), fr / 6 * w, fr / 1.6 * h, 0, 0, 7); g.stroke(); }
    /* bas de caisse */
    g.fillStyle = 'rgba(6,8,8,.88)'; g.fillRect(0, Y(.325), w, h);
  });
  const paint = new MeshPhysicalMaterial({ ...s.paint, map: seamTex, clearcoat: 1, clearcoatRoughness: .07, envMap: env, envMapIntensity: .95, side: DoubleSide });
  const archU = { value: s.axles.map((x, i) => new Vector3(x, s.wheelR, s.arch[i][0])) };
  const archC = { value: s.arch.map((a) => a[1]) };
  paint.onBeforeCompile = (sh) => {
    sh.uniforms.uArch = archU; sh.uniforms.uClip = archC;
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vL;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvL = position;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vL; uniform vec3 uArch[2]; uniform float uClip[2];')
      .replace('#include <map_fragment>', `
        if (abs(vL.z) > .25) { for (int i = 0; i < 2; i++) { if (length(vL.xy - uArch[i].xy) < uArch[i].z && vL.y < uClip[i]) discard; } }
        #include <map_fragment>`);
  };

  const halfSection = (x: number) => {
    const f = fl(x); const d = de(x); const b = Math.min(be(x), d - .004); const w = hw(x);
    const r = Math.min(.13, (b - f) * .3);
    return catmull([[0, f], [w * .55, f], [w * .9, f + .012], [w * .985, f + r], [w, lerp(f, b, .55)], [w * .992, b], [w * .9, lerp(b, d, .78)], [w * .55, d - .012 * (w / .9)], [0, d]], 26);
  };
  const xs = stations(-s.L / 2, s.L / 2, 92);
  const shell = new Mesh(loft(xs, halfSection), paint);
  body.add(shell);

  /* Dessous sombre, visible à travers les passages de roues */
  const under = new Mesh(loft(stations(-s.L / 2 + .2, s.L / 2 - .2, 30), (x) => {
    const f = fl(x) + .01; const w = hw(x) * .78; const t = Math.min(be(x), de(x)) - .03;
    return [[0, f], [w, f], [w, t], [0, t]];
  }), black);
  body.add(under);

  /* L'habitacle : un volume de verre, puis le toit et les montants posés dessus */
  const gl = s.glass;
  const roofY = curve([[gl.xa - .5, gl.baseY - .08], [gl.xa, gl.baseY], [gl.xb, gl.roofY - .012], [lerp(gl.xb, gl.xc, .35), gl.roofY], [gl.xc, gl.roofY - .022], [gl.xd, gl.tailY], [gl.xd + .4, gl.tailY - .1]]);
  const gh = (x: number, t: number): Pt => {
    const yb = Math.min(be(x), de(x)) - .025; const yt = Math.max(roofY(x), yb + .001); const wb = hw(x) * .955; const wt = wb * gl.tumble;
    const crown = .055 * Math.min(1, (yt - yb) / .3);
    const c = catmull([[wb, yb], [lerp(wb, wt, .55), lerp(yb, yt, .58)], [wt * 1.0, yt - crown], [wt * .62, yt - crown * .22], [0, yt]], 40);
    return c[Math.round(t * 40)];
  };
  /* Habitacle vu à travers les vitres : plancher, planche de bord et volant crème, sièges rouge foncé */
  function buildCabin(c: NonNullable<CarSpec['cabin']>) {
    const seat = new MeshStandardMaterial({ color: c.seat, roughness: .55 });
    const trim = new MeshStandardMaterial({ color: c.trim, roughness: .45 });
    const floorMat = new MeshStandardMaterial({ color: 0x1d1514, roughness: .9, side: DoubleSide });
    body.add(new Mesh(loft(stations(gl.xa, gl.xd, 24), (x): Pt[] => { const y = Math.min(be(x), de(x)) - .02; const w = hw(x) * .9; return [[w, y], [0, y]]; }, { caps: false }), floorMat));
    const y0 = (x: number) => Math.min(be(x), de(x)) - .02;
    const box = (x: number, y: number, z: number, sx: number, sy: number, sz: number, mat: Material, lean = 0) => { const m = new Mesh(new BoxGeometry(sx, sy, sz, 2, 2, 2), mat); m.position.set(x, y, z); m.rotation.z = lean; body.add(m); return m; };
    /* planche de bord crème sous le pare-brise */
    box(gl.xa + .42, y0(gl.xa + .42) + .05, 0, .22, .08, hw(gl.xa + .42) * 1.5, trim);
    /* volant monobranche crème, à gauche */
    const wheel = new Mesh(new TorusGeometry(.18, .013, 8, 36), trim); wheel.position.set(gl.xa + .68, y0(gl.xa + .68) + .17, .38); wheel.rotation.set(0, Math.PI / 2, -.55); body.add(wheel);
    const spoke = new Mesh(new CylinderGeometry(.009, .009, .18, 8), trim); spoke.position.set(gl.xa + .7, y0(gl.xa + .7) + .1, .38); spoke.rotation.x = .15; body.add(spoke);
    /* dossiers avant et banquette arrière */
    [.36, -.36].forEach((z) => box(.32, y0(.32) + .17, z, .12, .36, .46, seat, -.2));
    box(1.3, y0(1.3) + .16, 0, .13, .34, 1.24, seat, -.24);
    /* tablette arrière */
    box(1.72, y0(1.72) + .03, 0, .36, .02, hw(1.72) * 1.6, seat);
  }
  const glassGeo = loft(stations(gl.xa - .05, gl.xd + .05, 54), (x) => { const out: Pt[] = []; for (let k = 40; k >= 0; k--) { const [z, y] = gh(x, k / 40); out.push([z, y]); } return out.reverse().map((p) => p).reverse(); }, { caps: false });
  /* vitrage : sombre et réfléchissant, ou teinté et transparent quand l'habitacle est modélisé */
  const glass = new Mesh(glassGeo, s.cabin
    ? new MeshPhysicalMaterial({ side: DoubleSide, color: s.cabin.glass, roughness: .04, clearcoat: 1, clearcoatRoughness: .03, transparent: true, opacity: s.cabin.opacity, depthWrite: false, envMap: env, envMapIntensity: 1.1 })
    : new MeshPhysicalMaterial({ side: DoubleSide, color: 0x0d1513, metalness: .2, roughness: .08, clearcoat: 1, clearcoatRoughness: .05, envMap: env, envMapIntensity: .8 }));
  if (s.cabin) { glass.renderOrder = 4; buildCabin(s.cabin); }
  body.add(glass);

  const roofMat = s.roof ? new MeshPhysicalMaterial({ ...s.roof, clearcoat: .6, clearcoatRoughness: .2, envMap: env, envMapIntensity: .9, side: DoubleSide }) : new MeshPhysicalMaterial({ ...s.paint, clearcoat: 1, clearcoatRoughness: .07, envMap: env, envMapIntensity: 1.15, side: DoubleSide });
  const pillarMat: Material = s.roof || s.pillarChrome ? new MeshStandardMaterial({ color: 0xcfd2d2, metalness: .95, roughness: .2, envMap: env }) : roofMat;

  /* Pièce posée sur l'habitacle : une grille (x, t) légèrement décollée */
  function patch(mat: Material, f: (u: number, v: number) => Pt, nu = 16, nv = 8) {
    const pos: number[] = []; const idx: number[] = [];
    for (let i = 0; i <= nu; i++) for (let j = 0; j <= nv; j++) {
      const [x, t] = f(i / nu, j / nv); const [z, y] = gh(x, Math.min(1, Math.max(0, t)));
      pos.push(x, y + .004, z * 1.012 + (z > 0 ? .002 : 0));
    }
    for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) { const a = i * (nv + 1) + j; idx.push(a, a + nv + 1, a + 1, a + 1, a + nv + 1, a + nv + 2); }
    const g = new BufferGeometry(); g.setAttribute('position', new Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    const a = new Mesh(g, mat); const b = a.clone(); b.scale.z = -1; body.add(a, b);
  }
  const railT = .72;
  /* toit */
  patch(roofMat, (u, v) => [lerp(gl.xb + .02, gl.xc + .0, u), lerp(railT, 1, v)], 24, 8);
  /* montants de pare-brise et de lunette */
  /* montant de pare-brise : du coin de la baie jusqu'au coin du toit */
  patch(pillarMat, (u, v) => [lerp(gl.xa + .1, gl.xb + .06, u), lerp(.03, railT - .05, u) + v * .1], 18, 2);
  /* montant de lunette : du coin du toit jusqu'au coin de la malle */
  patch(s.pillarChrome ? roofMat : pillarMat, (u, v) => [lerp(gl.xc - .02, gl.xd - .14, u), lerp(railT - .05, .03, u) + v * .075], 18, 2);
  patch(pillarMat, (u, v) => [lerp(gl.xb, gl.xc, u), lerp(railT - .06, railT + .01, v)], 16, 2);
  /* montants centraux */
  s.pillars.forEach(([x0, x1, x2, x3]) => patch(pillarMat, (u, v) => [lerp(lerp(x0, x2, v), lerp(x1, x3, v), u), v * railT], 3, 6));
  /* custode */
  const [c0, c1, c2, c3] = s.cPillar;
  patch(s.roof ? pillarMat : roofMat, (u, v) => [lerp(lerp(c0, c2, v), lerp(c1, c3, v), u), v * railT], 10, 8);

  /* Joncs chromés */
  const side = (zs: number[]) => zs.forEach((sg) => {
    /* tour de vitre */
    const pts: P3[] = []; for (let i = 0; i <= 20; i++) { const x = lerp(gl.xa + .1, gl.xd - .25, i / 20); const [z, y] = gh(x, 0); pts.push([x, y + .004, sg * (z + .006)]); }
    body.add(tube(pts, .009, chrome));
    s.trim.forEach(([xa, ya, xb, yb]) => {
      const q: P3[] = []; for (let i = 0; i <= 24; i++) { const x = lerp(xa, xb, i / 24); q.push([x, lerp(ya, yb, i / 24), sg * (hw(x) + .004)]); }
      /* le jonc s'interrompt aux roues */
      let cur: P3[] = [];
      q.forEach((p) => {
        const hit = s.axles.some((ax, k) => Math.hypot(p[0] - ax, p[1] - s.wheelR) < s.arch[k][0] + .03 && p[1] < s.arch[k][1]);
        if (hit) { if (cur.length > 1) body.add(tube(cur, .011, chrome)); cur = []; } else cur.push(p);
      });
      if (cur.length > 1) body.add(tube(cur, .011, chrome));
    });
  });
  side([1, -1]);
  [1, -1].forEach((sg) => {
    const pts: P3[] = []; for (let i = 0; i <= 16; i++) { const x = lerp(gl.xa + .25, gl.xd - .35, i / 16); const [z, y] = gh(x, railT - .06); pts.push([x, y, sg * (z + .012)]); }
    body.add(tube(pts, .006, chrome));
    const m = new Mesh(new SphereGeometry(.05, 12, 8), chrome); m.scale.set(.6, .7, 1); const [z, y] = gh(gl.xa + .1, .06); m.position.set(gl.xa + .1, y + .05, sg * (z + .1)); body.add(m);
    const st = new Mesh(new CylinderGeometry(.006, .008, .08, 6), chrome); st.position.set(gl.xa + .1, y + .02, sg * (z + .055)); st.rotation.x = sg * 1.1; body.add(st);
  });

  /* Pare-chocs */
  const bumper = (x0: number, y: number, depth: number, r: number, flat: number, wrap: number) => {
    const pts: P3[] = []; const sg = Math.sign(x0);
    for (let i = 0; i <= 26; i++) { const t = i / 26 * 2 - 1; const w0 = hw(x0 - sg * .35); const z = t * w0 * 1.03; pts.push([x0 + sg * Math.abs(depth) - sg * Math.pow(Math.abs(t), 4) * wrap, y, z]); }
    body.add(tube(pts, r, chrome, flat));
  };

  /* Feux avant : le matériau reste partagé pour pouvoir les allumer */
  const lens = new MeshStandardMaterial({ color: s.lensColor || 0xf0e8d0, emissive: 0xf2b632, emissiveIntensity: 0, metalness: .85, roughness: .12, envMap: env, envMapIntensity: 1.5 });
  const lampPoints: P3[] = [];
  const rrect = (w: number, h: number, r: number) => { const a = new Shape(); a.moveTo(-w / 2 + r, -h / 2); a.lineTo(w / 2 - r, -h / 2); a.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r); a.lineTo(w / 2, h / 2 - r); a.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2); a.lineTo(-w / 2 + r, h / 2); a.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r); a.lineTo(-w / 2, -h / 2 + r); a.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2); return a; };
  const plate = (x: number, y: number, z: number, w: number, h: number, r: number, mat: Material, thick = .02, yaw = 0) => {
    const g = new ExtrudeGeometry(rrect(w, h, r), { depth: thick, bevelEnabled: true, bevelThickness: .006, bevelSize: .006, bevelSegments: 2, curveSegments: 8 });
    const m = new Mesh(g, mat); m.position.set(x, y, z); m.rotation.y = -Math.PI / 2 + yaw; body.add(m); return m;
  };
  const amber = new MeshStandardMaterial({ color: 0xc97d1c, roughness: .22, metalness: .3, envMap: env, emissive: 0x7a3d05, emissiveIntensity: .15 });
  const red = new MeshStandardMaterial({ color: 0x8c1414, roughness: .25, emissive: 0x500707, emissiveIntensity: .5 });
  const nx = -s.L / 2; const tx = s.L / 2;

  if (s.lampKind === 'mercedes') {
    /* calandre haute, phares verticaux, double pare-chocs */
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
    /* feux arrière */
    [1, -1].forEach((sg) => { const m = plate(tx - .012, .72, sg * .6, .42, .15, .02, red, .014); m.rotation.y = Math.PI / 2; });
    const tp = new Mesh(new BoxGeometry(.012, .014, .62), chrome); tp.position.set(tx + .004, .84, 0); body.add(tp);
  } else if (s.lampKind === 'peugeot') {
    /* un bandeau sombre : phares trapézoïdaux et calandre à fines barrettes */
    plate(nx + .02, .7, 0, 1.46, .23, .02, dark, .03);
    for (let i = 0; i < 6; i++) { const b = new Mesh(new BoxGeometry(.014, .011, .62), chrome); b.position.set(nx - .018, .625 + i * .03, 0); body.add(b); }
    const grilleFrame = new Mesh(new BoxGeometry(.012, .19, .64), chrome); grilleFrame.position.set(nx - .006, .7, 0); body.add(grilleFrame);
    const grilleIn = new Mesh(new BoxGeometry(.012, .17, .62), dark); grilleIn.position.set(nx - .012, .7, 0); body.add(grilleIn);
    [1, -1].forEach((sg) => {
      /* phare : trapèze penché, l'arête haute plus courte vers l'intérieur */
      const a = new Shape(); a.moveTo(-.2, -.092); a.lineTo(.2, -.092); a.lineTo(.2, .1); a.lineTo(-.13, .1); a.closePath();
      const rim = new Mesh(new ExtrudeGeometry(a, { depth: .012, bevelEnabled: true, bevelSize: .012, bevelThickness: .004, bevelSegments: 1 }), chrome);
      const l = new Mesh(new ExtrudeGeometry(a, { depth: .012, bevelEnabled: false }), lens);
      [rim, l].forEach((m) => { m.position.set(nx - .012, .7, sg * .535); m.rotation.y = -Math.PI / 2; if (sg < 0) m.scale.x = -1; body.add(m); });
      l.position.x -= .014;
      /* clignotant sous le phare */
      const t = new Mesh(new BoxGeometry(.014, .045, .3), amber); t.position.set(nx - .005, .555, sg * .53); body.add(t);
      /* feux arrière verticaux */
      const rr = plate(tx - .015, .76, sg * .6, .2, .24, .02, red, .012); rr.rotation.y = Math.PI / 2;
    });
    lampPoints.push([nx - .03, .7, .535], [nx - .03, .7, -.535]);
    bumper(nx + .03, .47, .06, .027, .85, .5);
    bumper(tx - .03, .5, .06, .027, .85, .5);
    [1, -1].forEach((sg) => { const o = new Mesh(new BoxGeometry(.05, .13, .045), chrome); o.position.set(nx - .045, .46, sg * .32); body.add(o); });
    const lion = new Mesh(new CylinderGeometry(.028, .028, .012, 16), chrome); lion.rotation.z = Math.PI / 2; lion.position.set(nx - .03, .845, 0); body.add(lion);
  } else {
    /* DS 21, d'après les photos : nez large et arrondi, double optique (grande à l'extérieur, petite à l'intérieur)
       aux ampoules jaunes sous un globe, clignotants aux angles, pare-chocs à butoirs, prise d'air noire ;
       poupe effilée : feux rouges rectangulaires, plaque, chevrons dorés et monogramme DS21 sur la malle,
       feux en trompette en haut des montants arrière. */
    const gold = new MeshStandardMaterial({ color: 0xc8a24c, metalness: 1, roughness: .26, envMap: env, envMapIntensity: 1.3 });
    const globe = new MeshPhysicalMaterial({ color: 0xffffff, roughness: .02, transparent: true, opacity: .2, clearcoat: 1, clearcoatRoughness: .02, envMap: env, envMapIntensity: 1.6, depthWrite: false });
    const crease = new MeshBasicMaterial({ color: 0x2b2e2e });
    /* x de la surface pour une demi-largeur donnée, au nez et à la poupe */
    const surfX = (z: number, front: boolean) => {
      let a = front ? nx : 1.2; let b = front ? -1.5 : tx;
      for (let k = 0; k < 30; k++) { const m = (a + b) / 2; if ((hw(m) >= z) === front) b = m; else a = m; }
      return (a + b) / 2;
    };
    /* hauteur du dessus de la caisse à une distance z de l'axe */
    const topY = (x: number, z: number) => {
      const sec = halfSection(x);
      for (let i = sec.length - 1; i > 0; i--) { const [z1, y1] = sec[i]; const [z0, y0] = sec[i - 1]; if (z0 >= z && z1 <= z) return lerp(y1, y0, (z - z1) / Math.max(1e-6, z0 - z1)); }
      return de(x);
    };
    /* orientation (autour de Y) d'un élément posé sur la face avant, pour qu'il regarde selon la normale de l'aile */
    const yawAt = (x: number) => { const d = (hw(x + .01) - hw(x - .01)) / .02; return Math.atan2(1, Math.max(.001, d)); };

    [1, -1].forEach((sg) => {
      const pods: [number, number][] = [[.66, .085], [.47, .068]];
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
      const fair = new Mesh(new SphereGeometry(1, 36, 18), globe); fair.scale.set(.05, .095, .2); fair.position.set(xm, .635, sg * zm); fair.rotation.y = sg * yawAt(xm); fair.renderOrder = 6; body.add(fair);
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
    bumper(nx + .04, .41, .05, .03, .8, .7);
    const v: P3[] = [[nx - .03, .41, -.12], [nx - .045, .365, 0], [nx - .03, .41, .12]]; body.add(tube(v, .012, chrome));
    const intake = new Mesh(new BoxGeometry(.03, .06, .9), dark); intake.position.set(nx + .07, .335, 0); body.add(intake);
    bumper(tx - .05, .46, .06, .028, .8, .62);
    /* plaque arrière (sans inscription), poignée de malle */
    const xp = surfX(.2, false);
    const plateBox = new Mesh(new BoxGeometry(.02, .11, .5), black); plateBox.position.set(xp - .004, .6, 0); body.add(plateBox);
    const handle = new Mesh(new CapsuleGeometry(.012, .05, 4, 8), chrome); handle.rotation.x = Math.PI / 2; handle.position.set(xp - .03, .7, 0); body.add(handle);
    /* chevrons dorés sur la malle, pointe vers l'avant ; monogramme DS21 à droite */
    const lay = (m: Mesh, x: number, z: number, lift = .004) => {
      const slope = (topY(x + .02, Math.abs(z)) - topY(x - .02, Math.abs(z))) / .04;
      const g = new Group(); g.position.set(x, topY(x, Math.abs(z)) + lift, z); g.rotation.z = Math.atan(slope); m.rotation.x = -Math.PI / 2; g.add(m); body.add(g);
    };
    const chev = new Shape(); chev.moveTo(.012, -.075); chev.lineTo(-.02, 0); chev.lineTo(.012, .075); chev.lineTo(.026, .075); chev.lineTo(-.006, 0); chev.lineTo(.026, -.075); chev.closePath();
    const chevG = new ExtrudeGeometry(chev, { depth: .004, bevelEnabled: false });
    [0, .042].forEach((dx) => lay(new Mesh(chevG, gold), 2.06 + dx, 0));
    const ds21 = canvasTex(256, 64, (g, w, h) => { g.clearRect(0, 0, w, h); g.fillStyle = '#d6b25c'; g.font = 'italic 700 52px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('DS21', w / 2, h / 2 + 2); });
    lay(new Mesh(new PlaneGeometry(.2, .05), new MeshBasicMaterial({ map: ds21, transparent: true, depthWrite: false })), 2.2, -.33, .006);
  }

  /* Roues */
  const tireMat = new MeshStandardMaterial({ color: 0x0c0c0c, roughness: .82 });
  const hubMap = hubTexture(s.hub, s.hubTint);
  const hubMat = new MeshStandardMaterial({ map: hubMap, metalness: .85, roughness: .32, envMap: env, envMapIntensity: 1.1 });
  const rimMat = chrome;
  const prof: Pt[] = [[.0, -.5], [.72, -.5], [.93, -.42], [1, -.22], [1, .22], [.93, .42], [.72, .5], [0, .5]];
  const tireG = new LatheGeometry(prof.map(([r, h]) => new Vector2(r * s.wheelR, h * s.wheelW)), 36);
  const wheels: Group[] = [];
  s.axles.forEach((ax, a) => {
    [1, -1].forEach((sg) => {
      const w = new Group(); w.position.set(ax, s.wheelR, sg * s.trackZ[a]);
      const spin = new Group(); w.add(spin);
      const tire = new Mesh(tireG, tireMat); tire.rotation.x = Math.PI / 2; spin.add(tire);
      const rim = new Mesh(new TorusGeometry(s.wheelR * .66, .012, 8, 36), rimMat); rim.position.z = sg * s.wheelW * .49; spin.add(rim);
      const hub = new Mesh(new CircleGeometry(s.wheelR * .64, 36), hubMat); hub.position.z = sg * s.wheelW * .505; if (sg < 0) hub.rotation.y = Math.PI; spin.add(hub);
      if (s.hub === 'ds') { const dome = new Mesh(new SphereGeometry(s.wheelR * .45, 28, 12, 0, Math.PI * 2, 0, Math.PI / 2), chrome); dome.rotation.x = sg * Math.PI / 2; dome.scale.y = .32; dome.position.z = sg * s.wheelW * .5; spin.add(dome); }
      root.add(w); wheels.push(spin);
    });
  });
  return { root, body, wheels, lens, lampPoints, L: s.L, W: s.W, H: s.H, wheelR: s.wheelR };
}

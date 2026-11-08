/* Le parking en vraie 3D (three.js). Les voitures sont des représentations graphiques modélisées
   dans carmodels.ts, en attendant de nouvelles photos. Ce module est chargé à la demande. */
import {
  WebGLRenderer, Scene, Group, Mesh, PlaneGeometry, BoxGeometry,
  MeshStandardMaterial, MeshBasicMaterial, CanvasTexture, Fog, Color,
  SRGBColorSpace, RepeatWrapping, AdditiveBlending, Sprite, SpriteMaterial, Vector3,
  type Object3D,
} from 'three';
import { buildCar } from './carmodels';
import { SPECS, type CarModelKey } from './carspecs';
import { addStudioLights, carLightIntensity, configureRenderer, createCamera, createCarLight } from './presentation';
import { release, studioEnvironment } from './studio';

export interface ParkingCar {
  /** Numéro de la place, peint au sol. */
  n: number;
  model: CarModelKey;
  /** 'rise' : la voiture se lève sur sa suspension au survol (DS). */
  behaviour: 'roll' | 'rise';
}

export interface ParkingOptions {
  reduced: boolean;
  start?: number;
  onReady?: () => void;
}

export type ParkingEngine = ReturnType<typeof createParking>;

const S = 4.7;             /* écart entre deux places */
/* Places en épi. Toutes les voitures restent dans l'axe de leur place, tournées de PARK_YAW (trois-quarts avant) :
   les trois voitures visibles sont avancées en rang à l'entrée de leur place, la voiture active un peu plus (REST de plus
   que ses voisines) ; fiche ouverte, les voisines reculent dans leur place. Une voiture se place donc par une seule
   distance `d` le long de l'axe (place()). Avancer dans une place en épi décale aussi la voiture vers la gauche : les
   voisines restent donc presque aussi avancées que la voiture active, pour que les trois voitures gardent le même écart
   entre elles, et les places sont décalées de BAY_OX pour centrer le rang face à la caméra. Lignes au sol, numéros,
   piliers et néons suivent. */
const PARK_YAW = .9;
const PARK_Z = -3.1;                                /* profondeur du centre d'une voiture garée */
const BAY_TILT = PARK_YAW - Math.PI / 2;            /* inclinaison de l'axe des places (radians) */
const AX = [Math.sin(BAY_TILT), Math.cos(BAY_TILT)]; /* vers l'avant de la place (l'allée), en x et z */
const OUT = 4;                                      /* la voiture active avance d'autant dans sa place */
const REST = .7;                                    /* ses voisines un peu moins */
const OUT_OPEN = .5;                                /* … et d'un peu plus quand sa fiche est ouverte */
const OUT_HOVER = .45;                              /* survolée, elle avance encore un peu */
const BACK_OPEN = 1.2;                              /* fiche ouverte, les voisines reculent d'autant */
const BAY_OX = -(OUT - REST / 2) * AX[0] + .35;     /* le rang (voiture active et voisines) centré face à la caméra */
const bayX = (z: number) => BAY_OX + (z - PARK_Z) * Math.tan(BAY_TILT); /* axe d'une place à la profondeur z */
const place = (d: number) => [BAY_OX + d * AX[0], PARK_Z + d * AX[1]];  /* centre d'une voiture avancée de d */
const BAY_BACK = -6.1;                              /* fond de la place, derrière les voitures même reculées */
const BAY_FRONT = 4;                                /* entrée de la place, côté allée */
const EXIT = 3.9;                                   /* élan supplémentaire de la voiture qui sort de l'écran pour changer de côté */
const NUM_Z = 3.5;                                  /* numéro peint à l'entrée de la place */
const WALL_Z = -7.65;
const N = 3;
const damp = (a: number, b: number, k: number, dt: number) => a + (b - a) * (1 - Math.exp(-k * dt));
const wrap = (v: number) => { const h = N / 2; return ((((v + h) % N) + N) % N) - h; };
const smooth = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

function canvas(w: number, h: number, draw: (g: CanvasRenderingContext2D, w: number, h: number) => void) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d')!, w, h); return c; }
function tex(c: HTMLCanvasElement, repeat?: [number, number]) { const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; t.anisotropy = 8; if (repeat) { t.wrapS = t.wrapT = RepeatWrapping; t.repeat.set(repeat[0], repeat[1]); } return t; }
function speckle(base: string, amount: number, n = 512) {
  return canvas(n, n, (g, w, h) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    const d = g.getImageData(0, 0, w, h); const p = d.data;
    for (let i = 0; i < p.length; i += 4) { const v = (Math.random() - .5) * amount; p[i] += v; p[i + 1] += v; p[i + 2] += v; }
    g.putImageData(d, 0, 0);
    for (let i = 0; i < 26; i++) {
      const x = Math.random() * w, y = Math.random() * h, r = 30 + Math.random() * 110;
      const gr = g.createRadialGradient(x, y, 0, x, y, r);
      const k = Math.random() > .5 ? '255,255,255' : '0,0,0';
      gr.addColorStop(0, `rgba(${k},.035`.concat(')')); gr.addColorStop(1, `rgba(${k},0)`);
      g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2);
    }
  });
}
function softBlob() {
  return canvas(256, 256, (g, w, h) => {
    const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.45, 'rgba(255,255,255,.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
  });
}

export function createParking(canvasEl: HTMLCanvasElement, cars: ParkingCar[], opts: ParkingOptions) {
  const motion = !opts.reduced;
  const renderer = new WebGLRenderer({ canvas: canvasEl, antialias: true, alpha: false, powerPreference: 'high-performance' });
  configureRenderer(renderer);
  const fogColor = new Color('#0c1511');
  renderer.setClearColor(fogColor, 1);
  const scene = new Scene();
  scene.fog = new Fog(fogColor, 15, 36);
  const camera = createCamera();

  /* --- Le lieu --- */
  const floorTex = tex(speckle('#172a22', 18), [10, 10]);
  /* Le sol est légèrement transparent : le lieu entier est dupliqué en miroir dessous, comme dans une résine brillante. */
  const floor = new Mesh(new PlaneGeometry(90, 70), new MeshStandardMaterial({ map: floorTex, roughness: .68, metalness: .05, transparent: true, opacity: .87 }));
  floor.rotation.x = -Math.PI / 2; floor.position.set(0, 0, 8); floor.renderOrder = 1;
  scene.add(floor);

  const ceilTex = tex(speckle('#2a2e27', 10), [12, 5]);
  const ceilMat = new MeshBasicMaterial({ map: ceilTex, color: 0x8a8d84 });
  const doorTex = tex(canvas(1024, 512, (g, w, h) => {
    g.fillStyle = '#1b2e25'; g.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 26) { g.fillStyle = 'rgba(237,233,223,.12)'; g.fillRect(0, y, w, 2); g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(0, y + 2, w, 5); }
    g.fillStyle = '#0a110d'; g.fillRect(0, 0, 36, h); g.fillRect(w - 36, 0, 36, h);
    g.fillStyle = 'rgba(237,233,223,.2)'; g.fillRect(36, 0, 3, h); g.fillRect(w - 39, 0, 3, h);
  }), [14, 1]);
  const wallMat = new MeshStandardMaterial({ map: doorTex, roughness: .55, metalness: .1 });
  const paintMat = new MeshBasicMaterial({ color: 0xdedbcd, transparent: true, opacity: .82, depthWrite: false });
  const pillarTex = tex(canvas(256, 512, (g, w, h) => {
    g.fillStyle = '#34352f'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 2600; i++) { g.fillStyle = `rgba(${Math.random() > .5 ? '255,255,255' : '0,0,0'},.05)`; g.fillRect(Math.random() * w, Math.random() * h, 2, 2); }
    g.fillStyle = '#ede9df'; g.fillRect(0, h - 74, w, 44);
    g.fillStyle = '#b39a70'; g.fillRect(0, h - 28, w, 12);
  }));
  const pillarMat = new MeshStandardMaterial({ map: pillarTex, roughness: .8 });
  const neonOff = new MeshBasicMaterial({ color: 0xf2f2e6 });
  const beamMat = new MeshStandardMaterial({ color: 0x2a302a, roughness: 1 });
  const glowTex = tex(softBlob());

  /* Une copie du lieu au-dessus du sol, une copie en miroir en dessous */
  const items: { g: Group; k: number }[] = [];
  function buildWorld(mirrored: boolean) {
    const root = new Group();
    if (mirrored) root.scale.y = -1;
    const ceil = new Mesh(new PlaneGeometry(90, 30), ceilMat);
    ceil.rotation.x = Math.PI / 2; ceil.position.set(0, 3.7, 8); root.add(ceil);
    const wall = new Mesh(new PlaneGeometry(S * 14, 3.7), wallMat);
    wall.position.set(0, 1.85, -8); root.add(wall);
    for (let k = -7; k <= 7; k++) {
      const g = new Group();
      const pillar = new Mesh(new BoxGeometry(.62, 3.7, .62), pillarMat);
      pillar.position.set(S / 2 + bayX(WALL_Z), 1.85, WALL_Z); g.add(pillar);
      const beam = new Mesh(new BoxGeometry(.44, .36, 26), beamMat);
      beam.position.set(S / 2 + bayX(WALL_Z), 3.52, 8); g.add(beam);
      if (!mirrored) {
        const neon = new Mesh(new BoxGeometry(2.6, .05, .12), neonOff);
        neon.position.set(bayX(-4.2), 3.42, -4.2); g.add(neon);
        const neon2 = new Mesh(new BoxGeometry(2.6, .05, .12), neonOff);
        neon2.position.set(bayX(-.9), 3.42, -.9); g.add(neon2);
      }
      if (!mirrored) {
        /* lignes au sol : places en épi, dans l'axe des voitures garées, du fond de la place jusqu'à l'allée */
        const zc = (BAY_BACK + BAY_FRONT) / 2;
        const line = new Mesh(new PlaneGeometry(.075, (BAY_FRONT - BAY_BACK) / Math.cos(BAY_TILT)), paintMat);
        line.rotation.x = -Math.PI / 2; line.rotation.z = BAY_TILT; line.position.set(S / 2 + bayX(zc), .012, zc); line.renderOrder = 2;
        g.add(line);
        /* fond de la place, parallèle au mur, entre les deux lignes */
        const stop = new Mesh(new PlaneGeometry(S - .7, .07), paintMat);
        stop.rotation.x = -Math.PI / 2; stop.position.set(bayX(BAY_BACK), .012, BAY_BACK); stop.renderOrder = 2;
        g.add(stop);
      }
      items.push({ g, k });
      root.add(g);
    }
    scene.add(root);
  }
  buildWorld(false); buildWorld(true);

  /* --- Reflets --- */
  const envRT = studioEnvironment(renderer);
  const env = envRT.texture;
  addStudioLights(scene);

  const shadowTex = tex(canvas(256, 256, (g, w, h) => {
    const d = g.createImageData(w, h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const a = Math.abs(x / w - .5) * 2; const b = Math.abs(y / h - .5) * 2;
      const r = Math.pow(Math.pow(a, 4) + Math.pow(b, 4), 1 / 4);
      const v = Math.max(0, Math.min(1, (1 - r) / .5));
      const i = (y * w + x) * 4; d.data[i] = d.data[i + 1] = d.data[i + 2] = 0; d.data[i + 3] = v * v * (3 - 2 * v) * 255;
    }
    g.putImageData(d, 0, 0);
  }));
  const beamTex = tex(canvas(256, 128, (g, w, h) => {
    const d = g.createImageData(w, h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const u = x / w; const spread = .1 + (1 - u) * .42; const off = Math.abs(y / h - .5) / spread;
      const a = Math.max(0, 1 - off * off) * Math.pow(u, 1.3);
      const i = (y * w + x) * 4; d.data[i] = d.data[i + 1] = d.data[i + 2] = 255; d.data[i + 3] = a * 255;
    }
    g.putImageData(d, 0, 0);
  }));

  /* --- Les voitures --- */
  const units = cars.map((car, i) => {
    const model = buildCar(SPECS[car.model], env);
    const group = new Group();
    group.add(model.root);
    /* reflet : la même voiture, retournée sous le sol */
    const mirror = model.root.clone();
    mirror.scale.y = -1;
    const mirrorRoot = new Group(); mirrorRoot.add(mirror); group.add(mirrorRoot);
    const mirrorWheels: Object3D[] = [];
    mirror.traverse((o) => { if (o.parent && o.parent.parent === mirror && o.children.length && o.parent.children[0] === o && o.parent !== mirror) mirrorWheels.push(o); });
    const mirrorBody = mirror.children[0];
    const shadow = new Mesh(new PlaneGeometry(model.L * 1.16, model.W * 1.32), new MeshBasicMaterial({ map: shadowTex, transparent: true, opacity: .95, depthWrite: false, color: 0xffffff }));
    shadow.rotation.x = -Math.PI / 2; shadow.position.y = .012; shadow.renderOrder = 2;
    group.add(shadow);

    const nose = model.lampPoints;
    const lamps = nose.map((l) => {
      const sp = new Sprite(new SpriteMaterial({ map: glowTex, color: 0xf2b632, blending: AdditiveBlending, transparent: true, opacity: 0, depthWrite: false }));
      sp.position.set(l[0] - .06, l[1], l[2]); sp.scale.setScalar(.62); sp.renderOrder = 5;
      group.add(sp); return sp;
    });
    const beam = new Mesh(new PlaneGeometry(6.2, 3.8), new MeshBasicMaterial({ map: beamTex, color: 0xf2b632, transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false }));
    beam.rotation.x = -Math.PI / 2; beam.position.set(-model.L / 2 - 3.05, .025, 0); beam.renderOrder = 3;
    group.add(beam);

    const numTex = tex(canvas(512, 512, (g, w, h) => {
      g.clearRect(0, 0, w, h); g.fillStyle = '#e4e1d6'; g.font = '700 430px "Stardos Stencil", Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(car.n), w / 2, h / 2 + 16);
    }));
    const num = new Mesh(new PlaneGeometry(1.7, 1.7), new MeshBasicMaterial({ map: numTex, transparent: true, opacity: .22, depthWrite: false }));
    num.rotation.x = -Math.PI / 2; num.rotation.z = BAY_TILT; num.position.set(bayX(NUM_Z), .014, NUM_Z); num.renderOrder = 2;
    scene.add(num);

    const light = createCarLight();
    scene.add(light);
    scene.add(group);
    return { i, car, model, group, mirrorWheels, mirrorBody, lamps, beam, num, light, hover: 0, spin: 0, lastX: 0, lastZ: 0, tgtHover: 0, yaw: 1.1, init: false };
  });

  const EYE = { y: 2.55 };

  /* --- État --- */
  const st = { pos: opts.start || 0, target: opts.start || 0, drag: false, dragFrom: opts.start || 0, hover: -1, mx: 0, my: 0, smx: 0, smy: 0, open: 0, openT: 0, inset: 0, w: 1, h: 1, portrait: false, dist: 16, cx: 0, visible: true, intro: motion ? 0 : 1, speed: 0 };
  let last = performance.now(); let raf = 0; let shown = false;
  const v = new Vector3();

  function resize() {
    const r = canvasEl.parentElement!.getBoundingClientRect();
    st.w = Math.max(1, r.width); st.h = Math.max(1, r.height);
    renderer.setSize(st.w, st.h, false);
    camera.aspect = st.w / st.h;
    st.portrait = camera.aspect < 1;
    const halfW = st.portrait ? 2.75 : 7.05;
    st.dist = Math.max(11, halfW / (Math.tan((camera.fov / 2) * Math.PI / 180) * camera.aspect));
    camera.updateProjectionMatrix();
  }
  resize();
  const ro = window.ResizeObserver ? new ResizeObserver(resize) : null;
  if (ro) ro.observe(canvasEl.parentElement!);

  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    /* rien à dessiner hors écran ; la fiche ouverte laisse le parking visible, le rendu continue */
    if (!st.visible) { last = now; return; }
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    tick(dt);
    renderer.render(scene, camera);
    /* prête quand la première image est dessinée : c'est de là que comptent les 9 s avant la première alternance */
    if (!shown) { shown = true; opts.onReady?.(); }
  }

  let init = true;
  function tick(dt: number) {
    if (!st.drag) {
      const prev = st.pos;
      st.pos = motion ? damp(st.pos, st.target, 3.1, dt) : st.target;
      st.speed = dt > 0 ? (st.pos - prev) / dt : 0;
    }
    st.smx = damp(st.smx, st.mx, 3.2, dt); st.smy = damp(st.smy, st.my, 3.2, dt);
    st.openT = motion ? damp(st.openT, st.open ? 1 : 0, 3.4, dt) : st.open;
    st.intro = motion ? Math.min(1, st.intro + dt / 2.2) : 1;
    const intro = 1 - Math.pow(1 - st.intro, 3);

    /* l'allée défile */
    const shift = (((st.pos * S) % S) + S) % S;
    items.forEach((it) => { it.g.position.x = it.k * S - shift; });
    doorTex.offset.x = st.pos % 1;

    /* La caméra. Fiche ouverte (o → 1), elle centre la voiture choisie dans l'espace laissé libre :
       à gauche de la fiche en paysage, au-dessus en portrait. */
    const o = st.openT;
    const dist = st.dist * (1 + (st.portrait ? .06 : -.14) * o) * (1 + .1 * (1 - intro));
    const [carX, carZ] = place(OUT + OUT_OPEN * o + OUT_HOVER);
    const depth = dist - carZ; const tanH = Math.tan((camera.fov / 2) * Math.PI / 180);
    const openShift = o * (carX + (st.portrait ? 0 : st.inset * depth * tanH * camera.aspect));
    const lookY = st.portrait ? .75 - o * st.inset * depth * tanH : .85;
    const par = 1 - .6 * o;
    camera.position.set(st.smx * (st.portrait ? .5 : 1.1) * par + openShift + st.cx, EYE.y + st.smy * -.5 * par + (1 - intro) * .9, dist);
    camera.lookAt(openShift + st.smx * .25 * par + st.cx, lookY, 0);

    /* les voitures */
    units.forEach((u) => {
      const w = wrap(u.i - st.pos);
      const near = 1 - smooth(0, 1, Math.abs(w));
      const edge = 1 - smooth(1.3, 1.5, Math.abs(w));
      /* fiche ouverte : la voiture choisie reste allumée, le survol peut aussi allumer une voisine */
      u.tgtHover = st.hover === u.i || (st.open && near > .5) ? 1 : 0;
      u.hover = damp(u.hover, u.tgtHover, 5, dt);
      const chosen = o * near; const away = o * (1 - near);
      /* Dans l'axe de sa place : la voiture active avance un peu plus que ses voisines (encore plus fiche ouverte, ou survolée) ;
         fiche ouverte, les voisines reculent (leurs roues tournent en marche arrière). */
      const d = OUT - (1 - near) * lerp(REST, OUT, o) + chosen * OUT_OPEN + u.hover * OUT_HOVER - away * BACK_OPEN;
      /* toujours dans l'axe de la place ; seul l'élan de l'allée qui défile la fait légèrement pivoter */
      const yawT = PARK_YAW + Math.max(-.12, Math.min(.12, st.speed * .08)) * (1 - near * .3);
      u.yaw = init ? yawT : damp(u.yaw, yawT, 7, dt);
      const [px, z] = place(d);
      /* Au-delà de la voisine (|w| > 1), la voiture qui va changer de côté accélère vers le bord et sort de l'écran
         avant de réapparaître de l'autre côté, hors champ elle aussi : elle ne disparaît plus d'un coup. */
      const out = Math.min(1, Math.max(0, (Math.abs(w) - 1) / .5));
      const x = w * S + Math.sign(w) * EXIT * out * out + px;
      u.group.position.set(x, 0, z);
      u.group.rotation.y = u.yaw;
      u.group.visible = edge > .01;
      /* les roues tournent vraiment avec le déplacement */
      if (u.init) {
        const dist = (x - u.lastX) * Math.cos(u.yaw) - (z - u.lastZ) * Math.sin(u.yaw);
        const rot = dist / u.model.wheelR;
        u.spin += Math.abs(rot) < 2 ? rot : 0;
        u.model.wheels.forEach((m) => { m.rotation.z = u.spin; });
        u.mirrorWheels.forEach((m) => { m.rotation.z = u.spin; });
      }
      u.lastX = x; u.lastZ = z; u.init = true;
      /* La DS se lève sur sa suspension, les autres plongent légèrement */
      const rise = u.car.behaviour === 'rise' ? u.hover * .07 : u.hover * -.012;
      const pitch = st.speed * -.012 * near + (u.car.behaviour === 'rise' ? 0 : u.hover * .008);
      [u.model.body, u.mirrorBody].forEach((b) => { b.position.y = rise; b.rotation.z = pitch; });

      u.num.position.x = w * S + bayX(NUM_Z);
      u.num.material.opacity = (.16 + near * .3 + u.hover * .42) * edge * (1 - .5 * away);
      const fast = Math.min(1, Math.abs(st.speed) * .7);
      /* phares et lumière de la place s'allument en fondu, sans clignoter (le clignotement passait pour un défaut des néons) */
      const lampV = Math.max(u.hover, fast * near * .7) * edge;
      u.model.lens.emissiveIntensity = lampV * 3.2;
      u.lamps.forEach((sp) => { sp.material.opacity = lampV * .85; });
      u.beam.material.opacity = lampV * .3;
      u.light.position.x = x; u.light.position.z = z;
      u.light.intensity = carLightIntensity(near, u.hover) * edge * intro * (st.portrait ? .6 : 1) * (1 - .85 * away);
    });
    init = false;

    /* La voiture de trois-quarts (nez vers la caméra) paraît décalée : en portrait, et en paysage fiche ouverte,
       la caméra glisse pour centrer son encombrement projeté (à gauche de la fiche en paysage). */
    let target = 0;
    if (st.portrait || o > .001) {
      const a = units.reduce((b, u) => (Math.abs(wrap(u.i - st.pos)) < Math.abs(wrap(b.i - st.pos)) ? u : b));
      camera.updateMatrixWorld(); a.group.updateMatrixWorld(true);
      const L = a.model.L / 2; const W = a.model.W / 2; const H = a.model.H;
      let lo = Infinity; let hi = -Infinity;
      for (const [x, y, z] of [[-L, 0, W], [L, 0, W], [-L, 0, -W], [L, 0, -W], [-L, H, W], [L, H, W], [-L, H, -W], [L, H, -W]]) {
        v.set(x, y, z); a.group.localToWorld(v); v.project(camera); lo = Math.min(lo, v.x); hi = Math.max(hi, v.x);
      }
      const halfW = Math.tan((camera.fov / 2) * Math.PI / 180) * camera.aspect * (camera.position.z - a.group.position.z);
      const want = st.portrait ? 0 : -st.inset;
      target = (st.cx + ((lo + hi) / 2 - want) * halfW) * (st.portrait ? 1 : o);
    }
    st.cx = motion ? damp(st.cx, target, 4, dt) : target;
  }

  /* Qui est sous le pointeur ? On compare au rectangle projeté de chaque voiture. */
  function pick(cx: number, cy: number) {
    const r = canvasEl.getBoundingClientRect();
    const px = cx - r.left; const py = cy - r.top;
    let best = -1; let bestZ = -Infinity;
    units.forEach((u) => {
      if (Math.abs(wrap(u.i - st.pos)) > 1.35) return;
      const L = u.model.L / 2; const W = u.model.W / 2; const H = u.model.H;
      const pts = [[-L, 0, W], [L, 0, W], [-L, 0, -W], [L, 0, -W], [-L, H, W], [L, H, W], [-L, H, -W], [L, H, -W]].map(([a, b, c]) => {
        v.set(a, b, c); u.group.localToWorld(v); v.project(camera);
        return [(v.x + 1) / 2 * st.w, (1 - v.y) / 2 * st.h];
      });
      const xs = pts.map((p) => p[0]); const ys = pts.map((p) => p[1]);
      if (px >= Math.min(...xs) && px <= Math.max(...xs) && py >= Math.min(...ys) && py <= Math.max(...ys) && u.group.position.z > bestZ) { best = u.i; bestZ = u.group.position.z; }
    });
    return best;
  }

  const api = {
    get state() { return st; },
    go(i: number) {
      /* chemin le plus court sur la boucle */
      const cur = st.target; const base = Math.round(cur);
      const d = wrap(i - base);
      st.target = base + d;
    },
    step(d: number) { st.target = Math.round(st.target) + d; },
    active() { return ((Math.round(st.target) % N) + N) % N; },
    setHover(i: number) { st.hover = i; },
    pointer(nx: number, ny: number) { st.mx = nx; st.my = ny; },
    /* Un glissement change d'une seule voiture à la fois : il part de la voiture affichée
       (même si une alternance est en cours) et l'allée ne dépasse pas la place voisine. */
    drag(active: boolean) {
      st.drag = active;
      if (active) { st.dragFrom = Math.round(st.pos); return; }
      st.target = clamp(Math.round(st.pos + clamp(st.speed * .22, -.5, .5)), st.dragFrom - 1, st.dragFrom + 1);
    },
    dragBy(dx: number) { const d = dx / (st.portrait ? st.w * .72 : st.w * .36); const prev = st.pos; st.pos = clamp(st.pos - d, st.dragFrom - 1, st.dragFrom + 1); st.speed = (st.pos - prev) * 60; },
    open(v2: boolean) { st.open = v2 ? 1 : 0; },
    /** Part de la scène couverte par la fiche : sa largeur en paysage, sa hauteur en portrait (0 à 1). */
    inset(f: number) { st.inset = clamp(f, 0, .9); },
    pick,
    pause(p: boolean) { st.visible = !p; },
    start() { last = performance.now(); raf = requestAnimationFrame(frame); },
    /* Arrête la boucle et rend au GPU tout ce qui lui a été confié, contexte compris. */
    dispose() {
      cancelAnimationFrame(raf);
      if (ro) ro.disconnect();
      release(scene);
      envRT.dispose();
      renderer.dispose();
      if (!renderer.getContext().isContextLost()) renderer.forceContextLoss();
    },
  };
  return api;
}

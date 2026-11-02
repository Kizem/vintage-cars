/* Atelier de développement (ds.html, non publié) : une voiture seule, caméra orbitale et vues fixes,
   pour travailler le modèle à partir des photos. ?car=ds | p504 | w114 & view=<nom> */
import { ACESFilmicToneMapping, Color, DirectionalLight, HemisphereLight, Mesh, MeshStandardMaterial, PerspectiveCamera, CircleGeometry, Scene, SRGBColorSpace, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { buildCar } from './carmodels';
import { SPECS, type CarModelKey } from './carspecs';
import { studioEnvironment } from './studio';

const q = new URLSearchParams(location.search);
const key = (q.get('car') as CarModelKey) in SPECS ? (q.get('car') as CarModelKey) : 'ds';

const renderer = new WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = SRGBColorSpace;
renderer.toneMapping = ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
document.body.prepend(renderer.domElement);

const scene = new Scene();
scene.background = new Color(q.get('bg') || '#2a302c');
const env = studioEnvironment(renderer).texture;
scene.environment = null;
scene.add(new HemisphereLight(0xe6eadf, 0x16241c, .9));
const sun = new DirectionalLight(0xfff6e4, 1.6); sun.position.set(-3, 8, 7); scene.add(sun);
const ground = new Mesh(new CircleGeometry(9, 64), new MeshStandardMaterial({ color: 0x1c2621, roughness: .8 }));
ground.rotation.x = -Math.PI / 2; scene.add(ground);

const car = buildCar(SPECS[key], env);
scene.add(car.root);

/* Le nez est côté -X : vues nommées (position de la caméra), cible au centre de la voiture */
const views: Record<string, [number, number, number]> = {
  'trois-quarts avant': [-5.2, 1.6, 4.4],
  avant: [-7, 1.1, 0],
  profil: [0, 1.1, 7.5],
  'trois-quarts arrière': [5.2, 1.7, 4.4],
  arrière: [7, 1.2, 0],
  dessus: [0, 8, .01],
};
const camera = new PerspectiveCamera(30, 1, .1, 100);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, .7, 0);
controls.enableDamping = true;
const show = (name: string) => { camera.position.set(...views[name]); controls.update(); };
const nav = document.getElementById('views')!;
Object.keys(views).forEach((name) => { const b = document.createElement('button'); b.textContent = name; b.onclick = () => show(name); nav.append(b); });
show(q.get('view') && views[q.get('view')!] ? q.get('view')! : 'trois-quarts avant');

function resize() { renderer.setSize(innerWidth, innerHeight, false); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();
renderer.setAnimationLoop(() => { controls.update(); renderer.render(scene, camera); });

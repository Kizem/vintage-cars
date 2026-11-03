/* Atelier de développement (ds.html, non publié) : une voiture seule, caméra orbitale et vues fixes,
   pour travailler le modèle à partir des photos. ?car=ds | p504 | w114 & view=<nom> & bg=<couleur>
   Rendu, caméra et lumières viennent de presentation.ts, comme dans le parking : la voiture est éclairée
   comme sur la page quand elle est en face de la caméra. */
import { Color, Mesh, MeshStandardMaterial, CircleGeometry, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { buildCar } from './carmodels';
import { SPECS, type CarModelKey } from './carspecs';
import { addStudioLights, carLightIntensity, configureRenderer, createCamera, createCarLight, VIEWS, VIEW_TARGET } from './presentation';
import { studioEnvironment } from './studio';

const q = new URLSearchParams(location.search);
const key = (q.get('car') as CarModelKey) in SPECS ? (q.get('car') as CarModelKey) : 'ds';

const renderer = new WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
configureRenderer(renderer);
document.body.prepend(renderer.domElement);

const scene = new Scene();
scene.background = new Color(q.get('bg') || '#2a302c');
const env = studioEnvironment(renderer).texture;
addStudioLights(scene);
const light = createCarLight(); light.intensity = carLightIntensity(1, 0); scene.add(light);
const ground = new Mesh(new CircleGeometry(9, 64), new MeshStandardMaterial({ color: 0x1c2621, roughness: .8 }));
ground.rotation.x = -Math.PI / 2; scene.add(ground);

const car = buildCar(SPECS[key], env);
scene.add(car.root);

const camera = createCamera(100);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(...VIEW_TARGET);
controls.enableDamping = true;
const show = (name: string) => { camera.position.set(...VIEWS[name]); controls.update(); };
const nav = document.getElementById('views')!;
Object.keys(VIEWS).forEach((name) => { const b = document.createElement('button'); b.textContent = name; b.onclick = () => show(name); nav.append(b); });
show(q.get('view') && VIEWS[q.get('view')!] ? q.get('view')! : 'trois-quarts avant');

function resize() { renderer.setSize(innerWidth, innerHeight, false); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();
renderer.setAnimationLoop(() => { controls.update(); renderer.render(scene, camera); });

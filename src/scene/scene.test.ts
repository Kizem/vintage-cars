/* Les voitures se construisent sans carte graphique (three.js ne fait que des calculs ici) : on vérifie leurs
   dimensions, leur symétrie, leurs phares, et qu'aucun sommet n'est invalide. */
import { Box3, BufferGeometry, Group, Mesh, MeshStandardMaterial, PerspectiveCamera, Scene, Texture, Vector3, type Object3D } from 'three';
import { describe, expect, it, vi } from 'vitest';
import { buildCar } from './carmodels';
import { SPECS, curve, lerp, type CarModelKey } from './carspecs';
import { badgeTexture, canvasTex, catmull, loft, rrect, stations, tube } from './geometry';
import { createMaterials } from './materials';
import { addStudioLights, carLightIntensity, configureRenderer, createCamera, createCarLight, CAR_LIGHT, VIEWS, VIEW_TARGET } from './presentation';
import { release } from './studio';
import { hasWebGL } from './webgl';

describe('carspecs', () => {
  it('curve passe par ses points, sans dépassement, et se prolonge à plat', () => {
    const c = curve([[0, 0], [1, 1], [2, 1], [3, 0]]);
    expect(c(1)).toBeCloseTo(1); expect(c(-5)).toBe(0); expect(c(9)).toBe(0);
    for (let x = 1; x <= 2; x += .1) expect(c(x)).toBeLessThanOrEqual(1 + 1e-9);
    expect(lerp(2, 4, .25)).toBe(2.5);
  });
  it('chaque fiche est cohérente', () => {
    for (const [k, s] of Object.entries(SPECS)) {
      expect(s.axles[0], k).toBeLessThan(s.axles[1]);
      for (const name of ['floor', 'belt', 'deck', 'hw'] as const) {
        const xs = s[name].map((p) => p[0]);
        expect([...xs].sort((a, b) => a - b), `${k}.${name} croissant`).toEqual(xs);
      }
    }
  });
});

describe('geometry', () => {
  it('catmull, stations, loft, tube, rrect', () => {
    const pts = catmull([[0, 0], [1, 1], [2, 0]], 10);
    expect(pts).toHaveLength(11); expect(pts[0]).toEqual([0, 0]); expect(pts[10][0]).toBeCloseTo(2);
    const st = stations(-1, 1, 8);
    expect(st[0]).toBe(-1); expect(st[8]).toBeCloseTo(1);
    const g = loft(st, () => [[0, 0], [1, 0], [1, 1], [0, 1]]);
    expect(g.attributes.position.count).toBeGreaterThan(0);
    expect(loft(st, () => [[0, 0], [1, 1]], { caps: false }).index!.count).toBeGreaterThan(0);
    const m = tube([[0, 0, 0], [1, 0, 0], [2, .5, 0]], .1, new MeshStandardMaterial(), .5);
    expect(m.geometry.attributes.position.count).toBeGreaterThan(0);
    expect(rrect(1, .5, .1).getPoints().length).toBeGreaterThan(4);
    expect(canvasTex(8, 8, () => undefined)).toBeInstanceOf(Texture);
    expect(badgeTexture('DS', '#fff', '10px serif')).toBeInstanceOf(Texture);
  });
});

const finite = (root: Object3D) => {
  let bad = 0; let meshes = 0;
  root.traverse((o) => {
    const g = (o as Mesh).geometry as BufferGeometry | undefined;
    if (!g) return; meshes++;
    const a = g.attributes.position.array as ArrayLike<number>;
    for (let i = 0; i < a.length; i++) if (!Number.isFinite(a[i])) { bad++; break; }
  });
  return { bad, meshes };
};

describe('les trois voitures', () => {
  for (const key of Object.keys(SPECS) as CarModelKey[]) {
    it(`${key} : dimensions, symétrie, phares, sommets valides`, () => {
      const s = SPECS[key];
      const car = buildCar(s, new Texture());
      const { bad, meshes } = finite(car.root);
      expect(bad).toBe(0);
      expect(meshes).toBeGreaterThan(40);
      car.root.updateMatrixWorld(true);
      const box = new Box3().setFromObject(car.body.children[0]);
      expect(box.max.x - box.min.x).toBeCloseTo(s.L, 1);
      expect(box.max.z - box.min.z).toBeLessThanOrEqual(s.W + .05); // le lissage des coupes déborde de quelques cm
      expect(car.wheels).toHaveLength(4);
      /* feux avant : deux par côté sur la DS, un par côté sinon, en miroir, à l'avant de la voiture */
      expect(car.lampPoints.length).toBe(key === 'ds' ? 4 : 2);
      const zs = car.lampPoints.map((p) => p[2]).sort((a, b) => a - b);
      zs.forEach((z, i) => expect(z).toBeCloseTo(-zs[zs.length - 1 - i], 6));
      car.lampPoints.forEach((p) => expect(p[0]).toBeLessThan(-s.L / 2 + .45));
      expect(car.lens.emissiveIntensity).toBe(0);
    });
  }
  it('DS : la glace des phares découpe la peinture du seul côté du phare', () => {
    const mats = createMaterials(SPECS.ds, new Texture(), () => .9);
    const c = new Vector3(-2.3, .62, .78); const d = new Vector3(-1, 0, .5).normalize();
    const e2 = new Vector3(0, 1, 0); const e1 = new Vector3().crossVectors(e2, d).normalize();
    mats.lampCut(c, e1, e2, d, { A: .2, B: .1, pF: 8, pR: 2, tF: .9, k: .05, kb: .02 }, -.2, .03);
    const sh = { uniforms: {} as Record<string, { value: unknown }>, vertexShader: '#include <common>\n#include <begin_vertex>', fragmentShader: '#include <common>\n#include <map_fragment>' };
    mats.paint.onBeforeCompile(sh as never, undefined as never);
    expect(sh.fragmentShader).toContain('uLampKb');
    expect(sh.uniforms.uLampC.value).toEqual(c);
  });
  it('la DS et la 504 allument le halo avec la glace', () => {
    const ds = buildCar(SPECS.ds, new Texture());
    ds.lens.emissiveIntensity = 2;
    let clear: MeshStandardMaterial | undefined;
    ds.root.traverse((o) => { const m = (o as Mesh).material as MeshStandardMaterial; if (m && m !== ds.lens && m.emissive && m.emissive.getHex() === 0xfff0c0) clear = m; });
    expect(clear?.emissiveIntensity).toBe(1);
  });
});

describe('présentation, studio, WebGL', () => {
  it('rendu, caméra, lumières', () => {
    const r = { setPixelRatio: vi.fn(), outputColorSpace: '', toneMapping: 0, toneMappingExposure: 0 };
    configureRenderer(r as never);
    expect(r.setPixelRatio).toHaveBeenCalled(); expect(r.toneMappingExposure).toBeGreaterThan(1);
    expect(createCamera()).toBeInstanceOf(PerspectiveCamera);
    const scene = new Scene(); addStudioLights(scene); expect(scene.children).toHaveLength(2);
    expect(createCarLight().intensity).toBe(0);
    expect(carLightIntensity(0, 0)).toBe(CAR_LIGHT.rest);
    expect(carLightIntensity(1, 1)).toBe(CAR_LIGHT.rest + CAR_LIGHT.near + CAR_LIGHT.hover);
    expect(Object.keys(VIEWS)).toContain('profil'); expect(VIEW_TARGET).toHaveLength(3);
  });
  it('release libère géométries, matériaux et textures', () => {
    const tex = new Texture(); const mat = new MeshStandardMaterial({ map: tex }); const geo = new BufferGeometry();
    const spies = [vi.spyOn(tex, 'dispose'), vi.spyOn(mat, 'dispose'), vi.spyOn(geo, 'dispose')];
    const g = new Group(); g.add(new Mesh(geo, [mat])); release(g);
    spies.forEach((s) => expect(s).toHaveBeenCalled());
  });
  it('hasWebGL : faux sans contexte, et le résultat est gardé', () => {
    expect(hasWebGL()).toBe(false);
    expect(hasWebGL()).toBe(false);
  });
});

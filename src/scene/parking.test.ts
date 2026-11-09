/* Le moteur du parking, sur un rendu factice : la scène se construit, la boucle tourne, les voitures avancent,
   le pointeur les désigne, le glissement change d'une voiture à la fois, tout est rendu à la fin. */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FakeRenderer } from '../test/fakeGL';

vi.mock('three', async (orig) => {
  const actual = await orig<typeof import('three')>();
  const { fakePMREM, FakeRenderer: R } = await import('../test/fakeGL');
  return { ...actual, WebGLRenderer: R, PMREMGenerator: fakePMREM(actual.Texture) };
});

const { createParking } = await import('./parking');
const cars = [{ n: 1, model: 'p504' as const, behaviour: 'roll' as const }, { n: 2, model: 'ds' as const, behaviour: 'rise' as const }, { n: 3, model: 'w114' as const, behaviour: 'roll' as const }];

let frames: FrameRequestCallback[] = [];
let clock = 0;
const run = (n: number, dt = 16) => { for (let i = 0; i < n; i++) { clock += dt; const f = frames; frames = []; f.forEach((cb) => cb(clock)); } };

function mount(w = 1200, h = 700, opts = {}) {
  const box = document.createElement('div'); document.body.append(box);
  box.getBoundingClientRect = () => ({ width: w, height: h, top: 0, left: 0, right: w, bottom: h, x: 0, y: 0, toJSON() {} });
  const canvas = document.createElement('canvas'); box.append(canvas);
  canvas.getBoundingClientRect = box.getBoundingClientRect;
  const onReady = vi.fn();
  const eng = createParking(canvas, cars, { reduced: false, onReady, ...opts });
  return { eng, onReady, canvas, box };
}

describe('createParking', () => {
  beforeEach(() => {
    frames = []; clock = 0; FakeRenderer.instances = [];
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => { frames.push(cb); return frames.length; });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => { frames = []; });
    vi.spyOn(performance, 'now').mockImplementation(() => clock);
  });
  afterEach(() => { vi.restoreAllMocks(); document.body.innerHTML = ''; });

  it('se construit, rend des images, signale la première, respecte le budget de pixels', () => {
    const { eng, onReady } = mount();
    eng.start(); run(3);
    const r = FakeRenderer.instances[0];
    expect(r.renders).toBe(3);
    expect(onReady).toHaveBeenCalledTimes(1);
    expect(r.size).toEqual([1200, 700]);
    expect(1200 * 700 * r.pixelRatio ** 2).toBeLessThanOrEqual(2.4e6 + 1);
    eng.pause(true); run(2); expect(r.renders).toBe(3);
    eng.pause(false); run(1); expect(r.renders).toBe(4);
  });

  it('change de voiture et y arrive ; fiche ouverte, inset, survol', () => {
    const { eng } = mount();
    eng.start(); run(5);
    expect(eng.active()).toBe(0);
    eng.step(1); run(240);
    expect(eng.active()).toBe(1);
    expect(eng.state.pos).toBeCloseTo(1, 2);
    eng.step(-2); run(240); expect(eng.active()).toBe(2);
    eng.open(true); eng.inset(.4); eng.setHover(2); eng.pointer(.3, -.2); run(120);
    expect(eng.state.openT).toBeGreaterThan(.95);
    expect(eng.state.inset).toBe(.4);
    eng.inset(5); expect(eng.state.inset).toBe(.9);
    eng.open(false); run(120); expect(eng.state.openT).toBeLessThan(.05);
  });

  it('désigne la voiture sous le pointeur, et rien dans le vide', () => {
    const { eng } = mount();
    eng.start(); run(200);
    expect(eng.pick(600, 420)).toBe(0);
    expect(eng.pick(5, 5)).toBe(-1);
  });

  it('un glissement ne change que d’une voiture', () => {
    const { eng } = mount();
    eng.start(); run(10);
    eng.drag(true); eng.dragBy(-5000); run(2); eng.drag(false);
    run(240);
    expect(eng.active()).toBe(1);
  });

  it('portrait et mouvement réduit : la caméra suit la voiture, rien n’anime', () => {
    const { eng } = mount(400, 800, { reduced: true, start: 2 });
    eng.start(); run(2);
    expect(eng.state.portrait).toBe(true);
    expect(eng.active()).toBe(2);
    eng.step(1); run(1); expect(eng.state.pos).toBe(eng.state.target);
    eng.open(true); run(1); expect(eng.state.openT).toBe(1);
  });

  it('dispose : arrête la boucle, libère tout, rend le contexte', () => {
    const { eng } = mount();
    eng.start(); run(2); eng.dispose();
    expect(frames).toHaveLength(0);
    expect(FakeRenderer.instances[0].lost).toBe(true);
  });
});

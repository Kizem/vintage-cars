/* Le parking avec la 3D (rendu factice) : survol, clic sur une voisine puis sur la voiture, glissement, clic dans le
   vide, perte du contexte graphique (nouvel essai, puis repli sur le monogramme). */
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FakeRenderer } from '../../test/fakeGL';

vi.mock('three', async (orig) => {
  const actual = await orig<typeof import('three')>();
  const { fakePMREM, FakeRenderer: R } = await import('../../test/fakeGL');
  return { ...actual, WebGLRenderer: R, PMREMGenerator: fakePMREM(actual.Texture) };
});
vi.mock('../../scene/webgl', () => ({ hasWebGL: () => true }));

const { default: App } = await import('../../App');

let frames: FrameRequestCallback[] = [];
const run = (n: number) => act(() => { for (let i = 0; i < n; i++) { const f = frames; frames = []; f.forEach((cb) => cb(performance.now())); } });
const isOpen = () => document.querySelector('.em-parking')!.classList.contains('is-open');
const name = () => document.querySelector('.em-parking__name')!.textContent;

describe('Parking en 3D', () => {
  beforeEach(() => {
    frames = []; FakeRenderer.instances = [];
    window.matchMedia = ((q: string) => ({ matches: q.includes('reduce'), media: q, addEventListener() {}, removeEventListener() {} })) as unknown as typeof matchMedia;
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => { frames.push(cb); return frames.length; });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => undefined);
    Object.defineProperty(document, 'fonts', { value: { load: async () => [] }, configurable: true });
    HTMLElement.prototype.getBoundingClientRect = function () { return { width: 1200, height: 700, top: 0, left: 0, right: 1200, bottom: 700, x: 0, y: 0, toJSON() {} }; };
  });
  afterEach(() => vi.restoreAllMocks());

  it('scène prête, pointeur, clic, glissement, vide', async () => {
    render(<App />);
    await waitFor(() => expect(document.querySelector('.em-parking__gl canvas')).not.toBeNull());
    await waitFor(() => { run(1); expect(document.querySelector('.em-parking.is-ready')).not.toBeNull(); });
    expect(document.querySelector('.em-parking__flat')).toBeNull();
    run(30);
    const gl = document.querySelector('.em-parking__gl') as HTMLElement;
    gl.setPointerCapture = () => undefined;
    /* survol de la voiture du milieu, puis clic : la fiche s'ouvre */
    fireEvent.pointerMove(gl, { clientX: 600, clientY: 420, pointerType: 'mouse' });
    fireEvent.pointerDown(gl, { clientX: 600, clientY: 420, pointerType: 'mouse', button: 0 });
    fireEvent.pointerUp(gl, { clientX: 600, clientY: 420, pointerType: 'mouse' });
    expect(isOpen()).toBe(true);
    /* clic dans le vide : elle se ferme */
    fireEvent.pointerDown(gl, { clientX: 5, clientY: 5, pointerType: 'mouse', button: 0 });
    fireEvent.pointerUp(gl, { clientX: 5, clientY: 5, pointerType: 'mouse' });
    expect(isOpen()).toBe(false);
    /* clic sur une voisine : elle passe au premier plan */
    fireEvent.pointerDown(gl, { clientX: 1050, clientY: 400, pointerType: 'touch', button: 0 });
    fireEvent.pointerUp(gl, { clientX: 1050, clientY: 400, pointerType: 'touch' });
    run(5);
    /* glissement au doigt */
    const before = name();
    fireEvent.pointerDown(gl, { clientX: 800, clientY: 400, pointerType: 'touch', pointerId: 3, button: 0 });
    fireEvent.pointerMove(gl, { clientX: 700, clientY: 400, pointerType: 'touch', pointerId: 3 });
    fireEvent.pointerMove(gl, { clientX: 300, clientY: 400, pointerType: 'touch', pointerId: 3 });
    fireEvent.pointerUp(gl, { clientX: 300, clientY: 400, pointerType: 'touch', pointerId: 3 });
    run(5);
    expect(name()).not.toBe(before);
    fireEvent.pointerDown(gl, { clientX: 800, clientY: 400, pointerType: 'touch', pointerId: 4 });
    fireEvent.pointerMove(gl, { clientX: 600, clientY: 400, pointerType: 'touch', pointerId: 4 });
    fireEvent.pointerCancel(gl);
    fireEvent.pointerLeave(gl);
    fireEvent.pointerDown(gl, { button: 2 });
  });

  it('perte du contexte : deux nouveaux essais, puis le monogramme', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout'] });
    render(<App />);
    for (let k = 0; k < 3; k++) {
      await vi.waitFor(() => expect(document.querySelector('.em-parking__gl canvas')).not.toBeNull());
      const c = document.querySelector('.em-parking__gl canvas')!;
      act(() => { c.dispatchEvent(new Event('webglcontextlost', { cancelable: true })); });
      await act(async () => { vi.advanceTimersByTime(800); });
    }
    await vi.waitFor(() => expect(document.querySelector('.em-parking__flat')).not.toBeNull());
    vi.useRealTimers();
  });
});

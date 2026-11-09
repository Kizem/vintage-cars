/* Préparation des tests unitaires (jsdom) : ce que le navigateur fournit et que jsdom n'a pas. */
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
  localStorage.clear();
  window.history.replaceState(null, '', '/');
});

/* contexte 2D factice : les textures dessinées (canvasTex) s'exécutent sans rien tracer */
const ctx2d = new Proxy({}, {
  get: (_t, k) => (k === 'measureText' ? () => ({ width: 10 }) : k === 'createRadialGradient' || k === 'createLinearGradient' ? () => ({ addColorStop() {} }) : k === 'getImageData' || k === 'createImageData' ? (...a: number[]) => { const w = a.length > 2 ? a[2] : a[0]; const h = a.length > 2 ? a[3] : a[1]; return { data: new Uint8ClampedArray(Math.max(1, w * h) * 4), width: w, height: h }; } : () => undefined),
  set: () => true,
});
HTMLCanvasElement.prototype.getContext = function (type: string) { return type === '2d' ? (ctx2d as unknown as CanvasRenderingContext2D) : null; } as typeof HTMLCanvasElement.prototype.getContext;

window.matchMedia ??= ((q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {}, onchange: null, addListener() {}, removeListener() {}, dispatchEvent: () => false })) as typeof window.matchMedia;

class Observer { observe() {} unobserve() {} disconnect() {} takeRecords() { return []; } }
window.ResizeObserver ??= Observer as unknown as typeof ResizeObserver;
window.IntersectionObserver ??= Observer as unknown as typeof IntersectionObserver;

Element.prototype.scrollTo ??= function (this: Element, o?: ScrollToOptions | number) { if (typeof o === 'object' && o?.left !== undefined) (this as HTMLElement).scrollLeft = o.left; };
Element.prototype.scrollIntoView ??= function () {};
/* <dialog> : jsdom ne gère pas showModal / close */
if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) { this.setAttribute('open', ''); };
}
HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
  if (!this.hasAttribute('open')) return;
  this.removeAttribute('open');
  this.dispatchEvent(new Event('close'));
};
window.requestAnimationFrame = (cb: FrameRequestCallback) => setTimeout(() => cb(performance.now()), 0) as unknown as number;
vi.stubGlobal('scrollTo', () => undefined);

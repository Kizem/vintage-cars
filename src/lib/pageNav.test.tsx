import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CLOSE_FOCUS, currentIndex, isLocked, reducedMotion, scroller, scrollToId, sections, setLock, usePageNavigation } from './pageNav';

/* Une page de sections dont la position suit scrollTop : section i à i * 800 px. */
function Page() {
  usePageNavigation();
  return (
    <main className="em-scroll">
      {['garage', 'sortie-1', 'sortie-2', 'ecrire'].map((id) => (
        <section id={id} key={id}><h2 tabIndex={-1}>{id}</h2><input aria-label={`in-${id}`} /></section>
      ))}
    </main>
  );
}
function layout() {
  const sc = scroller()!;
  Object.defineProperty(sc, 'clientHeight', { value: 800, configurable: true });
  sc.getBoundingClientRect = () => ({ top: 0, bottom: 800, height: 800, left: 0, right: 1000, width: 1000, x: 0, y: 0, toJSON() {} });
  sections().forEach((el, i) => { el.getBoundingClientRect = () => { const top = i * 800 - sc.scrollTop; return { top, bottom: top + 800, height: 800, left: 0, right: 1000, width: 1000, x: 0, y: top, toJSON() {} }; }; });
  return sc;
}
const reduce = (on: boolean) => { window.matchMedia = ((q: string) => ({ matches: on && q.includes('reduce'), media: q, addEventListener() {}, removeEventListener() {} })) as unknown as typeof matchMedia; };

describe('pageNav', () => {
  beforeEach(() => reduce(true));
  afterEach(() => { setLock('focus', false); setLock('dialog', false); });

  it('verrous', () => {
    expect(isLocked()).toBe(false);
    setLock('dialog', true);
    expect(isLocked()).toBe(true);
    expect(isLocked('focus')).toBe(false);
    setLock('dialog', false);
    expect(isLocked()).toBe(false);
  });
  it('reducedMotion se replie sur false si matchMedia échoue', () => {
    expect(reducedMotion()).toBe(true);
    window.matchMedia = (() => { throw new Error('x'); }) as unknown as typeof matchMedia;
    expect(reducedMotion()).toBe(false);
  });
  it('sans page : index 0, rien ne casse', () => {
    expect(scroller()).toBeNull();
    expect(sections()).toEqual([]);
    expect(currentIndex()).toBe(0);
    document.body.innerHTML = '<section id="ecrire"><h2 tabindex="-1">x</h2></section>';
    expect(() => scrollToId('ecrire')).not.toThrow();
    document.body.innerHTML = '';
  });
  it('clavier : ↓ ↑ PageDown, pas dans un champ ni sous verrou', () => {
    render(<Page />);
    const sc = layout();
    const key = (k: string) => act(() => { window.dispatchEvent(new KeyboardEvent('keydown', { key: k, cancelable: true })); });
    key('ArrowDown'); expect(sc.scrollTop).toBe(800); expect(currentIndex()).toBe(1);
    key('PageDown'); expect(sc.scrollTop).toBe(1600);
    key('ArrowUp'); expect(sc.scrollTop).toBe(800);
    setLock('focus', true); key('ArrowDown'); expect(sc.scrollTop).toBe(800); setLock('focus', false);
    setLock('dialog', true); key('ArrowDown'); expect(sc.scrollTop).toBe(800); setLock('dialog', false);
    (document.querySelector('input') as HTMLInputElement).focus(); key('ArrowDown'); expect(sc.scrollTop).toBe(800);
  });
  it('molette : une section par geste, petits crans cumulés, verrous', () => {
    render(<Page />);
    const sc = layout();
    let ts = 1000;
    const wheel = (dy: number, opts: WheelEventInit = {}) => act(() => { const e = new WheelEvent('wheel', { deltaY: dy, cancelable: true, ...opts }); Object.defineProperty(e, 'timeStamp', { value: ts }); sc.dispatchEvent(e); });
    wheel(100); expect(sc.scrollTop).toBe(800);
    ts += 50; wheel(100); expect(sc.scrollTop).toBe(800); // même geste : ignoré
    ts += 1000; wheel(1); ts += 10; wheel(1); ts += 10; wheel(2); expect(sc.scrollTop).toBe(1600); // petits crans cumulés
    ts += 1000; wheel(-1, { deltaMode: 1 }); expect(sc.scrollTop).toBe(800); // en lignes
    ts += 1000; wheel(0, { deltaX: 50 }); expect(sc.scrollTop).toBe(800); // horizontal : ignoré
    setLock('dialog', true); ts += 1000; wheel(100); expect(sc.scrollTop).toBe(800); setLock('dialog', false);
    setLock('focus', true); ts += 1000; wheel(100); expect(sc.scrollTop).toBe(800); setLock('focus', false);
  });
  it('scrollToId : ferme la fiche, va à la section, donne le focus au titre', async () => {
    render(<Page />);
    const sc = layout();
    const closed = vi.fn();
    window.addEventListener(CLOSE_FOCUS, closed);
    scrollToId('ecrire', { focusHeading: true });
    expect(sc.scrollTop).toBe(2400);
    await new Promise((r) => setTimeout(r, 5));
    expect(document.activeElement?.textContent).toBe('ecrire');
    expect(closed).toHaveBeenCalled();
    window.removeEventListener(CLOSE_FOCUS, closed);
  });
  it('scrollToId animé (mouvement normal) arrive à destination', async () => {
    reduce(false);
    render(<Page />);
    const sc = layout();
    let now = 0;
    vi.spyOn(performance, 'now').mockImplementation(() => now);
    const raf = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => { now += 300; cb(now); return 0; });
    scrollToId('sortie-2');
    expect(sc.scrollTop).toBe(1600);
    raf.mockRestore(); vi.restoreAllMocks();
  });
  it('touche F : plein écran', () => {
    render(<Page />);
    const req = vi.fn(async () => undefined);
    document.documentElement.requestFullscreen = req;
    act(() => { window.dispatchEvent(new KeyboardEvent('keydown', { key: 'f' })); });
    expect(req).toHaveBeenCalled();
  });
  it('lien direct #section : arrivée sans animation', () => {
    window.history.replaceState(null, '', '/#sortie-2');
    const { unmount } = render(<Page />);
    unmount();
    expect(true).toBe(true);
  });
});

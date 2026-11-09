/* L'atelier 3D (ds.html) : chaque voiture s'affiche seule, avec ses vues et la caméra libre. */
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('three', async (orig) => {
  const actual = await orig<typeof import('three')>();
  const { fakePMREM, FakeRenderer: R } = await import('../test/fakeGL');
  return { ...actual, WebGLRenderer: R, PMREMGenerator: fakePMREM(actual.Texture) };
});

describe('viewer', () => {
  afterEach(() => { document.body.innerHTML = ''; vi.resetModules(); });
  it.each([['?car=w114&view=profil&bg=%23ffffff', 6], ['?car=nope&cam=1,2,3&at=0,1,0', 6], ['', 6]])('%s', async (search, views) => {
    window.history.replaceState(null, '', `/ds.html${search}`);
    document.body.innerHTML = '<nav id="views"></nav>';
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 0);
    await import('./viewer');
    const buttons = document.querySelectorAll('#views button');
    expect(buttons).toHaveLength(views);
    (buttons[1] as HTMLButtonElement).click();
    window.dispatchEvent(new Event('resize'));
    expect(document.querySelector('canvas')).not.toBeNull();
  });
});

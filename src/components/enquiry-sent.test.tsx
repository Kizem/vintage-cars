/* Le formulaire avec un point d'envoi configuré : erreur, nouvel essai, envoi réussi, envoi trop rapproché. */
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

async function setup(responses: (Response | Error)[]) {
  vi.resetModules();
  vi.stubEnv('VITE_ENQUIRY_ENDPOINT', 'https://forms.example/enquiry');
  const fetchMock = vi.fn(async () => { const r = responses.shift()!; if (r instanceof Error) throw r; return r; });
  vi.stubGlobal('fetch', fetchMock);
  window.history.replaceState(null, '', '/?lang=en');
  const { default: App } = await import('../App');
  const user = userEvent.setup();
  render(<App />);
  vi.spyOn(performance, 'now').mockReturnValue(1e9);
  await user.type(screen.getByLabelText('Full name'), 'Camille Martin');
  await user.type(screen.getByLabelText('Email address'), 'camille@example.com');
  await user.selectOptions(screen.getByLabelText('Preferred experience'), 'private-tours');
  await user.selectOptions(screen.getByLabelText('Preferred vehicle'), 'citroen-ds');
  await user.click(document.getElementById('em-consent')!);
  return { user, fetchMock };
}

describe('envoi configuré', () => {
  afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

  it('erreur réseau, « Réessayer », puis envoyé ; un second envoi immédiat est refusé', async () => {
    const { user, fetchMock } = await setup([new TypeError('offline'), new Response('{}', { status: 200 })]);
    await user.click(screen.getByRole('button', { name: 'Send an Enquiry' }));
    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toMatch(/could not reach/);
    expect(decodeURIComponent((within(alert).getByText('Send by email') as HTMLAnchorElement).href)).toContain('Citroën DS 21 Henri Chapron');
    await user.click(within(alert).getByText('Try again'));
    const done = await screen.findByRole('status');
    expect(done.textContent).toMatch(/Thank you, Camille/);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(JSON.parse((fetchMock.mock.calls[1] as unknown as [string, RequestInit])[1].body as string)).toMatchObject({ vehicle: 'citroen-ds', experience: 'private-tours', locale: 'en' });
    /* nouvelle demande aussitôt : refusée par la limite d'envoi */
    await user.click(within(done).getByText('Send another enquiry'));
    await user.type(screen.getByLabelText('Full name'), 'Camille Martin');
    await user.type(screen.getByLabelText('Email address'), 'camille@example.com');
    await user.selectOptions(screen.getByLabelText('Preferred experience'), 'events');
    await user.click(document.getElementById('em-consent')!);
    /* rempli en 5 s (pas un robot), mais moins de 20 s après le premier envoi */
    vi.spyOn(performance, 'now').mockReturnValue(1e9 + 5000);
    await user.click(screen.getByRole('button', { name: 'Send an Enquiry' }));
    expect((await screen.findByRole('alert')).textContent).toMatch(/just been sent/);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('erreur du serveur', async () => {
    const { user } = await setup([new Response('', { status: 503 })]);
    await user.click(screen.getByRole('button', { name: 'Send an Enquiry' }));
    expect((await screen.findByRole('alert')).textContent).toMatch(/server responded/);
  });
});

describe('langue', () => {
  afterEach(() => vi.restoreAllMocks());
  it('choix mémorisé, puis langue du navigateur', async () => {
    vi.resetModules();
    const { default: App } = await import('../App');
    localStorage.setItem('epoque-lang', 'fr');
    const a = render(<App />);
    expect(document.documentElement.lang).toBe('fr');
    a.unmount(); localStorage.clear(); window.history.replaceState(null, '', '/');
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('fr-FR');
    const b = render(<App />);
    expect(document.documentElement.lang).toBe('fr');
    b.unmount(); window.history.replaceState(null, '', '/');
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('de-DE');
    render(<App />);
    expect(document.documentElement.lang).toBe('en');
  });
  it('les crochets refusent d’être utilisés hors de leur fournisseur', async () => {
    const { useI18n } = await import('../i18n/I18nContext');
    const { useEnquiry } = await import('../context/EnquiryContext');
    const { renderHook } = await import('@testing-library/react');
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => renderHook(() => useI18n())).toThrow(/I18nProvider/);
    expect(() => renderHook(() => useEnquiry())).toThrow(/EnquiryProvider/);
  });
});

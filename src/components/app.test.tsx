/* L'interface complète sous jsdom (sans WebGL : le parking affiche le monogramme de secours). */
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { resetSubmitGuard } from '../lib/enquiry';
import { setLock } from '../lib/pageNav';

const reduce = () => { window.matchMedia = ((q: string) => ({ matches: q.includes('reduce'), media: q, addEventListener() {}, removeEventListener() {} })) as unknown as typeof matchMedia; };
const panelOpen = () => document.querySelector('.em-parking')!.classList.contains('is-open');
const carName = () => document.querySelector('.em-parking__name')!.textContent;

describe('App', () => {
  beforeEach(() => { reduce(); resetSubmitGuard(); window.history.replaceState(null, '', '/?lang=fr'); });
  afterEach(() => { setLock('focus', false); setLock('dialog', false); vi.useRealTimers(); });

  it('sept sections, un seul h1, le monogramme sans 3D', () => {
    render(<App />);
    expect([...document.querySelectorAll('main > section')].map((s) => s.id)).toEqual(['garage', 'sortie-1', 'sortie-2', 'sortie-3', 'savoir', 'apropos', 'ecrire']);
    expect(document.querySelectorAll('h1')).toHaveLength(1);
    expect(document.querySelector('.em-parking__flat .em-mono')).not.toBeNull();
    expect(document.documentElement.lang).toBe('fr');
    expect(screen.getByText('Cliquez sur le nom d’une voiture pour voir ses photos.')).toBeTruthy();
  });

  it('parking : flèches, nom, fiche, photos, plein écran, Échap', async () => {
    const user = userEvent.setup();
    render(<App />);
    /* le garage est la section affichée (les autres sont plus bas) : ← → changent de voiture */
    document.querySelectorAll<HTMLElement>('main > section').forEach((el, i) => { el.getBoundingClientRect = () => ({ top: i * 1000, bottom: i * 1000 + 800, height: 800, left: 0, right: 0, width: 0, x: 0, y: 0, toJSON() {} }); });
    expect(carName()).toBe('Peugeot 504 GL');
    await user.click(document.querySelectorAll('.em-parking__arrow')[1] as HTMLElement);
    expect(carName()).toBe('Citroën DS 21 Henri Chapron');
    await user.keyboard('{ArrowLeft}');
    expect(carName()).toBe('Peugeot 504 GL');
    await user.click(document.querySelector('.em-parking__name')!);
    expect(panelOpen()).toBe(true);
    const sheet = document.querySelector('.em-sheet') as HTMLElement;
    expect(within(sheet).getByRole('heading', { level: 2 }).textContent).toBe('Peugeot 504 GL');
    expect(sheet.querySelectorAll('.em-carousel__slide img')).toHaveLength(5);
    expect(sheet.textContent).not.toMatch(/Disponibilit/);
    const counter = () => sheet.querySelector('.em-carousel__pager .em-counter')!.textContent!.replace(/\s/g, '');
    await user.click(within(sheet).getByRole('button', { name: 'Photo suivante' }));
    expect(counter()).toBe('2-5');
    await user.keyboard('{ArrowRight}');
    expect(counter()).toBe('3-5');
    await user.click(within(sheet).getByRole('button', { name: 'Photo précédente' }));
    expect(counter()).toBe('2-5');
    /* défilement au doigt dans le carrousel */
    const track = sheet.querySelector('.em-carousel__track') as HTMLElement;
    Object.defineProperty(track, 'clientWidth', { value: 300, configurable: true });
    fireEvent.pointerDown(track); track.scrollLeft = 900; fireEvent.scroll(track);
    expect(counter()).toBe('4-5');
    /* plein écran : flèches, glissement, Échap ; la fiche reste ouverte */
    await user.click(sheet.querySelectorAll('.em-carousel__open')[3] as HTMLElement);
    const lb = document.querySelector('.em-lightbox') as HTMLDialogElement;
    expect(lb.open).toBe(true);
    fireEvent.keyDown(lb, { key: 'ArrowRight' });
    expect(lb.querySelector('.em-counter')!.textContent!.replace(/\s/g, '')).toBe('5-5');
    const fig = lb.querySelector('.em-lightbox__fig')!;
    fireEvent.pointerDown(fig, { clientX: 300 }); fireEvent.pointerUp(fig, { clientX: 100 });
    expect(lb.querySelector('.em-counter')!.textContent!.replace(/\s/g, '')).toBe('1-5');
    await user.click(within(lb).getByRole('button', { name: 'Fermer' }));
    expect(lb.open).toBe(false);
    expect(panelOpen()).toBe(true);
    /* voiture suivante depuis la fiche, puis Échap */
    await user.click(document.querySelectorAll('.em-panel__arrow')[1] as HTMLElement);
    expect(document.querySelector('.em-sheet__name')!.textContent).toBe('Citroën DS 21 Henri Chapron');
    await user.keyboard('{Escape}');
    expect(panelOpen()).toBe(false);
  });

  it('parking : glisser change de voiture, toucher le monogramme ouvre, toucher à côté ferme', () => {
    render(<App />);
    const flat = document.querySelector('.em-parking__flat') as HTMLElement;
    fireEvent.pointerDown(flat, { clientX: 400, pointerId: 1 }); fireEvent.pointerUp(flat, { clientX: 300, pointerId: 1 });
    expect(carName()).toBe('Citroën DS 21 Henri Chapron');
    fireEvent.pointerDown(flat, { clientX: 300, pointerId: 1 }); fireEvent.pointerUp(flat, { clientX: 400, pointerId: 1 });
    expect(carName()).toBe('Peugeot 504 GL');
    const mono = flat.querySelector('.em-profile')!;
    fireEvent.pointerMove(mono);
    fireEvent.pointerDown(mono, { clientX: 10 }); fireEvent.pointerUp(mono, { clientX: 12 });
    expect(panelOpen()).toBe(true);
    fireEvent.pointerDown(flat, { clientX: 10 }); fireEvent.pointerUp(flat, { clientX: 11 });
    expect(panelOpen()).toBe(false);
    fireEvent.pointerLeave(flat); fireEvent.pointerCancel(flat);
  });

  it('les voitures alternent seules toutes les 5 s environ, après 9 s', () => {
    vi.useFakeTimers({ toFake: ['setInterval', 'setTimeout', 'performance'] });
    window.matchMedia = ((q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} })) as unknown as typeof matchMedia;
    render(<App />);
    act(() => { vi.advanceTimersByTime(8000); });
    expect(carName()).toBe('Peugeot 504 GL');
    act(() => { vi.advanceTimersByTime(8000); });
    expect(carName()).not.toBe('Peugeot 504 GL');
  });

  it('« Demander cette voiture » préremplit le formulaire', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(document.querySelector('.em-parking__name')!);
    await user.click(within(document.querySelector('.em-sheet') as HTMLElement).getByText('Demander cette voiture'));
    expect((document.getElementById('em-vehicle') as HTMLSelectElement).value).toBe('peugeot-504');
    expect(panelOpen()).toBe(false);
  });

  it('formulaire : erreurs, puis « non envoyé » avec l’envoi par e-mail, jamais « envoyé »', async () => {
    const user = userEvent.setup();
    render(<App />);
    const form = document.querySelector('.em-form') as HTMLFormElement;
    await user.click(within(form).getByRole('button', { name: 'Envoyer ma demande' }));
    expect(form.querySelectorAll('[aria-invalid="true"]').length).toBeGreaterThanOrEqual(3);
    expect(document.activeElement?.id).toBe('em-fullName');
    await user.type(screen.getByLabelText('Nom et prénom'), 'Camille Martin');
    expect(form.querySelector('#em-fullName[aria-invalid]')).toBeNull();
    await user.type(screen.getByLabelText('Adresse e-mail'), 'camille@example.com');
    await user.selectOptions(screen.getByLabelText('Expérience souhaitée'), 'events');
    await user.type(screen.getByLabelText('Message (facultatif)'), 'Un mariage');
    await user.click(form.querySelector('#em-consent')!);
    expect((screen.getByLabelText('Nom et prénom') as HTMLInputElement).maxLength).toBe(100);
    vi.spyOn(performance, 'now').mockReturnValue(performance.now() + 60000);
    await user.click(within(form).getByRole('button', { name: 'Envoyer ma demande' }));
    const done = await screen.findByRole('alert');
    expect(done.textContent).toMatch(/pas encore partie/);
    const mail = within(done).getByText('Envoyer par e-mail') as HTMLAnchorElement;
    expect(mail.href).toMatch(/^mailto:hello@epoque-motors\.example\?subject=/);
    expect(decodeURIComponent(mail.href)).toContain('Camille Martin');
    await user.click(within(done).getByText('Modifier ma demande'));
    expect((screen.getByLabelText('Nom et prénom') as HTMLInputElement).value).toBe('Camille Martin');
    vi.restoreAllMocks();
  });

  it('menu : langue, sections, haut de page ; pages légales', async () => {
    const user = userEvent.setup();
    render(<App />);
    const nav = screen.getByRole('navigation');
    await user.click(within(nav).getByRole('link', { name: /English|anglais/i }));
    expect(document.documentElement.lang).toBe('en');
    expect(localStorage.getItem('epoque-lang')).toBe('en');
    expect(window.location.search).toBe('');
    for (const a of within(nav).getAllByRole('link').slice(1, -1).filter((x) => x.getAttribute('href')!.startsWith('#'))) await user.click(a);
    /* la rubrique des guides est une autre page */
    expect(within(nav).getByRole('link', { name: 'Guides' }).getAttribute('href')).toMatch(/\/guides\/$/);
    await user.click(screen.getByRole('button', { name: /top/i, hidden: true }));
    await user.click(document.querySelector('.em-brand') as HTMLElement);
    /* page légale ouverte par son ancre, fermée par son bouton */
    act(() => { window.location.hash = '#privacy'; window.dispatchEvent(new HashChangeEvent('hashchange')); });
    const dlg = document.querySelector('.em-legal') as HTMLDialogElement;
    expect(dlg.open).toBe(true);
    await user.click(within(dlg).getByRole('button'));
    expect(dlg.open).toBe(false);
    expect(window.location.hash).toBe('');
  });
});

/* Adresses : chaque langue a la sienne (/ et /fr/), les fichiers se trouvent depuis n'importe quelle profondeur,
   et un lien d'une page de contenu arrive sur le formulaire pré-rempli. */
import { render, screen } from '@testing-library/react';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import App from '../App';
import { asset, assetSet, homeHref, localeFromPath, resetRoot, setRootPrefix } from './paths';

const setRootMeta = (content: string | null) => {
  document.querySelector('meta[name="em-root"]')?.remove();
  if (content !== null) {
    const m = document.createElement('meta');
    m.name = 'em-root';
    m.content = content;
    document.head.append(m);
  }
  resetRoot();
};

beforeEach(() => setRootMeta(null));
afterEach(() => setRootMeta(null));

describe('racine du site', () => {
  it('sans balise : la racine du serveur', () => {
    window.history.replaceState(null, '', '/fr/');
    expect(asset('images/a.webp')).toBe(`${window.location.origin}/images/a.webp`);
    expect(assetSet('images/a-900.webp 900w, images/a.webp 2000w')).toBe(
      `${window.location.origin}/images/a-900.webp 900w, ${window.location.origin}/images/a.webp 2000w`,
    );
    expect(assetSet(undefined)).toBeUndefined();
  });

  it('page française construite : la balise remonte d’un niveau', () => {
    window.history.replaceState(null, '', '/vintage-cars/fr/');
    setRootMeta('../');
    expect(asset('images/a.webp')).toBe(`${window.location.origin}/vintage-cars/images/a.webp`);
    expect(homeHref('en')).toBe(`${window.location.origin}/vintage-cars/`);
    expect(homeHref('fr')).toBe(`${window.location.origin}/vintage-cars/fr/`);
    expect(localeFromPath()).toBe('fr');
    window.history.replaceState(null, '', '/vintage-cars/');
    expect(localeFromPath()).toBeNull();
    window.history.replaceState(null, '', '/ailleurs/fr/');
    expect(localeFromPath()).toBeNull();
  });

  it('pré-rendu : chemins relatifs à la page', () => {
    setRootPrefix('../');
    expect(asset('images/a.webp')).toBe('../images/a.webp');
    setRootPrefix(null);
    expect(asset('x')).toBe(`${window.location.origin}/x`);
  });
});

describe('langue et formulaire depuis l’adresse', () => {
  it('/fr/ impose le français, même après un choix anglais', () => {
    localStorage.setItem('epoque-lang', 'en');
    window.history.replaceState(null, '', '/fr/');
    render(<App />);
    expect(document.documentElement.lang).toBe('fr');
    expect(window.location.pathname).toBe('/fr/');
  });

  it('?lang=fr (anciens liens) mène à /fr/', () => {
    window.history.replaceState(null, '', '/?lang=fr');
    render(<App />);
    expect(document.documentElement.lang).toBe('fr');
    expect(window.location.pathname).toBe('/fr/');
    expect(window.location.search).toBe('');
  });

  it('lien « Parler de votre mariage » : expérience et voiture pré-remplies, adresse nettoyée', async () => {
    window.history.replaceState(null, '', '/fr/?experience=events&car=citroen-ds#ecrire');
    render(<App />);
    await act(async () => {});
    expect((screen.getByLabelText('Expérience souhaitée') as HTMLSelectElement).value).toBe('events');
    expect((screen.getByLabelText('Voiture souhaitée') as HTMLSelectElement).value).toBe('citroen-ds');
    expect(window.location.search).toBe('');
    expect(window.location.hash).toBe('#ecrire');
  });

  it('valeurs inconnues ignorées', async () => {
    window.history.replaceState(null, '', '/?experience=nope&car=<x>');
    render(<App />);
    await act(async () => {});
    expect(window.location.search).toBe('');
    expect((document.getElementById('em-experience') as HTMLSelectElement).value).toBe('');
    expect((document.getElementById('em-vehicle') as HTMLSelectElement).value).toBe('');
  });
});

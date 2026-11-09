/* Contenu : chaque voiture, expérience et image déclarée est complète, dans les deux langues, et chaque fichier
   d'image existe aux dimensions annoncées (srcset compris). */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { en } from '../i18n/en';
import { fr } from '../i18n/fr';
import { isLocale, locales } from '../i18n/locales';
import { SPECS } from '../scene/carspecs';
import { experiences } from './experiences';
import { primaryNav, sectionIds, sectionImages, site } from './site';
import type { MediaAsset } from './types';
import { getVehicle, vehicles } from './vehicles';

const size = (file: string) => execFileSync('identify', ['-format', '%w %h', file]).toString().trim().split(' ').map(Number);
const hasIdentify = (() => { try { execFileSync('identify', ['-version']); return true; } catch { return false; } })();

function checkAsset(a: MediaAsset, where: string) {
  for (const lc of locales) expect(a.alt[lc], `${where} alt ${lc}`).toBeTruthy();
  const files: [string, number | null][] = [[a.src, a.width]];
  a.srcSet?.split(',').forEach((part) => { const [f, w] = part.trim().split(' '); files.push([f, parseInt(w, 10)]); });
  for (const [f, w] of files) {
    const path = `public/${f}`;
    expect(existsSync(path), `${where} : ${path} existe`).toBe(true);
    if (hasIdentify) {
      const [fw, fh] = size(path);
      expect(fw, `${where} : largeur de ${f}`).toBe(w);
      if (f === a.src) expect(fh, `${where} : hauteur de ${f}`).toBe(a.height);
    }
  }
}

describe('voitures', () => {
  it('trois voitures, slugs uniques, ordre des places', () => {
    expect(vehicles.map((v) => v.slug)).toEqual(['peugeot-504', 'citroen-ds', 'mercedes-benz-classic']);
    expect(getVehicle('citroen-ds')?.name.fr).toBe('Citroën DS 21 Henri Chapron');
    expect(getVehicle('nope')).toBeUndefined();
    expect(getVehicle(null)).toBeUndefined();
  });
  for (const v of vehicles) {
    it(`${v.slug} : nom, fiche, modèle 3D, photos`, () => {
      for (const lc of locales) expect(v.name[lc]).toBeTruthy();
      expect(SPECS[v.rendering.model]).toBeDefined();
      for (const d of v.details ?? []) for (const lc of locales) { expect(d.label[lc]).toBeTruthy(); expect(d.value[lc]).toBeTruthy(); }
      const photos = [v.image, ...(v.gallery ?? [])];
      expect(photos.length).toBe(5);
      photos.forEach((p, i) => checkAsset(p, `${v.slug} photo ${i + 1}`));
      expect(new Set(photos.map((p) => p.src)).size).toBe(5);
    });
  }
});

describe('expériences et site', () => {
  it('trois expériences complètes', () => {
    expect(experiences.map((x) => x.id)).toEqual(['events', 'private-tours', 'chauffeured']);
    for (const x of experiences) {
      for (const lc of locales) { expect(x.title[lc]).toBeTruthy(); expect(x.summary[lc]).toBeTruthy(); expect(x.body[lc].length).toBeGreaterThan(0); }
      checkAsset(x.image, x.id);
    }
  });
  it('images de section et navigation', () => {
    checkAsset(sectionImages.practical, 'practical');
    checkAsset(sectionImages.about, 'about');
    for (const n of primaryNav) { expect(sectionIds).toContain(n.id); expect(en.nav.items[n.key]).toBeTruthy(); }
    expect(site.contact.email).toMatch(/@/);
  });
});

describe('traductions', () => {
  const shape = (o: unknown, p = ''): string[] => (o && typeof o === 'object' ? Object.entries(o).flatMap(([k, v]) => shape(v, `${p}.${k}`)) : [`${p}:${Array.isArray(o) ? 'array' : typeof o}`]);
  it('le français a exactement les clés de l’anglais', () => {
    expect(shape(fr).sort()).toEqual(shape(en).sort());
  });
  it('aucune chaîne vide, mêmes {variables} dans les deux langues', () => {
    const leaves = (o: unknown, p = ''): [string, string][] => (typeof o === 'string' ? [[p, o]] : o && typeof o === 'object' ? Object.entries(o).flatMap(([k, v]) => leaves(v, `${p}.${k}`)) : []);
    const frMap = new Map(leaves(fr));
    for (const [k, s] of leaves(en)) {
      expect(s.length, k).toBeGreaterThan(0);
      const vars = (x: string) => (x.match(/\{\w+\}/g) ?? []).sort().join();
      expect(vars(frMap.get(k)!), k).toBe(vars(s));
    }
  });
  it('isLocale', () => {
    expect(isLocale('fr')).toBe(true);
    expect(isLocale('de')).toBe(false);
    expect(isLocale(null)).toBe(false);
  });
});

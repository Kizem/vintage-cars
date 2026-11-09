import type { Locale } from '../i18n/locales';

/**
 * Où est la racine du site, pour qu'une page à n'importe quelle profondeur (/, /fr/, /fr/guides/…) trouve
 * ses images et ses pages, que le site soit à la racine d'un domaine ou sous un chemin GitHub Pages.
 *
 * - Pages construites : `<meta name="em-root" content="../">` (posé au pré-rendu) donne la racine relative à la page.
 * - Pré-rendu (Node) : `setRootPrefix('../')` pendant le rendu de la page ; les chemins restent relatifs.
 * - Développement et tests (aucune balise) : la racine du serveur.
 */
let prefix: string | null = null;
let root: string | undefined;

export function setRootPrefix(p: string | null) {
  prefix = p;
}

function siteRoot(): string {
  if (prefix !== null) return prefix;
  if (root === undefined) {
    const m = document.querySelector('meta[name="em-root"]')?.getAttribute('content');
    root = new URL(m ?? '/', m ? document.baseURI : window.location.href).href;
  }
  return root;
}

/** Oublie la racine calculée (tests). */
export const resetRoot = () => {
  root = undefined;
};

/** Un fichier de `public/`, ex. `images/collection/x.webp`. */
export const asset = (p: string) => siteRoot() + p;

/** Un attribut srcset dont chaque fichier part de la racine. */
export const assetSet = (s: string | undefined) =>
  s
    ?.split(',')
    .map((part) => {
      const [file, w] = part.trim().split(/\s+/);
      return `${asset(file)} ${w}`;
    })
    .join(', ');

/** Chemin de l'accueil d'une langue, depuis la racine : '' (anglais) ou 'fr/'. */
export const homeRel = (l: Locale) => (l === 'fr' ? 'fr/' : '');

/** Adresse de l'accueil d'une langue. */
export const homeHref = (l: Locale) => asset(homeRel(l));

/** Langue imposée par le chemin (/fr/…), sinon null. */
export function localeFromPath(): Locale | null {
  const base = new URL(siteRoot(), window.location.href).pathname;
  const path = window.location.pathname;
  const rel = path.startsWith(base) ? path.slice(base.length) : path.replace(/^\//, '');
  return rel === 'fr' || rel.startsWith('fr/') ? 'fr' : null;
}

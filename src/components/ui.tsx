import type { MouseEvent, ReactNode } from 'react';
import { pageLinks, type LinkedPage } from '../data/links';
import { useI18n } from '../i18n/I18nContext';
import { scrollToId } from '../lib/pageNav';
import { asset } from '../lib/paths';

/** Le symbole de marque : É et M décalés. */
export function Monogram() {
  return (
    <span className="em-mono em-mono--lg" aria-hidden="true">
      <span>É</span>
      <span>M</span>
    </span>
  );
}

/** Le logo, toujours visible : monogramme et nom de la maison. Mène au garage. */
export function Brand({ className = '' }: { className?: string }) {
  return (
    <a
      className={`em-brand ${className}`}
      aria-label="Époque Motors"
      href="#garage"
      onClick={(e) => {
        e.preventDefault();
        scrollToId('garage');
      }}
    >
      <span className="em-mono em-mono--sm" aria-hidden="true">
        <span>É</span>
        <span>M</span>
      </span>
      <span className="em-brand__word">Époque Motors</span>
    </a>
  );
}

/** Compteur à rouleaux, pour le numéro de la place. */
export function Odometer({ value, digits, label }: { value: number; digits: number; label: string }) {
  const s = String(value).padStart(digits, '0');
  return (
    <span className="em-odo" role="img" aria-label={label}>
      {s.split('').map((d, i) => (
        <span className="em-odo__cell" key={i} aria-hidden="true">
          <span className="em-odo__wheel" style={{ transform: `translateY(-${Number(d) * 10}%)` }}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((x) => (
              <span key={x}>{x}</span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}

/** Un numéro au format « N - total ». */
export function Counter({ n, total }: { n: number; total: number }) {
  return (
    <span className="em-counter">
      {n} - {total}
    </span>
  );
}

/** Le seul signe dessiné du site : la flèche, au trait. */
export function Arrow({ flip }: { flip?: boolean }) {
  return (
    <svg className={`em-arrow${flip ? ' em-arrow--flip' : ''}`} width="26" height="9" viewBox="0 0 26 9" fill="none" aria-hidden="true">
      <path d="M0 4.5h25M21 .8l4 3.7-4 3.7" stroke="currentColor" />
    </svg>
  );
}

/** L'action d'une section : petites capitales soulignées. Mène au formulaire. */
export function ActionLink({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  const click = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClick();
  };
  return (
    <a className="em-action" href="#ecrire" onClick={click}>
      {children}
    </a>
  );
}

/** A discreet link to a content page of the site (its own page, in the current language). */
export function MoreLink({ to, children, arrow }: { to: LinkedPage; children: ReactNode; arrow?: boolean }) {
  const { locale } = useI18n();
  return (
    <a className={`em-more${arrow ? ' em-more--arrow' : ''}`} href={asset(pageLinks[to][locale])}>
      {children}
      {arrow && <Arrow />}
    </a>
  );
}

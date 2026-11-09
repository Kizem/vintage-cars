import { useEffect } from 'react';
import { sectionIds, type SectionId } from '../data/site';

/*
 * Navigation section par section : un geste, une section.
 * C'est la page elle-même qui défile (et non un cadre intérieur) : sur iPhone, toucher le haut de l'écran
 * remonte en haut du site, comme ailleurs. .em-scroll contient directement les section[id] ; l'arrêt sur
 * chaque section est posé sur <html> (index.css).
 */

export const reducedMotion = () => {
  try {
    return matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
};

/* Le focus voiture et le dialogue légal suspendent la navigation entre sections. */
type Lock = 'focus' | 'dialog';
const locks = new Set<Lock>();
export const setLock = (lock: Lock, on: boolean) => void (on ? locks.add(lock) : locks.delete(lock));
export const isLocked = (lock?: Lock) => (lock ? locks.has(lock) : locks.size > 0);

/** Élément qui défile : la page (quand le site est présent), sinon rien. */
export const scroller = () => (document.querySelector('.em-scroll') ? (document.scrollingElement as HTMLElement | null) ?? document.documentElement : null);
/** Hauteur visible de la page. */
const viewH = () => window.innerHeight || document.documentElement.clientHeight;
export const sections = () => {
  const main = document.querySelector<HTMLElement>('.em-scroll');
  return main ? Array.from(main.querySelectorAll<HTMLElement>(':scope > section[id]')) : [];
};

/** Index de la section qui occupe l'écran (celle qui passe la ligne des 40 %). */
export function currentIndex() {
  if (!scroller()) return 0;
  const y = viewH() * 0.4;
  return sections().reduce((acc, el, i) => (el.getBoundingClientRect().top <= y ? i : acc), 0);
}

function sectionTop(el: HTMLElement) {
  return el.getBoundingClientRect().top + scroller()!.scrollTop;
}

let animating = false;
let animRun = 0;

/* La position finale est toujours signalée : le menu et les images ne dépendent pas
   du regroupement des événements scroll par le navigateur quand la page est chargée. */
const arrived = (_sc: HTMLElement, done?: () => void) => {
  window.dispatchEvent(new Event('scroll'));
  done?.();
};

function animateTo(y: number, done?: () => void) {
  const sc = scroller();
  if (!sc) return;
  if (reducedMotion()) {
    sc.scrollTop = y;
    arrived(sc, done);
    return;
  }
  animating = true;
  const run = ++animRun;
  sc.style.scrollSnapType = 'none';
  const y0 = sc.scrollTop;
  const t0 = performance.now();
  const dur = 820;
  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const step = (now: number) => {
    if (run !== animRun) return;
    const t = Math.min(1, (now - t0) / dur);
    sc.scrollTop = y0 + (y - y0) * ease(t);
    if (t < 1) requestAnimationFrame(step);
    else {
      sc.style.scrollSnapType = '';
      animating = false;
      arrived(sc, done);
    }
  };
  requestAnimationFrame(step);
}

/** Ferme le focus voiture s'il est ouvert. `to` : la section visée ensuite. */
export const CLOSE_FOCUS = 'epoque:closefocus';
const requestCloseFocus = (to: SectionId) => window.dispatchEvent(new CustomEvent(CLOSE_FOCUS, { detail: to }));

/**
 * Va à une section. Avec `focusHeading`, le titre de la section (tabIndex=-1)
 * reçoit le focus clavier à l'arrivée.
 */
export function scrollToId(id: SectionId, opts: { focusHeading?: boolean } = {}) {
  requestCloseFocus(id);
  const el = document.getElementById(id);
  if (!el) return;
  /* le focus attend la fin du rendu en cours : la section, inerte pendant la fiche, doit d'abord redevenir active
     (sans animation, en mouvement réduit, l'arrivée est immédiate) */
  const arrive = () => {
    if (opts.focusHeading) window.setTimeout(() => el.querySelector<HTMLElement>('h2[tabindex="-1"]')?.focus({ preventScroll: true }), 0);
  };
  if (scroller()) animateTo(sectionTop(el), arrive);
  else {
    el.scrollIntoView({ block: 'start' });
    arrive();
  }
}

function goSection(d: number) {
  if (isLocked()) return;
  const list = sections();
  const next = list[Math.max(0, Math.min(list.length - 1, currentIndex() + d))];
  if (next) animateTo(sectionTop(next));
}

const scrollableSheet = (el: Element | null | undefined) => {
  const sheet = el?.closest?.('.em-sheet');
  return !!sheet && sheet.scrollHeight > sheet.clientHeight + 1;
};

/** Molette, pavé tactile et clavier : une section à la fois. */
export function usePageNavigation() {
  /* Molette et pavé tactile : un geste amène à la section suivante, puis on attend la fin du geste */
  useEffect(() => {
    const sc = scroller();
    if (!sc) return;
    let quietUntil = 0;
    /* petits crans cumulés au sein d'un même geste (certaines souris, Firefox en lignes) */
    let acc = 0;
    let accAt = 0;
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (isLocked('focus')) {
        /* pendant le focus, la molette ne fait défiler que la fiche */
        if (!scrollableSheet(e.target as Element)) e.preventDefault();
        return;
      }
      if (isLocked('dialog')) {
        e.preventDefault();
        return;
      }
      /* l'heure de l'événement, pas celle de son traitement : une rafale reste une rafale même si la page est occupée */
      const now = e.timeStamp || performance.now();
      const dir = Math.sign(e.deltaY);
      const cur = sections()[currentIndex()];
      if (cur && !animating) {
        /* une section plus haute que l'écran se lit d'abord en entier */
        const r = cur.getBoundingClientRect();
        const h = viewH();
        if (r.height > h + 2) {
          if ((dir > 0 && r.bottom > h + 2) || (dir < 0 && r.top < -2)) return;
        }
      }
      e.preventDefault();
      if (animating || now < quietUntil) {
        quietUntil = now + 150;
        return;
      }
      /* en pixels, quelle que soit l'unité de la molette (pixels, lignes ou pages) */
      const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? viewH() : 1);
      if (now - accAt > 200 || Math.sign(acc) !== dir) acc = 0;
      acc += dy;
      accAt = now;
      if (Math.abs(acc) < 3) return;
      acc = 0;
      quietUntil = now + 150;
      goSection(dir);
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);

  /* ↑ ↓ et Page précédente / suivante entre sections, F pour le plein écran */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const a = document.activeElement as HTMLElement | null;
      if (a && (/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName) || a.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
      if (isLocked('dialog')) return;
      if (isLocked('focus')) {
        /* pendant le focus, seules les touches dans la fiche font défiler quelque chose */
        if (/^(ArrowUp|ArrowDown|PageUp|PageDown|Home|End)$/.test(e.key) && !scrollableSheet(a)) e.preventDefault();
      } else {
        if (e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && a === document.body)) {
          e.preventDefault();
          goSection(1);
        }
        if (e.key === 'ArrowUp' || e.key === 'PageUp') {
          e.preventDefault();
          goSection(-1);
        }
      }
      if (e.key === 'f' || e.key === 'F') {
        if (document.fullscreenElement) void document.exitFullscreen().catch(() => undefined);
        else void document.documentElement.requestFullscreen?.().catch(() => undefined);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* Lien direct vers une section (#ecrire…) : on y arrive sans animation */
  useEffect(() => {
    const id = window.location.hash.slice(1);
    const el = (sectionIds as readonly string[]).includes(id) ? document.getElementById(id) : null;
    const sc = scroller();
    if (el && sc) sc.scrollTop = sectionTop(el);
  }, []);
}

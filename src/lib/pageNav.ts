import { useEffect } from 'react';
import { sectionIds, type SectionId } from '../data/site';

/*
 * Navigation section par section : un geste, une section.
 * Le défilement se fait dans .em-scroll, qui contient directement les section[id].
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

export const scroller = () => document.querySelector<HTMLElement>('.em-scroll');
export const sections = () => {
  const sc = scroller();
  return sc ? Array.from(sc.querySelectorAll<HTMLElement>(':scope > section[id]')) : [];
};

/** Index de la section qui occupe l'écran (celle qui passe la ligne des 40 %). */
export function currentIndex() {
  const sc = scroller();
  if (!sc) return 0;
  const y = sc.getBoundingClientRect().top + sc.clientHeight * 0.4;
  return sections().reduce((acc, el, i) => (el.getBoundingClientRect().top <= y ? i : acc), 0);
}

function sectionTop(el: HTMLElement) {
  const sc = scroller()!;
  return el.getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop;
}

let animating = false;
let animRun = 0;

function animateTo(y: number, done?: () => void) {
  const sc = scroller();
  if (!sc) return;
  if (reducedMotion()) {
    sc.scrollTop = y;
    done?.();
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
      done?.();
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
  const arrive = () => {
    if (opts.focusHeading) el.querySelector<HTMLElement>('h2[tabindex="-1"]')?.focus({ preventScroll: true });
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
        const box = sc.getBoundingClientRect();
        if (r.height > box.height + 2) {
          if ((dir > 0 && r.bottom > box.bottom + 2) || (dir < 0 && r.top < box.top - 2)) return;
        }
      }
      e.preventDefault();
      if (animating || now < quietUntil) {
        quietUntil = now + 150;
        return;
      }
      if (Math.abs(e.deltaY) < 3) return;
      quietUntil = now + 150;
      goSection(dir);
    };
    sc.addEventListener('wheel', onWheel, { passive: false });
    return () => sc.removeEventListener('wheel', onWheel);
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

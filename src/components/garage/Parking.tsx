import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { useEnquiry } from '../../context/EnquiryContext';
import { vehicles } from '../../data/vehicles';
import { fill, useI18n } from '../../i18n/I18nContext';
import { CLOSE_FOCUS, currentIndex, isLocked, reducedMotion, setLock } from '../../lib/pageNav';
import type { ParkingCar, ParkingEngine } from '../../scene/parking';
import { hasWebGL } from '../../scene/webgl';
import { Arrow, Brand, Monogram, Odometer } from '../ui';
import { CarProfile } from './CarProfile';
import type { CarouselHandle } from './PhotoCarousel';
import { VehicleSheet } from './VehicleSheet';

const cars: ParkingCar[] = vehicles.map((v, i) => ({ n: i + 1, model: v.rendering.model, behaviour: v.rendering.behaviour }));
const total = vehicles.length;
/** Les voitures alternent seules toutes les 5 secondes environ… */
const AUTO_EVERY = 5200;
/** …sauf dans les 9 secondes qui suivent un geste (et au démarrage). */
const QUIET = 9000;

interface Drag { x: number; sx: number; moved: boolean; id: number }

/**
 * Le parking en 3D : la scène three.js est chargée à part, à la demande.
 * En attendant : le fond sombre, le monogramme et le nom de la voiture.
 * Sans WebGL (ou contexte perdu) : le profil vectoriel, avec les mêmes commandes.
 * Au clic sur la voiture, sa fiche (photos comprises) s'ouvre dans le garage, à côté d'elle :
 * à droite en paysage, en bas en portrait ; le parking reste visible et animé derrière.
 */
export function Parking({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { t, l } = useI18n();
  const { startEnquiry } = useEnquiry();
  const rootRef = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const engine = useRef<ParkingEngine | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const nameBtn = useRef<HTMLButtonElement>(null);
  const carousel = useRef<CarouselHandle>(null);
  const panel = useRef<HTMLElement>(null);
  /* part de la scène prise par la fiche (largeur en paysage, hauteur en portrait), transmise à la caméra */
  const inset = useRef(0);
  const [gl, setGl] = useState(hasWebGL);
  /* nouvel essai de la scène après une perte du contexte WebGL (fréquent au chargement sur mobile) */
  const [glTry, setGlTry] = useState(0);
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  /* les changements de voiture ne sont annoncés que s'ils viennent du visiteur */
  const [announce, setAnnounce] = useState(false);
  const unmount = useRef(0);
  const paused = useRef(false);
  /* geste en cours : bouton ou doigt posé sur la scène */
  const drag = useRef<Drag | null>(null);
  const flatHover = useRef(false);
  const refocusName = useRef(false);
  const lastTouch = useRef(performance.now());
  const latest = useRef({ gl, open, active, ready });
  latest.current = { gl, open, active, ready };
  const car = vehicles[active];
  const name = l(car.name);

  /* Démarrage de la scène, une fois la police du pochoir disponible pour les numéros au sol.
     Le canvas est créé ici et détruit au démontage : jamais deux canvas, même en StrictMode. */
  useEffect(() => {
    const box = host.current;
    if (!gl || !box) return;
    let dead = false;
    let retry = 0;
    let eng: ParkingEngine | null = null;
    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    const stop = () => {
      canvas.removeEventListener('webglcontextlost', fallBack);
      eng?.dispose();
      eng = null;
      engine.current = null;
      canvas.remove();
    };
    /* Contexte perdu ou scène impossible à créer : on garde le fond sombre et on réessaie deux fois,
       avec un canvas neuf ; le profil vectoriel ne remplace la scène qu'en dernier recours. */
    function fallBack(e?: Event) {
      e?.preventDefault();
      if (dead) return;
      dead = true;
      stop();
      setReady(false);
      if (glTry < 2) retry = window.setTimeout(() => setGlTry((n) => n + 1), 700);
      else setGl(false);
    }
    canvas.addEventListener('webglcontextlost', fallBack);
    box.appendChild(canvas);
    const font = document.fonts?.load('700 200px "Stardos Stencil"').catch(() => undefined);
    Promise.all([import('../../scene/parking'), font])
      .then(([{ createParking }]) => {
        if (dead) return;
        try {
          eng = createParking(canvas, cars, {
            reduced: reducedMotion(),
            start: latest.current.active,
            onReady: () => {
              lastTouch.current = performance.now();
              setReady(true);
            },
          });
          engine.current = eng;
          eng.inset(inset.current);
          eng.pause(paused.current);
          eng.open(latest.current.open);
          eng.start();
        } catch {
          fallBack();
        }
      })
      .catch(() => fallBack());
    return () => {
      dead = true;
      clearTimeout(retry);
      stop();
    };
  }, [gl, glTry]);

  /* Les 9 secondes de la première voiture comptent à partir de son apparition à l'écran (la classe is-ready
     posée), pas du premier rendu de la scène, qui la précède un peu sur un appareil lent. */
  useEffect(() => {
    if (ready) lastTouch.current = performance.now();
  }, [ready]);

  /* La place prise par la fiche, mesurée sur la racine et sur le panneau (le portrait : plus haut que large, comme la caméra) */
  useEffect(() => {
    const root = rootRef.current;
    const box = panel.current;
    if (!root || !box) return;
    const measure = () => {
      const w = root.clientWidth;
      const h = root.clientHeight;
      if (!w || !h) return;
      inset.current = h > w ? box.offsetHeight / h : box.offsetWidth / w;
      engine.current?.inset(inset.current);
    };
    measure();
    if (!window.ResizeObserver) return;
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    ro.observe(box);
    return () => ro.disconnect();
  }, []);

  /* Pause hors écran */
  useEffect(() => {
    const el = rootRef.current;
    if (!el || !window.IntersectionObserver) return;
    const io = new IntersectionObserver((es) => {
      paused.current = !es[0].isIntersecting;
      engine.current?.pause(paused.current);
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Les voitures alternent toutes seules, tant qu'on ne touche à rien */
  useEffect(() => {
    if (reducedMotion()) return;
    const id = window.setInterval(() => {
      if (paused.current || document.hidden || latest.current.open || drag.current) return;
      if (performance.now() - lastTouch.current < QUIET) return;
      const a = document.activeElement;
      if (a && rootRef.current?.contains(a) && a.matches(':focus-visible')) return;
      const e = engine.current;
      if (e) {
        if (!latest.current.ready || e.state.drag || e.state.open || e.state.hover >= 0) return;
        e.step(1);
        setActive(e.active());
      } else if (!latest.current.gl) {
        if (flatHover.current) return;
        setActive((x) => (x + 1) % total);
      } else return;
      setAnnounce(false);
    }, AUTO_EVERY);
    return () => clearInterval(id);
  }, []);

  const step = (d: number) => {
    lastTouch.current = performance.now();
    refocusName.current = document.activeElement === nameBtn.current;
    setAnnounce(true);
    const e = engine.current;
    if (e) {
      e.step(d);
      setActive(e.active());
    } else setActive((x) => (x + d + total) % total);
  };

  /* le nom est recréé à chaque voiture (pour son animation) : il garde le focus clavier */
  useEffect(() => {
    if (refocusName.current) nameBtn.current?.focus({ preventScroll: true });
    refocusName.current = false;
  }, [active]);

  const openSheet = () => {
    clearTimeout(unmount.current);
    setMounted(true);
    onOpenChange(true);
    engine.current?.open(true);
  };
  const closeSheet = (restoreFocus: boolean) => {
    lastTouch.current = performance.now();
    onOpenChange(false);
    engine.current?.open(false);
    clearTimeout(unmount.current);
    unmount.current = window.setTimeout(() => setMounted(false), 500);
    if (restoreFocus) window.setTimeout(() => nameBtn.current?.focus({ preventScroll: true }), 60);
  };
  const actions = useRef({ step, closeSheet });
  actions.current = { step, closeSheet };

  /* À l'ouverture seulement, le focus va au nom de la voiture ; changer de voiture fiche ouverte le laisse sur la flèche */
  useEffect(() => {
    if (open) heading.current?.focus({ preventScroll: true });
  }, [open]);

  /* Fiche ouverte, la page ne change plus de section */
  useEffect(() => {
    setLock('focus', open);
    return () => setLock('focus', false);
  }, [open]);

  /* Clavier : Échap ferme la fiche ; ← → changent de voiture, ou de photo quand la fiche est ouverte */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isLocked('dialog') || e.metaKey || e.ctrlKey || e.altKey) return;
      const a = document.activeElement;
      if (a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)) return;
      const isOpen = latest.current.open;
      if (e.key === 'Escape' && isOpen) {
        actions.current.closeSheet(true);
        return;
      }
      if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && currentIndex() === 0) {
        e.preventDefault();
        const d = e.key === 'ArrowRight' ? 1 : -1;
        if (isOpen) carousel.current?.step(d);
        else actions.current.step(d);
      }
    };
    /* un clic dans le menu ferme la fiche */
    const onClose = (e: Event) => {
      if (latest.current.open) actions.current.closeSheet((e as CustomEvent<string>).detail === 'garage');
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener(CLOSE_FOCUS, onClose);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener(CLOSE_FOCUS, onClose);
    };
  }, []);

  /* Souris et doigt sur la scène */
  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button && e.button !== 0) return;
    lastTouch.current = performance.now();
    drag.current = { x: e.clientX, sx: e.clientX, moved: false, id: e.pointerId };
    const en = engine.current;
    if (en) en.setHover(en.pick(e.clientX, e.clientY));
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const en = engine.current;
    if (!en) return;
    const r = e.currentTarget.getBoundingClientRect();
    const d = drag.current;
    if (e.pointerType === 'mouse' || d) en.pointer(((e.clientX - r.left) / r.width - 0.5) * 2, ((e.clientY - r.top) / r.height - 0.5) * 2);
    if (d) {
      const dx = e.clientX - d.x;
      if (!d.moved && Math.abs(e.clientX - d.sx) > 7) {
        d.moved = true;
        en.drag(true);
        try {
          e.currentTarget.setPointerCapture(d.id);
        } catch {
          /* sans capture */
        }
      }
      if (d.moved) {
        en.dragBy(dx);
        const near = ((Math.round(en.state.pos) % total) + total) % total;
        if (near !== active) setActive(near);
      }
      d.x = e.clientX;
      return;
    }
    if (e.pointerType === 'mouse') {
      /* fiche ouverte, le survol peut aussi allumer une voisine */
      const h = en.pick(e.clientX, e.clientY);
      en.setHover(h);
      /* main sur une voiture cliquable ; la voiture déjà ouverte et le vide se saisissent pour glisser */
      e.currentTarget.style.cursor = h >= 0 && !(open && h === en.active()) ? 'pointer' : 'grab';
    }
  };
  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    const en = engine.current;
    const d = drag.current;
    drag.current = null;
    lastTouch.current = performance.now();
    if (!en || !d) return;
    if (d.moved) {
      en.drag(false);
      setActive(en.active());
      setAnnounce(true);
      if (e.pointerType !== 'mouse') en.setHover(-1);
      return;
    }
    const hit = en.pick(e.clientX, e.clientY);
    if (e.pointerType !== 'mouse') window.setTimeout(() => en.setHover(-1), 700);
    /* fiche ouverte : un clic dans le vide du parking la referme */
    if (hit < 0) {
      if (open) closeSheet(false);
      return;
    }
    /* Fiche fermée, une voisine passe d'abord au premier plan et seule la voiture principale ouvre sa fiche.
       Fiche ouverte, une autre voiture visible prend la fiche. */
    if (hit !== en.active()) {
      en.go(hit);
      setActive(hit);
      setAnnounce(true);
      return;
    }
    if (!open) openSheet();
  };
  const onCancel = () => {
    const en = engine.current;
    const d = drag.current;
    drag.current = null;
    if (!en) return;
    if (d?.moved) {
      en.drag(false);
      setActive(en.active());
    }
    en.setHover(-1);
  };
  const onLeave = () => {
    /* bouton relâché hors de la scène sans avoir glissé : le geste est fini */
    if (drag.current && !drag.current.moved) drag.current = null;
    const en = engine.current;
    if (!en) return;
    en.setHover(-1);
    en.pointer(0, 0);
  };

  /* Sans WebGL : glisser change de voiture, toucher le profil ouvre la fiche */
  const flatDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button && e.button !== 0) return;
    lastTouch.current = performance.now();
    drag.current = { x: e.clientX, sx: e.clientX, moved: false, id: e.pointerId };
  };
  const flatUp = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    const dx = e.clientX - d.sx;
    if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
    else if (Math.abs(dx) < 8) {
      /* toucher le profil ouvre la fiche ; fiche ouverte, toucher à côté la referme */
      const onCar = !!(e.target as Element).closest?.('.em-profile');
      if (!open && onCar) openSheet();
      else if (open && !onCar) closeSheet(false);
    }
  };

  const hover = (on: boolean) => {
    flatHover.current = on;
    engine.current?.setHover(on ? active : -1);
  };

  return (
    <div className={`em-parking${open ? ' is-open' : ''}${ready || !gl ? ' is-ready' : ''}`} ref={rootRef}>
      {gl ? (
        <div
          className="em-parking__gl"
          ref={host}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onCancel}
          onPointerLeave={onLeave}
        />
      ) : (
        <div
          className="em-parking__flat"
          role="img"
          aria-label={l(car.rendering.alt)}
          onPointerDown={flatDown}
          onPointerUp={flatUp}
          onPointerCancel={() => (drag.current = null)}
          onPointerEnter={() => (flatHover.current = true)}
          onPointerLeave={() => {
            flatHover.current = false;
            drag.current = null;
          }}
        >
          <CarProfile model={car.rendering.model} />
        </div>
      )}
      {gl && (
        <div className="em-parking__intro" aria-hidden="true">
          <Monogram />
        </div>
      )}
      <div className="em-parking__top">
        <Brand className="em-brand--garage" />
        <h1 className="em-parking__h1">{t.garage.h1}</h1>
      </div>
      <div className="em-parking__bottom" inert={open}>
        <button type="button" className="em-parking__arrow" aria-label={t.garage.prev} onClick={() => step(-1)}>
          <Arrow flip />
        </button>
        <div className="em-parking__who" aria-live={announce ? 'polite' : 'off'}>
          <p className="em-no">
            <span className="em-sr">{t.garage.place} </span>
            <Odometer value={active + 1} digits={1} label={`${active + 1} / ${total}`} /> <span aria-hidden="true">- {total}</span>
          </p>
          <button
            ref={nameBtn}
            type="button"
            className="em-parking__name"
            key={car.slug}
            onClick={openSheet}
            aria-label={fill(t.garage.seeSheet, { name })}
            onMouseEnter={() => hover(true)}
            onMouseLeave={() => hover(false)}
            onFocus={() => hover(true)}
            onBlur={() => hover(false)}
          >
            {name}
          </button>
          <p className="em-parking__sub">
            <span className="em-only-hover">{t.garage.slide}</span>
            <span className="em-only-touch">{t.garage.slideTouch}</span>
          </p>
        </div>
        <button type="button" className="em-parking__arrow" aria-label={t.garage.next} onClick={() => step(1)}>
          <Arrow />
        </button>
      </div>
      <p className="em-parking__label" aria-hidden={!open}>
        {t.focus.rendering}
      </p>
      <aside className="em-parking__panel" aria-label={t.focus.label} inert={!open} ref={panel}>
        <div className="em-panel__bar">
          <div className="em-panel__cars">
            <button type="button" className="em-panel__arrow" aria-label={fill(t.focus.prevCar, { name: l(vehicles[(active - 1 + total) % total].name) })} onClick={() => step(-1)}>
              <Arrow flip />
            </button>
            <button type="button" className="em-panel__arrow" aria-label={fill(t.focus.nextCar, { name: l(vehicles[(active + 1) % total].name) })} onClick={() => step(1)}>
              <Arrow />
            </button>
          </div>
          <button type="button" className="em-panel__close" onClick={() => closeSheet(true)} aria-label={t.focus.close}>
            {t.focus.closeShort}
          </button>
        </div>
        {mounted && (
          <VehicleSheet
            key={car.slug}
            car={car}
            n={active + 1}
            headingRef={heading}
            carouselRef={carousel}
            onEnquire={() => startEnquiry({ vehicle: car.slug })}
          />
        )}
      </aside>
    </div>
  );
}

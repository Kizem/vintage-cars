import { useEffect, useImperativeHandle, useRef, useState, type Ref } from 'react';
import type { MediaAsset } from '../../data/types';
import { useI18n } from '../../i18n/I18nContext';
import { reducedMotion, setLock } from '../../lib/pageNav';
import { Arrow, Counter } from '../ui';

export interface CarouselHandle {
  /** Photo suivante (1) ou précédente (-1), en boucle. */
  step: (d: number) => void;
}

/**
 * Les photos de la voiture, en grand, d'un bord à l'autre de la fiche : toutes dans le même cadre carré
 * (recadrées autour de `focalPoint`), qu'elles soient en portrait ou en paysage. Un clic ouvre la photo
 * entière en plein écran. La légende est réservée aux lecteurs d'écran ; la mention « Photo d'illustration »
 * reste affichée, sur la photo.
 * Flèches à l'écran, glissement du doigt, ← → au clavier (relayés par le parking, ou par le plein écran).
 * Monté seulement à l'ouverture de la fiche : les photos ne se chargent qu'à ce moment.
 */
export function PhotoCarousel({ photos, label, ref }: { photos: MediaAsset[]; label: string; ref?: Ref<CarouselHandle> }) {
  const { t, l } = useI18n();
  const track = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDialogElement>(null);
  const [i, setI] = useState(0);
  const [big, setBig] = useState(false);
  /* photo visée par les flèches, tant que le défilement animé n'y est pas arrivé */
  const target = useRef<number | null>(null);
  /* glissement du doigt en plein écran */
  const swipe = useRef<number | null>(null);
  const n = photos.length;

  const go = (k: number) => {
    const el = track.current;
    if (!el || !n) return;
    const to = (k + n) % n;
    target.current = to;
    el.scrollTo({ left: to * el.clientWidth, behavior: reducedMotion() || big ? 'auto' : 'smooth' });
    setI(to);
  };
  useImperativeHandle(ref, () => ({ step: (d: number) => go(i + d) }));

  /* Plein écran : dialogue modal ; le parking ignore le clavier pendant ce temps (verrou 'dialog') */
  useEffect(() => {
    const d = box.current;
    if (!d) return;
    if (big && !d.open) d.showModal();
    if (!big && d.open) d.close();
    setLock('dialog', big);
    return () => setLock('dialog', false);
  }, [big]);

  const onScroll = () => {
    const el = track.current;
    if (!el || !el.clientWidth) return;
    /* pendant un défilement lancé par les flèches, les positions intermédiaires ne changent pas la photo courante */
    if (target.current !== null) {
      if (Math.abs(el.scrollLeft - target.current * el.clientWidth) < 2) target.current = null;
      return;
    }
    const k = Math.round(el.scrollLeft / el.clientWidth);
    if (k !== i && k >= 0 && k < n) setI(k);
  };
  /* le doigt ou la molette reprennent la main */
  const release = () => {
    target.current = null;
  };

  if (!n) return null;
  const p = photos[Math.min(i, n - 1)];
  const pager = (cls: string) =>
    n > 1 && (
      <div className={cls}>
        <button type="button" aria-label={t.focus.prevPhoto} onClick={() => go(i - 1)}>
          <Arrow flip />
        </button>
        <Counter n={i + 1} total={n} />
        <button type="button" aria-label={t.focus.nextPhoto} onClick={() => go(i + 1)}>
          <Arrow />
        </button>
      </div>
    );
  return (
    <div className="em-carousel" role="group" aria-roledescription="carousel" aria-label={label}>
      <div className="em-carousel__track" ref={track} onScroll={onScroll} onPointerDown={release} onTouchStart={release} onWheel={release} tabIndex={0}>
        {photos.map((x, k) => (
          <figure className="em-carousel__slide" key={x.src} aria-hidden={k === i ? undefined : true}>
            <button type="button" className="em-carousel__open" onClick={() => setBig(true)} aria-label={`${t.focus.enlarge} : ${l(x.alt)}`} tabIndex={k === i ? 0 : -1}>
              <img
                src={x.src}
                srcSet={x.srcSet}
                sizes={x.srcSet ? '(orientation: portrait) 100vw, 34rem' : undefined}
                width={x.width}
                height={x.height}
                alt=""
                loading={k === 0 ? 'eager' : 'lazy'}
                decoding="async"
                draggable={false}
                style={x.focalPoint ? { objectPosition: x.focalPoint } : undefined}
              />
            </button>
            {x.credit && <span className="em-carousel__credit">{l(x.credit)}</span>}
          </figure>
        ))}
      </div>
      {/* la légende (« Trois-quarts avant »…) n'est pas affichée : elle reste lue par les lecteurs d'écran */}
      <p className="em-sr" aria-live="polite">
        {p.caption && l(p.caption)}
      </p>
      {pager('em-carousel__pager')}

      <dialog
        ref={box}
        className="em-lightbox"
        aria-label={label}
        onClose={() => setBig(false)}
        onClick={(e) => e.target === e.currentTarget && setBig(false)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault();
            go(i + (e.key === 'ArrowRight' ? 1 : -1));
          }
        }}
      >
        {big && (
          <>
            <button type="button" className="em-lightbox__close" onClick={() => setBig(false)}>
              {t.focus.closeShort}
            </button>
            <figure
              className="em-lightbox__fig"
              onClick={(e) => e.target === e.currentTarget && setBig(false)}
              onPointerDown={(e) => {
                swipe.current = e.clientX;
              }}
              onPointerUp={(e) => {
                const dx = swipe.current === null ? 0 : e.clientX - swipe.current;
                swipe.current = null;
                if (Math.abs(dx) > 50) go(i + (dx < 0 ? 1 : -1));
              }}
            >
              <img src={p.src} srcSet={p.srcSet} sizes="100vw" width={p.width} height={p.height} alt={l(p.alt)} draggable={false} />
              {p.credit && <span className="em-carousel__credit">{l(p.credit)}</span>}
            </figure>
            {pager('em-lightbox__pager')}
          </>
        )}
      </dialog>
    </div>
  );
}

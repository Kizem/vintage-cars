import { useImperativeHandle, useRef, useState, type Ref } from 'react';
import type { MediaAsset } from '../../data/types';
import { useI18n } from '../../i18n/I18nContext';
import { reducedMotion } from '../../lib/pageNav';
import { Arrow, Counter } from '../ui';

export interface CarouselHandle {
  /** Photo suivante (1) ou précédente (-1), en boucle. */
  step: (d: number) => void;
}

/**
 * Les photos de la voiture, entières (sans recadrage). La légende est réservée aux lecteurs d'écran ;
 * la mention « Photo d'illustration » reste affichée.
 * Flèches à l'écran, glissement du doigt, ← → au clavier (relayés par le parking).
 * Monté seulement à l'ouverture de la fiche : les photos ne se chargent qu'à ce moment.
 */
export function PhotoCarousel({ photos, label, ref }: { photos: MediaAsset[]; label: string; ref?: Ref<CarouselHandle> }) {
  const { t, l } = useI18n();
  const track = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  /* photo visée par les flèches, tant que le défilement animé n'y est pas arrivé */
  const target = useRef<number | null>(null);
  const n = photos.length;

  const go = (k: number) => {
    const el = track.current;
    if (!el || !n) return;
    const to = (k + n) % n;
    target.current = to;
    el.scrollTo({ left: to * el.clientWidth, behavior: reducedMotion() ? 'auto' : 'smooth' });
    setI(to);
  };
  useImperativeHandle(ref, () => ({ step: (d: number) => go(i + d) }));

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
  return (
    <div className="em-carousel" role="group" aria-roledescription="carousel" aria-label={label}>
      <div className="em-carousel__track" ref={track} onScroll={onScroll} onPointerDown={release} onTouchStart={release} onWheel={release} tabIndex={0}>
        {photos.map((x, k) => (
          <figure className="em-carousel__slide" key={x.src} aria-hidden={k === i ? undefined : true}>
            <img
              src={x.src}
              srcSet={x.srcSet}
              sizes={x.srcSet ? '(orientation: portrait) 100vw, 34rem' : undefined}
              width={x.width}
              height={x.height}
              alt={l(x.alt)}
              loading={k === 0 ? 'eager' : 'lazy'}
              decoding="async"
              draggable={false}
            />
          </figure>
        ))}
      </div>
      <div className="em-carousel__bar">
        <p className="em-carousel__cap" aria-live="polite">
          {/* la légende (« Trois-quarts avant »…) n'est pas affichée : elle reste lue par les lecteurs d'écran */}
          {p.caption && <span className="em-sr">{l(p.caption)}</span>}
          {p.credit && <span className="em-carousel__credit">{l(p.credit)}</span>}
        </p>
        {n > 1 && (
          <div className="em-carousel__pager">
            <button type="button" aria-label={t.focus.prevPhoto} onClick={() => go(i - 1)}>
              <Arrow flip />
            </button>
            <Counter n={i + 1} total={n} />
            <button type="button" aria-label={t.focus.nextPhoto} onClick={() => go(i + 1)}>
              <Arrow />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

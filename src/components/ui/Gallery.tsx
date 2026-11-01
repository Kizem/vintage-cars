import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import type { MediaAsset } from '../../data/types';
import { fill, useI18n } from '../../i18n/I18nContext';
import { Media } from './Media';

interface GalleryProps {
  images: MediaAsset[];
  /** Vehicle name, used in accessible labels. */
  name: string;
  mark?: string;
  tone?: 'forest' | 'stone' | 'charcoal';
  className?: string;
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Photo carousel for the detail view. Uses native horizontal scrolling with
 * scroll-snap (touch swipe for free), plus arrow buttons and keyboard arrows.
 */
export function Gallery({ images, name, mark, tone = 'forest', className = '' }: GalleryProps) {
  const { t } = useI18n();
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const count = images.length;

  const goTo = useCallback(
    (i: number) => {
      const el = track.current;
      if (!el) return;
      const next = (i + count) % count;
      el.scrollTo({ left: next * el.clientWidth, behavior: reducedMotion() ? 'auto' : 'smooth' });
    },
    [count],
  );

  // Keep the counter in sync with swipes and button navigation.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => setIndex(Math.round(el.scrollLeft / Math.max(el.clientWidth, 1)));
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      goTo(index + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goTo(index - 1);
    }
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label={fill(t.gallery.label, { name })}
      className={className}
      onKeyDown={count > 1 ? onKeyDown : undefined}
    >
      <div ref={track} className="no-scrollbar flex aspect-[3/2] snap-x snap-mandatory overflow-x-auto overscroll-x-contain bg-forest-deep md:rounded-xs">
        {images.map((img, i) => (
          <div
            key={img.src || i}
            role="group"
            aria-roledescription="slide"
            aria-label={fill(t.gallery.slide, { n: i + 1, total: count })}
            aria-hidden={i !== index}
            className="h-full w-full shrink-0 snap-center"
          >
            <Media
              image={img}
              mark={mark}
              tone={tone}
              showBrief
              priority={i === 0}
              sizes="(min-width: 768px) 55vw, 100vw"
              className="h-full w-full"
            />
          </div>
        ))}
      </div>

      {count > 1 && (
        <div className="flex items-center justify-between px-6 pt-4 sm:px-10 md:px-0">
          <p aria-live="polite" className="eyebrow text-muted-ink">
            {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </p>
          <div className="flex gap-2">
            {(['prev', 'next'] as const).map((dir) => (
              <button
                key={dir}
                type="button"
                onClick={() => goTo(index + (dir === 'next' ? 1 : -1))}
                aria-label={t.gallery[dir]}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-charcoal/25 text-forest transition-colors duration-300 hover:border-forest hover:bg-forest hover:text-ivory"
              >
                <svg aria-hidden="true" width="18" height="8" viewBox="0 0 22 8" fill="none" className={dir === 'prev' ? 'rotate-180' : ''}>
                  <path d="M0 4h20.5M17.5 1l3 3-3 3" stroke="currentColor" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

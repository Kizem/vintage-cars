import { useEffect, useRef, useState, type RefObject } from 'react';
import type { MediaAsset } from '../data/types';
import { useI18n } from '../i18n/I18nContext';
import { scroller } from '../lib/pageNav';

/**
 * L'image se charge à l'approche de sa section : rien au démarrage, puis,
 * dès que la page défile, tout ce qui se trouve à moins d'un écran.
 */
function useNear(ref: RefObject<HTMLElement | null>) {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    const sc = scroller();
    if (near || !el) return;
    if (!sc || !('IntersectionObserver' in window)) {
      setNear(true);
      return;
    }
    let io: IntersectionObserver | null = null;
    const watch = () => {
      io = new IntersectionObserver((entries) => entries.some((x) => x.isIntersecting) && setNear(true), {
        root: sc,
        rootMargin: '100% 0px',
      });
      io.observe(el);
    };
    if (sc.scrollTop > 0) watch();
    else sc.addEventListener('scroll', watch, { once: true, passive: true });
    return () => {
      sc.removeEventListener('scroll', watch);
      io?.disconnect();
    };
  }, [near, ref]);
  return near;
}

export function SectionImage({ image, sizes }: { image: MediaAsset; sizes: string }) {
  const { l } = useI18n();
  const frame = useRef<HTMLDivElement>(null);
  const near = useNear(frame);
  return (
    <figure className="em-figure">
      <div className="em-figure__frame" ref={frame}>
        <img
          src={near ? image.src : undefined}
          srcSet={near ? image.srcSet : undefined}
          sizes={image.srcSet ? sizes : undefined}
          width={image.width}
          height={image.height}
          alt={l(image.alt)}
          decoding="async"
          style={{ objectPosition: image.focalPoint }}
        />
        {image.credit && <span className="em-credit">{l(image.credit)}</span>}
      </div>
    </figure>
  );
}

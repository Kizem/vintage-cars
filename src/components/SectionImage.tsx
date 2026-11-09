import { useEffect, useRef, useState, type RefObject } from 'react';
import type { MediaAsset } from '../data/types';
import { useI18n } from '../i18n/I18nContext';
import { scroller } from '../lib/pageNav';
import { asset, assetSet } from '../lib/paths';

/**
 * L'image se charge à l'approche de sa section : rien au démarrage, puis,
 * dès que la page défile, tout ce qui se trouve à moins d'un écran.
 */
function useNear(ref: RefObject<HTMLElement | null>) {
  /* pré-rendu (pas de window) : l'image est dans le HTML, chargée paresseusement par le navigateur */
  const [near, setNear] = useState(() => typeof window === 'undefined');
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

/** `natural` : la photo entière (sans recadrage), comme dans un portfolio. Sa légende n'est pas affichée :
    elle reste lue par les lecteurs d'écran, en description de la figure. */
export function SectionImage({ image, sizes, natural = false }: { image: MediaAsset; sizes: string; natural?: boolean }) {
  const { l } = useI18n();
  const frame = useRef<HTMLDivElement>(null);
  const near = useNear(frame);
  return (
    <figure className={`em-figure${natural ? ' em-figure--natural' : ''}`}>
      {natural && image.caption && <figcaption className="em-sr">{l(image.caption)}</figcaption>}
      <div className="em-figure__frame" ref={frame}>
        <img
          src={near ? asset(image.src) : undefined}
          srcSet={near ? assetSet(image.srcSet) : undefined}
          sizes={image.srcSet ? sizes : undefined}
          width={image.width}
          height={image.height}
          alt={l(image.alt)}
          decoding="async"
          loading="lazy"
          style={natural ? undefined : { objectPosition: image.focalPoint }}
        />
        {image.credit && <span className="em-credit">{l(image.credit)}</span>}
      </div>
    </figure>
  );
}

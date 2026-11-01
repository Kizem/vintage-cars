import type { MediaAsset } from '../../data/types';
import { useI18n } from '../../i18n/I18nContext';

type Tone = 'forest' | 'stone' | 'charcoal';

const toneClasses: Record<Tone, string> = {
  forest: 'bg-forest text-ivory',
  stone: 'bg-[#cfc8b8] text-charcoal',
  charcoal: 'bg-[#2c2c28] text-ivory',
};

const captionPos = {
  'bottom-left': 'bottom-4 left-4 sm:bottom-5 sm:left-5 text-left',
  'bottom-right': 'bottom-4 right-4 sm:bottom-5 sm:right-5 text-right items-end',
  'top-right': 'top-4 right-4 sm:top-5 sm:right-5 text-right items-end',
  /** Below the fixed header (hero). */
  'under-header': 'top-[92px] right-5 sm:right-8 lg:top-[112px] lg:right-14 text-right items-end',
};

interface MediaProps {
  image: MediaAsset;
  className?: string;
  imgClassName?: string;
  /** Load eagerly with high priority (hero only). */
  priority?: boolean;
  sizes?: string;
  tone?: Tone;
  /** Large typographic mark shown on placeholders (e.g. "DS"). */
  mark?: string;
  captionPosition?: keyof typeof captionPos;
  showBrief?: boolean;
}

/**
 * Renders a photograph or, while the final photography is not yet supplied,
 * a clearly identified placeholder carrying the shot description.
 */
export function Media({
  image,
  className = '',
  imgClassName = '',
  priority = false,
  sizes = '100vw',
  tone = 'forest',
  mark,
  captionPosition = 'bottom-left',
  showBrief = false,
}: MediaProps) {
  const { t, l } = useI18n();

  if (image.src) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <img
          src={image.src}
          srcSet={image.srcSet}
          sizes={image.srcSet ? sizes : undefined}
          alt={l(image.alt)}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          style={{ objectPosition: image.focalPoint }}
          className={`h-full w-full object-cover ${imgClassName}`}
        />
        {image.credit && (
          <span className="absolute right-3 bottom-2 text-[10px] tracking-wide text-ivory/70">{image.credit}</span>
        )}
      </div>
    );
  }

  const dark = tone !== 'stone';
  return (
    <div
      role="img"
      aria-label={`${l(image.alt)} (${t.common.photoToCome})`}
      data-placeholder="image"
      className={`grain relative isolate overflow-hidden ${toneClasses[tone]} ${className}`}
    >
      {/* hairline inner frame */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-3 rounded-xs border sm:inset-4 ${dark ? 'border-ivory/12' : 'border-charcoal/12'} ${imgClassName}`}
      />
      {mark && (
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 flex items-center justify-center font-display text-[clamp(4.5rem,13vw,9rem)] leading-none italic select-none ${dark ? 'text-ivory/[0.07]' : 'text-charcoal/[0.08]'}`}
        >
          {mark}
        </span>
      )}
      <div aria-hidden="true" className={`absolute z-10 flex max-w-[78%] flex-col gap-1 ${captionPos[captionPosition]}`}>
        <span className={`eyebrow !text-[9.5px] !tracking-[0.22em] ${dark ? 'text-champagne' : 'text-muted-ink'}`}>
          {t.common.imagePlaceholder}
        </span>
        <span className={`text-[12px] leading-snug ${dark ? 'text-ivory/75' : 'text-charcoal/75'}`}>{l(image.placeholderLabel)}</span>
        {showBrief && image.brief && (
          <span className={`hidden text-[11px] leading-snug lg:block ${dark ? 'text-ivory/50' : 'text-charcoal/55'}`}>
            {l(image.brief)}
          </span>
        )}
      </div>
    </div>
  );
}

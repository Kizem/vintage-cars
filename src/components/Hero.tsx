import type { CSSProperties } from 'react';
import { heroImage } from '../data/site';
import { useI18n } from '../i18n/I18nContext';
import { Media } from './ui/Media';
import { ButtonLink } from './ui/Button';

const delay = (ms: number) => ({ '--hero-delay': `${ms}ms` }) as CSSProperties;

export function Hero() {
  const { t } = useI18n();
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[max(640px,100svh)] items-end overflow-hidden bg-forest-deep text-ivory md:min-h-[max(640px,88vh)]"
    >
      <Media
        image={heroImage}
        priority
        tone="charcoal"
        captionPosition="under-header"
        creditPosition="under-header"
        className="!absolute inset-0 -z-10"
        imgClassName="hero-media"
        showBrief
      />
      {/* Readability overlays, darker where the text sits (functional, not decorative) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(16_28_22/0.55)_0%,rgb(16_28_22/0.08)_32%,rgb(16_28_22/0.35)_62%,rgb(16_28_22/0.86)_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 hidden bg-[linear-gradient(90deg,rgb(16_28_22/0.7)_0%,rgb(16_28_22/0.35)_40%,transparent_62%)] lg:block"
      />

      {/* Top padding reserves the space of the fixed header: the content can grow but never slides under it. */}
      <div className="page-gutter mx-auto w-full max-w-[var(--container-page)] pt-36 pb-14 sm:pb-16 lg:pt-44 lg:pb-20">
        {/* Text stays in the left half so the car (right of the image) remains visible. */}
        <div className="max-w-[44rem]">
          <div>
            <p className="eyebrow hero-in mb-6 flex items-center gap-4 text-champagne" style={delay(150)}>
              <span aria-hidden="true" className="h-px w-10 bg-champagne/70" />
              {t.hero.eyebrow}
            </p>
            <h1
              id="hero-title"
              className="hero-in max-w-[16ch] text-[clamp(2.5rem,min(7.4vw,11.5svh),6.4rem)] leading-[0.98] font-light"
              style={delay(300)}
            >
              {t.hero.titleStart} <em className="font-normal italic">{t.hero.titleEm}</em>
              {t.hero.titleEnd}
            </h1>
          </div>
          <div className="hero-in mt-8" style={delay(550)}>
            <p className="max-w-md text-[1.0625rem] leading-relaxed text-ivory/90">{t.hero.text}</p>
          </div>
        </div>

        <div className="hero-in mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8" style={delay(750)}>
          <ButtonLink href="#collection" variant="light" arrow>
            {t.hero.ctaPrimary}
          </ButtonLink>
          <ButtonLink href="#experiences" variant="text-light" className="self-start sm:self-auto">
            {t.hero.ctaSecondary}
          </ButtonLink>
        </div>

        <div className="mt-12 hidden items-center border-t border-line-light pt-5 text-ivory/70 md:flex">
          <p className="eyebrow">{t.hero.strap}</p>
        </div>
      </div>
    </section>
  );
}

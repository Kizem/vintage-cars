import type { CSSProperties } from 'react';
import { heroImage, site } from '../data/site';
import { Media } from './ui/Media';
import { ButtonLink } from './ui/Button';

const delay = (ms: number) => ({ '--hero-delay': `${ms}ms` }) as CSSProperties;

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate flex min-h-[640px] h-[100svh] max-h-[1000px] items-end overflow-hidden bg-forest-deep text-ivory md:h-[88vh]">
      <Media
        image={heroImage}
        priority
        tone="charcoal"
        captionPosition="under-header"
        className="!absolute inset-0 -z-10"
        imgClassName="hero-media"
        showBrief
      />
      {/* Readability overlay: darker at the bottom where the text sits */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(16_28_22/0.55)_0%,rgb(16_28_22/0.08)_32%,rgb(16_28_22/0.35)_62%,rgb(16_28_22/0.86)_100%)]"
      />

      <div className="page-gutter mx-auto w-full max-w-[var(--container-page)] pb-14 sm:pb-16 lg:pb-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="eyebrow hero-in mb-6 flex items-center gap-4 text-champagne" style={delay(150)}>
              <span aria-hidden="true" className="h-px w-10 bg-champagne/70" />
              French Automotive Heritage
            </p>
            <h1
              id="hero-title"
              className="hero-in max-w-[15ch] text-[clamp(2.9rem,7.4vw,6.4rem)] leading-[0.98] font-light"
              style={delay(300)}
            >
              Some journeys deserve a <em className="font-normal italic">timeless</em> car.
            </h1>
          </div>
          <div className="hero-in lg:col-span-4 lg:pb-3" style={delay(550)}>
            <p className="max-w-md text-[1.0625rem] leading-relaxed text-ivory/85">
              Discover Paris behind the wheel of automotive icons, through private experiences crafted around elegance,
              history and authenticity.
            </p>
          </div>
        </div>

        <div className="hero-in mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8" style={delay(750)}>
          <ButtonLink href="#collection" variant="light" arrow>
            Discover our collection
          </ButtonLink>
          <ButtonLink href="#experiences" variant="text-light" className="self-start sm:self-auto">
            Explore our experiences
          </ButtonLink>
        </div>

        <div className="mt-12 hidden items-center justify-between border-t border-line-light pt-5 text-ivory/70 md:flex">
          <p className="font-display text-lg italic">{site.tagline}</p>
          <p className="eyebrow">Paris · Private experiences by enquiry</p>
        </div>
      </div>
    </section>
  );
}

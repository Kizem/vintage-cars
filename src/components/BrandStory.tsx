import { storyImages, site } from '../data/site';
import { Media } from './ui/Media';
import { Reveal } from './ui/Reveal';

export function BrandStory() {
  return (
    <section id="story" aria-labelledby="story-title" className="overflow-hidden bg-offwhite py-24 sm:py-32 lg:py-44">
      <div className="page-gutter mx-auto grid max-w-[var(--container-page)] gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="relative lg:col-span-6">
          <Reveal>
            <Media
              image={storyImages.primary}
              tone="forest"
              className="aspect-[4/5] w-full max-w-[560px] rounded-xs"
              sizes="(min-width:1024px) 45vw, 100vw"
              showBrief
            />
          </Reveal>
          <Reveal
            delay={200}
            className="absolute right-0 -bottom-10 w-[42%] max-w-[240px] border-[6px] border-offwhite sm:-bottom-12 lg:right-[-1rem]"
          >
            <Media image={storyImages.detail} tone="stone" className="aspect-square w-full" sizes="240px" />
          </Reveal>
        </div>

        <div className="flex flex-col justify-center lg:col-span-5 lg:col-start-8">
          <Reveal>
            <p className="eyebrow mb-6 flex items-center gap-4 text-forest">
              <span aria-hidden="true" className="h-px w-10 bg-champagne" />
              Our Story
            </p>
            <h2 id="story-title" className="mb-10 text-[clamp(2.4rem,4.6vw,3.9rem)] leading-[1.03] text-forest">
              An Appreciation for <em className="italic">Timeless Design.</em>
            </h2>
          </Reveal>
          <Reveal delay={120} className="space-y-6 text-[1.0625rem] leading-[1.8] text-charcoal/85">
            <p className="font-display text-[1.6rem] leading-[1.35] text-forest first-letter:float-left first-letter:mt-1 first-letter:mr-3 first-letter:text-[4.4rem] first-letter:leading-[0.8] first-letter:text-champagne">
              Some automobiles transcend their original purpose. They become symbols of an era, expressions of
              craftsmanship and pieces of cultural heritage.
            </p>
            <p>At Époque Motors, we believe these icons deserve to be experienced, not simply admired.</p>
            <p>
              Our ambition is to share the beauty of classic motoring through personal, authentic and memorable
              experiences in Paris.
            </p>
          </Reveal>
          <Reveal delay={200} className="mt-12 border-t border-line pt-6">
            <p className="font-display text-xl text-forest italic">{site.tagline}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

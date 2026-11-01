import type { Experience } from '../data/types';
import { experiences } from '../data/experiences';
import { useEnquiry } from '../context/EnquiryContext';
import { useI18n } from '../i18n/I18nContext';
import { SectionIntro } from './ui/SectionIntro';
import { Reveal } from './ui/Reveal';
import { Media } from './ui/Media';
import { Button } from './ui/Button';

function ExperienceText({ exp, onEnquire, compact = false }: { exp: Experience; onEnquire: () => void; compact?: boolean }) {
  const { t, l } = useI18n();
  return (
    <div>
      <div className="mb-7 flex items-center gap-5">
        <span aria-hidden="true" className="font-display text-[2.75rem] leading-none text-champagne italic">
          {exp.index}
        </span>
        <span aria-hidden="true" className="h-px w-10 bg-champagne/60" />
        <p className="eyebrow text-champagne">
          <span className="sr-only">{t.experiences.service} {exp.index}, </span>
          {l(exp.label)}
        </p>
      </div>
      <h3 id={`${exp.id}-title`} className={`mb-6 leading-[1.04] text-ivory ${compact ? 'text-[clamp(2rem,3.4vw,2.9rem)]' : 'text-[clamp(2.1rem,3.8vw,3.25rem)]'}`}>
        {l(exp.title)}
      </h3>
      <p className="mb-9 max-w-[44ch] text-[1.0625rem] leading-relaxed text-ivory/75">{l(exp.description)}</p>
      <Button variant="outline-light" arrow onClick={onEnquire}>
        {l(exp.cta)}
      </Button>
    </div>
  );
}

export function Experiences() {
  const { startEnquiry } = useEnquiry();
  const { t } = useI18n();
  const [tours, chauffeured, events] = experiences;
  const enquire = (exp: Experience) => () => startEnquiry({ experience: exp.id });

  return (
    <section id="experiences" aria-labelledby="experiences-title" className="bg-forest py-24 text-ivory sm:py-32 lg:py-40">
      <div className="page-gutter mx-auto max-w-[var(--container-page)]">
        <SectionIntro
          id="experiences-title"
          tone="dark"
          eyebrow={t.experiences.eyebrow}
          title={
            <>
              {t.experiences.titleStart} <em className="italic">{t.experiences.titleEm}</em>
            </>
          }
          text={t.experiences.text}
        />

        <div className="mt-20 flex flex-col gap-24 sm:gap-32 lg:mt-28 lg:gap-40">
          {/* 01: wide landscape image, text to the right */}
          <article aria-labelledby={`${tours.id}-title`} className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
            <Reveal className="lg:col-span-7">
              <Media image={tours.image} tone="charcoal" className="aspect-[3/2] w-full rounded-xs" sizes="(min-width:1024px) 58vw, 100vw" showBrief />
            </Reveal>
            <Reveal delay={120} className="lg:col-span-5 lg:pl-6">
              <ExperienceText exp={tours} onEnquire={enquire(tours)} />
            </Reveal>
          </article>

          {/* 02: portrait image to the right, offset; small detail frame */}
          <article aria-labelledby={`${chauffeured.id}-title`} className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
            <Reveal delay={120} className="order-2 lg:order-1 lg:col-span-5 lg:col-start-2 lg:pb-16">
              <ExperienceText exp={chauffeured} onEnquire={enquire(chauffeured)} />
            </Reveal>
            <Reveal className="order-1 lg:order-2 lg:col-span-5 lg:col-start-8">
              <Media
                image={chauffeured.image}
                tone="stone"
                className="mx-auto aspect-[4/5] w-full max-w-md rounded-xs lg:max-w-none"
                sizes="(min-width:1024px) 40vw, 100vw"
                showBrief
              />
            </Reveal>
          </article>

          {/* 03: cinematic full-width image with overlaid panel */}
          <article aria-labelledby={`${events.id}-title`} className="relative">
            <Reveal>
              <Media
                image={events.image}
                tone="charcoal"
                captionPosition="top-right"
                className="aspect-[4/3] w-full rounded-xs sm:aspect-[16/9] lg:aspect-[21/9]"
                sizes="100vw"
                showBrief
              />
            </Reveal>
            <Reveal
              delay={150}
              className="relative -mt-16 ml-4 rounded-xs border border-line-light bg-forest-deep p-7 sm:-mt-24 sm:ml-10 sm:max-w-xl sm:p-10 lg:absolute lg:bottom-[-3rem] lg:left-12 lg:mt-0 lg:ml-0 lg:p-12"
            >
              <ExperienceText exp={events} onEnquire={enquire(events)} compact />
            </Reveal>
          </article>
        </div>

        <Reveal className="mt-24 grid gap-6 border-t border-line-light pt-8 sm:grid-cols-2 lg:mt-36">
          <p className="eyebrow text-champagne">{t.experiences.footLabel}</p>
          <p className="max-w-xl text-[0.975rem] leading-relaxed text-ivory/70 sm:justify-self-end">
            {t.experiences.footText}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

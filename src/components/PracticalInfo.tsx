import { useState } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { Reveal } from './ui/Reveal';

/**
 * Compact practical section: title and key facts, the three steps on one
 * row, and the FAQ collapsed behind a disclosure button.
 */
export function PracticalInfo() {
  const { t } = useI18n();
  const p = t.practical;
  const [faqOpen, setFaqOpen] = useState(false);

  return (
    <section id="practical" aria-labelledby="practical-title" className="bg-ivory py-20 sm:py-24 lg:py-28">
      <div className="page-gutter mx-auto max-w-[var(--container-page)]">
        {/* Title + key facts */}
        <Reveal className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-4">
            <p className="eyebrow mb-6 flex items-center gap-4 text-forest">
              <span aria-hidden="true" className="h-px w-10 bg-champagne" />
              {p.eyebrow}
            </p>
            <h2 id="practical-title" className="text-[clamp(2.4rem,4.6vw,3.9rem)] leading-[1.03] text-forest">
              {p.titleStart} <em className="italic">{p.titleEm}</em>
            </h2>
          </div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4 lg:col-span-8 lg:pb-2">
            {p.facts.map((f) => (
              <div key={f.label} className="border-t border-line pt-4">
                <dt className="eyebrow mb-1.5 text-muted-ink">{f.label}</dt>
                <dd className="font-display text-[1.3rem] leading-snug text-forest">{f.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* Steps */}
        <Reveal delay={100} className="mt-14 lg:mt-16">
          <h3 className="eyebrow mb-6 font-sans text-muted-ink">{p.howItWorks}</h3>
          <ol className="grid gap-6 sm:grid-cols-3 sm:gap-8">
            {p.steps.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span aria-hidden="true" className="w-9 shrink-0 font-display text-[1.9rem] leading-none text-champagne italic">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className="mb-1.5 font-display text-[1.3rem] leading-snug text-forest">{step.title}</p>
                  <p className="text-[0.95rem] leading-relaxed text-muted-ink">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>

        {/* FAQ, collapsed by default */}
        <Reveal delay={150} className="mt-12 border-t border-line pt-6">
          <button
            type="button"
            aria-expanded={faqOpen}
            aria-controls="practical-faq"
            onClick={() => setFaqOpen((o) => !o)}
            className="group flex min-h-11 items-center gap-3 text-[12px] font-medium tracking-[0.18em] text-forest uppercase"
          >
            <span className="link-quiet pb-0.5">{faqOpen ? p.faqHide : p.faqShow}</span>
            <svg
              aria-hidden="true"
              width="12"
              height="8"
              viewBox="0 0 12 8"
              fill="none"
              className={`transition-transform duration-300 ${faqOpen ? 'rotate-180' : ''}`}
            >
              <path d="M1 1.5l5 5 5-5" stroke="currentColor" />
            </svg>
          </button>

          <div id="practical-faq" hidden={!faqOpen} className="mt-6">
            <h3 className="sr-only">{p.faqTitle}</h3>
            <dl className="grid sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-4">
              {p.faq.map((item) => (
                <div key={item.q} className="border-t border-line py-6">
                  <dt className="mb-2 font-display text-[1.3rem] leading-snug text-forest">{item.q}</dt>
                  <dd className="text-[0.95rem] leading-relaxed text-muted-ink">{item.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

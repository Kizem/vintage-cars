import { useI18n } from '../i18n/I18nContext';
import { Reveal } from './ui/Reveal';

export function PracticalInfo() {
  const { t } = useI18n();
  const p = t.practical;

  return (
    <section id="practical" aria-labelledby="practical-title" className="bg-ivory py-24 sm:py-32 lg:py-40">
      <div className="page-gutter mx-auto grid max-w-[var(--container-page)] gap-14 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-4">
          <p className="eyebrow mb-6 flex items-center gap-4 text-forest">
            <span aria-hidden="true" className="h-px w-10 bg-champagne" />
            {p.eyebrow}
          </p>
          <h2 id="practical-title" className="text-[clamp(2.4rem,4.6vw,3.9rem)] leading-[1.03] text-forest">
            {p.titleStart} <em className="italic">{p.titleEm}</em>
          </h2>
        </Reveal>

        <div className="lg:col-span-7 lg:col-start-6">
          <Reveal>
            <h3 className="eyebrow mb-8 font-sans text-muted-ink">{p.howItWorks}</h3>
            <ol className="grid gap-10 border-t border-line pt-8 sm:grid-cols-3 sm:gap-8">
              {p.steps.map((step, i) => (
                <li key={step.title}>
                  <span aria-hidden="true" className="mb-4 block font-display text-[2.4rem] leading-none text-champagne italic">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="mb-3 font-display text-[1.45rem] leading-snug text-forest">{step.title}</p>
                  <p className="text-[0.95rem] leading-relaxed text-muted-ink">{step.text}</p>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={120} className="mt-20">
            <h3 className="eyebrow mb-8 font-sans text-muted-ink">{p.faqTitle}</h3>
            <dl className="grid border-t border-line sm:grid-cols-2 sm:gap-x-10">
              {p.faq.map((item) => (
                <div key={item.q} className="border-b border-line py-7">
                  <dt className="mb-2 font-display text-[1.35rem] leading-snug text-forest">{item.q}</dt>
                  <dd className="text-[0.95rem] leading-relaxed text-muted-ink">{item.a}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

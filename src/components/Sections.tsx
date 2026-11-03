import { useEnquiry } from '../context/EnquiryContext';
import { sectionImages, site } from '../data/site';
import type { Experience } from '../data/types';
import { fill, useI18n } from '../i18n/I18nContext';
import { EnquirySentence } from './EnquirySentence';
import { SectionImage } from './SectionImage';
import { ActionLink } from './ui';

/* Les sections calmes, sur l'ivoire, sous le parking. Une idée par section. */

/** Un chapitre, à la manière d'un portfolio : N° et titre en haut, texte et action plus bas, la photo entière à côté. */
export function Chapter({ experience: x, n, inert }: { experience: Experience; n: number; inert: boolean }) {
  const { t, l } = useI18n();
  const { startEnquiry } = useEnquiry();
  const id = `sortie-${n}`;
  return (
    <section
      id={id}
      className="em-sc em-sc--exp"
      data-tone="light"
      data-part={n > 1 ? 'sortie-1' : undefined}
      inert={inert}
      aria-labelledby={`${id}-title`}
    >
      <div className="em-exp__head">
        <p className="em-no">{fill(t.chapter.number, { n })}</p>
        <h2 className="em-title" id={`${id}-title`}>
          {l(x.title)}
        </h2>
      </div>
      <div className="em-exp__body">
        <div className="em-exp__copy">
          {/* texte complet sur ordinateur et tablette, version courte sur smartphone (bascule en CSS) */}
          <div className="em-exp__long">
            {l(x.body).map((para) => (
              <p className="em-text" key={para}>
                {para}
              </p>
            ))}
          </div>
          <p className="em-text em-exp__short">{l(x.summary)}</p>
        </div>
        <ActionLink onClick={() => startEnquiry({ experience: x.id })}>{l(x.cta)}</ActionLink>
      </div>
      <div className="em-exp__media">
        <SectionImage image={x.image} sizes="(max-width: 899px) 100vw, 50vw" natural />
      </div>
    </section>
  );
}

/** Bon à savoir : des explications sur les expériences (pas un chapitre numéroté), image à droite. */
export function GoodToKnow({ inert }: { inert: boolean }) {
  const { t } = useI18n();
  const g = t.goodToKnow;
  return (
    <section id="savoir" className="em-sc em-sc--split em-sc--flip" data-tone="light" data-part="sortie-1" inert={inert} aria-labelledby="savoir-title">
      <SectionImage image={sectionImages.practical} sizes="(max-width: 899px) 100vw, 40vw" />
      <div className="em-sc__col">
        <h2 className="em-title" id="savoir-title">
          {g.title}
        </h2>
        <ul className="em-facts">
          {g.facts.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <div className="em-faq">
          {g.faq.map(({ q, a }) => (
            <details key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/** À propos : image à gauche, titre, deux paragraphes. */
export function About({ inert }: { inert: boolean }) {
  const { t } = useI18n();
  return (
    <section id="apropos" className="em-sc em-sc--split" data-tone="light" inert={inert} aria-labelledby="apropos-title">
      <SectionImage image={sectionImages.about} sizes="(max-width: 899px) 100vw, 40vw" />
      <div className="em-sc__col">
        <h2 className="em-title" id="apropos-title">
          {t.about.title}
        </h2>
        <p className="em-text">{t.about.p1}</p>
        <p className="em-text">{t.about.p2}</p>
      </div>
    </section>
  );
}

/** Écrire : pas d'image. Le titre, le formulaire-phrase et le pied de page. */
export function Write({ inert }: { inert: boolean }) {
  const { t, l } = useI18n();
  const { email, phone, phoneHref, hours } = site.contact;
  return (
    <section id="ecrire" className="em-sc" data-tone="light" inert={inert} aria-labelledby="ecrire-title">
      <h2 className="em-title" id="ecrire-title" tabIndex={-1}>
        {t.form.title}
      </h2>
      <EnquirySentence />
      <footer className="em-foot">
        <p>
          <a href={`mailto:${email}`}>{email}</a> · <a href={`tel:${phoneHref}`}>{phone}</a>
        </p>
        <p>{l(hours)}</p>
        <p>
          © {new Date().getFullYear()} {site.name} · <a href="#legal-notice">{t.footer.legalNotice}</a> ·{' '}
          <a href="#privacy">{t.footer.privacy}</a>
        </p>
      </footer>
    </section>
  );
}

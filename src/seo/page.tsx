import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { carPage, childrenOf, frTypo, getPage, pages, type Page, type PageId } from '../content';
import type { Block } from '../content/types';
import { site } from '../data/site';
import type { MediaAsset, Vehicle } from '../data/types';
import { getVehicle } from '../data/vehicles';
import { en } from '../i18n/en';
import { fr } from '../i18n/fr';
import type { Locale } from '../i18n/locales';
import { docUi, type DocUi } from './ui';
import { enquiryPath, homePath, relHref } from './urls';

/**
 * The template of the content pages, rendered to static HTML (no JavaScript in the browser).
 * Header and footer link every page to the others, so that search engines and AI crawlers find them all.
 */

const dict = { en, fr };
export const ui = (l: Locale): DocUi =>
  l === 'fr' ? (Object.fromEntries(Object.entries(docUi.fr).map(([k, v]) => [k, frTypo(v)])) as DocUi) : docUi.en;

/** Pages of the top menu, in order. */
export const MENU: PageId[] = ['collection', 'events', 'tours', 'chauffeur', 'guides', 'faq'];
const FOOT: Record<'footExperiences' | 'footCollection' | 'footGuides' | 'footInfo', PageId[]> = {
  footExperiences: ['events', 'wedding', 'proposal', 'photoshoot', 'tours', 'chauffeur', 'rental'],
  footCollection: ['collection', 'car-ds', 'car-504', 'car-w115'],
  footGuides: ['guides', 'guide-things-to-do', 'guide-wedding-car'],
  footInfo: ['faq', 'about'],
};

export interface Ctx {
  l: Locale;
  /** Path of the page being written ('fr/faq/'). */
  path: string;
}

export const href = (c: Ctx, to: string) => relHref(c.path, to);
export const pageHref = (c: Ctx, id: PageId) => href(c, getPage(id)[c.l].path);

export function Img({ c, a, sizes, eager, cls }: { c: Ctx; a: MediaAsset; sizes: string; eager?: boolean; cls?: string }) {
  return (
    <img
      className={cls}
      src={href(c, a.src)}
      srcSet={a.srcSet?.split(',').map((s) => href(c, s.trim())).join(', ')}
      sizes={a.srcSet ? sizes : undefined}
      width={a.width}
      height={a.height}
      alt={a.alt[c.l]}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : undefined}
      decoding="async"
      style={a.focalPoint ? { objectPosition: a.focalPoint } : undefined}
    />
  );
}

export function Monogram() {
  return (
    <span className="dp-mono" aria-hidden="true">
      <span>É</span>
      <span>M</span>
    </span>
  );
}

export function Header({ c, current, alternate }: { c: Ctx; current?: PageId; alternate: string }) {
  const t = ui(c.l);
  const other: Locale = c.l === 'fr' ? 'en' : 'fr';
  return (
    <header className="dp-top">
      <a className="dp-skip" href="#contenu">
        {t.skip}
      </a>
      <div className="dp-wrap">
        <a className="dp-brand" href={href(c, homePath(c.l))} aria-label={`${site.name}, ${t.home}`}>
          <Monogram />
          <span className="dp-brand__word">{site.name}</span>
        </a>
        <nav className="dp-nav" aria-label={t.menu}>
          <ul className="dp-menu">
            {MENU.map((id) => (
              <li key={id}>
                <a href={pageHref(c, id)} aria-current={id === current ? 'page' : undefined}>
                  {getPage(id)[c.l].nav}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        {/* écrire et la langue restent visibles sur téléphone, à côté du logo */}
        <ul className="dp-menu dp-tools">
          <li className="dp-menu__cta">
            <a href={href(c, enquiryPath(c.l))}>{t.enquire}</a>
          </li>
          <li>
            <a href={href(c, alternate)} hrefLang={other} lang={other} aria-label={t.otherLanguage} title={t.otherLanguage}>
              {t.otherLanguageShort}
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}

export function Footer({ c, alternate }: { c: Ctx; alternate: string }) {
  const t = ui(c.l);
  const { email, phone, phoneHref, location } = site.contact;
  const home = homePath(c.l);
  return (
    <footer className="dp-foot">
      <div className="dp-wrap">
        <div className="dp-foot__cols">
          {(Object.keys(FOOT) as (keyof typeof FOOT)[]).map((k) => (
            <section key={k} aria-labelledby={`foot-${k}`}>
              <h2 id={`foot-${k}`}>{t[k]}</h2>
              <ul>
                {FOOT[k].map((id) => (
                  <li key={id}>
                    <a href={pageHref(c, id)}>{getPage(id)[c.l].nav}</a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
          <section aria-labelledby="foot-contact">
            <h2 id="foot-contact">{t.contact}</h2>
            <ul>
              <li>{site.name}</li>
              <li>{location[c.l]}</li>
              <li>
                <a href={`mailto:${email}`}>{email}</a>
              </li>
              <li>
                <a href={`tel:${phoneHref}`}>{phone}</a>
              </li>
              <li>
                <a href={href(c, enquiryPath(c.l))}>{t.enquire}</a>
              </li>
            </ul>
          </section>
        </div>
        <p className="dp-foot__legal">
          {t.tagline} © {new Date().getFullYear()} {site.name} · <a href={href(c, `${home}#legal-notice`)}>{t.legalNotice}</a> ·{' '}
          <a href={href(c, `${home}#privacy`)}>{t.privacy}</a> · <a href={href(c, alternate)} hrefLang={c.l === 'fr' ? 'en' : 'fr'}>{t.otherLanguage}</a>
        </p>
      </div>
    </footer>
  );
}

function serviceOf(cars: Vehicle[], l: Locale, t: DocUi) {
  const modes = new Set(cars.map((v) => v.service));
  return modes.size === 1 ? dict[l].service[cars[0].service] : t.serviceMixed;
}

function Facts({ c, p }: { c: Ctx; p: Page }) {
  const t = ui(c.l);
  const cars = (p.cars ?? ['peugeot-504', 'citroen-ds', 'mercedes-benz-classic']).map((s) => getVehicle(s)!);
  const rows: [string, string][] = [
    [t.where, t.whereValue],
    [t.duration, t.durationValue],
    [t.languages, t.languagesValue],
    [t.cars, cars.map((v) => v.name[c.l]).join(', ')],
    [t.service, serviceOf(cars, c.l, t)],
    [t.booking, t.bookingValue],
  ];
  return (
    <dl className="dp-facts" aria-label={t.facts}>
      {rows.map(([k, v]) => (
        <div key={k}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Section({ b }: { b: Block }) {
  return (
    <section className="dp-block">
      <h2>{b.h2}</h2>
      {b.p?.map((x) => <p key={x}>{x}</p>)}
      {b.list && (
        <ul className="dp-list">
          {b.list.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      )}
      {b.stops && (
        <ol className="dp-stops">
          {b.stops.map((s) => (
            <li key={s.name}>
              <h3>{s.name}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function Cars({ c, slugs, title }: { c: Ctx; slugs: string[]; title: string }) {
  const t = ui(c.l);
  return (
    <section className="dp-block">
      <h2>{title}</h2>
      <ul className="dp-cars">
        {slugs.map((s) => {
          const v = getVehicle(s)!;
          const year = v.details?.find((d) => d.label.en === 'Year')?.value[c.l];
          const page = carPage(s)!;
          return (
            <li key={s}>
              <Img c={c} a={v.image} sizes="9rem" />
              <div>
                <h3>
                  <a href={href(c, page[c.l].path)}>{v.name[c.l]}</a>
                </h3>
                <p>
                  {year} · {dict[c.l].service[v.service]}
                </p>
                <a className="dp-more" href={href(c, page[c.l].path)} aria-label={`${t.seeCar}, ${v.name[c.l]}`}>
                  {t.seeCar}
                </a>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function CarSheet({ c, v }: { c: Ctx; v: Vehicle }) {
  const t = ui(c.l);
  return (
    <>
      <section className="dp-block" aria-labelledby="specs">
        <h2 id="specs">{t.specs}</h2>
        <dl className="dp-specs">
          <div>
            <dt>{t.service}</dt>
            <dd>{dict[c.l].service[v.service]}</dd>
          </div>
          {v.details?.map((d) => (
            <div key={d.label.en}>
              <dt>{d.label[c.l]}</dt>
              <dd>{d.value[c.l]}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section aria-labelledby="photos">
        <h2 id="photos">{t.photos}</h2>
        <ul className="dp-gallery">
          {[v.image, ...(v.gallery ?? [])].map((a) => (
            <li key={a.src}>
              <figure className="dp-figure">
                <Img c={c} a={a} sizes="(max-width: 899px) 50vw, 24rem" />
                {a.credit && <span className="dp-credit">{a.credit[c.l]}</span>}
              </figure>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

export function Index({ c, items }: { c: Ctx; items: Page[] }) {
  return (
    <ul className="dp-index">
      {items.map((q) => (
        <li key={q.id}>
          <h3>
            <a href={href(c, q[c.l].path)}>{q[c.l].h1}</a>
          </h3>
          <p>{q[c.l].description}</p>
        </li>
      ))}
    </ul>
  );
}

function Faq({ c, items, title }: { c: Ctx; items: { q: string; a: string }[]; title?: string }) {
  return (
    <section className="dp-block" aria-labelledby="questions">
      <h2 id="questions">{title ?? ui(c.l).questions}</h2>
      <div className="dp-faq">
        {items.map(({ q, a }) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function Breadcrumb({ c, p }: { c: Ctx; p: Page }) {
  const chain: Page[] = [];
  for (let q: Page | undefined = p; q; q = q.parent ? getPage(q.parent) : undefined) chain.unshift(q);
  const t = ui(c.l);
  return (
    <nav className="dp-crumbs dp-wrap" aria-label={t.breadcrumb}>
      <ol>
        <li>
          <a href={href(c, homePath(c.l))}>{t.home}</a>
        </li>
        {chain.map((q) => (
          <li key={q.id}>
            {q === p ? <span aria-current="page">{q[c.l].nav}</span> : <a href={href(c, q[c.l].path)}>{q[c.l].nav}</a>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageBody({ p, l }: { p: Page; l: Locale }) {
  const copy = p[l];
  const c: Ctx = { l, path: copy.path };
  const t = ui(l);
  const other: Locale = l === 'fr' ? 'en' : 'fr';
  const alternate = p[other].path;
  const cta = href(c, enquiryPath(l, p.experience, p.kind === 'car' ? p.cars?.[0] : undefined));
  const children = p.kind === 'hub' && p.id !== 'collection' ? childrenOf(p.id) : [];
  const car = p.kind === 'car' ? getVehicle(p.cars![0])! : null;
  const showCars = p.cars && p.kind !== 'car' && p.kind !== 'about';
  const date = new Date(`${p.updated}T12:00:00Z`).toLocaleDateString(l === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <>
      <Header c={c} current={MENU.includes(p.id) ? p.id : p.parent && MENU.includes(p.parent) ? p.parent : undefined} alternate={alternate} />
      <main id="contenu">
        <Breadcrumb c={c} p={p} />
        <article>
          <header className="dp-hero dp-wrap">
            <div>
              <p className="dp-kicker">{p.parent ? getPage(p.parent)[l].nav : `${site.name} · Paris`}</p>
              <h1>{copy.h1}</h1>
              <p className="dp-lead">{copy.lead}</p>
              {copy.cta && (
                <a className="dp-action" href={cta}>
                  {copy.cta}
                </a>
              )}
            </div>
            <figure className="dp-figure">
              <Img c={c} a={p.image} sizes="(max-width: 899px) 100vw, 50vw" eager />
              {p.image.credit && <span className="dp-credit">{p.image.credit[l]}</span>}
            </figure>
          </header>
          <div className="dp-wrap">
            <Facts c={c} p={p} />
            <div className="dp-body">
              {children.length > 0 && <Index c={c} items={children} />}
              {copy.sections.map((b) => (
                <Section key={b.h2} b={b} />
              ))}
              {car && <CarSheet c={c} v={car} />}
              {showCars && <Cars c={c} slugs={p.cars!} title={p.id === 'collection' ? t.footCollection : t.ourCars} />}
              {copy.faq && <Faq c={c} items={copy.faq} />}
            </div>
          </div>
          <section className="dp-cta" aria-labelledby="cta-title">
            <div className="dp-wrap">
              <h2 id="cta-title">{t.ctaTitle}</h2>
              <p>{t.ctaText}</p>
              <a className="dp-action" href={cta}>
                {copy.cta ?? t.enquire}
              </a>
            </div>
          </section>
          <div className="dp-wrap dp-body" style={{ paddingTop: 'clamp(2.5rem, 6vw, 4rem)' }}>
            <section aria-labelledby="related">
              <h2 id="related">{t.related}</h2>
              <ul className="dp-related">
                {p.related.map((id) => (
                  <li key={id}>
                    <a href={pageHref(c, id)}>{getPage(id)[l].nav}</a>
                  </li>
                ))}
              </ul>
              <p className="dp-updated">
                {t.updated} <time dateTime={p.updated}>{date}</time>
              </p>
            </section>
          </div>
        </article>
      </main>
      <Footer c={c} alternate={alternate} />
    </>
  );
}

/** The body of a content page, as HTML. */
export const renderBody = (p: Page, l: Locale) => renderToStaticMarkup(<PageBody p={p} l={l} />);

/** The 404 page body: menu, message and the main pages. */
export function NotFound({ l, root }: { l: Locale; root: string }): ReactNode {
  const t = ui(l);
  const c: Ctx = { l, path: '' };
  const abs = (to: string) => root + to;
  return (
    <main id="contenu" className="dp-wrap dp-body" lang={l} style={{ paddingBlock: 'clamp(2.5rem, 6vw, 4rem)' }}>
      <h1>{t.notFoundTitle}</h1>
      <p>{t.notFoundText}</p>
      <ul className="dp-related">
        <li>
          <a href={abs(homePath(l))}>{t.home}</a>
        </li>
        {pages
          .filter((p) => p.kind === 'hub' || p.id === 'faq')
          .map((p) => (
            <li key={p.id}>
              <a href={abs(p[c.l].path)}>{p[c.l].nav}</a>
            </li>
          ))}
      </ul>
    </main>
  );
}

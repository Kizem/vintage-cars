import { renderToStaticMarkup } from 'react-dom/server';
import { childrenOf, getPage, routeAnchor, routes, type Page } from '../content';
import type { Locale } from '../i18n/locales';
import { Breadcrumb, Footer, Header, href, Img, Index, pageHref, Section, ui, type Ctx } from './page';
import { enquiryPath, homePath } from './urls';

/**
 * « Les Guides de Paris » : the guides page (« Paris, autrement. ») and, inside it, the detailed sheet of each
 * route in a pop-in (<dialog>, anchor /fr/guides/#paris-intemporel). The text of every sheet is in the HTML of
 * the page, for search engines and AI assistants; the small script src/seo/guides.ts opens and closes them.
 */

const no = (n: number) => String(n).padStart(2, '0');

/** The editorial closing block of the guides (owner's text), with the links to the experiences and the form. */
function Invitation({ c, compact }: { c: Ctx; compact?: boolean }) {
  const t = ui(c.l);
  const Title = compact ? 'h3' : 'h2';
  return (
    <section className={compact ? 'dp-pop__cta' : 'dp-cta'} aria-labelledby={compact ? undefined : 'cta-title'}>
      <div className={compact ? undefined : 'dp-wrap'}>
        <Title id={compact ? undefined : 'cta-title'}>{t.convTitle}</Title>
        <p>{t.convText}</p>
        <p className="dp-actions">
          <a className="dp-action" href={href(c, `${homePath(c.l)}#sortie-1`)}>
            {t.convMain}
          </a>
          <a className="dp-action dp-action--soft" href={href(c, enquiryPath(c.l, 'private-tours'))}>
            {t.convSecond}
          </a>
        </p>
      </div>
    </section>
  );
}

/** The detailed sheet of a route, in its pop-in. */
function RouteSheet({ r: p, c, i }: { r: Page; c: Ctx; i: number }) {
  const l = c.l;
  const t = ui(l);
  const copy = p[l];
  const r = copy.route!;
  const id = routeAnchor(p, l);
  const prev = routes[(i - 1 + routes.length) % routes.length];
  const next = routes[(i + 1) % routes.length];
  const colon = l === 'fr' ? ' :' : ':';
  const facts: [string, string][] = [
    [t.duration, r.duration],
    ['Distance', r.distance],
    [t.start, r.start],
    [t.end, r.end],
    [t.mood, r.mood],
  ];
  return (
    <dialog className="dp-pop" id={id} aria-labelledby={`${id}-title`}>
      <div className="dp-pop__bar">
        <p className="dp-kicker">
          {t.routeNo}
          {no(r.n)}
        </p>
        <a className="dp-pop__close" href="#itineraires" data-close="">
          {t.close}
        </a>
      </div>
      <article className="dp-pop__body">
        <h2 id={`${id}-title`}>{copy.h1}</h2>
        <p className="dp-intro">{r.intro}</p>
        <figure className="dp-figure dp-pop__photo">
          <Img c={c} a={p.image} sizes="(max-width: 899px) 100vw, 56rem" />
          {p.image.credit && <span className="dp-credit">{p.image.credit[l]}</span>}
        </figure>
        <h3 className="dp-sr">{t.practical}</h3>
        <dl className="dp-facts dp-facts--route">
          {facts.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <p className="dp-note">{t.indicative}</p>
        <p className="dp-lead">{copy.lead}</p>
        <section>
          <h3>{t.course}</h3>
          {r.course.map((x) => (
            <p key={x}>{x}</p>
          ))}
        </section>
        <section>
          <h3>{t.stops}</h3>
          <ol className="dp-timeline">
            {r.stops.map((s, k) => (
              <li key={s.name}>
                <p className="dp-timeline__no">{k === 0 ? t.start : k === r.stops.length - 1 ? t.end : `N°${k + 1}`}</p>
                <h4>{s.name}</h4>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </section>
        <div className="dp-route__pair">
          <section>
            <h3>{t.photoSpots}</h3>
            <ul className="dp-spots">
              {r.photo.map((s) => (
                <li key={s.name}>
                  <h4>{s.name}</h4>
                  <p>{s.text}</p>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h3>{t.food}</h3>
            <ul className="dp-spots">
              {r.food.map((s) => (
                <li key={s.name}>
                  <h4>{s.name}</h4>
                  <p>{s.text}</p>
                </li>
              ))}
            </ul>
            <p className="dp-note">{t.foodNote}</p>
          </section>
        </div>
        <section>
          <h3>{t.tips}</h3>
          <ul className="dp-list">
            {[...r.tips, t.tipWalk, t.tipPark, t.tipAdapt].map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </section>
        <Invitation c={c} compact />
        <nav className="dp-routes-nav__pn" aria-label={t.otherRoutes}>
          <a href={`#${routeAnchor(prev, l)}`} data-route="">
            ← {t.prevRoute}
            {colon} {prev[l].route!.name}
          </a>
          <a href={`#${routeAnchor(next, l)}`} data-route="">
            {t.nextRoute}
            {colon} {next[l].route!.name} →
          </a>
        </nav>
      </article>
    </dialog>
  );
}

function GuidesHub({ p, l }: { p: Page; l: Locale }) {
  const copy = p[l];
  const c: Ctx = { l, path: copy.path };
  const t = ui(l);
  const alternate = p[l === 'fr' ? 'en' : 'fr'].path;
  const articles = childrenOf('guides');
  return (
    <>
      <Header c={c} current="guides" alternate={alternate} />
      <main id="contenu">
        <Breadcrumb c={c} p={p} />
        <article>
          <header className="dp-hero dp-wrap">
            <div>
              <p className="dp-kicker">{copy.nav}</p>
              <h1>{copy.h1}</h1>
              <p className="dp-intro">{copy.subtitle}</p>
            </div>
            <figure className="dp-figure">
              <Img c={c} a={p.image} sizes="(max-width: 899px) 100vw, 50vw" eager />
              {p.image.credit && <span className="dp-credit">{p.image.credit[l]}</span>}
            </figure>
          </header>
          <div className="dp-wrap dp-body">
            <section className="dp-block">
              <p className="dp-lead">{copy.lead}</p>
            </section>
            {copy.sections.map((b) => (
              <Section key={b.h2} b={b} />
            ))}
            <section aria-labelledby="itineraires">
              <h2 id="itineraires">{t.fiveRoutes}</h2>
              <ol className="dp-routes">
                {routes.map((q) => {
                  const r = q[l].route!;
                  const anchor = `#${routeAnchor(q, l)}`;
                  return (
                    <li key={q.id}>
                      <figure className="dp-figure">
                        <Img c={c} a={q.image} sizes="(max-width: 899px) 100vw, 55vw" />
                        {q.image.credit && <span className="dp-credit">{q.image.credit[l]}</span>}
                      </figure>
                      <div className="dp-routes__text">
                        <p className="dp-routes__no">N°{no(r.n)}</p>
                        <h3>
                          <a href={anchor} data-route="">
                            {r.name}
                          </a>
                        </h3>
                        <p>{r.teaser}</p>
                        <dl className="dp-routes__meta">
                          <div>
                            <dt>{t.duration}</dt>
                            <dd>{r.duration}</dd>
                          </div>
                          <div>
                            <dt>Distance</dt>
                            <dd>{r.distance}</dd>
                          </div>
                          <div>
                            <dt>{t.mood}</dt>
                            <dd>{r.mood}</dd>
                          </div>
                        </dl>
                        <a className="dp-action" href={anchor} data-route="" aria-label={`${t.discover}, ${r.name}`}>
                          {t.discover}
                        </a>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>
            {articles.length > 0 && (
              <section aria-labelledby="articles">
                <h2 id="articles">{t.related}</h2>
                <Index c={c} items={articles} />
              </section>
            )}
          </div>
          <Invitation c={c} />
          <div className="dp-wrap" style={{ paddingBlock: 'clamp(2rem, 5vw, 3rem)' }}>
            <ul className="dp-related">
              {p.related.map((id) => (
                <li key={id}>
                  <a href={pageHref(c, id)}>{pageLabel(id, l)}</a>
                </li>
              ))}
            </ul>
          </div>
        </article>
        {routes.map((q, i) => (
          <RouteSheet key={q.id} r={q} c={c} i={i} />
        ))}
      </main>
      <Footer c={c} alternate={alternate} />
    </>
  );
}

const pageLabel = (id: Page['id'], l: Locale) => getPage(id)[l].nav;

/** Body of the guides page, with the five route sheets. */
export const renderGuides = (p: Page, l: Locale) => renderToStaticMarkup(<GuidesHub p={p} l={l} />);

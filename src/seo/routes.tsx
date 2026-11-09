import { renderToStaticMarkup } from 'react-dom/server';
import { childrenOf, getPage, pages, type Page } from '../content';
import type { Locale } from '../i18n/locales';
import { Breadcrumb, Footer, Header, href, Img, Index, pageHref, Section, ui, type Ctx } from './page';
import { enquiryPath, homePath } from './urls';

/**
 * « Les Guides de Paris » : the guides page (« Paris, autrement. ») and one page per route. Static HTML; the
 * map is the only script (src/seo/map.ts), loaded by the route pages and started on demand.
 */

const routes = () => pages.filter((p) => p.kind === 'route');
const no = (n: number) => String(n).padStart(2, '0');
const osm = ([lat, lng]: [number, number]) => `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`;

function Shell({ p, l, children }: { p: Page; l: Locale; children: React.ReactNode }) {
  const c: Ctx = { l, path: p[l].path };
  const alternate = p[l === 'fr' ? 'en' : 'fr'].path;
  return (
    <>
      <Header c={c} current="guides" alternate={alternate} />
      <main id="contenu">
        <Breadcrumb c={c} p={p} />
        {children}
      </main>
      <Footer c={c} alternate={alternate} />
    </>
  );
}

/** The editorial closing block of every route, then the links to the experiences and the form. */
function Invitation({ c }: { c: Ctx }) {
  const t = ui(c.l);
  return (
    <section className="dp-cta" aria-labelledby="cta-title">
      <div className="dp-wrap">
        <h2 id="cta-title">{t.convTitle}</h2>
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

function RouteFacts({ c, p }: { c: Ctx; p: Page }) {
  const t = ui(c.l);
  const r = p[c.l].route!;
  const rows: [string, string][] = [
    [t.duration, r.duration],
    ['Distance', r.distance],
    [t.start, r.start],
    [t.end, r.end],
    [t.mood, r.mood],
  ];
  return (
    <section aria-labelledby="pratique">
      <h2 id="pratique" className="dp-sr">
        {t.practical}
      </h2>
      <dl className="dp-facts dp-facts--route">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      <p className="dp-note">{t.indicative}</p>
    </section>
  );
}

function RouteBody({ p, l }: { p: Page; l: Locale }) {
  const copy = p[l];
  const r = copy.route!;
  const c: Ctx = { l, path: copy.path };
  const t = ui(l);
  const all = routes();
  const i = all.findIndex((q) => q.id === p.id);
  const prev = all[(i - 1 + all.length) % all.length];
  const next = all[(i + 1) % all.length];
  const colon = l === 'fr' ? '\u00a0:' : ':';
  const stops = r.stops.map((s, k) => ({ n: k + 1, name: s.name, lat: p.geo![k][0], lng: p.geo![k][1] }));
  return (
    <Shell p={p} l={l}>
      <article className="dp-route">
        <header className="dp-wrap dp-route__head">
          <p className="dp-kicker">
            <a href={pageHref(c, 'guides')}>{getPage('guides')[l].nav}</a> · {t.routeNo}
            {no(r.n)}
          </p>
          <h1>{copy.h1}</h1>
          <p className="dp-intro">{r.intro}</p>
          <p className="dp-lead">{copy.lead}</p>
        </header>
        <figure className="dp-figure dp-route__photo">
          <Img c={c} a={p.image} sizes="100vw" eager />
          {p.image.credit && <span className="dp-credit">{p.image.credit[l]}</span>}
        </figure>
        <div className="dp-wrap">
          <RouteFacts c={c} p={p} />
          <div className="dp-body dp-route__body">
            <section className="dp-block" aria-labelledby="parcours">
              <h2 id="parcours">{t.course}</h2>
              {r.course.map((x) => (
                <p key={x}>{x}</p>
              ))}
            </section>
            <section className="dp-block" aria-labelledby="etapes">
              <h2 id="etapes">{t.stops}</h2>
              <ol className="dp-timeline">
                {r.stops.map((s, k) => (
                  <li key={s.name}>
                    <p className="dp-timeline__no">
                      {k === 0 ? t.start : k === r.stops.length - 1 ? t.end : `N°${k + 1}`}
                    </p>
                    <h3>{s.name}</h3>
                    <p>{s.text}</p>
                  </li>
                ))}
              </ol>
            </section>
            <div className="dp-route__pair">
              <section className="dp-block" aria-labelledby="photos">
                <h2 id="photos">{t.photoSpots}</h2>
                <ul className="dp-spots">
                  {r.photo.map((s) => (
                    <li key={s.name}>
                      <h3>{s.name}</h3>
                      <p>{s.text}</p>
                    </li>
                  ))}
                </ul>
              </section>
              <section className="dp-block" aria-labelledby="pauses">
                <h2 id="pauses">{t.food}</h2>
                <ul className="dp-spots">
                  {r.food.map((s) => (
                    <li key={s.name}>
                      <h3>{s.name}</h3>
                      <p>{s.text}</p>
                    </li>
                  ))}
                </ul>
                <p className="dp-note">{t.foodNote}</p>
              </section>
            </div>
            <section className="dp-block" aria-labelledby="conseils">
              <h2 id="conseils">{t.tips}</h2>
              <ul className="dp-list">
                {[...r.tips, t.tipWalk, t.tipPark, t.tipAdapt].map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </section>
            <section className="dp-map-section" aria-labelledby="carte">
              <h2 id="carte">{t.map}</h2>
              <div className="dp-map" data-stops={JSON.stringify(stops)} data-label={copy.h1}>
                <button type="button" className="dp-action dp-map__show" hidden>
                  {t.mapShow}
                </button>
              </div>
              <ol className="dp-map__list">
                {stops.map((s) => (
                  <li key={s.n}>
                    <span className="dp-map__n">{s.n}</span> {s.name} ·{' '}
                    <a href={osm([s.lat, s.lng])} rel="noopener" target="_blank">
                      {t.mapOpen}
                    </a>
                  </li>
                ))}
              </ol>
              <p className="dp-note">{t.mapNote}</p>
            </section>
          </div>
        </div>
        <Invitation c={c} />
        <nav className="dp-wrap dp-routes-nav" aria-labelledby="autres">
          <h2 id="autres">{t.otherRoutes}</h2>
          <p className="dp-routes-nav__pn">
            <a href={pageHref(c, prev.id)} rel="prev">
              ← {t.prevRoute}
              {colon} {prev[l].route!.name}
            </a>
            <a href={pageHref(c, next.id)} rel="next">
              {t.nextRoute}
              {colon} {next[l].route!.name} →
            </a>
          </p>
          <ul className="dp-related">
            {all
              .filter((q) => q.id !== p.id)
              .map((q) => (
                <li key={q.id}>
                  <a href={pageHref(c, q.id)}>
                    N°{no(q[l].route!.n)} {q[l].route!.name}
                  </a>
                </li>
              ))}
            {p.related
              .filter((id) => getPage(id).kind !== 'route')
              .map((id) => (
                <li key={id}>
                  <a href={pageHref(c, id)}>{getPage(id)[l].nav}</a>
                </li>
              ))}
          </ul>
        </nav>
      </article>
    </Shell>
  );
}

function GuidesHub({ p, l }: { p: Page; l: Locale }) {
  const copy = p[l];
  const c: Ctx = { l, path: copy.path };
  const t = ui(l);
  const articles = childrenOf('guides').filter((q) => q.kind !== 'route');
  return (
    <Shell p={p} l={l}>
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
              {routes().map((q) => {
                const r = q[l].route!;
                return (
                  <li key={q.id}>
                    <figure className="dp-figure">
                      <Img c={c} a={q.image} sizes="(max-width: 899px) 100vw, 55vw" />
                      {q.image.credit && <span className="dp-credit">{q.image.credit[l]}</span>}
                    </figure>
                    <div className="dp-routes__text">
                      <p className="dp-routes__no">N°{no(r.n)}</p>
                      <h3>
                        <a href={href(c, q[l].path)}>{r.name}</a>
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
                      <a className="dp-action" href={href(c, q[l].path)} aria-label={`${t.discover}, ${r.name}`}>
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
                <a href={pageHref(c, id)}>{getPage(id)[l].nav}</a>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </Shell>
  );
}

/** Body of the guides page or of a route page. */
export const renderGuides = (p: Page, l: Locale) =>
  renderToStaticMarkup(p.kind === 'route' ? <RouteBody p={p} l={l} /> : <GuidesHub p={p} l={l} />);

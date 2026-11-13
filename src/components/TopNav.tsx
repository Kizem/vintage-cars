import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { primaryNav } from '../data/site';
import { useI18n } from '../i18n/I18nContext';
import { Arrow, Brand } from './ui';
import { asset, homeHref } from '../lib/paths';
import { pageLinks, siteTabs } from '../data/links';
import { currentIndex, scroller, scrollToId, sections, setLock } from '../lib/pageNav';

/**
 * Le menu minuscule en haut : quatre entrées et la langue.
 * L'entrée de la section affichée est soulignée ; la couleur suit data-tone.
 */
export function TopNav() {
  const { t, locale, setLocale } = useI18n();
  const [cur, setCur] = useState(0);
  const [tone, setTone] = useState<'dark' | 'light'>('dark');
  /* le bouton « haut de page » paraît à partir de la deuxième expérience */
  const [deep, setDeep] = useState(false);
  const [last, setLast] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  /* téléphone : le menu de la partie détaillée du site (toutes ses pages), ouvert par le bouton du coin gauche */
  const menuRef = useRef<HTMLDialogElement>(null);
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    const d = menuRef.current;
    if (!d) return;
    if (menu && !d.open) d.showModal();
    if (!menu && d.open) d.close();
    setLock('dialog', menu);
    return () => setLock('dialog', false);
  }, [menu]);

  useEffect(() => {
    const sc = scroller();
    if (!sc) return;
    const parts: string[] = primaryNav.map((x) => x.id);
    const on = () => {
      const list = sections();
      const ci = currentIndex();
      let c = 0;
      list.slice(0, ci + 1).forEach((x) => {
        const k = parts.indexOf(x.dataset.part || x.id);
        if (k >= 0) c = k;
      });
      setCur(c);
      setTone(list[ci]?.dataset.tone === 'dark' ? 'dark' : 'light');
      setDeep(ci >= 2);
      setLast(ci === list.length - 1);
      const foot = list[list.length - 1]?.querySelector<HTMLElement>('.em-foot');
      if (foot) document.documentElement.style.setProperty('--em-foot-h', `${foot.offsetHeight}px`);
    };
    on();
    const later = window.setTimeout(on, 400);
    const ro = new ResizeObserver(on);
    ro.observe(sc);
    sc.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      clearTimeout(later);
      ro.disconnect();
      sc.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
    };
  }, []);

  const other = locale === 'fr' ? 'en' : 'fr';
  const switchLanguage = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setLocale(other);
  };

  const toTop = () => {
    scrollToId('garage');
    /* le bouton disparaît : le focus clavier passe au logo, en haut */
    navRef.current?.querySelector<HTMLElement>('.em-brand')?.focus({ preventScroll: true });
  };

  return (
    <>
      <nav ref={navRef} className={`em-nav em-nav--${tone} em-nav--fixed`} aria-label={t.nav.label}>
        <Brand className="em-brand--nav" />
        <ul>
          {primaryNav.map((item, i) => (
            /* sur téléphone, « Écrire » laisse la place (les actions des chapitres mènent au formulaire) */
            <li key={item.id} className={item.key === 'write' ? 'em-nav__write' : undefined}>
              <a
                href={`#${item.id}`}
                aria-current={i === cur ? 'true' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId(item.id);
                }}
              >
                {t.nav.items[item.key]}
              </a>
            </li>
          ))}
          <li className="em-nav__lang">
            <a
              href={homeHref(other)}
              hrefLang={other}
              lang={other}
              aria-label={t.nav.otherLanguage}
              title={t.nav.otherLanguage}
              onClick={switchLanguage}
            >
              <svg className="em-lang__globe" width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                <circle cx="6.5" cy="6.5" r="6" stroke="currentColor" />
                <ellipse cx="6.5" cy="6.5" rx="2.6" ry="6" stroke="currentColor" />
                <path d="M.5 6.5h12" stroke="currentColor" />
              </svg>
              {(['fr', 'en'] as const).map((code, i) => (
                <span key={code} className={code === locale ? 'em-lang__cur' : 'em-lang__other'} aria-hidden="true">
                  {i > 0 && <span className="em-lang__sep">/</span>}
                  {code.toUpperCase()}
                </span>
              ))}
            </a>
          </li>
        </ul>
        {/* téléphone : le menu de tout le site, en haut à droite (avec la langue) */}
        <button
          type="button"
          className="em-nav__burger"
          aria-haspopup="dialog"
          aria-expanded={menu}
          aria-label={t.nav.menu}
          title={t.nav.menu}
          onClick={() => setMenu(true)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
        {/* la partie détaillée du site, ouverte sur la collection : on quitte la vitrine (sur téléphone, le menu) */}
        <a className="em-nav__site" href={asset(pageLinks.collection[locale])} title={t.nav.exploreHint}>
          <span className="em-nav__site-full">{t.nav.explore}</span>
          <span className="em-nav__site-short" aria-hidden="true">
            {t.nav.exploreShort}
          </span>
          <Arrow />
        </a>
      </nav>
      <dialog
        ref={menuRef}
        className="em-menu"
        aria-label={t.nav.siteTitle}
        onClose={() => setMenu(false)}
        onClick={(e) => e.target === e.currentTarget && setMenu(false)}
      >
        <div className="em-menu__bar">
          <p className="em-menu__brand">
            <span className="em-mono em-mono--sm" aria-hidden="true">
              <span>É</span>
              <span>M</span>
            </span>
            <span className="em-brand__word">Époque Motors</span>
          </p>
          <button type="button" className="em-menu__close" onClick={() => setMenu(false)}>
            {t.legal.close}
          </button>
        </div>
        <p className="em-menu__title">{t.nav.siteTitle}</p>
        <ul className="em-menu__list">
          {siteTabs.map((x) => (
            <li key={x.to}>
              <a href={asset(pageLinks[x.to][locale])}>{x.name[locale]}</a>
            </li>
          ))}
        </ul>
        <div className="em-menu__tools">
          <a
            className="em-action em-menu__write"
            href="#ecrire"
            onClick={(e) => {
              e.preventDefault();
              setMenu(false);
              scrollToId('ecrire', { focusHeading: true });
            }}
          >
            {t.nav.items.write}
          </a>
          {/* sur téléphone, la langue est ici : le coin droit tient le menu */}
          <a
            className="em-menu__lang"
            href={homeHref(other)}
            hrefLang={other}
            lang={other}
            onClick={(e) => {
              switchLanguage(e);
              setMenu(false);
            }}
          >
            <svg className="em-lang__globe" width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
              <circle cx="6.5" cy="6.5" r="6" stroke="currentColor" />
              <ellipse cx="6.5" cy="6.5" rx="2.6" ry="6" stroke="currentColor" />
              <path d="M.5 6.5h12" stroke="currentColor" />
            </svg>
            {t.nav.otherLanguage}
          </a>
        </div>
      </dialog>
      <button
        type="button"
        className={`em-top em-top--${tone}${deep ? ' is-shown' : ''}${last ? ' is-high' : ''}`}
        aria-label={t.nav.backToTop}
        title={t.nav.backToTop}
        onClick={toTop}
        inert={!deep}
      >
        <svg width="12" height="16" viewBox="0 0 12 16" fill="none" aria-hidden="true">
          <path d="M6 15.5V1M1.6 5.2 6 .8l4.4 4.4" stroke="currentColor" />
        </svg>
      </button>
    </>
  );
}

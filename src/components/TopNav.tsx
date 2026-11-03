import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { primaryNav } from '../data/site';
import { useI18n } from '../i18n/I18nContext';
import { Brand } from './ui';
import { currentIndex, scroller, scrollToId, sections } from '../lib/pageNav';

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
            <li key={item.id}>
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
            <a href={`?lang=${other}`} hrefLang={other} lang={other} aria-label={t.nav.otherLanguage} onClick={switchLanguage}>
              {other.toUpperCase()}
            </a>
          </li>
        </ul>
      </nav>
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

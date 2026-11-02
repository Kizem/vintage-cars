import { useEffect, useState, type MouseEvent } from 'react';
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

  return (
    <nav className={`em-nav em-nav--${tone} em-nav--fixed`} aria-label={t.nav.label}>
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
  );
}

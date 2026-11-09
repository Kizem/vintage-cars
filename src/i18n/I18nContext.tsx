import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { en, type Dictionary } from './en';
import { fr } from './fr';
import { defaultLocale, isLocale, type Locale, type Localized } from './locales';
import { homeHref, localeFromPath } from '../lib/paths';

const dictionaries: Record<Locale, Dictionary> = { en, fr };
const STORAGE_KEY = 'epoque-lang';
const PARAM = 'lang';

/** The page's path (/fr/) first, then ?lang= (older links), then the visitor's previous choice, then the browser language. */
function detectLocale(): Locale {
  const fromPath = localeFromPath();
  if (fromPath) return fromPath;
  const fromUrl = new URLSearchParams(window.location.search).get(PARAM);
  if (isLocale(fromUrl)) return fromUrl;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    /* storage unavailable */
  }
  return navigator.language?.toLowerCase().startsWith('fr') ? 'fr' : defaultLocale;
}

interface I18nValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Dictionary;
  /** Picks the current language from a Localized value. */
  l: <T>(value: Localized<T>) => T;
}

const I18nContext = createContext<I18nValue | null>(null);

/** `initial`: the language of a page rendered ahead of time (pre-rendering, no window). */
export function I18nProvider({ children, initial }: { children: ReactNode; initial?: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(() => initial ?? detectLocale());
  const t = dictionaries[locale];

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = t.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description);

    /* each language has its own address: / (English) and /fr/ */
    const url = new URL(window.location.href);
    url.searchParams.delete(PARAM);
    url.pathname = new URL(homeHref(locale), window.location.href).pathname;
    window.history.replaceState(null, '', url);
  }, [locale, t]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const value = useMemo<I18nValue>(
    () => ({ locale, setLocale, t, l: (v) => v[locale] }),
    [locale, setLocale, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
}

/** Replaces {placeholders} in a dictionary string. */
export const fill = (s: string, vars: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ''));

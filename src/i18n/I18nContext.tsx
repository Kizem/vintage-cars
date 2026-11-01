import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { en, type Dictionary } from './en';
import { fr } from './fr';
import { defaultLocale, isLocale, type Locale, type Localized } from './locales';

const dictionaries: Record<Locale, Dictionary> = { en, fr };
const STORAGE_KEY = 'epoque-lang';
const PARAM = 'lang';

/** URL (?lang=) first, then the visitor's previous choice, then the browser language. */
function detectLocale(): Locale {
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

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale);
  const t = dictionaries[locale];

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = t.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description);

    const url = new URL(window.location.href);
    if (locale === defaultLocale) url.searchParams.delete(PARAM);
    else url.searchParams.set(PARAM, locale);
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

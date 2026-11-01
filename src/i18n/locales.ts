export const locales = ['en', 'fr'] as const;
export type Locale = (typeof locales)[number];

/** A piece of content available in every site language. */
export type Localized<T = string> = Record<Locale, T>;

export const defaultLocale: Locale = 'en';

export const isLocale = (v: unknown): v is Locale => locales.includes(v as Locale);

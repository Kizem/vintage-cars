import { useI18n } from '../../i18n/I18nContext';
import { locales } from '../../i18n/locales';

const names = { en: 'English', fr: 'Français' } as const;

/** Discreet EN | FR switch. */
export function LanguageToggle({ className = '' }: { className?: string }) {
  const { locale, setLocale, t } = useI18n();
  return (
    <div role="group" aria-label={t.header.language} className={`flex items-center text-[11.5px] font-medium tracking-[0.16em] ${className}`}>
      {locales.map((code, i) => (
        <span key={code} className="flex items-center">
          {i > 0 && (
            <span aria-hidden="true" className="mx-1.5 h-3 w-px bg-current opacity-35" />
          )}
          <button
            type="button"
            lang={code}
            onClick={() => setLocale(code)}
            aria-pressed={locale === code}
            aria-label={names[code]}
            className={`px-1 py-2 uppercase transition-opacity duration-300 ${
              locale === code ? 'opacity-100 underline decoration-champagne decoration-1 underline-offset-[6px]' : 'opacity-55 hover:opacity-100'
            }`}
          >
            {code}
          </button>
        </span>
      ))}
    </div>
  );
}

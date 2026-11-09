import { renderToString } from 'react-dom/server';
import App from '../App';
import type { Locale } from '../i18n/locales';
import { setRootPrefix } from '../lib/paths';

/** The single-page home, rendered ahead of time in one language (the browser then renders it again). */
export function renderHome(locale: Locale, prefix: string): string {
  setRootPrefix(prefix);
  try {
    return renderToString(<App locale={locale} />);
  } finally {
    setRootPrefix(null);
  }
}

import { useEffect, useRef, useState } from 'react';
import { site } from '../data/site';
import { useI18n } from '../i18n/I18nContext';
import { setLock } from '../lib/pageNav';

/**
 * Legal pages placeholder, opened by the #legal-notice and #privacy links.
 * While it is open, the wheel and the keys do not change section.
 * TODO: replace the texts in the dictionaries with the final versions
 * validated by counsel (mentions légales, GDPR privacy policy).
 */
const pageKeys = ['legal-notice', 'privacy'] as const;
type PageKey = (typeof pageKeys)[number];
const isPage = (h: string): h is PageKey => (pageKeys as readonly string[]).includes(h);

export function LegalDialog() {
  const { t } = useI18n();
  const ref = useRef<HTMLDialogElement>(null);
  const [page, setPage] = useState<PageKey | null>(null);

  useEffect(() => {
    const sync = () => {
      const h = window.location.hash.slice(1);
      setPage(isPage(h) ? h : null);
    };
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (page && !d.open) d.showModal();
    if (!page && d.open) d.close();
    setLock('dialog', page !== null);
    return () => setLock('dialog', false);
  }, [page]);

  const onClose = () => {
    if (isPage(window.location.hash.slice(1))) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    setPage(null);
  };

  const content = page ? t.legal[page] : null;

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
      aria-labelledby="legal-title"
      className="em-legal"
    >
      {content && (
        <div className="em-legal__in">
          <p className="em-no">{site.name}</p>
          <h2 id="legal-title" className="em-legal__title">
            {content.title}
          </h2>
          {content.body.map((p) => (
            <p key={p} className="em-text">
              {p}
            </p>
          ))}
          <button type="button" className="em-action" onClick={() => ref.current?.close()}>
            {t.legal.close}
          </button>
        </div>
      )}
    </dialog>
  );
}

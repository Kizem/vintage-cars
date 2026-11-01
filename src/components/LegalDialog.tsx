import { useEffect, useRef, useState } from 'react';
import { site } from '../data/site';
import { useI18n } from '../i18n/I18nContext';

/**
 * Legal pages placeholder, opened by the #legal-notice and #privacy links.
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
      className="m-auto w-[min(92vw,640px)] rounded-sm bg-offwhite p-0 text-charcoal"
    >
      {content && (
        <div className="p-8 sm:p-12">
          <p className="eyebrow mb-4 text-muted-ink">{site.name}</p>
          <h2 id="legal-title" className="mb-6 text-[2.4rem] leading-tight text-forest">
            {content.title}
          </h2>
          <div className="space-y-4 text-[15px] leading-relaxed text-charcoal/85">
            {content.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            className="mt-10 border-b border-forest pb-1 text-[12px] font-medium tracking-[0.18em] text-forest uppercase"
          >
            {t.legal.close}
          </button>
        </div>
      )}
    </dialog>
  );
}

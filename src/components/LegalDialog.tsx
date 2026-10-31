import { useEffect, useRef, useState } from 'react';
import { site } from '../data/site';

/**
 * Legal pages placeholder. Opened by the #legal-notice and #privacy links.
 * TODO: replace the content with the final texts validated by counsel
 * (French "mentions légales" and a GDPR-compliant privacy policy).
 */
const pages = {
  'legal-notice': {
    title: 'Legal Notice',
    body: [
      'This page will contain the legal information required by French law (mentions légales): the publisher’s company name, legal form, registered office, registration number (RCS/SIREN), VAT number, publication director and the website host’s details.',
      'This content is pending and will be published before launch.',
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    body: [
      `The details you share through the enquiry form are used solely by ${site.name} to reply to your request and arrange your experience. They are never sold or shared for marketing purposes.`,
      'The complete privacy policy — data controller, legal basis, retention periods, processors and your rights under the GDPR (access, rectification, erasure, objection) — is pending and will be published before launch.',
    ],
  },
} as const;

type PageKey = keyof typeof pages;
const isPage = (h: string): h is PageKey => h in pages;

export function LegalDialog() {
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

  const content = page ? pages[page] : null;

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
            Close
          </button>
        </div>
      )}
    </dialog>
  );
}

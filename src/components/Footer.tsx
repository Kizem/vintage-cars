import { site } from '../data/site';
import { Wordmark } from './ui/Wordmark';

export function Footer() {
  const year = new Date().getFullYear();
  const { instagramUrl, instagramHandle } = site.social;

  return (
    <footer className="bg-forest-deep text-ivory">
      <div className="page-gutter mx-auto max-w-[var(--container-page)] pt-20 pb-10 sm:pt-24">
        <div className="grid gap-14 border-b border-line-light pb-16 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <a href="#top" aria-label={`${site.name} — back to top`}>
              <Wordmark size="lg" />
            </a>
            <p className="mt-6 max-w-sm text-[0.975rem] leading-relaxed text-ivory/65">
              A French automotive heritage house offering private vintage car experiences in Paris to international
              visitors — by enquiry only.
            </p>
            <p className="mt-8 font-display text-xl text-champagne italic">{site.tagline}</p>
          </div>

          <nav aria-label="Footer" className="md:col-span-3 md:col-start-7">
            <h2 className="eyebrow mb-6 font-sans text-champagne">Explore</h2>
            <ul className="space-y-3">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="link-quiet text-ivory/80 hover:text-ivory">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <h2 className="eyebrow mb-6 font-sans text-champagne">Contact</h2>
            <address className="space-y-3 not-italic text-ivory/80">
              <p>
                <a href={`mailto:${site.contact.email}`} className="link-quiet hover:text-ivory">
                  {site.contact.email}
                </a>
              </p>
              <p>
                <a href={`tel:${site.contact.phoneHref}`} className="link-quiet hover:text-ivory">
                  {site.contact.phone}
                </a>
              </p>
              <p>{site.contact.location}</p>
              <p className="text-ivory/55">{site.contact.hours}</p>
            </address>
            <p className="mt-6">
              {instagramUrl ? (
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="link-quiet inline-flex items-center gap-2 text-ivory/80 hover:text-ivory">
                  <InstagramIcon /> Instagram {instagramHandle}
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 text-ivory/55" title="Instagram profile coming soon">
                  <InstagramIcon /> Instagram — coming soon
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-8 text-[12.5px] text-ivory/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <ul className="flex gap-8">
            <li>
              <a href="#legal-notice" className="link-quiet hover:text-ivory">
                Legal Notice
              </a>
            </li>
            <li>
              <a href="#privacy" className="link-quiet hover:text-ivory">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

function InstagramIcon() {
  return (
    <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

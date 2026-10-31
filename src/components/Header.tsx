import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { site } from '../data/site';
import { Wordmark } from './ui/Wordmark';
import { ButtonLink } from './ui/Button';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Mobile menu: lock scroll, close on Escape, keep focus inside, close when resizing to desktop.
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector<HTMLElement>('a')?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === 'Tab' && panelRef.current) {
        const items = [toggleRef.current, ...panelRef.current.querySelectorAll<HTMLElement>('a')].filter(Boolean) as HTMLElement[];
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    const mq = window.matchMedia('(min-width: 1024px)');
    const onMq = () => mq.matches && setOpen(false);
    window.addEventListener('keydown', onKey);
    mq.addEventListener('change', onMq);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onMq);
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,color] duration-500 ease-[var(--ease-editorial)] ${
        solid ? 'border-b border-line bg-ivory text-forest' : 'border-b border-transparent bg-transparent text-ivory'
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60] focus:bg-forest focus:px-4 focus:py-2 focus:text-ivory"
      >
        Skip to content
      </a>
      <div className={`page-gutter mx-auto flex max-w-[var(--container-page)] items-center justify-between transition-[height] duration-500 ${scrolled ? 'h-[68px]' : 'h-[76px] lg:h-[88px]'}`}>
        <a href="#top" aria-label={`${site.name} — back to top`} className="relative z-10" onClick={() => setOpen(false)}>
          <Wordmark />
        </a>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-10">
            {site.nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="link-quiet pb-1 text-[12.5px] font-medium tracking-[0.12em] uppercase">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          <span className="hidden sm:block">
            <ButtonLink href="#contact" variant={solid ? 'solid' : 'outline-light'} className="!px-6 !py-3">
              Enquire Now
            </ButtonLink>
          </span>
          <button
            ref={toggleRef}
            type="button"
            className="relative z-10 -mr-2 flex h-11 w-11 items-center justify-center lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            <span aria-hidden="true" className="relative block h-3 w-6">
              <span
                className={`absolute left-0 block h-px w-6 bg-current transition-transform duration-500 ${open ? 'top-1.5 rotate-45' : 'top-0'}`}
              />
              <span
                className={`absolute left-0 block h-px bg-current transition-all duration-500 ${open ? 'top-1.5 w-6 -rotate-45' : 'top-3 w-4'}`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        ref={panelRef}
        hidden={!open}
        className="fixed inset-x-0 top-0 bottom-0 -z-0 overflow-y-auto bg-ivory pt-[96px] text-forest lg:hidden"
      >
        <nav aria-label="Mobile" className="page-gutter flex min-h-full flex-col pb-10">
          <ul className="flex flex-col border-t border-line">
            {site.nav.map((item, i) => (
              <li key={item.href} className="border-b border-line">
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="hero-in flex items-baseline justify-between py-5 font-display text-[2rem] leading-none"
                  style={{ '--hero-delay': `${80 + i * 60}ms` } as CSSProperties}
                >
                  {item.label}
                  <span className="eyebrow text-muted-ink">0{i + 1}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-col gap-6 pt-12">
            <ButtonLink href="#contact" onClick={() => setOpen(false)} arrow className="w-full justify-between">
              Enquire Now
            </ButtonLink>
            <p className="font-display text-xl text-forest/80 italic">{site.tagline}</p>
          </div>
        </nav>
      </div>
    </header>
  );
}

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { primaryNav, site } from '../data/site';
import { useI18n } from '../i18n/I18nContext';
import { LanguageToggle } from './ui/LanguageToggle';
import { Wordmark } from './ui/Wordmark';
import { ButtonLink } from './ui/Button';

export function Header() {
  const { t } = useI18n();
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
        // Visible while the menu is open: language switch, close button, then the panel.
        const langButtons = [...(toggleRef.current?.parentElement?.querySelectorAll<HTMLElement>('[role=group] button') ?? [])];
        const items = [...langButtons, toggleRef.current, ...panelRef.current.querySelectorAll<HTMLElement>('a, button')].filter(Boolean) as HTMLElement[];
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
        {t.common.skipToContent}
      </a>
      <div className={`page-gutter mx-auto flex max-w-[var(--container-page)] items-center justify-between gap-4 transition-[height] lg:px-8 xl:px-14 duration-500 ${scrolled ? 'h-[68px]' : 'h-[76px] lg:h-[88px]'}`}>
        <a href="#top" aria-label={`${site.name}, ${t.common.backToTop}`} className="relative z-10" onClick={() => setOpen(false)}>
          <Wordmark />
        </a>

        <nav aria-label={t.header.primaryNav} className="hidden lg:block">
          <ul className="flex items-center gap-3 xl:gap-10">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="link-quiet pb-1 text-[12.5px] font-medium tracking-[0.06em] whitespace-nowrap uppercase xl:tracking-[0.12em]">
                  {t.nav[item.key]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3 sm:gap-5 lg:gap-3 xl:gap-5">
          <LanguageToggle className="relative z-10" />
          <span className="hidden sm:block">
            <ButtonLink href="#contact" variant={solid ? 'solid' : 'outline-light'} className="!px-6 !py-3 whitespace-nowrap lg:!px-5 lg:tracking-[0.1em] xl:!px-6 xl:tracking-[0.18em]">
              {t.header.enquire}
            </ButtonLink>
          </span>
          <button
            ref={toggleRef}
            type="button"
            className="relative z-10 -mr-2 flex h-11 w-11 items-center justify-center lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.header.closeMenu : t.header.openMenu}
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
        <nav aria-label={t.header.mobileNav} className="page-gutter flex min-h-full flex-col pb-10">
          <ul className="flex flex-col border-t border-line">
            {primaryNav.map((item, i) => (
              <li key={item.href} className="border-b border-line">
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="hero-in flex items-baseline justify-between py-5 font-display text-[2rem] leading-none"
                  style={{ '--hero-delay': `${80 + i * 60}ms` } as CSSProperties}
                >
                  {t.nav[item.key]}
                  <span className="eyebrow text-muted-ink">0{i + 1}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-col gap-6 pt-12">
            <ButtonLink href="#contact" onClick={() => setOpen(false)} arrow className="w-full justify-between">
              {t.header.enquire}
            </ButtonLink>
          </div>
        </nav>
      </div>
    </header>
  );
}

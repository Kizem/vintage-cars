import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
}

// The hidden “before” state only applies once this module has run (see .js-reveal in
// index.css): if scripts or the observer fail, the content stays visible.
if (typeof document !== 'undefined') document.documentElement.classList.add('js-reveal');

/**
 * Safety net: if an element sits well inside the viewport after scrolling has
 * settled and is still hidden, the observer is not doing its job. Drop the
 * hidden state for the whole page (content shown, without the entrance).
 */
let watchdogArmed = false;
function armWatchdog() {
  if (watchdogArmed || typeof window === 'undefined') return;
  watchdogArmed = true;
  let timer = 0;
  const check = () => {
    const pending = [...document.querySelectorAll<HTMLElement>('.reveal:not(.is-visible)')];
    if (!pending.length) return window.removeEventListener('scroll', schedule);
    const vh = window.innerHeight;
    const stuck = pending.some((el) => {
      const r = el.getBoundingClientRect();
      const seen = Math.min(r.bottom, vh * 0.9) - Math.max(r.top, 0);
      return seen > 0 && r.height > 0 && (seen / r.height > 0.4 || seen > vh * 0.5);
    });
    if (stuck) {
      document.documentElement.classList.remove('js-reveal');
      window.removeEventListener('scroll', schedule);
    }
  };
  function schedule() {
    window.clearTimeout(timer);
    timer = window.setTimeout(check, 1500);
  }
  window.addEventListener('scroll', schedule, { passive: true });
  schedule();
}

/**
 * Fades content in once when it enters the viewport. Respects reduced motion (see CSS).
 * Children can join the entrance with the shared motion classes in index.css
 * (.motion-rule, .motion-beam, .motion-shutter): they play when `.is-visible` is set.
 */
export function Reveal({ children, as: Tag = 'div', delay = 0, className = '' }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    armWatchdog();
    if (!('IntersectionObserver' in window)) {
      el.classList.add('is-visible');
      return;
    }
    // Already scrolled past (anchor jump, restored scroll position): show it straight away.
    if (el.getBoundingClientRect().bottom < 0) {
      el.classList.add('is-visible');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}>
      {children}
    </Tag>
  );
}

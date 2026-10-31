import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'solid' | 'outline' | 'outline-light' | 'light' | 'text' | 'text-light';

const base =
  'group inline-flex items-center justify-center gap-3 rounded-xs font-sans text-[12px] font-medium tracking-[0.18em] uppercase transition-[background-color,color,border-color] duration-500 ease-[var(--ease-editorial)] disabled:cursor-not-allowed disabled:opacity-60';

const variants: Record<Variant, string> = {
  solid: 'bg-forest px-7 py-4 text-ivory hover:bg-forest-deep',
  light: 'bg-ivory px-7 py-4 text-forest hover:bg-offwhite',
  outline: 'border border-charcoal/30 px-7 py-[15px] text-charcoal hover:border-forest hover:bg-forest hover:text-ivory',
  'outline-light': 'border border-ivory/45 px-7 py-[15px] text-ivory hover:border-ivory hover:bg-ivory hover:text-forest',
  text: 'py-2 text-forest',
  'text-light': 'py-2 text-ivory',
};

function Arrow() {
  return (
    <svg
      aria-hidden="true"
      width="22"
      height="8"
      viewBox="0 0 22 8"
      fill="none"
      className="transition-transform duration-500 ease-[var(--ease-editorial)] group-hover:translate-x-1"
    >
      <path d="M0 4h20.5M17.5 1l3 3-3 3" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

interface Common {
  variant?: Variant;
  arrow?: boolean;
  children: ReactNode;
  className?: string;
}

export function ButtonLink({ variant = 'solid', arrow, children, className = '', ...rest }: Common & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={`${base} ${variants[variant]} ${className}`} {...rest}>
      <span className={variant.startsWith('text') ? 'link-quiet pb-0.5' : ''}>{children}</span>
      {arrow && <Arrow />}
    </a>
  );
}

export function Button({ variant = 'solid', arrow, children, className = '', type = 'button', ...rest }: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={`${base} ${variants[variant]} ${className}`} {...rest}>
      <span className={variant.startsWith('text') ? 'link-quiet pb-0.5' : ''}>{children}</span>
      {arrow && <Arrow />}
    </button>
  );
}

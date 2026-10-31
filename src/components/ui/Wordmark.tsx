interface WordmarkProps {
  className?: string;
  size?: 'sm' | 'lg';
}

/** Typographic wordmark — to be replaced by the final logotype when available. */
export function Wordmark({ className = '', size = 'sm' }: WordmarkProps) {
  return (
    <span className={`inline-flex items-baseline gap-[0.55em] whitespace-nowrap ${className}`}>
      <span className={`font-display font-medium tracking-[0.2em] ${size === 'lg' ? 'text-[2rem]' : 'text-[1.3rem] sm:text-[1.45rem]'}`}>
        ÉPOQUE
      </span>
      <span className={`font-sans font-medium tracking-[0.42em] ${size === 'lg' ? 'text-[0.8rem]' : 'text-[0.6rem] sm:text-[0.64rem]'}`}>
        MOTORS
      </span>
    </span>
  );
}

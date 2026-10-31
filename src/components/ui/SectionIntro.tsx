import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

interface SectionIntroProps {
  id: string;
  eyebrow: string;
  title: ReactNode;
  text?: ReactNode;
  tone?: 'light' | 'dark';
  align?: 'split' | 'stack';
}

export function SectionIntro({ id, eyebrow, title, text, tone = 'light', align = 'split' }: SectionIntroProps) {
  const dark = tone === 'dark';
  return (
    <Reveal
      className={
        align === 'split'
          ? 'grid gap-6 md:grid-cols-12 md:items-end md:gap-10'
          : 'flex max-w-3xl flex-col gap-6'
      }
    >
      <div className={align === 'split' ? 'md:col-span-7' : ''}>
        <p className={`eyebrow mb-5 flex items-center gap-4 ${dark ? 'text-champagne' : 'text-forest'}`}>
          <span aria-hidden="true" className={`h-px w-10 ${dark ? 'bg-champagne/70' : 'bg-champagne'}`} />
          {eyebrow}
        </p>
        <h2 id={id} className={`text-[clamp(2.4rem,5.2vw,4.25rem)] leading-[1.02] ${dark ? 'text-ivory' : 'text-forest'}`}>
          {title}
        </h2>
      </div>
      {text && (
        <p
          className={`max-w-md text-[1.0625rem] leading-relaxed md:col-span-5 md:justify-self-end md:pb-2 ${dark ? 'text-ivory/75' : 'text-muted-ink'}`}
        >
          {text}
        </p>
      )}
    </Reveal>
  );
}

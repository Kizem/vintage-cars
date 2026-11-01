import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import { experiences } from '../data/experiences';
import { useEnquiry } from '../context/EnquiryContext';
import { useI18n } from '../i18n/I18nContext';
import { SectionIntro } from './ui/SectionIntro';
import { Reveal } from './ui/Reveal';
import { Media } from './ui/Media';
import { Button } from './ui/Button';

/** Time each experience stays on screen when the slideshow plays. */
const DURATION_MS = 7000;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * One experience at a time: large image on one side, text on the other.
 * Autoplays while visible (the progress bar of the active tab drives it),
 * pauses on hover and keyboard focus, stops when the visitor picks a tab,
 * and never autoplays with reduced motion. Accessible tabs pattern.
 */
export function Experiences() {
  const { startEnquiry } = useEnquiry();
  const { t, l } = useI18n();
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(() => !prefersReducedMotion());
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const swipeX = useRef<number | null>(null);
  const count = experiences.length;

  useEffect(() => {
    const el = stageRef.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = playing && inView && !hovered && !focused;

  const go = (i: number, fromUser = true) => {
    setActive((i + count) % count);
    if (fromUser) setPlaying(false);
  };

  const onTabKey = (e: KeyboardEvent) => {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let next: number | null = null;
    if (e.key in keys) next = (active + keys[e.key] + count) % count;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = count - 1;
    if (next === null) return;
    e.preventDefault();
    go(next);
    tabRefs.current[next]?.focus();
  };

  const onPointerDown = (e: PointerEvent) => {
    swipeX.current = e.clientX;
  };
  const onPointerUp = (e: PointerEvent) => {
    if (swipeX.current === null) return;
    const dx = e.clientX - swipeX.current;
    swipeX.current = null;
    if (Math.abs(dx) > 50) go(active + (dx < 0 ? 1 : -1));
  };

  return (
    <section id="experiences" aria-labelledby="experiences-title" className="bg-forest py-24 text-ivory sm:py-32 lg:py-40">
      <div className="page-gutter mx-auto max-w-[var(--container-page)]">
        <SectionIntro
          id="experiences-title"
          tone="dark"
          eyebrow={t.experiences.eyebrow}
          title={
            <>
              {t.experiences.titleStart} <em className="italic">{t.experiences.titleEm}</em>
            </>
          }
          text={t.experiences.text}
        />

        <Reveal className="mt-16 lg:mt-24">
          <div
            ref={stageRef}
            className="grid gap-10 lg:grid-cols-12 lg:items-stretch lg:gap-14"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocus={() => setFocused(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocused(false);
            }}
          >
            {/* Images: crossfade, slight settle-in zoom on the active one */}
            <div
              className="relative order-1 aspect-[4/3] touch-pan-y overflow-hidden rounded-xs bg-forest-deep select-none lg:order-2 lg:col-span-7 lg:aspect-auto lg:min-h-[560px]"
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
            >
              {experiences.map((exp, i) => (
                <div
                  key={exp.id}
                  aria-hidden={i !== active}
                  className={`absolute inset-0 transition-[opacity,transform] duration-[1400ms] ease-[var(--ease-editorial)] motion-reduce:transition-none ${
                    i === active ? 'scale-100 opacity-100' : 'scale-[1.04] opacity-0'
                  }`}
                >
                  <Media
                    image={exp.image}
                    tone="charcoal"
                    captionPosition="top-right"
                    creditPosition="top-right"
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className="!absolute inset-0 h-full w-full"
                    showBrief
                  />
                </div>
              ))}
              {/* Pause / play, on the image so it never competes with the call to action */}
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? t.experiences.pause : t.experiences.play}
                className="absolute bottom-4 left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-ivory/40 bg-forest-deep/60 text-ivory transition-colors hover:bg-ivory hover:text-forest"
              >
                {playing ? (
                  <svg aria-hidden="true" width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
                    <rect x="1" y="1" width="2.5" height="10" />
                    <rect x="6.5" y="1" width="2.5" height="10" />
                  </svg>
                ) : (
                  <svg aria-hidden="true" width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
                    <path d="M1.5 1v10l8-5z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Tabs + text */}
            <div className="order-2 flex flex-col lg:order-1 lg:col-span-5 lg:py-2">
              <div role="tablist" aria-label={t.experiences.tabsLabel} className="grid grid-cols-3 gap-4 lg:grid-cols-1 lg:gap-0">
                {experiences.map((exp, i) => {
                  const selected = i === active;
                  return (
                    <button
                      key={exp.id}
                      ref={(el) => {
                        tabRefs.current[i] = el;
                      }}
                      type="button"
                      role="tab"
                      id={`exp-tab-${exp.id}`}
                      aria-selected={selected}
                      aria-controls={`exp-panel-${exp.id}`}
                      tabIndex={selected ? 0 : -1}
                      onClick={() => go(i)}
                      onKeyDown={onTabKey}
                      className={`group relative flex flex-col gap-2 pb-4 text-left transition-colors duration-500 lg:flex-row lg:items-baseline lg:gap-5 lg:border-b lg:border-line-light lg:py-5 ${
                        selected ? 'text-ivory' : 'text-ivory/50 hover:text-ivory/85'
                      }`}
                    >
                      <span className={`font-display text-[1.6rem] leading-none italic lg:text-[1.9rem] ${selected ? 'text-champagne' : ''}`}>
                        {exp.index}
                      </span>
                      <span className="eyebrow !text-[10px] leading-snug lg:!text-[11px]">{l(exp.label)}</span>
                      {/* progress track */}
                      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-line-light lg:-bottom-px">
                        {selected && (
                          <span
                            key={`${active}-${playing}`}
                            className={`block h-full bg-champagne ${playing ? 'showcase-progress' : ''}`}
                            style={
                              {
                                '--showcase-duration': `${DURATION_MS}ms`,
                                animationPlayState: running ? 'running' : 'paused',
                              } as CSSProperties
                            }
                            onAnimationEnd={() => go(active + 1, false)}
                          />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Panels share one grid cell, so the height never jumps between slides */}
              <div className="mt-10 grid flex-1 lg:mt-12">
                {experiences.map((exp, i) => {
                  const selected = i === active;
                  return (
                    <div
                      key={exp.id}
                      id={`exp-panel-${exp.id}`}
                      role="tabpanel"
                      aria-labelledby={`exp-tab-${exp.id}`}
                      className={`[grid-area:1/1] flex flex-col ${selected ? 'visible' : 'invisible'}`}
                    >
                      {selected && (
                        <div key={`${exp.id}-${active}`} className="flex flex-1 flex-col">
                          <h3
                            id={`${exp.id}-title`}
                            className="hero-in mb-6 text-[clamp(2.1rem,3.6vw,3.25rem)] leading-[1.04] text-ivory"
                            style={{ '--hero-delay': '80ms' } as CSSProperties}
                          >
                            {l(exp.title)}
                          </h3>
                          <p
                            className="hero-in mb-9 max-w-[44ch] text-[1.0625rem] leading-relaxed text-ivory/75"
                            style={{ '--hero-delay': '200ms' } as CSSProperties}
                          >
                            {l(exp.description)}
                          </p>
                        </div>
                      )}
                      {/* invisible copy keeps every panel's height in the shared cell */}
                      {!selected && (
                        <div aria-hidden="true">
                          <h3 className="mb-6 text-[clamp(2.1rem,3.6vw,3.25rem)] leading-[1.04]">{l(exp.title)}</h3>
                          <p className="mb-9 max-w-[44ch] text-[1.0625rem] leading-relaxed">{l(exp.description)}</p>
                        </div>
                      )}
                      <div className="mt-auto">
                        <Button
                          variant="outline-light"
                          arrow
                          onClick={() => startEnquiry({ experience: exp.id })}
                          tabIndex={selected ? 0 : -1}
                          className="w-full whitespace-nowrap max-sm:!px-4 max-sm:text-[11px] max-sm:tracking-[0.12em] sm:w-auto [&>svg]:hidden sm:[&>svg]:block"
                        >
                          {l(exp.cta)}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-20 grid gap-6 border-t border-line-light pt-8 sm:grid-cols-2 lg:mt-28">
          <p className="eyebrow text-champagne">{t.experiences.footLabel}</p>
          <p className="max-w-xl text-[0.975rem] leading-relaxed text-ivory/70 sm:justify-self-end">{t.experiences.footText}</p>
        </Reveal>
      </div>
    </section>
  );
}

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import type { Vehicle } from '../data/types';
import { getVehicle, vehicles } from '../data/vehicles';
import { fill, useI18n } from '../i18n/I18nContext';
import { useEnquiry } from '../context/EnquiryContext';
import { Button, ButtonLink } from './ui/Button';
import { VehicleDetail } from './VehicleDetail';
import { Plinth } from './ui/Plinth';

const cars = vehicles.filter((v): v is Vehicle & Required<Pick<Vehicle, 'miniature'>> => Boolean(v.miniature));

const delay = (ms: number) => ({ '--hero-delay': `${ms}ms` }) as CSSProperties;

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const isDesktop = () => window.matchMedia('(min-width: 1024px)').matches;

type Shift = { x: number; y: number; s: number };

/** Deep link: ?car=<slug> opens that car's specifications in the showroom. */
const PARAM = 'car';
const readSlug = () => {
  const slug = new URLSearchParams(window.location.search).get(PARAM);
  return cars.some((c) => c.slug === slug) ? slug : null;
};
function writeSlug(slug: string | null) {
  const url = new URL(window.location.href);
  if (slug) url.searchParams.set(PARAM, slug);
  else url.searchParams.delete(PARAM);
  window.history.replaceState(null, '', url);
}

/** Layout box of `el` relative to `root`, ignoring CSS transforms. */
function boxWithin(el: HTMLElement, root: HTMLElement) {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== root) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

/**
 * Hero “showroom”: the cars of the collection on lit plinths.
 * Hover (or keyboard focus, or the centred car on touch screens) lights a car;
 * a click brings it forward and opens its specifications, read from vehicles.ts.
 */
export function HeroShowroom() {
  const { t, l } = useI18n();
  const { startEnquiry } = useEnquiry();

  const [selected, setSelected] = useState<string | null>(readSlug);
  /** Car whose photo detail view (<dialog>) is open. */
  const [photos, setPhotos] = useState<string | null>(null);
  const [lit, setLit] = useState<string | null>(null);
  const [shift, setShift] = useState<Shift | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);
  const slotRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const modelRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const panelTitleRef = useRef<HTMLHeadingElement>(null);

  const selectedIndex = cars.findIndex((c) => c.slug === selected);
  const current = selectedIndex >= 0 ? cars[selectedIndex] : undefined;
  const next = current ? cars[(selectedIndex + 1) % cars.length] : undefined;

  /* Camera move: brings the selected car into the left part of the stage (desktop only). */
  const measure = useCallback(() => {
    if (!selected || !isDesktop() || prefersReducedMotion()) {
      setShift(null);
      return;
    }
    const slot = slotRefs.current[selected];
    const target = targetRef.current;
    const root = sectionRef.current;
    if (!slot || !target || !root) return;
    const slotBox = boxWithin(slot, root);
    const targetBox = boxWithin(target, root);
    const s = Math.min(targetBox.w / slotBox.w, targetBox.h / slotBox.h, 1.5);
    setShift({
      x: targetBox.x + targetBox.w / 2 - (slotBox.x + slotBox.w / 2),
      y: targetBox.y + targetBox.h / 2 - (slotBox.y + slotBox.h / 2),
      s,
    });
  }, [selected]);

  useLayoutEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  useEffect(() => writeSlug(selected), [selected]);

  const close = useCallback(() => {
    const slug = selected;
    setSelected(null);
    if (slug) requestAnimationFrame(() => buttonRefs.current[slug]?.focus({ preventScroll: true }));
  }, [selected]);

  // Escape closes the specifications; focus moves to them when they open.
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !document.querySelector('dialog[open]')) close();
    };
    window.addEventListener('keydown', onKey);
    const id = window.setTimeout(() => panelTitleRef.current?.focus({ preventScroll: true }), prefersReducedMotion() ? 0 : 450);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(id);
    };
  }, [selected, close]);

  // Phones: the specifications open as a sheet, so the page behind must not scroll.
  useEffect(() => {
    if (!selected || isDesktop()) return;
    const { overflow } = document.documentElement.style;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = overflow;
    };
  }, [selected]);

  // Touch screens: the car centred in the carousel is the lit one.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || canHover() || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setLit((e.target as HTMLElement).dataset.slug ?? null);
      },
      { root: scroller, threshold: 0.75 },
    );
    Object.values(slotRefs.current).forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  /* Pointer tilt, written straight to CSS variables (no re-render per frame). */
  const tilt = (slug: string, e: PointerEvent<HTMLButtonElement>) => {
    const model = modelRefs.current[slug];
    if (!model || e.pointerType !== 'mouse' || prefersReducedMotion()) return;
    const r = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    model.style.setProperty('--tilt-x', `${(nx * 10).toFixed(2)}deg`);
    model.style.setProperty('--tilt-y', `${(-ny * 6).toFixed(2)}deg`);
  };
  const resetTilt = (slug: string) => {
    const model = modelRefs.current[slug];
    model?.style.removeProperty('--tilt-x');
    model?.style.removeProperty('--tilt-y');
  };

  const slotState = (i: number, slug: string) => {
    if (!current) return 'idle';
    if (slug === selected) return 'selected';
    if (!isDesktop()) return 'dimmed';
    return i < selectedIndex ? 'away-left' : 'away-right';
  };

  const closePhotos = useCallback(() => setPhotos(null), []);
  /** “Next car” inside the photo view keeps the specifications behind it in step. */
  const navigatePhotos = useCallback((slug: string) => {
    setPhotos(slug);
    setSelected(slug);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-labelledby="hero-title"
      data-selected={selected ? '' : undefined}
      className="showroom grain relative isolate flex min-h-[max(680px,100svh)] flex-col overflow-hidden bg-forest-deep text-ivory"
    >
      {/* Floor of the showroom: a single plane and its horizon line. */}
      <div aria-hidden="true" className="showroom-floor pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[46%]" />

      <div className="showroom-intro page-gutter relative z-10 mx-auto w-full max-w-[var(--container-page)] pt-28 sm:pt-32 lg:pt-36">
        <p className="eyebrow hero-in mb-5 flex items-center gap-4 text-champagne" style={delay(150)}>
          <span aria-hidden="true" className="h-px w-10 bg-champagne/70" />
          {t.hero.eyebrow}
        </p>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h1
            id="hero-title"
            className="hero-in max-w-[17ch] text-[clamp(2.3rem,min(5vw,8svh),4.6rem)] leading-[1] font-light"
            style={delay(300)}
          >
            {t.hero.titleStart} <em className="font-normal italic">{t.hero.titleEm}</em>
            {t.hero.titleEnd}
          </h1>
          <div className="hero-in max-w-sm lg:pb-2" style={delay(550)}>
            <p className="hidden text-[1rem] leading-relaxed text-ivory/85 sm:block">{t.hero.text}</p>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 sm:mt-6">
              <ButtonLink href="#contact" variant="light" arrow>
                {t.header.enquire}
              </ButtonLink>
              <ButtonLink href="#experiences" variant="text-light">
                {t.hero.ctaSecondary}
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>

      {/* Where the selected car comes to rest (measured, never displayed). */}
      <div ref={targetRef} aria-hidden="true" className="showroom-target pointer-events-none absolute" />

      <div ref={stageRef} className="showroom-stage relative mt-auto w-full" role="group" aria-label={t.showroom.label}>

        <ul
          ref={scrollerRef}
          className="showroom-row no-scrollbar mx-auto flex max-w-[var(--container-page)] snap-x snap-mandatory items-end overflow-x-auto px-[11vw] pt-16 pb-4 lg:grid lg:snap-none lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-14 lg:pt-10"
        >
          {cars.map((car, i) => {
            const m = car.miniature;
            const state = slotState(i, car.slug);
            const style = {
              '--i': i,
              '--scale': m.scale,
              '--ratio': `${m.width} / ${m.height}`,
              ...(state === 'selected' && shift
                ? { '--dx': `${shift.x}px`, '--dy': `${shift.y}px`, '--zoom': shift.s }
                : {}),
            } as CSSProperties;
            const maskUrl = `url("${m.src}")`;
            return (
              <li
                key={car.slug}
                ref={(el) => {
                  slotRefs.current[car.slug] = el;
                }}
                data-slug={car.slug}
                data-state={state}
                data-lit={lit === car.slug && !selected ? '' : undefined}
                className="showroom-slot w-[78vw] max-w-[26rem] shrink-0 snap-center lg:w-auto lg:max-w-none"
                style={style}
              >
                <button
                  ref={(el) => {
                    buttonRefs.current[car.slug] = el;
                  }}
                  type="button"
                  className="showroom-car"
                  aria-expanded={selected === car.slug}
                  aria-controls="showroom-spec"
                  aria-label={fill(t.showroom.open, { name: l(car.name) })}
                  tabIndex={selected && selected !== car.slug && isDesktop() ? -1 : undefined}
                  onPointerEnter={(e) => e.pointerType === 'mouse' && setLit(car.slug)}
                  onPointerLeave={(e) => {
                    if (e.pointerType === 'mouse') setLit((s) => (s === car.slug ? null : s));
                    resetTilt(car.slug);
                  }}
                  onPointerMove={(e) => tilt(car.slug, e)}
                  onFocus={() => setLit(car.slug)}
                  onBlur={() => setLit((s) => (s === car.slug ? null : s))}
                  onClick={() => (selected === car.slug ? close() : setSelected(car.slug))}
                >
                  <span aria-hidden="true" className="showroom-display">
                    <span className="showroom-cone" />
                    <span
                      ref={(el) => {
                        modelRefs.current[car.slug] = el;
                      }}
                      className="showroom-model"
                    >
                      <span className="showroom-shadow" />
                      <img src={m.src} alt="" width={m.width} height={m.height} decoding="async" draggable={false} />
                      <span className="showroom-sheen" style={{ WebkitMaskImage: maskUrl, maskImage: maskUrl }} />
                      {m.lamps.map(([x, y]) => (
                        <span
                          key={`${x}-${y}`}
                          className="showroom-lamp"
                          style={{ left: `${x}%`, top: `${y}%`, width: `${m.lampSize}%` }}
                        />
                      ))}
                    </span>
                    <Plinth />
                  </span>
                  <span className="showroom-caption">
                    <span className="eyebrow text-champagne">
                      {t.collection.number} {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="showroom-name font-display text-[1.65rem] leading-tight text-ivory">
                      {l(car.name)}
                    </span>
                    <span className="eyebrow text-ivory/55">
                      {l(car.category)}
                      {m.credit && <span className="normal-case tracking-normal italic"> · {l(m.credit)}</span>}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <p className="showroom-hint eyebrow pb-8 text-center text-ivory/50 lg:pb-10">
          <span className="hint-hover">{t.showroom.hint}</span>
          <span className="hint-touch">{t.showroom.hintTouch}</span>
        </p>

        {current && (
          <Button variant="text-light" onClick={close} className="showroom-back absolute bottom-8 left-14 hidden lg:inline-flex">
            ← {t.showroom.back}
          </Button>
        )}
      </div>

      {/* Specifications: a side card on desktop, a sheet on phones. */}
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        className="showroom-scrim lg:hidden"
        data-open={current ? '' : undefined}
        onClick={close}
      />
      <aside
        id="showroom-spec"
        aria-labelledby={current ? 'showroom-spec-title' : undefined}
        aria-hidden={current ? undefined : true}
        inert={!current}
        data-open={current ? '' : undefined}
        className="showroom-spec text-charcoal"
      >
        {current && (
          <div key={current.slug} className="showroom-spec-inner">
            <button
              type="button"
              onClick={close}
              className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full text-forest transition-colors hover:bg-forest hover:text-ivory"
              aria-label={t.showroom.back}
            >
              <svg aria-hidden="true" width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" />
              </svg>
            </button>

            <img
              src={current.miniature.src}
              alt=""
              width={current.miniature.width}
              height={current.miniature.height}
              className="mx-auto mb-4 max-h-28 w-auto lg:hidden"
            />

            <p className="spec-line eyebrow flex items-center gap-4 text-forest" style={{ '--d': 0 } as CSSProperties}>
              <span aria-hidden="true" className="h-px w-8 bg-champagne" />
              {t.showroom.specs} · {t.collection.number} {String(selectedIndex + 1).padStart(2, '0')}
            </p>
            <p className="spec-line eyebrow mt-5 text-muted-ink" style={{ '--d': 1 } as CSSProperties}>
              {l(current.category)}
            </p>
            <h2
              id="showroom-spec-title"
              ref={panelTitleRef}
              tabIndex={-1}
              className="spec-line mt-2 text-[clamp(2.1rem,3vw,2.9rem)] leading-[1.02] text-forest outline-none"
              style={{ '--d': 2 } as CSSProperties}
            >
              {l(current.name)}
            </h2>
            <p className="spec-line mt-3 text-[0.9375rem] leading-relaxed text-charcoal/80" style={{ '--d': 3 } as CSSProperties}>
              {l(current.description)}
            </p>

            <dl className="mt-6 grid grid-cols-2 gap-x-6">
              {[
                { label: t.vehicleDetail.marque, value: current.marque },
                ...(current.details ?? []).map((d) => ({ label: l(d.label), value: l(d.value) })),
                { label: t.vehicleDetail.availability, value: t.availabilityShort[current.availability] },
              ].map((row, r) => (
                <div key={row.label} className="spec-row" style={{ '--d': 4 + r } as CSSProperties}>
                  <dt className="eyebrow text-muted-ink">{row.label}</dt>
                  <dd className="mt-1 font-display text-[1.15rem] leading-snug text-forest">{row.value}</dd>
                </div>
              ))}
            </dl>

            {current.miniature.credit && (
              <p className="mt-4 text-xs text-muted-ink italic">{l(current.miniature.credit)}</p>
            )}

            <div className="mt-7 flex flex-col items-start gap-3">
              <Button
                arrow
                className="w-full justify-between sm:w-auto"
                onClick={() => {
                  const slug = current.slug;
                  setSelected(null);
                  startEnquiry({ vehicle: slug });
                }}
              >
                {t.vehicleDetail.enquire}
              </Button>
              <div className="flex flex-wrap items-center gap-x-7 gap-y-1">
                <Button variant="text" onClick={() => setPhotos(current.slug)}>
                  {t.showroom.photos}
                </Button>
                {next && next.slug !== current.slug && (
                  <Button variant="text" arrow className="text-left" onClick={() => setSelected(next.slug)}>
                    {fill(t.vehicleDetail.next, { name: l(next.name) })}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </aside>

      <VehicleDetail vehicle={getVehicle(photos)} onClose={closePhotos} onNavigate={navigatePhotos} />
    </section>
  );
}

import { useCallback, useEffect, useState } from 'react';
import { getVehicle, vehicles } from '../data/vehicles';
import { useI18n } from '../i18n/I18nContext';
import { SectionIntro } from './ui/SectionIntro';
import { Reveal } from './ui/Reveal';
import { VehicleCard } from './VehicleCard';
import { VehicleDetail } from './VehicleDetail';
import { OPEN_VEHICLE_EVENT } from './HeroShowroom';

const PARAM = 'car';

const readSlug = () => new URLSearchParams(window.location.search).get(PARAM);

/** Keeps the open vehicle in the URL (?car=slug) so detail views can be shared. */
function writeSlug(slug: string | null) {
  const url = new URL(window.location.href);
  if (slug) url.searchParams.set(PARAM, slug);
  else url.searchParams.delete(PARAM);
  window.history.replaceState(null, '', url);
}

export function VehicleCollection() {
  const { t } = useI18n();
  const [active, setActive] = useState<string | null>(() => (getVehicle(readSlug()) ? readSlug() : null));

  useEffect(() => writeSlug(active), [active]);

  // The hero showroom asks for a car's photos through a window event.
  useEffect(() => {
    const onOpen = (e: Event) => {
      const slug = (e as CustomEvent<string>).detail;
      if (getVehicle(slug)) setActive(slug);
    };
    window.addEventListener(OPEN_VEHICLE_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_VEHICLE_EVENT, onOpen);
  }, []);

  const close = useCallback(() => setActive(null), []);

  return (
    <section id="collection" aria-labelledby="collection-title" className="bg-ivory py-24 sm:py-32 lg:py-40">
      <div className="page-gutter mx-auto max-w-[var(--container-page)]">
        <SectionIntro
          id="collection-title"
          eyebrow={t.collection.eyebrow}
          title={
            <>
              {t.collection.titleLine1}
              <br />
              <em className="italic">{t.collection.titleLine2}</em>
            </>
          }
          text={t.collection.text}
        />

        <ul className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:mt-24 lg:grid-cols-3 lg:gap-x-10">
          {vehicles.map((v, i) => (
            <Reveal
              as="li"
              key={v.slug}
              delay={i * 120}
              className={`${i === 1 ? 'lg:mt-20' : ''} ${i === 2 ? 'sm:col-span-2 sm:mx-auto sm:w-1/2 sm:px-4 lg:col-span-1 lg:mt-10 lg:w-auto lg:px-0' : ''}`}
            >
              <VehicleCard vehicle={v} index={i} onOpen={setActive} />
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-20 flex flex-col items-start justify-between gap-6 border-t border-line pt-8 sm:flex-row sm:items-center">
          <p className="max-w-xl font-display text-[1.45rem] leading-snug text-forest italic">
            {t.collection.closing}
          </p>
          <a href="#contact" className="link-quiet eyebrow pb-1 text-forest">
            {t.collection.askSpecific}
          </a>
        </Reveal>
      </div>

      <VehicleDetail vehicle={getVehicle(active)} onClose={close} onNavigate={setActive} />
    </section>
  );
}

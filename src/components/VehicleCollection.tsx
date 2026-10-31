import { useCallback, useEffect, useState } from 'react';
import { getVehicle, vehicles } from '../data/vehicles';
import { SectionIntro } from './ui/SectionIntro';
import { Reveal } from './ui/Reveal';
import { VehicleCard } from './VehicleCard';
import { VehicleDetail } from './VehicleDetail';

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
  const [active, setActive] = useState<string | null>(() => (getVehicle(readSlug()) ? readSlug() : null));

  useEffect(() => writeSlug(active), [active]);

  const close = useCallback(() => setActive(null), []);

  return (
    <section id="collection" aria-labelledby="collection-title" className="bg-ivory py-24 sm:py-32 lg:py-40">
      <div className="page-gutter mx-auto max-w-[var(--container-page)]">
        <SectionIntro
          id="collection-title"
          eyebrow="The Collection"
          title={
            <>
              Iconic Cars.
              <br />
              <em className="italic">Timeless Stories.</em>
            </>
          }
          text="A carefully selected collection of automobiles, each with its own character and history."
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
            The collection grows slowly and deliberately — each automobile chosen for its character.
          </p>
          <a href="#contact" className="link-quiet eyebrow pb-1 text-forest">
            Ask about a specific car
          </a>
        </Reveal>
      </div>

      <VehicleDetail vehicle={getVehicle(active)} onClose={close} onNavigate={setActive} />
    </section>
  );
}

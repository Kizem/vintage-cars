import { useEffect, useRef } from 'react';
import type { Vehicle } from '../data/types';
import { availabilityLabels, vehicles } from '../data/vehicles';
import { useEnquiry } from '../context/EnquiryContext';
import { Media } from './ui/Media';
import { Button } from './ui/Button';
import { vehicleMark } from './VehicleCard';

interface VehicleDetailProps {
  vehicle: Vehicle | undefined;
  onClose: () => void;
  onNavigate: (slug: string) => void;
}

/** Vehicle detail view, rendered in a native modal <dialog> (focus trap + Escape built in). */
export function VehicleDetail({ vehicle, onClose, onNavigate }: VehicleDetailProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const { startEnquiry } = useEnquiry();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (vehicle && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = 'hidden';
    } else if (!vehicle && dialog.open) {
      dialog.close();
    }
  }, [vehicle]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const onDialogClose = () => {
      document.documentElement.style.overflow = '';
      onClose();
    };
    dialog.addEventListener('close', onDialogClose);
    return () => dialog.removeEventListener('close', onDialogClose);
  }, [onClose]);

  useEffect(() => {
    ref.current?.querySelector('[data-scroll]')?.scrollTo({ top: 0 });
  }, [vehicle?.slug]);

  const idx = vehicle ? vehicles.findIndex((v) => v.slug === vehicle.slug) : -1;
  const next = idx >= 0 ? vehicles[(idx + 1) % vehicles.length] : undefined;

  return (
    <dialog
      ref={ref}
      aria-labelledby="vehicle-detail-title"
      className="m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-transparent md:m-auto md:h-[min(88vh,820px)] md:w-[min(92vw,1180px)]"
      onClick={(e) => {
        if (e.target === e.currentTarget) ref.current?.close();
      }}
    >
      {vehicle && (
        <div data-scroll className="relative flex h-full flex-col overflow-y-auto bg-offwhite text-charcoal md:grid md:grid-cols-[1.05fr_1fr] md:overflow-hidden md:rounded-sm">
          <button
            type="button"
            onClick={() => ref.current?.close()}
            className="fixed top-4 right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-offwhite/90 text-forest transition-colors hover:bg-forest hover:text-ivory md:absolute md:top-5 md:right-5"
            aria-label="Close vehicle details"
          >
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" />
            </svg>
          </button>

          <Media
            image={vehicle.image}
            mark={vehicleMark(vehicle)}
            tone={idx % 2 === 1 ? 'stone' : 'forest'}
            showBrief
            className="aspect-[4/3] w-full shrink-0 md:aspect-auto md:h-full"
            sizes="(min-width: 768px) 50vw, 100vw"
          />

          <div className="flex shrink-0 grow flex-col p-6 sm:p-10 md:shrink md:overflow-y-auto lg:p-14">
            <p className="eyebrow mb-6 flex items-center gap-4 text-forest">
              <span aria-hidden="true" className="h-px w-10 bg-champagne" />
              The Collection · N° {String(idx + 1).padStart(2, '0')}
            </p>
            <p className="eyebrow mb-3 text-muted-ink">{vehicle.category}</p>
            <h2 id="vehicle-detail-title" className="mb-6 text-[clamp(2.4rem,4.5vw,3.6rem)] leading-[1.02] text-forest">
              {vehicle.name}
            </h2>

            <div className="space-y-4 text-[1.0625rem] leading-relaxed text-charcoal/85">
              {(vehicle.story ?? [vehicle.description]).map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            <dl className="my-9 grid grid-cols-2 gap-x-8 border-t border-line">
              <div className="border-b border-line py-4">
                <dt className="eyebrow mb-1.5 text-muted-ink">Marque</dt>
                <dd className="font-display text-xl text-forest">{vehicle.marque}</dd>
              </div>
              <div className="border-b border-line py-4">
                <dt className="eyebrow mb-1.5 text-muted-ink">Availability</dt>
                <dd className="font-display text-xl text-forest">{availabilityLabels[vehicle.availability]}</dd>
              </div>
              {vehicle.details?.map((d) => (
                <div key={d.label} className="border-b border-line py-4">
                  <dt className="eyebrow mb-1.5 text-muted-ink">{d.label}</dt>
                  <dd className="font-display text-xl text-forest">{d.value}</dd>
                </div>
              ))}
            </dl>

            <p className="mb-8 text-sm leading-relaxed text-muted-ink">
              Each experience is arranged privately, on enquiry. Tell us your dates and what you have in mind — we will
              confirm the car’s availability and the details of your journey personally.
            </p>

            <div className="mt-auto flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <Button
                arrow
                onClick={() => {
                  const slug = vehicle.slug;
                  ref.current?.close();
                  startEnquiry({ vehicle: slug });
                }}
              >
                Enquire about this car
              </Button>
              {next && next.slug !== vehicle.slug && (
                <Button variant="text" onClick={() => onNavigate(next.slug)} arrow>
                  Next: {next.name}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}

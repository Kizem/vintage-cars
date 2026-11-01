import { useEffect, useRef } from 'react';
import type { Vehicle } from '../data/types';
import { vehicles } from '../data/vehicles';
import { fill, useI18n } from '../i18n/I18nContext';
import { useEnquiry } from '../context/EnquiryContext';
import { Gallery } from './ui/Gallery';
import { Button } from './ui/Button';

interface VehicleDetailProps {
  vehicle: Vehicle | undefined;
  onClose: () => void;
  onNavigate: (slug: string) => void;
}

/** Vehicle detail view, rendered in a native modal <dialog> (focus trap + Escape built in). */
export function VehicleDetail({ vehicle, onClose, onNavigate }: VehicleDetailProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const { startEnquiry } = useEnquiry();
  const { t, l } = useI18n();

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
        <div data-scroll className="relative flex h-full flex-col overflow-y-auto bg-offwhite text-charcoal md:grid md:grid-cols-[1.2fr_1fr] md:overflow-hidden md:rounded-sm">
          <button
            type="button"
            onClick={() => ref.current?.close()}
            className="fixed top-4 right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-offwhite/90 text-forest transition-colors hover:bg-forest hover:text-ivory md:absolute md:top-5 md:right-5"
            aria-label={t.vehicleDetail.close}
          >
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" />
            </svg>
          </button>

          <Gallery
            key={vehicle.slug}
            images={[vehicle.image, ...(vehicle.gallery ?? [])]}
            name={l(vehicle.name)}
            mark={vehicle.mark}
            tone={idx % 2 === 1 ? 'stone' : 'forest'}
            className="w-full shrink-0 md:self-center md:py-10 md:pl-10 lg:pl-12"
          />

          <div className="flex shrink-0 grow flex-col p-6 sm:p-10 md:shrink md:overflow-y-auto lg:p-14">
            <p className="eyebrow mb-6 flex items-center gap-4 text-forest md:pr-14">
              <span aria-hidden="true" className="h-px w-10 bg-champagne" />
              {t.collection.eyebrow} · {t.collection.number} {String(idx + 1).padStart(2, '0')}
            </p>
            <p className="eyebrow mb-3 text-muted-ink">{l(vehicle.category)}</p>
            <h2 id="vehicle-detail-title" className="mb-6 text-[clamp(2.4rem,4.5vw,3.6rem)] leading-[1.02] text-forest">
              {l(vehicle.name)}
            </h2>

            <div className="space-y-4 text-[1.0625rem] leading-relaxed text-charcoal/85">
              {(vehicle.story ? l(vehicle.story) : [l(vehicle.description)]).map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            <dl className="my-9 grid grid-cols-2 gap-x-8 border-t border-line">
              <div className="border-b border-line py-4">
                <dt className="eyebrow mb-1.5 text-muted-ink">{t.vehicleDetail.marque}</dt>
                <dd className="font-display text-xl text-forest">{vehicle.marque}</dd>
              </div>
              <div className="border-b border-line py-4">
                <dt className="eyebrow mb-1.5 text-muted-ink">{t.vehicleDetail.availability}</dt>
                <dd className="font-display text-xl text-forest">{t.availabilityShort[vehicle.availability]}</dd>
              </div>
              <div className="border-b border-line py-4">
                <dt className="eyebrow mb-1.5 text-muted-ink">{t.vehicleDetail.service}</dt>
                <dd className="font-display text-xl text-forest">{t.service[vehicle.service]}</dd>
              </div>
              {vehicle.details?.map((d) => (
                <div key={d.label.en} className="border-b border-line py-4">
                  <dt className="eyebrow mb-1.5 text-muted-ink">{l(d.label)}</dt>
                  <dd className="font-display text-xl text-forest">{l(d.value)}</dd>
                </div>
              ))}
            </dl>

            <p className="mb-8 text-sm leading-relaxed text-muted-ink">
              {t.vehicleDetail.note}
            </p>

            <div className="mt-auto flex flex-col items-start gap-5">
              <Button
                arrow
                className="w-full justify-between sm:w-auto"
                onClick={() => {
                  const slug = vehicle.slug;
                  ref.current?.close();
                  startEnquiry({ vehicle: slug });
                }}
              >
                {t.vehicleDetail.enquire}
              </Button>
              {next && next.slug !== vehicle.slug && (
                <Button variant="text" onClick={() => onNavigate(next.slug)} arrow className="text-left">
                  {fill(t.vehicleDetail.next, { name: l(next.name) })}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}

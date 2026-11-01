import type { Vehicle } from '../data/types';
import { useI18n } from '../i18n/I18nContext';
import { Media } from './ui/Media';

interface VehicleCardProps {
  vehicle: Vehicle;
  index: number;
  onOpen: (slug: string) => void;
}

export function VehicleCard({ vehicle, index, onOpen }: VehicleCardProps) {
  const { t, l } = useI18n();
  const titleId = `vehicle-${vehicle.slug}-title`;
  return (
    <article aria-labelledby={titleId} className="group relative flex flex-col">
      <div className="relative overflow-hidden rounded-xs">
        <Media
          image={vehicle.image}
          tone={index % 2 === 1 ? 'stone' : 'forest'}
          mark={vehicle.mark}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
          className="aspect-[3/2] w-full transition-transform duration-[1.2s] ease-[var(--ease-editorial)] group-hover:scale-[1.025]"
        />
        <span className="eyebrow absolute top-5 left-5 rounded-xs bg-offwhite/92 px-3 py-1.5 !text-[10px] text-forest">
          {t.availability[vehicle.availability]}
        </span>
      </div>

      <div className="flex flex-1 flex-col border-b border-line pt-6 pb-7">
        <div className="mb-3 flex items-baseline justify-between gap-4">
          <p className="eyebrow text-muted-ink">{l(vehicle.category)}</p>
          <span aria-hidden="true" className="font-display text-sm text-muted-ink italic">
            {t.collection.number} {String(index + 1).padStart(2, '0')}
          </span>
        </div>
        <h3 id={titleId} className="mb-4 text-[2rem] leading-tight text-forest">
          {l(vehicle.name)}
        </h3>
        <p className="mb-7 max-w-[38ch] text-[0.975rem] leading-relaxed text-muted-ink">{l(vehicle.description)}</p>
        <button
          type="button"
          onClick={() => onOpen(vehicle.slug)}
          aria-haspopup="dialog"
          className="mt-auto inline-flex items-center gap-3 self-start text-[12px] font-medium tracking-[0.18em] text-forest uppercase after:absolute after:inset-0 after:content-['']"
        >
          <span className="link-quiet pb-0.5 group-hover:bg-[length:100%_1px]">{t.collection.discover}</span>
          <svg aria-hidden="true" width="22" height="8" viewBox="0 0 22 8" fill="none" className="transition-transform duration-500 group-hover:translate-x-1">
            <path d="M0 4h20.5M17.5 1l3 3-3 3" stroke="currentColor" />
          </svg>
          <span className="sr-only">, {l(vehicle.name)}</span>
        </button>
      </div>
    </article>
  );
}

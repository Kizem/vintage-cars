import type { Ref } from 'react';
import type { Vehicle } from '../../data/types';
import { fill, useI18n } from '../../i18n/I18nContext';
import { ActionLink } from '../ui';
import { PhotoCarousel, type CarouselHandle } from './PhotoCarousel';

/**
 * La fiche d'une voiture, dans le garage à côté de la voiture : N°, nom, photos, phrase,
 * fiche technique (service et disponibilité en tête), action. `withPhotos={false}` retire les photos.
 */
export function VehicleSheet({
  car,
  n,
  onEnquire,
  headingRef,
  carouselRef,
  withPhotos = true,
}: {
  car: Vehicle;
  n: number;
  onEnquire: () => void;
  headingRef: Ref<HTMLHeadingElement>;
  carouselRef?: Ref<CarouselHandle>;
  withPhotos?: boolean;
}) {
  const { t, l } = useI18n();
  const name = l(car.name);
  return (
    <div className="em-sheet" role="group" aria-label={name}>
      <p className="em-no">{fill(t.chapter.number, { n })}</p>
      <h2 className="em-sheet__name" tabIndex={-1} ref={headingRef}>
        {name}
      </h2>
      {withPhotos && <PhotoCarousel ref={carouselRef} photos={[car.image, ...(car.gallery ?? [])]} label={fill(t.focus.photosOf, { name })} />}
      <p className="em-sheet__desc">{l(car.summary ?? car.description)}</p>
      <h3 className="em-sr">{t.focus.specs}</h3>
      <dl className="em-specs">
        <div>
          <dt>{t.focus.service}</dt>
          <dd>{t.service[car.service]}</dd>
        </div>
        <div>
          <dt>{t.focus.availability}</dt>
          <dd>{t.availabilityShort[car.availability]}</dd>
        </div>
        {car.details?.map((d) => (
          <div key={d.label.en}>
            <dt>{l(d.label)}</dt>
            <dd>{l(d.value)}</dd>
          </div>
        ))}
      </dl>
      <ActionLink onClick={onEnquire}>{t.focus.enquire}</ActionLink>
    </div>
  );
}

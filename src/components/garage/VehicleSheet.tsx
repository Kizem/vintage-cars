import type { Ref } from 'react';
import type { Vehicle } from '../../data/types';
import { fill, useI18n } from '../../i18n/I18nContext';
import { carLink } from '../../data/links';
import { ActionLink, MoreLink } from '../ui';
import { PhotoCarousel, type CarouselHandle } from './PhotoCarousel';

/**
 * La fiche d'une voiture, dans le garage à côté de la voiture : N°, nom, photos en grand,
 * fiche technique (service en tête), action. `withPhotos={false}` retire les photos.
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
      {/* sa page détaillée : sous les photos, en italique avec une flèche, loin de l'action (le formulaire) */}
      {carLink[car.slug] && (
        <MoreLink to={carLink[car.slug]} arrow>
          {fill(t.focus.page, { name })}
        </MoreLink>
      )}
      <h3 className="em-sr">{t.focus.specs}</h3>
      <dl className="em-specs">
        <div>
          <dt>{t.focus.service}</dt>
          <dd>{t.service[car.service]}</dd>
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

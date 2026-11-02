import type { Ref } from 'react';
import type { Vehicle } from '../../data/types';
import { fill, useI18n } from '../../i18n/I18nContext';
import { ActionLink } from '../ui';

/** La fiche technique, à côté des photos dans le focus. */
export function VehicleSheet({
  car,
  n,
  onEnquire,
  headingRef,
}: {
  car: Vehicle;
  n: number;
  onEnquire: () => void;
  headingRef: Ref<HTMLHeadingElement>;
}) {
  const { t, l } = useI18n();
  const name = l(car.name);
  return (
    <div className="em-sheet" role="group" aria-label={name}>
      <p className="em-no">{fill(t.chapter.number, { n })}</p>
      <h2 className="em-sheet__name" tabIndex={-1} ref={headingRef}>
        {name}
      </h2>
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

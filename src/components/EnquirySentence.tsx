import { useEffect, useLayoutEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { useEnquiry } from '../context/EnquiryContext';
import { experiences } from '../data/experiences';
import { site } from '../data/site';
import { getVehicle, vehicles } from '../data/vehicles';
import { fill, useI18n } from '../i18n/I18nContext';
import {
  buildMailto,
  emptyEnquiry,
  submitEnquiry,
  todayISO,
  validateEnquiry,
  type EnquiryErrors,
  type EnquiryPayload,
  type SubmitResult,
} from '../lib/enquiry';

type Status = 'idle' | 'submitting' | SubmitResult['status'];
type Field = keyof EnquiryPayload;

/** Les champs s'élargissent avec leur contenu, comme des blancs dans une phrase. */
const grow = (v: string, placeholder: string) => ({ width: `${Math.max((v || placeholder).length, 4) + 1}ch` });

/**
 * Le formulaire est une phrase à compléter, plus « Je précise : » pour le message.
 * Tant qu'aucun point d'envoi n'est configuré (VITE_ENQUIRY_ENDPOINT), il le dit
 * et propose l'envoi par e-mail : jamais de faux message d'envoi.
 */
export function EnquirySentence() {
  const { prefill } = useEnquiry();
  const { t, l, locale } = useI18n();
  const f = t.form;
  const [values, setValues] = useState<EnquiryPayload>(emptyEnquiry);
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [reason, setReason] = useState<'server' | 'network'>('network');
  const statusRef = useRef<HTMLDivElement>(null);
  const message = useRef<HTMLTextAreaElement>(null);

  /* « Demander cette voiture » et les actions de chapitre préremplissent la phrase */
  useEffect(() => {
    if (!prefill) return;
    setValues((v) => ({ ...v, experience: prefill.experience ?? v.experience, vehicle: prefill.vehicle ?? v.vehicle }));
    setStatus((s) => (s === 'submitting' ? s : 'idle'));
  }, [prefill]);

  /* le message grandit avec le texte, jusqu'à trois lignes */
  useLayoutEffect(() => {
    const el = message.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [values.message, status]);

  const update = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const next = { ...values, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value };
    setValues(next);
    if (touched) setErrors(validateEnquiry(next));
  };

  const send = async () => {
    setStatus('submitting');
    const result = await submitEnquiry(values, locale);
    setStatus(result.status);
    if (result.status === 'error') setReason(result.reason);
    requestAnimationFrame(() => statusRef.current?.focus());
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched(true);
    const found = validateEnquiry(values);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    void send();
  };

  const reset = () => {
    setValues(emptyEnquiry);
    setErrors({});
    setTouched(false);
    setStatus('idle');
  };

  const experienceName = (id: string) => {
    const x = experiences.find((e) => e.id === id);
    return x ? l(x.label) : f.somethingElse;
  };
  const sep = locale === 'fr' ? ' : ' : ': ';
  const mailto = () => {
    const car = getVehicle(values.vehicle);
    return buildMailto(
      site.contact.email,
      `${f.mailSubject}${sep}${experienceName(values.experience)}`,
      [
        [f.mailName, values.fullName.trim()],
        [f.mailEmail, values.email.trim()],
        [f.mailExperience, experienceName(values.experience)],
        [f.mailVehicle, car ? l(car.name) : f.noPreference],
        [f.mailDate, values.date || f.flexible],
      ],
      values.message,
      sep,
    );
  };

  if (status === 'sent') {
    return (
      <div className="em-done" role="status" tabIndex={-1} ref={statusRef}>
        <p className="em-title">{fill(f.sentTitle, { name: values.fullName.trim().split(' ')[0] })}</p>
        <p className="em-text">{fill(f.sentText, { email: values.email.trim() })}</p>
        <button type="button" className="em-link" onClick={reset}>
          {f.sendAnother}
        </button>
      </div>
    );
  }

  if (status === 'not-configured' || status === 'error') {
    return (
      <div className="em-done" role="alert" tabIndex={-1} ref={statusRef}>
        <p className="em-form__s">{status === 'error' ? f.errorTitle : f.notSentTitle}</p>
        <p className="em-text">
          {status === 'error' ? `${reason === 'server' ? f.errorServer : f.errorNetwork} ${f.errorText}` : f.notSentText}
        </p>
        {status === 'error' && (
          <button type="button" className="em-action" onClick={() => void send()}>
            {f.tryAgain}
          </button>
        )}
        <a className="em-action" href={mailto()}>
          {f.sendByEmail}
        </a>
        <button type="button" className="em-link" onClick={() => setStatus('idle')}>
          {f.edit}
        </button>
      </div>
    );
  }

  const invalid = (k: Field) => (errors[k] ? { 'aria-invalid': true, 'aria-describedby': `em-err-${k}` } : {});
  const errorKeys = Object.keys(errors) as Field[];
  const busy = status === 'submitting';

  return (
    <form className="em-form" onSubmit={onSubmit} noValidate>
      <p className="em-form__s">
        {f.a}{' '}
        <span className="em-slot">
          <label className="em-sr" htmlFor="em-fullName">
            {f.fullName}
          </label>
          <input
            id="em-fullName"
            name="fullName"
            autoComplete="name"
            placeholder={f.namePlaceholder}
            value={values.fullName}
            onChange={update}
            style={grow(values.fullName, f.namePlaceholder)}
            {...invalid('fullName')}
          />
        </span>
        {f.b}{' '}
        <span className="em-slot em-slot--sel">
          <label className="em-sr" htmlFor="em-experience">
            {f.experience}
          </label>
          <select id="em-experience" name="experience" value={values.experience} onChange={update} {...invalid('experience')}>
            <option value="">{f.selectExperience}</option>
            {experiences.map((x) => (
              <option key={x.id} value={x.id}>
                {l(x.label)}
              </option>
            ))}
            <option value="other">{f.somethingElse}</option>
          </select>
        </span>{' '}
        {f.c}{' '}
        <span className="em-slot em-slot--sel">
          <label className="em-sr" htmlFor="em-vehicle">
            {f.vehicle}
          </label>
          <select id="em-vehicle" name="vehicle" value={values.vehicle} onChange={update}>
            <option value="">{f.noPreference}</option>
            {vehicles.map((v) => (
              <option key={v.slug} value={v.slug}>
                {l(v.name)}
              </option>
            ))}
          </select>
        </span>{' '}
        {f.d}{' '}
        <span className="em-slot em-slot--date">
          <label className="em-sr" htmlFor="em-date">
            {f.date}
          </label>
          <input id="em-date" name="date" type="date" min={todayISO()} value={values.date} onChange={update} {...invalid('date')} />
        </span>
        {f.e}{' '}
        <span className="em-slot">
          <label className="em-sr" htmlFor="em-email">
            {f.email}
          </label>
          <input
            id="em-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder={f.emailPlaceholder}
            value={values.email}
            onChange={update}
            style={grow(values.email, f.emailPlaceholder)}
            {...invalid('email')}
          />
        </span>
        {f.f}
      </p>
      <p className="em-form__s em-form__s--msg">
        <span aria-hidden="true">{f.more}</span>
        <span className="em-slot em-slot--msg">
          <label className="em-sr" htmlFor="em-message">
            {f.message}
          </label>
          <textarea
            ref={message}
            id="em-message"
            name="message"
            rows={1}
            maxLength={2000}
            placeholder={f.messagePlaceholder}
            value={values.message}
            onChange={update}
            {...invalid('message')}
          />
        </span>
      </p>
      {errorKeys.length > 0 && (
        <ul className="em-form__errors">
          {errorKeys.map((k) => (
            <li key={k} id={`em-err-${k}`}>
              {f.errors[errors[k]!]}
            </li>
          ))}
        </ul>
      )}
      {/* Pot de miel : invisible pour les personnes et les technologies d'assistance */}
      <div className="em-hp" aria-hidden="true">
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" value={values.company} onChange={update} />
        </label>
      </div>
      <label className="em-form__consent">
        <input type="checkbox" id="em-consent" name="consent" checked={values.consent} onChange={update} {...invalid('consent')} />
        <span>{f.consent}</span>
      </label>
      <button type="submit" className="em-action" disabled={busy} aria-busy={busy}>
        {busy ? f.submitting : f.submit}
      </button>
      <p className="em-text em-text--small">{f.noPayment}</p>
    </form>
  );
}

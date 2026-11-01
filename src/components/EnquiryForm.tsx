import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { experiences } from '../data/experiences';
import { site } from '../data/site';
import { getVehicle, vehicles } from '../data/vehicles';
import { useEnquiry } from '../context/EnquiryContext';
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
import { Button, ButtonLink } from './ui/Button';
import { Reveal } from './ui/Reveal';

type Status = 'idle' | 'submitting' | SubmitResult['status'];

interface FieldProps {
  name: keyof EnquiryPayload;
  label: string;
  optionalLabel?: string;
  error?: string;
  hint?: string;
  className?: string;
  children: (props: { id: string; 'aria-invalid': boolean; 'aria-describedby'?: string }) => ReactNode;
}

function Field({ name, label, optionalLabel, error, hint, className = '', children }: FieldProps) {
  const id = `enquiry-${name}`;
  const describedBy = [hint && !error && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="eyebrow flex justify-between gap-3 text-forest">
        <span>{label}</span>
        {optionalLabel && <span className="tracking-normal text-muted-ink normal-case">{optionalLabel}</span>}
      </label>
      {children({ id, 'aria-invalid': Boolean(error), 'aria-describedby': describedBy })}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-2 text-[13px] text-muted-ink">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-[13px] text-[#8a3b2e]">
          {error}
        </p>
      )}
    </div>
  );
}

export function EnquiryForm() {
  const { prefill } = useEnquiry();
  const { t, l, locale } = useI18n();
  const f = t.form;
  const [values, setValues] = useState<EnquiryPayload>(emptyEnquiry);
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [errorReason, setErrorReason] = useState<'server' | 'network'>('network');
  const statusRef = useRef<HTMLDivElement>(null);
  const formId = useId();

  // Apply pre-selections coming from vehicle / experience CTAs.
  useEffect(() => {
    if (!prefill) return;
    setValues((v) => ({
      ...v,
      experience: prefill.experience ?? v.experience,
      vehicle: prefill.vehicle ?? v.vehicle,
    }));
    setStatus((s) => (s === 'submitting' ? s : 'idle'));
  }, [prefill]);

  const update = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const next = { ...values, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value };
    setValues(next);
    if (touched) setErrors(validateEnquiry(next));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched(true);
    const found = validateEnquiry(values);
    setErrors(found);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      document.getElementById(`enquiry-${firstInvalid}`)?.focus();
      return;
    }
    setStatus('submitting');
    const result = await submitEnquiry(values, locale);
    setStatus(result.status);
    if (result.status === 'error') setErrorReason(result.reason);
    requestAnimationFrame(() => statusRef.current?.focus());
  };

  const reset = () => {
    setValues(emptyEnquiry);
    setErrors({});
    setTouched(false);
    setStatus('idle');
  };

  const err = (k: keyof EnquiryPayload) => (errors[k] ? f.errors[errors[k]] : undefined);
  const errorCount = Object.keys(errors).length;

  const experienceName = (id: string) => {
    const x = experiences.find((e) => e.id === id);
    return x ? l(x.label) : f.somethingElse;
  };

  const sep = locale === 'fr' ? '\u00a0: ' : ': ';
  const mailto = () =>
    buildMailto(
      site.contact.email,
      `${f.mailSubject}${sep}${experienceName(values.experience)}`,
      [
        [f.mailName, values.fullName.trim()],
        [f.email, values.email.trim()],
        [f.experience, experienceName(values.experience)],
        [f.vehicle, (() => { const v = getVehicle(values.vehicle); return v ? l(v.name) : f.noPreference; })()],
        [f.date, values.date || f.flexible],
        [f.mailGuests, values.guests],
      ],
      values.message,
      sep,
    );

  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-offwhite py-24 sm:py-32 lg:py-40">
      <div className="page-gutter mx-auto grid max-w-[var(--container-page)] gap-16 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-4">
          <p className="eyebrow mb-6 flex items-center gap-4 text-forest">
            <span aria-hidden="true" className="h-px w-10 bg-champagne" />
            {f.eyebrow}
          </p>
          <h2 id="contact-title" className="mb-8 text-[clamp(2.4rem,4.6vw,3.9rem)] leading-[1.03] text-forest">
            {f.titleStart} <em className="italic">{f.titleEm}</em>
          </h2>
          <p className="mb-12 max-w-sm text-[1.0625rem] leading-relaxed text-muted-ink">{f.text}</p>

          <dl className="space-y-6 border-t border-line pt-8 text-[0.975rem]">
            <div>
              <dt className="eyebrow mb-1 text-muted-ink">{f.email}</dt>
              <dd>
                <a href={`mailto:${site.contact.email}`} className="link-quiet break-all text-forest">
                  {site.contact.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow mb-1 text-muted-ink">{f.telephone}</dt>
              <dd>
                <a href={`tel:${site.contact.phoneHref}`} className="link-quiet text-forest">
                  {site.contact.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow mb-1 text-muted-ink">{f.basedIn}</dt>
              <dd className="text-forest">{l(site.contact.location)}</dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={120} className="lg:col-span-7 lg:col-start-6">
          <div className="rounded-xs border border-line bg-ivory p-6 sm:p-10 lg:p-14">
            {status === 'sent' ? (
              <div ref={statusRef} tabIndex={-1} role="status" className="py-10 outline-none">
                <p className="eyebrow mb-6 text-forest">{f.sentEyebrow}</p>
                <h3 className="mb-6 text-[2.4rem] leading-tight text-forest">
                  {fill(f.sentTitle, { name: values.fullName.trim().split(' ')[0] })}
                </h3>
                <p className="mb-10 max-w-md text-muted-ink">{fill(f.sentText, { email: values.email.trim() })}</p>
                <Button variant="outline" onClick={reset}>
                  {f.sendAnother}
                </Button>
              </div>
            ) : (
              <form id={formId} noValidate onSubmit={onSubmit} aria-describedby="enquiry-required-note">
                <p id="enquiry-required-note" className="mb-10 text-[13px] text-muted-ink">
                  {f.requiredNote}
                </p>

                {touched && errorCount > 0 && (
                  <div role="alert" className="mb-10 border-l-2 border-[#8a3b2e] bg-[#8a3b2e]/5 px-5 py-4 text-sm text-[#7a3328]">
                    {errorCount === 1 ? f.reviewOne : fill(f.reviewMany, { count: errorCount })}
                  </div>
                )}

                <div className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
                  <Field name="fullName" label={f.fullName} error={err('fullName')}>
                    {(a) => (
                      <input {...a} name="fullName" type="text" autoComplete="name" value={values.fullName} onChange={update} className="field-control" />
                    )}
                  </Field>
                  <Field name="email" label={f.emailAddress} error={err('email')}>
                    {(a) => (
                      <input {...a} name="email" type="email" inputMode="email" autoComplete="email" value={values.email} onChange={update} className="field-control" />
                    )}
                  </Field>
                  <Field name="experience" label={f.experience} error={err('experience')}>
                    {(a) => (
                      <select {...a} name="experience" value={values.experience} onChange={update} className="field-control">
                        <option value="" disabled>
                          {f.selectExperience}
                        </option>
                        {experiences.map((x) => (
                          <option key={x.id} value={x.id}>
                            {l(x.label)}
                          </option>
                        ))}
                        <option value="other">{f.somethingElse}</option>
                      </select>
                    )}
                  </Field>
                  <Field name="vehicle" label={f.vehicle} optionalLabel={t.common.optional} error={err('vehicle')}>
                    {(a) => (
                      <select {...a} name="vehicle" value={values.vehicle} onChange={update} className="field-control">
                        <option value="">{f.noPreference}</option>
                        {vehicles.map((v) => (
                          <option key={v.slug} value={v.slug}>
                            {l(v.name)}
                          </option>
                        ))}
                      </select>
                    )}
                  </Field>
                  <Field name="date" label={f.date} optionalLabel={t.common.optional} error={err('date')} hint={f.dateHint}>
                    {(a) => <input {...a} name="date" type="date" min={todayISO()} value={values.date} onChange={update} className="field-control" />}
                  </Field>
                  <Field name="guests" label={f.guests} error={err('guests')}>
                    {(a) => (
                      <input {...a} name="guests" type="number" inputMode="numeric" min={1} max={500} step={1} value={values.guests} onChange={update} className="field-control" />
                    )}
                  </Field>
                  <Field name="message" label={f.message} optionalLabel={t.common.optional} error={err('message')} className="sm:col-span-2">
                    {(a) => (
                      <textarea
                        {...a}
                        name="message"
                        rows={4}
                        maxLength={2000}
                        placeholder={f.messagePlaceholder}
                        value={values.message}
                        onChange={update}
                        className="field-control placeholder:text-muted"
                      />
                    )}
                  </Field>
                </div>

                {/* Honeypot (hidden from people and assistive tech) */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                  <label>
                    Company
                    <input name="company" tabIndex={-1} autoComplete="off" value={values.company} onChange={update} />
                  </label>
                </div>

                <div className="mt-10">
                  <label htmlFor="enquiry-consent" className="flex cursor-pointer items-start gap-4 text-[14px] leading-relaxed text-charcoal/80">
                    <input
                      id="enquiry-consent"
                      name="consent"
                      type="checkbox"
                      checked={values.consent}
                      onChange={update}
                      aria-invalid={Boolean(errors.consent)}
                      aria-describedby={errors.consent ? 'enquiry-consent-error' : undefined}
                      className="mt-1 h-4 w-4 shrink-0 accent-forest"
                    />
                    <span>
                      {f.consentStart}{' '}
                      <a href="#privacy" className="underline decoration-line underline-offset-4 hover:decoration-forest">
                        {f.privacyPolicy}
                      </a>
                      .
                    </span>
                  </label>
                  {errors.consent && (
                    <p id="enquiry-consent-error" className="mt-2 pl-8 text-[13px] text-[#8a3b2e]">
                      {err('consent')}
                    </p>
                  )}
                </div>

                <div className="mt-10 flex flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
                  <Button type="submit" arrow disabled={status === 'submitting'} aria-busy={status === 'submitting'}>
                    {status === 'submitting' ? f.submitting : f.submit}
                  </Button>
                  <p className="text-[13px] text-muted-ink sm:max-w-[17rem] sm:text-right">{f.noPayment}</p>
                </div>

                <div aria-live="polite">
                  {(status === 'not-configured' || status === 'error') && (
                    <div ref={statusRef} tabIndex={-1} role="alert" className="mt-8 rounded-xs border border-champagne/60 bg-offwhite p-6 outline-none">
                      <p className="eyebrow mb-3 text-forest">{status === 'error' ? f.errorTitle : f.notSentTitle}</p>
                      <p className="mb-5 text-[15px] leading-relaxed text-charcoal/85">
                        {status === 'error'
                          ? `${errorReason === 'server' ? f.errorServer : f.errorNetwork} ${f.errorText}`
                          : f.notSentText}
                      </p>
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <ButtonLink href={mailto()} variant="solid" arrow>
                          {f.sendByEmail}
                        </ButtonLink>
                        {status === 'error' && (
                          <Button type="submit" variant="text" form={formId}>
                            {f.tryAgain}
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

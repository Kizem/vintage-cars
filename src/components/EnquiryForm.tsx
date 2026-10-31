import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { experiences } from '../data/experiences';
import { site } from '../data/site';
import { vehicles } from '../data/vehicles';
import { useEnquiry } from '../context/EnquiryContext';
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
  optional?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: (props: { id: string; 'aria-invalid': boolean; 'aria-describedby'?: string }) => ReactNode;
}

function Field({ name, label, optional, error, hint, className = '', children }: FieldProps) {
  const id = `enquiry-${name}`;
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="eyebrow flex justify-between text-forest">
        <span>{label}</span>
        {optional && <span className="text-muted-ink normal-case tracking-normal">Optional</span>}
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
  const [values, setValues] = useState<EnquiryPayload>(emptyEnquiry);
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');
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
    if (status !== 'submitting') setStatus('idle');
  }, [prefill?.nonce]);

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
    const result = await submitEnquiry(values);
    setStatus(result.status);
    setErrorMessage(result.status === 'error' ? result.message : '');
    requestAnimationFrame(() => statusRef.current?.focus());
  };

  const reset = () => {
    setValues(emptyEnquiry);
    setErrors({});
    setTouched(false);
    setStatus('idle');
  };

  const errorCount = Object.keys(errors).length;

  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-ivory py-24 sm:py-32 lg:py-40">
      <div className="page-gutter mx-auto grid max-w-[var(--container-page)] gap-16 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-4">
          <p className="eyebrow mb-6 flex items-center gap-4 text-forest">
            <span aria-hidden="true" className="h-px w-10 bg-champagne" />
            Enquiries
          </p>
          <h2 id="contact-title" className="mb-8 text-[clamp(2.4rem,4.6vw,3.9rem)] leading-[1.03] text-forest">
            Your Parisian Experience <em className="italic">Begins Here.</em>
          </h2>
          <p className="mb-12 max-w-sm text-[1.0625rem] leading-relaxed text-muted-ink">
            Tell us what you have in mind. We will help you create a memorable experience.
          </p>

          <dl className="space-y-6 border-t border-line pt-8 text-[0.975rem]">
            <div>
              <dt className="eyebrow mb-1 text-muted-ink">Email</dt>
              <dd>
                <a href={`mailto:${site.contact.email}`} className="link-quiet text-forest">
                  {site.contact.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow mb-1 text-muted-ink">Telephone</dt>
              <dd>
                <a href={`tel:${site.contact.phoneHref}`} className="link-quiet text-forest">
                  {site.contact.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow mb-1 text-muted-ink">Based in</dt>
              <dd className="text-forest">{site.contact.location}</dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={120} className="lg:col-span-7 lg:col-start-6">
          <div className="rounded-xs border border-line bg-offwhite p-6 sm:p-10 lg:p-14">
            {status === 'sent' ? (
              <div ref={statusRef} tabIndex={-1} role="status" className="py-10 outline-none">
                <p className="eyebrow mb-6 text-forest">Enquiry received</p>
                <h3 className="mb-6 text-[2.4rem] leading-tight text-forest">Thank you, {values.fullName.split(' ')[0]}.</h3>
                <p className="mb-10 max-w-md text-muted-ink">
                  Your enquiry has been sent. We will reply personally to {values.email} as soon as possible.
                </p>
                <Button variant="outline" onClick={reset}>
                  Send another enquiry
                </Button>
              </div>
            ) : (
              <form id={formId} noValidate onSubmit={onSubmit} aria-describedby="enquiry-required-note">
                <p id="enquiry-required-note" className="mb-10 text-[13px] text-muted-ink">
                  All fields are required unless marked optional.
                </p>

                {touched && errorCount > 0 && (
                  <div role="alert" className="mb-10 border-l-2 border-[#8a3b2e] bg-[#8a3b2e]/5 px-5 py-4 text-sm text-[#7a3328]">
                    Please review the {errorCount === 1 ? 'highlighted field' : `${errorCount} highlighted fields`} below.
                  </div>
                )}

                <div className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
                  <Field name="fullName" label="Full name" error={errors.fullName}>
                    {(a) => (
                      <input {...a} name="fullName" type="text" autoComplete="name" value={values.fullName} onChange={update} className="field-control" />
                    )}
                  </Field>
                  <Field name="email" label="Email address" error={errors.email}>
                    {(a) => (
                      <input {...a} name="email" type="email" inputMode="email" autoComplete="email" value={values.email} onChange={update} className="field-control" />
                    )}
                  </Field>
                  <Field name="experience" label="Preferred experience" error={errors.experience}>
                    {(a) => (
                      <select {...a} name="experience" value={values.experience} onChange={update} className="field-control">
                        <option value="" disabled>
                          Select an experience
                        </option>
                        {experiences.map((x) => (
                          <option key={x.id} value={x.id}>
                            {x.label}
                          </option>
                        ))}
                        <option value="other">Something else</option>
                      </select>
                    )}
                  </Field>
                  <Field name="vehicle" label="Preferred vehicle" optional error={errors.vehicle}>
                    {(a) => (
                      <select {...a} name="vehicle" value={values.vehicle} onChange={update} className="field-control">
                        <option value="">No preference</option>
                        {vehicles.map((v) => (
                          <option key={v.slug} value={v.slug}>
                            {v.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </Field>
                  <Field name="date" label="Desired date" optional error={errors.date} hint="Leave empty if your dates are flexible.">
                    {(a) => <input {...a} name="date" type="date" min={todayISO()} value={values.date} onChange={update} className="field-control" />}
                  </Field>
                  <Field name="guests" label="Number of guests" error={errors.guests}>
                    {(a) => (
                      <input {...a} name="guests" type="number" inputMode="numeric" min={1} max={500} step={1} value={values.guests} onChange={update} className="field-control" />
                    )}
                  </Field>
                  <Field name="message" label="Additional message" optional error={errors.message} className="sm:col-span-2">
                    {(a) => (
                      <textarea
                        {...a}
                        name="message"
                        rows={4}
                        maxLength={2000}
                        placeholder="An occasion, a route you dream of, timings, special requests…"
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
                      I agree that Époque Motors may use these details to reply to my enquiry. See our{' '}
                      <a href="#privacy" className="underline decoration-line underline-offset-4 hover:decoration-forest">
                        Privacy Policy
                      </a>
                      .
                    </span>
                  </label>
                  {errors.consent && (
                    <p id="enquiry-consent-error" className="mt-2 pl-8 text-[13px] text-[#8a3b2e]">
                      {errors.consent}
                    </p>
                  )}
                </div>

                <div className="mt-10 flex flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
                  <Button type="submit" arrow disabled={status === 'submitting'} aria-busy={status === 'submitting'}>
                    {status === 'submitting' ? 'Sending…' : 'Send an Enquiry'}
                  </Button>
                  <p className="text-[13px] text-muted-ink sm:max-w-[16rem] sm:text-right">
                    No payment is taken. Every request receives a personal reply.
                  </p>
                </div>

                <div aria-live="polite">
                  {(status === 'not-configured' || status === 'error') && (
                    <div
                      ref={statusRef}
                      tabIndex={-1}
                      role="alert"
                      className="mt-8 rounded-xs border border-champagne/60 bg-ivory p-6 outline-none"
                    >
                      <p className="eyebrow mb-3 text-forest">
                        {status === 'error' ? 'Your enquiry could not be sent' : 'Your enquiry has not been sent yet'}
                      </p>
                      <p className="mb-5 text-[15px] leading-relaxed text-charcoal/85">
                        {status === 'error'
                          ? `${errorMessage} Your details are still here — please try again, or send them by email.`
                          : 'Online enquiries are not connected yet. Your details are still here: you can send them to us by email in one click.'}
                      </p>
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <ButtonLink href={buildMailto(values)} variant="solid" arrow>
                          Send by email
                        </ButtonLink>
                        {status === 'error' && (
                          <Button type="submit" variant="text" form={formId}>
                            Try again
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

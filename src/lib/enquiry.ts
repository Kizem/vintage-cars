import type { Dictionary } from '../i18n/en';
import type { Locale } from '../i18n/locales';

export interface EnquiryPayload {
  fullName: string;
  email: string;
  /** Experience id, or 'other'. */
  experience: string;
  /** Vehicle slug, or '' for no preference. */
  vehicle: string;
  date: string;
  guests: string;
  message: string;
  consent: boolean;
  /** Honeypot, must stay empty. */
  company: string;
}

export type EnquiryErrorKey = keyof Dictionary['form']['errors'];
export type EnquiryErrors = Partial<Record<keyof EnquiryPayload, EnquiryErrorKey>>;

export const emptyEnquiry: EnquiryPayload = {
  fullName: '',
  email: '',
  experience: '',
  vehicle: '',
  date: '',
  guests: '2',
  message: '',
  consent: false,
  company: '',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const todayISO = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

/** Returns, per field, the key of the message to display (see dictionaries). */
export function validateEnquiry(v: EnquiryPayload): EnquiryErrors {
  const e: EnquiryErrors = {};
  if (v.fullName.trim().length < 2) e.fullName = 'nameRequired';
  if (!v.email.trim()) e.email = 'emailRequired';
  else if (!EMAIL_RE.test(v.email.trim())) e.email = 'emailInvalid';
  if (!v.experience) e.experience = 'experienceRequired';
  if (v.date && v.date < todayISO()) e.date = 'datePast';
  const guests = Number(v.guests);
  if (!v.guests || !Number.isInteger(guests) || guests < 1) e.guests = 'guestsRequired';
  else if (guests > 500) e.guests = 'guestsTooMany';
  if (v.message.length > 2000) e.message = 'messageTooLong';
  if (!v.consent) e.consent = 'consentRequired';
  return e;
}

export type SubmitResult =
  | { status: 'sent' }
  | { status: 'not-configured' }
  | { status: 'error'; reason: 'server' | 'network' };

/** Endpoint receiving a JSON POST. Configure with VITE_ENQUIRY_ENDPOINT (see .env.example). */
const ENDPOINT = (import.meta.env.VITE_ENQUIRY_ENDPOINT as string | undefined)?.trim();

/**
 * Submits an enquiry. Until a backend is connected this resolves to
 * `not-configured`: the UI must never claim the enquiry was sent.
 */
export async function submitEnquiry(v: EnquiryPayload, locale: Locale): Promise<SubmitResult> {
  if (v.company) return { status: 'sent' }; // honeypot: silently drop bots
  if (!ENDPOINT) return { status: 'not-configured' };

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        fullName: v.fullName.trim(),
        email: v.email.trim(),
        experience: v.experience,
        vehicle: v.vehicle || null,
        date: v.date || null,
        guests: Number(v.guests),
        message: v.message.trim(),
        consent: v.consent,
        locale,
        submittedAt: new Date().toISOString(),
        source: 'website',
      }),
    });
    return res.ok ? { status: 'sent' } : { status: 'error', reason: 'server' };
  } catch {
    return { status: 'error', reason: 'network' };
  }
}

/** Pre-filled email used as an honest fallback while no backend is connected. */
export function buildMailto(
  to: string,
  subject: string,
  rows: [label: string, value: string][],
  message: string,
) {
  const body = [...rows.map(([k, val]) => `${k}: ${val}`), '', message.trim()].join('\n');
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

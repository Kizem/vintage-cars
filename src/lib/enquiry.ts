import { experiences } from '../data/experiences';
import { site } from '../data/site';
import { getVehicle } from '../data/vehicles';

export interface EnquiryPayload {
  fullName: string;
  email: string;
  experience: string;
  vehicle: string;
  date: string;
  guests: string;
  message: string;
  consent: boolean;
  /** Honeypot — must stay empty. */
  company: string;
}

export type EnquiryErrors = Partial<Record<keyof EnquiryPayload, string>>;

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

export function validateEnquiry(v: EnquiryPayload): EnquiryErrors {
  const e: EnquiryErrors = {};
  if (v.fullName.trim().length < 2) e.fullName = 'Please tell us your full name.';
  if (!v.email.trim()) e.email = 'Please enter your email address.';
  else if (!EMAIL_RE.test(v.email.trim())) e.email = 'Please enter a valid email address.';
  if (!v.experience) e.experience = 'Please choose the experience you have in mind.';
  if (v.date && v.date < todayISO()) e.date = 'Please choose a date in the future.';
  const guests = Number(v.guests);
  if (!v.guests || !Number.isInteger(guests) || guests < 1)
    e.guests = 'Please indicate the number of guests.';
  else if (guests > 500) e.guests = 'For larger events, please describe your needs in the message.';
  if (v.message.length > 2000) e.message = 'Please keep your message under 2,000 characters.';
  if (!v.consent) e.consent = 'Please confirm we may use your details to reply to you.';
  return e;
}

export type SubmitResult =
  | { status: 'sent' }
  | { status: 'not-configured' }
  | { status: 'error'; message: string };

/** Endpoint receiving a JSON POST. Configure with VITE_ENQUIRY_ENDPOINT (see .env.example). */
const ENDPOINT = (import.meta.env.VITE_ENQUIRY_ENDPOINT as string | undefined)?.trim();

export const isEnquiryBackendConfigured = Boolean(ENDPOINT);

/**
 * Submits an enquiry. Until a backend is connected this resolves to
 * `not-configured` — the UI must never claim the enquiry was sent.
 */
export async function submitEnquiry(v: EnquiryPayload): Promise<SubmitResult> {
  if (v.company) return { status: 'sent' }; // honeypot: silently drop bots
  if (!ENDPOINT) return { status: 'not-configured' };

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        fullName: v.fullName.trim(),
        email: v.email.trim(),
        experience: experienceLabel(v.experience),
        vehicle: vehicleLabel(v.vehicle),
        date: v.date || null,
        guests: Number(v.guests),
        message: v.message.trim(),
        consent: v.consent,
        submittedAt: new Date().toISOString(),
        source: 'website',
      }),
    });
    if (!res.ok) return { status: 'error', message: `The server responded with status ${res.status}.` };
    return { status: 'sent' };
  } catch {
    return { status: 'error', message: 'We could not reach our server. Please check your connection.' };
  }
}

export const experienceLabel = (id: string) =>
  id === 'other' ? 'Something else' : (experiences.find((x) => x.id === id)?.label ?? 'Not specified');

export const vehicleLabel = (slug: string) => getVehicle(slug)?.name ?? 'No preference';

/** Pre-filled email used as an honest fallback while no backend is connected. */
export function buildMailto(v: EnquiryPayload) {
  const lines = [
    `Name: ${v.fullName.trim()}`,
    `Email: ${v.email.trim()}`,
    `Experience: ${experienceLabel(v.experience)}`,
    `Vehicle: ${vehicleLabel(v.vehicle)}`,
    `Desired date: ${v.date || 'Flexible'}`,
    `Guests: ${v.guests}`,
    '',
    v.message.trim(),
  ];
  const subject = `Enquiry — ${experienceLabel(v.experience)}`;
  return `mailto:${site.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
}

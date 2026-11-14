import { experiences } from '../data/experiences';
import { vehicles } from '../data/vehicles';
import { cleanLine, cleanText, emptyEnquiry, LIMITS, validateEnquiry, type EnquiryPayload } from '../lib/enquiry';
import type { Locale } from '../i18n/locales';

/*
 * Réception du formulaire de demande (POST /api/enquiry) et envoi par e-mail via Resend.
 *
 * Le Worker valide de nouveau tout ce que le navigateur a validé (le navigateur ne fait foi de rien) :
 * - même origine seulement (en-tête Origin), JSON seulement, corps borné, limite de débit par adresse IP ;
 * - champs attendus, de type chaîne, nettoyés et bornés comme côté site ; listes fermées (expérience, voiture) ;
 * - l'e-mail est en texte brut, avec l'adresse du visiteur en « Répondre à » : répondre au message lui répond.
 * La clé Resend (RESEND_API_KEY) est un secret Cloudflare, jamais dans le code ni dans le site.
 */

export interface RateLimit {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

export interface Env {
  /** Secret Cloudflare : `npx wrangler secret put RESEND_API_KEY`. */
  RESEND_API_KEY?: string;
  /** Boîte qui reçoit les demandes (wrangler.jsonc, vars). */
  ENQUIRY_TO?: string;
  /** Expéditeur, sur un domaine vérifié dans Resend (wrangler.jsonc, vars). */
  ENQUIRY_FROM?: string;
  /** Limite de débit (wrangler.jsonc, ratelimits). */
  ENQUIRY_LIMIT?: RateLimit;
}

export const RESEND_URL = 'https://api.resend.com/emails';
/** Taille maximale du corps de la requête : le message fait au plus 2000 caractères. */
export const MAX_BODY = 16384;
const RESEND_TIMEOUT_MS = 10000;

const choices = { experiences: experiences.map((x) => x.id), vehicles: vehicles.map((v) => v.slug) };

const reply = (status: number, body: Record<string, unknown>, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers },
  });

const str = (v: unknown) => (typeof v === 'string' ? v : null);

/** Lit le corps envoyé par le site (buildPayload) ; null si un champ n'a pas le bon type. */
export function readPayload(data: unknown): { values: EnquiryPayload; locale: Locale } | null {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return null;
  const d = data as Record<string, unknown>;
  const fullName = str(d.fullName);
  const email = str(d.email);
  const experience = str(d.experience);
  const message = str(d.message) ?? '';
  const vehicle = d.vehicle === null || d.vehicle === undefined ? '' : str(d.vehicle);
  const date = d.date === null || d.date === undefined ? '' : str(d.date);
  if (fullName === null || email === null || experience === null || vehicle === null || date === null) return null;
  if (typeof d.message !== 'string' && d.message !== undefined) return null;
  return {
    values: {
      ...emptyEnquiry,
      fullName: cleanLine(fullName, LIMITS.fullName + 1),
      email: cleanLine(email, LIMITS.email + 1),
      experience: cleanLine(experience, 40),
      vehicle: cleanLine(vehicle, 60),
      date: cleanLine(date, 11),
      message: cleanText(message, LIMITS.message + 1),
      consent: d.consent === true,
    },
    locale: d.locale === 'en' ? 'en' : 'fr',
  };
}

const frDate = (iso: string) => iso.split('-').reverse().join('/');

/** L'e-mail envoyé à la boîte du site, en français. */
export function composeEmail(v: EnquiryPayload, locale: Locale) {
  const experience = experiences.find((x) => x.id === v.experience)?.label.fr ?? 'Autre chose';
  const car = vehicles.find((x) => x.slug === v.vehicle)?.name.fr ?? 'Sans préférence';
  const subject = cleanLine(`Nouvelle demande : ${experience}, ${v.fullName}`, 200);
  const text = [
    'Nouvelle demande reçue depuis le formulaire du site Époque Motors.',
    '',
    `Nom : ${v.fullName}`,
    `E-mail : ${v.email}`,
    `Expérience : ${experience}`,
    `Voiture : ${car}`,
    `Date souhaitée : ${v.date ? frDate(v.date) : 'Flexible'}`,
    `Langue du visiteur : ${locale === 'en' ? 'anglais' : 'français'}`,
    '',
    'Message :',
    v.message || '(aucun message)',
    '',
    `Pour répondre, réponds simplement à cet e-mail : la réponse part vers ${v.email}.`,
  ].join('\n');
  return { subject, text };
}

/** POST /api/enquiry. */
export async function handleEnquiry(request: Request, env: Env, fetchImpl: typeof fetch = fetch, now = new Date()): Promise<Response> {
  if (request.method !== 'POST') return reply(405, { error: 'method' }, { Allow: 'POST' });
  if (request.headers.get('Origin') !== new URL(request.url).origin) return reply(403, { error: 'origin' });
  if (!/^application\/json\b/i.test(request.headers.get('Content-Type') ?? '')) return reply(415, { error: 'type' });
  if (Number(request.headers.get('Content-Length') ?? 0) > MAX_BODY) return reply(413, { error: 'size' });

  if (env.ENQUIRY_LIMIT) {
    const { success } = await env.ENQUIRY_LIMIT.limit({ key: request.headers.get('CF-Connecting-IP') ?? 'unknown' });
    if (!success) return reply(429, { error: 'rate' });
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY) return reply(413, { error: 'size' });
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return reply(400, { error: 'json' });
  }
  const parsed = readPayload(data);
  if (!parsed) return reply(400, { error: 'fields' });
  const errors = validateEnquiry(parsed.values, choices, now);
  if (Object.keys(errors).length) return reply(422, { error: 'invalid', fields: Object.keys(errors) });

  const { RESEND_API_KEY: key, ENQUIRY_TO: to, ENQUIRY_FROM: from } = env;
  if (!key || !to || !from) {
    console.error('enquiry: RESEND_API_KEY, ENQUIRY_TO or ENQUIRY_FROM missing');
    return reply(503, { error: 'not-configured' });
  }

  const { subject, text } = composeEmail(parsed.values, parsed.locale);
  try {
    const res = await fetchImpl(RESEND_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], reply_to: parsed.values.email, subject, text }),
      signal: AbortSignal.timeout(RESEND_TIMEOUT_MS),
    });
    if (!res.ok) {
      console.error(`enquiry: Resend answered ${res.status}`, (await res.text()).slice(0, 300));
      return reply(502, { error: 'upstream' });
    }
  } catch (e) {
    console.error('enquiry: Resend unreachable', String(e));
    return reply(502, { error: 'upstream' });
  }
  return reply(200, { ok: true });
}

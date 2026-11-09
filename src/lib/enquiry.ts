import type { Dictionary } from '../i18n/en';
import type { Locale } from '../i18n/locales';

/*
 * Formulaire de demande : validation, nettoyage et envoi.
 *
 * Le site est statique : la sécurité réelle est du ressort du service qui recevra les demandes (validation côté
 * serveur, limite de débit, filtrage). Côté site, tout ce qui peut l'être est fait ici :
 * - champs bornés en longueur, caractères de contrôle retirés, retours à la ligne interdits hors message
 *   (pas d'injection d'en-têtes dans un e-mail construit à partir de la demande) ;
 * - listes fermées : expérience et voiture ne peuvent valoir qu'une valeur connue, date au format AAAA-MM-JJ ;
 * - anti-robots : pot de miel et durée minimale de remplissage ; un robot reçoit « envoyé » sans que rien ne parte ;
 * - un envoi à la fois, et pas deux envois en moins de RESEND_MS ;
 * - point d'envoi en HTTPS uniquement (http seulement en local), sans cookie ni référent, sans redirection,
 *   avec un délai maximal ; seuls des champs connus et nettoyés sont envoyés.
 */

export interface EnquiryPayload {
  fullName: string;
  email: string;
  /** Experience id, or 'other'. */
  experience: string;
  /** Vehicle slug, or '' for no preference. */
  vehicle: string;
  date: string;
  message: string;
  consent: boolean;
  /** Honeypot, must stay empty. */
  company: string;
}

type EnquiryErrorKey = keyof Dictionary['form']['errors'];
export type EnquiryErrors = Partial<Record<keyof EnquiryPayload, EnquiryErrorKey>>;

export const emptyEnquiry: EnquiryPayload = {
  fullName: '',
  email: '',
  experience: '',
  vehicle: '',
  date: '',
  message: '',
  consent: false,
  company: '',
};

/** Longueurs maximales, reprises par les attributs maxLength des champs. */
export const LIMITS = { fullName: 100, email: 254, message: 2000 } as const;
/** Durée minimale entre l'affichage du formulaire et l'envoi : en deçà, c'est un robot. */
export const MIN_FILL_MS = 2500;
/** Délai minimal entre deux envois. */
export const RESEND_MS = 20000;
/** Délai maximal d'attente du serveur. */
export const TIMEOUT_MS = 15000;
/** Une date souhaitée au plus tard dans deux ans. */
const MAX_DAYS_AHEAD = 731;

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
/* caractères de contrôle (sauf tabulation et retours à la ligne, traités à part) et caractères invisibles de mise en forme */
// eslint-disable-next-line no-control-regex
const CONTROL_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F​-‏‪-‮⁦-⁩﻿]/g;

/** Texte d'une ligne : contrôles retirés, retours à la ligne et tabulations remplacés par une espace, espaces resserrées. */
export const cleanLine = (s: string, max: number) =>
  s.normalize('NFC').replace(CONTROL_RE, '').replace(/[\r\n\t]+/g, ' ').replace(/ {2,}/g, ' ').trim().slice(0, max);
/** Texte libre : contrôles retirés, retours à la ligne unifiés, au plus deux lignes vides de suite. */
export const cleanText = (s: string, max: number) =>
  s.normalize('NFC').replace(/\r\n?/g, '\n').replace(CONTROL_RE, '').replace(/\n{3,}/g, '\n\n').trim().slice(0, max);

export const todayISO = (now = new Date()) => {
  const d = new Date(now);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};
const addDays = (iso: string, days: number) => {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};
/** Date réelle du calendrier (2025-02-30 est refusée). */
const isRealDate = (iso: string) => DATE_RE.test(iso) && new Date(`${iso}T12:00:00Z`).toISOString().slice(0, 10) === iso;

/** Valeurs admises pour les listes : identifiants d'expérience (+ 'other') et de voiture (+ '' : sans préférence). */
export interface EnquiryChoices {
  experiences: readonly string[];
  vehicles: readonly string[];
}

/** Returns, per field, the key of the message to display (see dictionaries). */
export function validateEnquiry(v: EnquiryPayload, choices?: EnquiryChoices, now = new Date()): EnquiryErrors {
  const e: EnquiryErrors = {};
  const name = cleanLine(v.fullName, Infinity);
  if (name.length < 2) e.fullName = 'nameRequired';
  else if (name.length > LIMITS.fullName) e.fullName = 'nameTooLong';
  const email = v.email.trim();
  if (!email) e.email = 'emailRequired';
  else if (email.length > LIMITS.email || /[\r\n]/.test(email) || !EMAIL_RE.test(email)) e.email = 'emailInvalid';
  if (!v.experience || (choices && v.experience !== 'other' && !choices.experiences.includes(v.experience))) e.experience = 'experienceRequired';
  if (choices && v.vehicle && !choices.vehicles.includes(v.vehicle)) e.vehicle = 'vehicleInvalid';
  if (v.date) {
    const today = todayISO(now);
    if (!isRealDate(v.date)) e.date = 'dateInvalid';
    else if (v.date < today) e.date = 'datePast';
    else if (v.date > addDays(today, MAX_DAYS_AHEAD)) e.date = 'dateTooFar';
  }
  if (v.message.length > LIMITS.message) e.message = 'messageTooLong';
  if (!v.consent) e.consent = 'consentRequired';
  return e;
}

/** Ce qui part réellement : seulement des champs connus, nettoyés et bornés. */
export function buildPayload(v: EnquiryPayload, locale: Locale, now = new Date()) {
  return {
    fullName: cleanLine(v.fullName, LIMITS.fullName),
    email: cleanLine(v.email, LIMITS.email),
    experience: cleanLine(v.experience, 40),
    vehicle: cleanLine(v.vehicle, 60) || null,
    date: isRealDate(v.date) ? v.date : null,
    message: cleanText(v.message, LIMITS.message),
    consent: v.consent === true,
    locale,
    submittedAt: now.toISOString(),
    source: 'website',
  };
}

export type SubmitResult =
  | { status: 'sent' }
  | { status: 'not-configured' }
  | { status: 'error'; reason: 'server' | 'network' | 'tooSoon' };

/** Point d'envoi accepté : HTTPS, ou HTTP seulement en local ; sans identifiants dans l'adresse. */
export function safeEndpoint(raw: string | undefined | null): string | null {
  const s = raw?.trim();
  if (!s) return null;
  try {
    const u = new URL(s);
    const local = u.hostname === 'localhost' || u.hostname === '127.0.0.1';
    if (u.protocol !== 'https:' && !(u.protocol === 'http:' && local)) return null;
    if (u.username || u.password) return null;
    return u.href;
  } catch {
    return null;
  }
}

/** Endpoint receiving a JSON POST. Configure with VITE_ENQUIRY_ENDPOINT (see .env.example). */
const ENDPOINT = safeEndpoint(import.meta.env?.VITE_ENQUIRY_ENDPOINT as string | undefined);

export interface SubmitOptions {
  endpoint?: string | null;
  /** Instant d'affichage du formulaire (performance.now()), pour la durée minimale de remplissage. */
  shownAt?: number;
  now?: () => number;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}

let lastSent = -Infinity;
let inFlight = false;
/** Pour les tests : oublie le dernier envoi. */
export const resetSubmitGuard = () => {
  lastSent = -Infinity;
  inFlight = false;
};

/**
 * Submits an enquiry. Until a backend is connected this resolves to
 * `not-configured`: the UI must never claim the enquiry was sent.
 */
export async function submitEnquiry(v: EnquiryPayload, locale: Locale, opts: SubmitOptions = {}): Promise<SubmitResult> {
  const now = opts.now ?? (() => performance.now());
  const t = now();
  /* robots : pot de miel rempli, ou formulaire envoyé trop vite ; on fait comme si de rien n'était */
  if (v.company) return { status: 'sent' };
  if (opts.shownAt !== undefined && t - opts.shownAt < MIN_FILL_MS) return { status: 'sent' };
  const endpoint = opts.endpoint === undefined ? ENDPOINT : safeEndpoint(opts.endpoint);
  if (!endpoint) return { status: 'not-configured' };
  if (inFlight || t - lastSent < RESEND_MS) return { status: 'error', reason: 'tooSoon' };

  inFlight = true;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), opts.timeoutMs ?? TIMEOUT_MS);
  try {
    const res = await (opts.fetchImpl ?? fetch)(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(buildPayload(v, locale)),
      credentials: 'omit',
      mode: 'cors',
      cache: 'no-store',
      redirect: 'error',
      referrerPolicy: 'no-referrer',
      signal: ctrl.signal,
    });
    if (!res.ok) return { status: 'error', reason: 'server' };
    lastSent = now();
    return { status: 'sent' };
  } catch {
    return { status: 'error', reason: 'network' };
  } finally {
    clearTimeout(timer);
    inFlight = false;
  }
}

/** Pre-filled email used as an honest fallback while no backend is connected. */
export function buildMailto(
  to: string,
  subject: string,
  rows: [label: string, value: string][],
  message: string,
  /** ': ' in English, ' : ' in French. */
  separator = ': ',
) {
  const body = [...rows.map(([k, val]) => `${k}${separator}${cleanLine(val, 300)}`), '', cleanText(message, LIMITS.message)].join('\n');
  return `mailto:${encodeURIComponent(to).replace(/%40/g, '@')}?subject=${encodeURIComponent(cleanLine(subject, 200))}&body=${encodeURIComponent(body)}`;
}

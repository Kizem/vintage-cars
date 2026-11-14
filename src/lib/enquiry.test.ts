import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  LIMITS, MIN_FILL_MS, RESEND_MS, buildMailto, buildPayload, cleanLine, cleanText, emptyEnquiry, resetSubmitGuard,
  safeEndpoint, submitEnquiry, todayISO, validateEnquiry, type EnquiryPayload,
} from './enquiry';

const NOW = new Date('2026-06-15T10:00:00');
const choices = { experiences: ['private-tours', 'chauffeured', 'events'], vehicles: ['peugeot-504', 'citroen-ds'] };
const ok: EnquiryPayload = { ...emptyEnquiry, fullName: 'Camille Martin', email: 'camille@example.com', experience: 'events', consent: true };

describe('nettoyage', () => {
  it('cleanLine retire les contrôles, les retours à la ligne et borne la longueur', () => {
    expect(cleanLine('  Ca\u0000mille\r\nBcc: x@y.z\t ', 100)).toBe('Camille Bcc: x@y.z');
    expect(cleanLine('a‮b​c', 100)).toBe('abc');
    expect(cleanLine('x'.repeat(10), 4)).toBe('xxxx');
  });
  it('cleanText garde les paragraphes mais pas plus de deux lignes vides', () => {
    expect(cleanText('a\r\n\r\n\r\n\r\nb\u0007', 100)).toBe('a\n\nb');
    expect(cleanText('y'.repeat(5000), LIMITS.message)).toHaveLength(LIMITS.message);
  });
  it('todayISO donne la date locale', () => {
    expect(todayISO(NOW)).toBe('2026-06-15');
    expect(todayISO()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('validateEnquiry', () => {
  it('accepte une demande complète', () => {
    expect(validateEnquiry(ok, choices, NOW)).toEqual({});
    expect(validateEnquiry({ ...ok, experience: 'other', vehicle: 'citroen-ds', date: '2026-07-01' }, choices, NOW)).toEqual({});
  });
  it('signale chaque champ manquant', () => {
    expect(validateEnquiry(emptyEnquiry, choices, NOW)).toEqual({ fullName: 'nameRequired', email: 'emailRequired', experience: 'experienceRequired', consent: 'consentRequired' });
  });
  it('refuse les noms trop longs ou vides de sens', () => {
    expect(validateEnquiry({ ...ok, fullName: ' \u0000 a ' }, choices, NOW).fullName).toBe('nameRequired');
    expect(validateEnquiry({ ...ok, fullName: 'n'.repeat(LIMITS.fullName + 1) }, choices, NOW).fullName).toBe('nameTooLong');
  });
  it.each(['camille', 'camille@', 'a@b', 'a b@c.fr', 'a@b.fr\r\nBcc:x@y.z', '<a>@b.fr', `${'a'.repeat(250)}@b.fr`])('refuse l’adresse %j', (email) => {
    expect(validateEnquiry({ ...ok, email }, choices, NOW).email).toBe('emailInvalid');
  });
  it('n’admet que des valeurs connues pour les listes', () => {
    expect(validateEnquiry({ ...ok, experience: 'hack' }, choices, NOW).experience).toBe('experienceRequired');
    expect(validateEnquiry({ ...ok, vehicle: 'ferrari' }, choices, NOW).vehicle).toBe('vehicleInvalid');
    expect(validateEnquiry({ ...ok, experience: 'hack' }, undefined, NOW)).toEqual({});
  });
  it('contrôle la date : réelle, pas passée, dans les deux ans', () => {
    expect(validateEnquiry({ ...ok, date: '2026-02-30' }, choices, NOW).date).toBe('dateInvalid');
    expect(validateEnquiry({ ...ok, date: '15/07/2026' }, choices, NOW).date).toBe('dateInvalid');
    expect(validateEnquiry({ ...ok, date: '2026-06-14' }, choices, NOW).date).toBe('datePast');
    expect(validateEnquiry({ ...ok, date: '2026-06-15' }, choices, NOW).date).toBeUndefined();
    expect(validateEnquiry({ ...ok, date: '2029-01-01' }, choices, NOW).date).toBe('dateTooFar');
  });
  it('borne le message', () => {
    expect(validateEnquiry({ ...ok, message: 'm'.repeat(LIMITS.message + 1) }, choices, NOW).message).toBe('messageTooLong');
  });
});

describe('buildPayload', () => {
  it('n’envoie que des champs connus, nettoyés', () => {
    const p = buildPayload({ ...ok, fullName: ' Camille\nMartin ', vehicle: '', date: 'bad', message: ' Bonjour\u0000 ', company: 'x' } as EnquiryPayload, 'fr', NOW);
    expect(Object.keys(p).sort()).toEqual(['consent', 'date', 'email', 'experience', 'fullName', 'locale', 'message', 'source', 'submittedAt', 'vehicle']);
    expect(p).toMatchObject({ fullName: 'Camille Martin', vehicle: null, date: null, message: 'Bonjour', consent: true, locale: 'fr', source: 'website' });
    expect(buildPayload({ ...ok, date: '2026-07-01', vehicle: 'citroen-ds' }, 'en', NOW)).toMatchObject({ date: '2026-07-01', vehicle: 'citroen-ds' });
  });
});

describe('safeEndpoint', () => {
  it.each([
    ['https://api.example.com/enquiry', 'https://api.example.com/enquiry'],
    ['http://localhost:8787/x', 'http://localhost:8787/x'],
    ['http://127.0.0.1/x', 'http://127.0.0.1/x'],
    ['/api/enquiry', '/api/enquiry'],
    ['//evil.example/x', null],
    ['/api/../x', null],
    ['http://api.example.com/x', null],
    ['javascript:alert(1)', null],
    ['https://user:pw@api.example.com/', null],
    ['not a url', null],
    ['', null],
    [undefined, null],
  ])('%j → %j', (raw, want) => expect(safeEndpoint(raw)).toBe(want));
});

describe('submitEnquiry', () => {
  let t = 100000;
  const now = () => t;
  beforeEach(() => { resetSubmitGuard(); t = 100000; });
  afterEach(() => vi.useRealTimers());
  const okFetch = () => vi.fn(async () => new Response('{}', { status: 200 }));

  it('sans point d’envoi : « non configuré », jamais « envoyé »', async () => {
    expect(await submitEnquiry(ok, 'fr', { endpoint: null, now })).toEqual({ status: 'not-configured' });
    expect(await submitEnquiry(ok, 'fr', { endpoint: 'http://evil.example/x', now })).toEqual({ status: 'not-configured' });
    expect(await submitEnquiry(ok, 'fr', { now })).toEqual({ status: 'not-configured' });
  });
  it('robots : pot de miel ou remplissage trop rapide, rien ne part', async () => {
    const f = okFetch();
    expect(await submitEnquiry({ ...ok, company: 'ACME' }, 'en', { endpoint: 'https://a.example/', fetchImpl: f, now })).toEqual({ status: 'sent' });
    expect(await submitEnquiry(ok, 'en', { endpoint: 'https://a.example/', fetchImpl: f, now, shownAt: t - MIN_FILL_MS + 1 })).toEqual({ status: 'sent' });
    expect(f).not.toHaveBeenCalled();
  });
  it('envoie en JSON, sans cookie, sans référent, sans redirection', async () => {
    const f = okFetch();
    expect(await submitEnquiry(ok, 'en', { endpoint: 'https://a.example/e', fetchImpl: f, now, shownAt: 0 })).toEqual({ status: 'sent' });
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://a.example/e');
    expect(init).toMatchObject({ method: 'POST', credentials: 'omit', redirect: 'error', referrerPolicy: 'no-referrer', cache: 'no-store' });
    expect(JSON.parse(init.body as string)).toMatchObject({ fullName: 'Camille Martin', email: 'camille@example.com' });
  });
  it('un envoi à la fois, et pas deux de suite', async () => {
    const f = okFetch();
    const opts = { endpoint: 'https://a.example/', fetchImpl: f, now };
    const [a, b] = await Promise.all([submitEnquiry(ok, 'en', opts), submitEnquiry(ok, 'en', opts)]);
    expect([a, b]).toEqual([{ status: 'sent' }, { status: 'error', reason: 'tooSoon' }]);
    t += RESEND_MS - 1;
    expect(await submitEnquiry(ok, 'en', opts)).toEqual({ status: 'error', reason: 'tooSoon' });
    t += 2;
    expect(await submitEnquiry(ok, 'en', opts)).toEqual({ status: 'sent' });
  });
  it('erreur du serveur ou du réseau', async () => {
    expect(await submitEnquiry(ok, 'en', { endpoint: 'https://a.example/', fetchImpl: vi.fn(async () => new Response('', { status: 500 })), now })).toEqual({ status: 'error', reason: 'server' });
    expect(await submitEnquiry(ok, 'en', { endpoint: 'https://a.example/', fetchImpl: vi.fn(async () => { throw new TypeError('offline'); }), now })).toEqual({ status: 'error', reason: 'network' });
  });
  it('abandonne au bout du délai maximal', async () => {
    const f = vi.fn((_u: string, init: RequestInit) => new Promise<Response>((_r, reject) => init.signal!.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')))));
    expect(await submitEnquiry(ok, 'en', { endpoint: 'https://a.example/', fetchImpl: f as unknown as typeof fetch, now, timeoutMs: 5 })).toEqual({ status: 'error', reason: 'network' });
  });
});

describe('buildMailto', () => {
  it('encode tout et empêche l’injection d’en-têtes', () => {
    const m = buildMailto('hello@epoque.example', 'Demande\r\nBcc: x@y.z', [['Nom', 'Camille\nBcc: a@b.c']], 'Bonjour\n\nmerci', ' : ');
    expect(m.startsWith('mailto:hello@epoque.example?subject=')).toBe(true);
    const url = new URL(m);
    expect(url.searchParams.get('subject')).toBe('Demande Bcc: x@y.z');
    expect(url.searchParams.get('body')).toBe('Nom : Camille Bcc: a@b.c\n\nBonjour\n\nmerci');
    expect(buildMailto('a@b.c', 's', [], 'm')).toContain('body=%0Am');
  });
});

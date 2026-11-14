// @vitest-environment node
import worker from './index';
import { composeEmail, handleEnquiry, MAX_BODY, readPayload, RESEND_URL, type Env } from './enquiry';
import { emptyEnquiry } from '../lib/enquiry';

const SITE = 'https://epoquemotors.fr';
const NOW = new Date('2026-11-14T10:00:00Z');
const env: Env = {
  RESEND_API_KEY: 're_test',
  ENQUIRY_TO: 'epoquemotors@gmail.com',
  ENQUIRY_FROM: 'Époque Motors <formulaire@epoquemotors.fr>',
};
const body = {
  fullName: 'Camille Martin',
  email: 'camille@example.com',
  experience: 'events',
  vehicle: 'citroen-ds',
  date: '2027-05-12',
  message: 'Bonjour,\n\nPour un mariage.',
  consent: true,
  locale: 'fr',
  submittedAt: NOW.toISOString(),
  source: 'website',
};

const post = (data: unknown, headers: Record<string, string> = {}, method = 'POST') =>
  new Request(`${SITE}/api/enquiry`, {
    method,
    headers: { Origin: SITE, 'Content-Type': 'application/json', ...headers },
    body: method === 'GET' ? undefined : typeof data === 'string' ? data : JSON.stringify(data),
  });
const resendOk = () => vi.fn(async () => new Response('{"id":"x"}', { status: 200 }));

describe('POST /api/enquiry', () => {
  beforeEach(() => vi.spyOn(console, 'error').mockImplementation(() => {}));
  afterEach(() => vi.restoreAllMocks());

  it('envoie un e-mail via Resend vers la boîte du site, réponse au visiteur', async () => {
    const f = resendOk();
    const res = await handleEnquiry(post(body), env, f, NOW);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(f).toHaveBeenCalledTimes(1);
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(RESEND_URL);
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer re_test');
    const sent = JSON.parse(init.body as string);
    expect(sent.to).toEqual(['epoquemotors@gmail.com']);
    expect(sent.from).toBe(env.ENQUIRY_FROM);
    expect(sent.reply_to).toBe('camille@example.com');
    expect(sent.subject).toBe('Nouvelle demande : Événements et grandes occasions, Camille Martin');
    expect(sent.text).toContain('Voiture : Citroën DS 21 Henri Chapron');
    expect(sent.text).toContain('Date souhaitée : 12/05/2027');
    expect(sent.text).toContain('Pour un mariage.');
  });

  it('refuse une autre méthode, une autre origine, un autre type, un corps trop lourd', async () => {
    const f = resendOk();
    expect((await handleEnquiry(post(null, {}, 'GET'), env, f, NOW)).status).toBe(405);
    expect((await handleEnquiry(post(body, { Origin: 'https://evil.example' }), env, f, NOW)).status).toBe(403);
    expect((await handleEnquiry(new Request(`${SITE}/api/enquiry`, { method: 'POST', body: '{}' }), env, f, NOW)).status).toBe(403);
    expect((await handleEnquiry(post(body, { 'Content-Type': 'text/plain' }), env, f, NOW)).status).toBe(415);
    expect((await handleEnquiry(post(body, { 'Content-Length': String(MAX_BODY + 1) }), env, f, NOW)).status).toBe(413);
    expect((await handleEnquiry(post({ ...body, message: 'x'.repeat(MAX_BODY) }), env, f, NOW)).status).toBe(413);
    expect(f).not.toHaveBeenCalled();
  });

  it('refuse un JSON invalide, des champs de mauvais type ou des valeurs hors liste', async () => {
    const f = resendOk();
    expect((await handleEnquiry(post('{nope'), env, f, NOW)).status).toBe(400);
    expect((await handleEnquiry(post([1]), env, f, NOW)).status).toBe(400);
    expect((await handleEnquiry(post({ ...body, email: 42 }), env, f, NOW)).status).toBe(400);
    expect((await handleEnquiry(post({ ...body, message: ['x'] }), env, f, NOW)).status).toBe(400);
    const bad = await handleEnquiry(post({ ...body, experience: 'yacht', vehicle: 'ferrari', consent: false, date: '2020-01-01' }), env, f, NOW);
    expect(bad.status).toBe(422);
    expect((await bad.json()).fields).toEqual(expect.arrayContaining(['experience', 'vehicle', 'consent', 'date']));
    expect((await handleEnquiry(post({ ...body, email: 'a@b.c\nBcc: x@y.z' }), env, f, NOW)).status).toBe(422);
    expect((await handleEnquiry(post({ ...body, fullName: 'x'.repeat(101) }), env, f, NOW)).status).toBe(422);
    expect(f).not.toHaveBeenCalled();
  });

  it('limite le débit par adresse IP', async () => {
    const limit = vi.fn(async () => ({ success: false }));
    const res = await handleEnquiry(post(body, { 'CF-Connecting-IP': '203.0.113.7' }), { ...env, ENQUIRY_LIMIT: { limit } }, resendOk(), NOW);
    expect(res.status).toBe(429);
    expect(limit).toHaveBeenCalledWith({ key: '203.0.113.7' });
    const pass = vi.fn(async () => ({ success: true }));
    expect((await handleEnquiry(post(body), { ...env, ENQUIRY_LIMIT: { limit: pass } }, resendOk(), NOW)).status).toBe(200);
    expect(pass).toHaveBeenCalledWith({ key: 'unknown' });
  });

  it('sans clé ou sans adresses : 503, rien ne part', async () => {
    const f = resendOk();
    expect((await handleEnquiry(post(body), { ...env, RESEND_API_KEY: '' }, f, NOW)).status).toBe(503);
    expect((await handleEnquiry(post(body), { ...env, ENQUIRY_TO: undefined }, f, NOW)).status).toBe(503);
    expect(f).not.toHaveBeenCalled();
  });

  it('Resend en erreur ou injoignable : 502', async () => {
    const refused = vi.fn(async () => new Response('{"message":"domain not verified"}', { status: 403 }));
    expect((await handleEnquiry(post(body), env, refused, NOW)).status).toBe(502);
    const down = vi.fn(async () => { throw new TypeError('network'); });
    expect((await handleEnquiry(post(body), env, down, NOW)).status).toBe(502);
  });
});

describe('contenu', () => {
  it('readPayload accepte voiture et date nulles, langue anglaise', () => {
    const p = readPayload({ ...body, vehicle: null, date: null, message: undefined, locale: 'en' });
    expect(p?.values).toMatchObject({ vehicle: '', date: '', message: '', consent: true });
    expect(p?.locale).toBe('en');
    expect(readPayload(null)).toBeNull();
    expect(readPayload({ ...body, date: 20270512 })).toBeNull();
  });

  it('composeEmail : autre expérience, sans voiture, date flexible, sans message', () => {
    const { subject, text } = composeEmail({ ...emptyEnquiry, fullName: 'Alex', email: 'a@b.co', experience: 'other' }, 'en');
    expect(subject).toBe('Nouvelle demande : Autre chose, Alex');
    expect(text).toContain('Voiture : Sans préférence');
    expect(text).toContain('Date souhaitée : Flexible');
    expect(text).toContain('Langue du visiteur : anglais');
    expect(text).toContain('(aucun message)');
  });
});

describe('Worker', () => {
  it('route /api/enquiry, 404 pour le reste de /api/', async () => {
    expect((await worker.fetch(new Request(`${SITE}/api/other`), env)).status).toBe(404);
    expect((await worker.fetch(new Request(`${SITE}/api/enquiry`), env)).status).toBe(405);
  });
});

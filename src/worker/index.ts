import { handleEnquiry, type Env } from './enquiry';

/*
 * Worker Cloudflare d'Époque Motors. Le site reste statique : Cloudflare sert dist/ directement, et ce script ne
 * reçoit que les adresses /api/* (run_worker_first dans wrangler.jsonc). Seule /api/enquiry existe.
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/enquiry') return handleEnquiry(request, env);
    return new Response(JSON.stringify({ error: 'not-found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  },
};

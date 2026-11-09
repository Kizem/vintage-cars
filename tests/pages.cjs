/* Pages de contenu (services, voitures, guides, FAQ), écrites au build : chacune se charge sans erreur, sans
   débordement horizontal, de la largeur d'un petit téléphone à celle d'un ordinateur ; un seul h1 ; chaque image
   se charge ; chaque lien interne répond. Les fichiers du référencement (sitemap, robots, llms) sont servis. */
const fs = require('fs');
const path = require('path');
const { launch, suite, BASE } = require('./lib.cjs');
const { check, done } = suite('pages');

const dist = path.join(__dirname, '..', 'dist');
const pages = [];
(function walk(dir) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    if (f.isDirectory() && !['assets', 'images'].includes(f.name)) walk(path.join(dir, f.name));
    /* les anciennes adresses (redirections) sont vérifiées par les tests unitaires */
    else if (f.name === 'index.html' && dir !== dist && dir !== path.join(dist, 'fr') && !fs.readFileSync(path.join(dir, f.name), 'utf8').includes('http-equiv="refresh"')) pages.push(path.relative(dist, dir).split(path.sep).join('/') + '/');
  }
})(dist);

(async () => {
  const b = await launch();
  check(pages.length >= 40, `${pages.length} pages de contenu`);
  const links = new Set();
  for (const [w, h] of [[320, 640], [390, 844], [1024, 768], [1440, 900]]) {
    const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage();
    const errs = [];
    p.on('pageerror', (e) => errs.push(String(e)));
    p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
    for (const u of pages) {
      await p.goto(BASE + u, { waitUntil: 'load' });
      const r = await p.evaluate(async () => {
        for (const i of document.images) i.loading = 'eager';
        await Promise.all([...document.images].map((i) => (i.complete ? 0 : new Promise((ok) => { i.onload = i.onerror = ok; }))));
        return {
          over: document.documentElement.scrollWidth - innerWidth,
          h1: document.querySelectorAll('h1').length,
          broken: [...document.images].filter((i) => !i.naturalWidth).map((i) => i.getAttribute('src')),
          links: [...document.querySelectorAll('a[href]')].map((a) => a.href).filter((x) => x.startsWith(location.origin)),
        };
      });
      check(r.over <= 0, `${w} ${u} : pas de débordement (${r.over})`);
      if (w === 1440) {
        check(r.h1 === 1, `${u} : un h1 (${r.h1})`);
        check(!r.broken.length, `${u} : images (${r.broken.join(', ')})`);
        r.links.forEach((l) => links.add(l.split('#')[0]));
      }
    }
    check(!errs.length, `${w} : aucune erreur (${errs.slice(0, 3).join(' | ')})`);
  }
  /* la carte des itinéraires : rien de chargé avant le clic, puis une étape numérotée par arrêt (les tuiles
     d'OpenStreetMap peuvent manquer hors ligne : seules les erreurs de script comptent) */
  const routes = pages.filter((u) => fs.readFileSync(path.join(dist, u, 'index.html'), 'utf8').includes('class="dp-map"'));
  check(routes.length === 10, `${routes.length} pages d'itinéraire avec carte`);
  for (const [w, h] of [[390, 844], [1280, 800]]) {
    const p = await (await b.newContext({ viewport: { width: w, height: h }, hasTouch: w < 700 })).newPage();
    const errs = [];
    p.on('pageerror', (e) => errs.push(String(e)));
    for (const u of routes) {
      const leaflet = [];
      p.on('request', (r) => /map-view|tile\.openstreetmap/.test(r.url()) && leaflet.push(r.url()));
      await p.goto(BASE + u, { waitUntil: 'load' });
      check(!leaflet.length, `${w} ${u} : rien de chargé avant le clic`);
      const n = await p.$eval('.dp-map', (m) => JSON.parse(m.dataset.stops).length);
      await p.click('.dp-map__show');
      const ok = await p.waitForFunction((k) => document.querySelectorAll('.dp-pin').length === k, n, { timeout: 10000 }).then(() => true, () => false);
      check(ok, `${w} ${u} : ${n} étapes sur la carte`);
      p.removeAllListeners('request');
    }
    check(!errs.length, `${w} carte : aucune erreur (${errs.slice(0, 3).join(' | ')})`);
  }

  const ctx = await b.newContext();
  for (const l of links) {
    const res = await ctx.request.get(l);
    check(res.ok(), `lien ${l} (${res.status()})`);
  }
  for (const f of ['sitemap.xml', 'robots.txt', 'llms.txt', 'llms-full.txt']) {
    const res = await ctx.request.get(BASE + f);
    check(res.ok() && (await res.text()).length > 200, `${f} servi`);
  }
  await b.close();
  done();
})();

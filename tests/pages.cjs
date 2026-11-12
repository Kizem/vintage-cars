/* Pages de contenu (services, voitures, guides, FAQ), écrites au build : chacune se charge sans erreur, sans
   débordement horizontal, de la largeur d'un petit téléphone à celle d'un ordinateur ; un seul h1 ; chaque image
   se charge ; chaque lien interne répond. Les fichiers du référencement (sitemap, robots, llms) sont servis. */
const fs = require('fs');
const path = require('path');
const { launch, suite, until, BASE } = require('./lib.cjs');
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
  check(pages.length >= 32, `${pages.length} pages de contenu`);
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
  /* Les Guides de Paris : chaque itinéraire s'ouvre en pop-in (clic, adresse avec ancre, ancienne page),
     se ferme (Échap, bouton), passe au suivant ; la page derrière ne bouge pas */
  for (const [w, h, lang] of [[390, 844, 'fr/'], [1280, 800, ''], [1280, 800, 'fr/']]) {
    const ctxP = await b.newContext({ viewport: { width: w, height: h }, hasTouch: w < 700 });
    const p = await ctxP.newPage();
    const errs = [];
    p.on('pageerror', (e) => errs.push(String(e)));
    p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
    await p.goto(`${BASE}${lang}guides/`, { waitUntil: 'load' });
    const ids = await p.$$eval('dialog.dp-pop', (d) => d.map((x) => x.id));
    check(ids.length === 5, `${w} ${lang}guides : 5 fiches (${ids.length})`);
    for (const id of ids) {
      await p.click(`.dp-routes a.dp-action[href="#${id}"]`);
      const open = await until(p, (i) => document.getElementById(i).open, id);
      const r = await p.evaluate((i) => ({ hash: location.hash, over: document.getElementById(i).scrollWidth - document.getElementById(i).clientWidth, title: document.getElementById(i).querySelector('h2').textContent }), id);
      check(open && r.hash === `#${id}`, `${w} ${lang}${id} : la fiche s'ouvre (${r.hash})`);
      check(r.over <= 0, `${w} ${id} : la fiche ne déborde pas`);
      await p.keyboard.press('Escape');
      check(await until(p, (i) => !document.getElementById(i).open && !location.hash, id), `${w} ${id} : Échap ferme la fiche`);
    }
    /* suivant dans la fiche, puis le bouton Fermer */
    await p.click(`.dp-routes a.dp-action[href="#${ids[0]}"]`);
    await p.click(`#${ids[0]} .dp-routes-nav__pn a:last-child`);
    check(await until(p, (i) => document.getElementById(i).open, ids[1]), `${w} ${lang}: « itinéraire suivant » ouvre la fiche suivante`);
    await p.click(`#${ids[1]} .dp-pop__close`);
    check(await until(p, () => ![...document.querySelectorAll('dialog')].some((d) => d.open)), `${w} ${lang}: « Fermer » ferme`);
    /* adresse avec ancre */
    await p.goto(`${BASE}${lang}guides/#${ids[2]}`, { waitUntil: 'load' });
    check(await until(p, (i) => document.getElementById(i).open, ids[2]), `${w} ${lang}: l'ancre ouvre la fiche`);
    check(!errs.length, `${w} ${lang}guides : aucune erreur (${errs.slice(0, 3).join(' | ')})`);
    await ctxP.close();
  }
  /* l'ancienne page d'un itinéraire mène à sa fiche */
  {
    const p = await (await b.newContext()).newPage();
    await p.goto(`${BASE}fr/guides/paris-intemporel/`, { waitUntil: 'load' });
    check(await until(p, () => /\/fr\/guides\/#paris-intemporel$/.test(location.href) && document.getElementById('paris-intemporel')?.open, null, 10000), `ancienne page → fiche en pop-in (${p.url()})`);
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

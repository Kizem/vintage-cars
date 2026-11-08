/* La vraie scène WebGL (rendu logiciel, lent : un seul fichier), mouvement réduit : scène prête, fiche,
   clic dans le vide, perte du contexte ; puis chaque voiture seule dans l'atelier (ds.html), sans erreur. */
const { launch, page, suite, until, BASE } = require('./lib.cjs');

(async () => {
  const { check, done } = suite('scene');
  const b = await launch({ webgl: true });
  const p = await page(b, [1280, 720], { lang: 'fr', reduced: true });
  check(await p.evaluate(() => !!document.querySelector('.em-parking__gl canvas')), 'la scène 3D est là (canvas)');
  check(await p.evaluate(() => !document.querySelector('.em-parking__flat')), 'pas de profil vectoriel quand WebGL est disponible');
  /* fiche ouverte par le nom, fermée par un clic dans le parking vide */
  await p.click('.em-parking__name');
  check(await until(p, () => document.querySelector('.em-parking').classList.contains('is-open'), null, 15000), 'la fiche s\'ouvre');
  await p.waitForTimeout(1500);
  await p.mouse.click(60, 120);
  check(await until(p, () => !document.querySelector('.em-parking').classList.contains('is-open'), null, 15000), 'un clic dans le parking vide ferme la fiche');
  /* perte du contexte WebGL : la scène est reconstruite (ou, en dernier recours, le profil vectoriel) */
  await p.evaluate(() => document.querySelector('.em-parking__gl canvas').getContext('webgl2')?.getExtension('WEBGL_lose_context')?.loseContext());
  check(await until(p, () => !!document.querySelector('.em-parking__gl canvas') || !!document.querySelector('.em-parking__flat'), null, 20000), 'après une perte du contexte, la scène revient');
  check(!p.errors.filter((e) => !/CONTEXT_LOST|context lost/i.test(e)).length, `aucune erreur JS (${p.errors[0]})`);
  await p.context().close();
  /* l'atelier : chaque modèle se construit sans erreur */
  for (const car of ['p504', 'ds', 'w114']) {
    const ctx = await b.newContext({ viewport: { width: 640, height: 400 } });
    const w = await ctx.newPage(); const errs = [];
    w.on('pageerror', (e) => errs.push(String(e)));
    await w.goto(`${BASE}ds.html?car=${car}`);
    await w.waitForTimeout(3000);
    const drawn = await w.evaluate(() => { const c = document.querySelector('canvas'); const g = c?.getContext('webgl2') || c?.getContext('webgl'); return !!c && c.width > 0 && !!g; });
    check(drawn && !errs.length, `atelier : ${car} se construit (${errs[0] || ''})`);
    await ctx.close();
  }
  await b.close();
  done();
})();

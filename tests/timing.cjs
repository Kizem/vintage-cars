/* Alternance des voitures : la 504 reste au moins 9 s, puis une voiture toutes les 5 s environ. */
const { launch, page, suite } = require('./lib.cjs');

(async () => {
  const { check, done } = suite('timing');
  const b = await launch();
  const p = await page(b, 'desktop', { lang: 'fr' });
  const name = () => p.textContent('.em-parking__name').then((s) => s.trim());
  const t0 = Date.now();
  let last = await name();
  const seen = [[0, last]];
  while (Date.now() - t0 < 21000) {
    await p.waitForTimeout(200);
    const n = await name();
    if (n !== last) { seen.push([Date.now() - t0, n]); last = n; }
  }
  check(seen[0][1] === 'Peugeot 504 GL', `la 504 d'abord (${seen[0][1]})`);
  check(seen.length >= 3, `au moins deux changements en 21 s (${seen.map((s) => s.join(' ms : '))})`);
  if (seen.length >= 2) check(seen[1][0] >= 9000, `la 504 reste au moins 9 s (${seen[1][0]} ms)`);
  if (seen.length >= 3) { const d = seen[2][0] - seen[1][0]; check(d > 4000 && d < 6800, `puis environ 5 s par voiture (${d} ms)`); }
  check(!p.errors.length, `aucune erreur JS (${p.errors[0]})`);
  await b.close();
  done();
})();

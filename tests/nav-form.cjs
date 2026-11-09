/* Navigation (molette, clavier, menu, haut de page) et formulaire (erreurs, état « non configuré »). */
const { launch, page, suite, until } = require('./lib.cjs');

const at = (id) => { const s = document.getElementById(id); return !!s && Math.abs(s.getBoundingClientRect().top) < 4; };

(async () => {
  const { check, done } = suite('nav-form');
  const b = await launch();
  const p = await page(b, 'desktop', { lang: 'fr' });
  await p.mouse.move(700, 450);
  await p.mouse.wheel(0, 300);
  check(await until(p, at, 'sortie-1'), 'molette : section suivante');
  await p.waitForTimeout(1000);
  await p.mouse.wheel(0, 30);
  check(await until(p, at, 'sortie-2'), 'molette, petit cran : section suivante');
  await p.waitForTimeout(1000);
  await p.keyboard.press('ArrowUp');
  check(await until(p, at, 'sortie-1'), '↑ : section précédente');
  await p.waitForTimeout(800);
  await p.keyboard.press('PageDown');
  check(await until(p, at, 'sortie-2'), 'PageDown : section suivante');
  check(await until(p, () => document.querySelector('.em-top')?.classList.contains('is-shown')), 'le bouton haut de page paraît');
  const ids = await p.$$eval('.em-nav ul li:not(.em-nav__lang):not(.em-nav__page) a', (as) => as.map((a) => a.getAttribute('href').slice(1)));
  for (const id of ids) {
    await p.click(`.em-nav a[href="#${id}"]`);
    check(await until(p, at, id), `menu : ${id}`);
    await p.waitForTimeout(600);
  }
  await p.click('.em-top');
  check(await until(p, at, 'garage'), 'haut de page : retour au garage');

  /* formulaire */
  await p.click('.em-nav a[href="#ecrire"]');
  await until(p, at, 'ecrire');
  await p.click('.em-form button[type="submit"]');
  check(await until(p, () => document.querySelectorAll('.em-form [aria-invalid="true"]').length >= 2), 'formulaire vide : champs signalés');
  check(await until(p, () => document.querySelectorAll('.em-form__errors li').length >= 2), 'formulaire vide : liste des erreurs');
  await p.fill('#em-fullName', 'Camille Martin');
  await p.fill('#em-email', 'camille@example.com');
  const opts = await p.$$eval('#em-experience option', (o) => o.map((x) => x.value).filter(Boolean));
  if (opts.length) await p.selectOption('#em-experience', opts[0]);
  const consent = await p.$('.em-form input[type="checkbox"]:not([tabindex="-1"])');
  if (consent) await consent.check({ force: true });
  await p.click('.em-form button[type="submit"]');
  check(await until(p, () => !!document.querySelector('.em-done[role="alert"]')), 'formulaire valide sans service configuré : état « non envoyé »');
  check(!(await p.$('.em-done[role="status"]')), 'jamais de faux message « envoyé »');
  check(!p.errors.length, `aucune erreur JS (${p.errors[0]})`);
  await b.close();
  done();
})();

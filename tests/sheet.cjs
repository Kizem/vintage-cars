/* La fiche d'une voiture, sur ordinateur et téléphone : ouverture, focus, photos (toutes chargées, pleine largeur),
   plein écran, changement de voiture, fermeture, demande de renseignements. */
const { launch, page, suite, until } = require('./lib.cjs');

const isOpen = () => document.querySelector('.em-parking')?.classList.contains('is-open');

(async () => {
  const { check, done } = suite('sheet');
  const b = await launch();
  for (const size of ['desktop', 'phone']) {
    const p = await page(b, size, { lang: 'fr', reduced: true });
    for (let car = 0; car < 3; car++) {
      const name = (await p.textContent('.em-parking__name')).trim();
      await p.click('.em-parking__name');
      check(await until(p, isOpen), `${size} ${name}: la fiche s'ouvre`);
      check(await until(p, () => document.activeElement?.classList.contains('em-sheet__name')), `${size} ${name}: le focus va au nom`);
      const r = await p.evaluate(() => {
        const panel = document.querySelector('.em-parking__panel').getBoundingClientRect();
        const track = document.querySelector('.em-carousel__track').getBoundingClientRect();
        const imgs = [...document.querySelectorAll('.em-carousel__slide img')];
        return {
          title: document.querySelector('.em-sheet__name').textContent.trim(),
          n: imgs.length,
          counter: document.querySelector('.em-carousel__pager .em-counter')?.textContent.replace(/\s/g, ''),
          dl: [...document.querySelectorAll('.em-specs dt')].map((d) => d.textContent),
          desc: !!document.querySelector('.em-sheet__desc'),
          fullWidth: Math.abs(track.left - panel.left) <= 2 && Math.abs(track.right - panel.right) <= 2,
          srcs: imgs.flatMap((i) => [i.getAttribute('src'), ...(i.getAttribute('srcset') || '').split(',').map((s) => s.trim().split(' ')[0]).filter(Boolean)]),
        };
      });
      check(r.title === name, `${size}: le titre de la fiche est le nom de la voiture (${r.title})`);
      const n = r.n;
      check(n >= 2, `${size} ${name}: au moins deux photos (${n})`);
      check(r.counter === `1-${n}`, `${size} ${name}: compteur 1 - ${n} (${r.counter})`);
      check(!r.dl.some((d) => /Disponibilit|Availability/.test(d)), `${size} ${name}: pas de ligne disponibilité`);
      check(!r.desc, `${size} ${name}: pas de phrase sous la photo`);
      check(r.fullWidth, `${size} ${name}: photo sur toute la largeur de la fiche`);
      for (const src of new Set(r.srcs)) {
        const res = await p.request.get(new URL(src, p.url()).href);
        check(res.ok(), `${size} ${name}: ${src} se charge (${res.status()})`);
      }
      /* flèche de photos */
      await p.click('.em-carousel__pager button:last-child');
      check(await until(p, (want) => document.querySelector('.em-carousel__pager .em-counter')?.textContent.replace(/\s/g, '') === want, `2-${n}`), `${size} ${name}: la flèche passe à la photo 2`);
      /* plein écran ; → change de photo ; Échap le ferme sans fermer la fiche */
      await p.click('.em-carousel__slide:nth-child(2) .em-carousel__open', { force: true });
      check(await until(p, () => document.querySelector('.em-lightbox')?.open), `${size} ${name}: la photo s'ouvre en plein écran`);
      await p.keyboard.press('ArrowRight');
      check(await until(p, (want) => document.querySelector('.em-lightbox__pager .em-counter')?.textContent.replace(/\s/g, '') === want, `${n >= 3 ? 3 : 1}-${n}`), `${size} ${name}: → change de photo en plein écran`);
      await p.keyboard.press('Escape');
      check(await until(p, () => !document.querySelector('.em-lightbox')?.open), `${size} ${name}: Échap ferme le plein écran`);
      check(await p.evaluate(isOpen), `${size} ${name}: la fiche reste ouverte`);
      if (car < 2) {
        /* voiture suivante depuis la fiche, puis fermeture par le bouton */
        await p.click('.em-panel__arrow >> nth=1');
        check(await until(p, (n) => document.querySelector('.em-sheet__name')?.textContent.trim() !== n, name), `${size}: la flèche de la fiche change de voiture`);
        await p.click('.em-panel__close');
      } else {
        await p.keyboard.press('Escape');
      }
      check(await until(p, () => !document.querySelector('.em-parking').classList.contains('is-open')), `${size} ${name}: la fiche se ferme`);
    }
    /* « Demander cette voiture » : la page va au formulaire, la voiture est présélectionnée */
    await p.click('.em-parking__name');
    await until(p, isOpen);
    await p.click('.em-sheet .em-action');
    check(await until(p, () => !!document.querySelector('#em-vehicle')?.value), `${size}: la voiture est présélectionnée dans le formulaire`);
    check(await until(p, () => Math.abs(document.querySelector('#ecrire').getBoundingClientRect().top) < 4), `${size}: la page va au formulaire`);
    check(!p.errors.length, `${size}: aucune erreur JS (${p.errors[0]})`);
    await p.context().close();
  }
  await b.close();
  done();
})();

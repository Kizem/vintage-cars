/* Mise en page : sept sections, un seul h1, rien ne déborde, menu sur une ligne (5 tailles × FR/EN), bascule de langue. */
const { launch, page, suite, until, SIZES } = require('./lib.cjs');

(async () => {
  const { check, done } = suite('layout');
  const b = await launch();
  for (const size of Object.keys(SIZES)) {
    for (const lang of ['fr', 'en']) {
      const p = await page(b, size, { lang });
      const tag = `${size} ${lang}`;
      const r = await p.evaluate(() => {
        const sc = document.querySelector('.em-scroll');
        const secs = [...sc.querySelectorAll(':scope > section[id]')];
        const over = [...document.querySelectorAll('.em-scroll *')].filter((e) => {
          const b = e.getBoundingClientRect();
          if (!b.width || getComputedStyle(e).position === 'fixed') return false;
          if (e.closest('.em-carousel__track, .em-parking__panel, .em-sr, .em-hp, .em-parking__gl, .em-parking__flat')) return false;
          return b.right > innerWidth + 1 || b.left < -1;
        }).map((e) => e.className || e.tagName).slice(0, 5);
        const items = [...document.querySelectorAll('.em-nav ul > li')].map((li) => Math.round(li.getBoundingClientRect().top));
        return {
          ids: secs.map((s) => s.id),
          h1: document.querySelectorAll('h1').length,
          lang: document.documentElement.lang,
          docOver: document.documentElement.scrollWidth > innerWidth + 1,
          over,
          navOneLine: new Set(items).size === 1,
          fullScreen: secs.every((s) => s.getBoundingClientRect().height >= innerHeight - 2),
        };
      });
      check(r.ids.join() === 'garage,sortie-1,sortie-2,sortie-3,savoir,apropos,ecrire', `${tag}: sept sections dans l'ordre (${r.ids})`);
      check(r.h1 === 1, `${tag}: un seul h1 (${r.h1})`);
      check(r.lang === lang, `${tag}: html lang = ${lang} (${r.lang})`);
      check(!r.docOver && !r.over.length, `${tag}: rien ne déborde (${r.over})`);
      check(r.navOneLine, `${tag}: menu sur une ligne`);
      check(r.fullScreen, `${tag}: chaque section occupe l'écran`);
      check(!p.errors.length, `${tag}: aucune erreur JS (${p.errors[0]})`);
      await p.context().close();
    }
  }
  /* bascule de langue depuis le menu (chaque langue a son adresse : / pour l'anglais, /fr/ pour le français) */
  const p = await page(b, 'desktop', { lang: 'en' });
  const before = await p.textContent('.em-nav ul li:first-child a');
  await p.click('.em-nav__lang a');
  check(await until(p, () => document.documentElement.lang === 'fr'), 'bascule EN → FR');
  const after = await p.textContent('.em-nav ul li:first-child a');
  check(before !== after, `le menu change de langue (${before} → ${after})`);
  check(/\/fr\/$/.test(new URL(p.url()).pathname) && !/lang=/.test(p.url()), `l'URL devient celle de la page française (${p.url()})`);
  await b.close();
  done();
})();

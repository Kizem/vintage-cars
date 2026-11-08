/* Outils communs des tests : navigateur, pages, vérifications. Playwright est celui installé globalement
   (NODE_PATH, posé par run.cjs). Les tests tournent contre `vite preview` (BASE, voir run.cjs). */
const { chromium } = require('playwright');

const BASE = process.env.BASE || 'http://localhost:4321/';
const SIZES = { desktop: [1440, 900], laptop: [1280, 640], tablet: [1024, 768], tabletPortrait: [768, 1024], phone: [390, 844] };

/** WebGL désactivé par défaut : le profil vectoriel remplace la scène (rapide). */
async function launch({ webgl = false } = {}) {
  const args = webgl ? ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] : ['--disable-webgl', '--disable-webgl2'];
  return chromium.launch({ args });
}

function suite(name) {
  const fails = []; let checks = 0;
  const check = (ok, msg) => { checks++; if (!ok) { fails.push(msg); console.log(`  ✗ ${msg}`); } };
  const done = () => {
    console.log(`${fails.length ? 'FAIL' : 'ok'}  ${name}: ${checks - fails.length}/${checks}`);
    process.exit(fails.length ? 1 : 0);
  };
  return { check, done };
}

/** Nouvelle page à la taille donnée, langue et mouvement réduit au choix ; collecte les erreurs JS. */
async function page(browser, size, { lang = 'fr', reduced = false } = {}) {
  const [w, h] = SIZES[size] || size;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: reduced ? 'reduce' : 'no-preference', hasTouch: w < 700, isMobile: false });
  const p = await ctx.newPage();
  p.errors = [];
  p.on('pageerror', (e) => p.errors.push(String(e)));
  p.on('console', (m) => { if (m.type() === 'error' && !/favicon|Failed to load resource.*404/.test(m.text())) p.errors.push(m.text()); });
  await p.goto(`${BASE}?lang=${lang}`, { waitUntil: 'load' });
  await p.waitForSelector('.em-parking.is-ready', { timeout: 30000 });
  return p;
}

/** Attend qu'une condition évaluée dans la page devienne vraie (au lieu d'un délai fixe). */
async function until(p, fn, arg, timeout = 8000) {
  try { await p.waitForFunction(fn, arg, { timeout, polling: 100 }); return true; } catch { return false; }
}

module.exports = { launch, page, suite, until, SIZES, BASE };

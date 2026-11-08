/* Lance la batterie de tests contre le site construit (`npm run build` d'abord) servi par `vite preview`.
   Playwright et son Chromium sont ceux installés sur la machine (paquet global) ; ce script pose NODE_PATH.
   node tests/run.cjs            → layout, sheet, nav-form, timing en parallèle, puis scene (WebGL, lent)
   node tests/run.cjs sheet      → un seul fichier */
const { spawn, execSync } = require('child_process');
const path = require('path');
const http = require('http');

const PORT = 4321;
const root = path.join(__dirname, '..');
const globalRoot = execSync('npm root -g').toString().trim();
const env = { ...process.env, NODE_PATH: [globalRoot, process.env.NODE_PATH].filter(Boolean).join(path.delimiter), BASE: `http://localhost:${PORT}/` };

const ping = () => new Promise((ok) => http.get(env.BASE, (r) => { r.resume(); ok(r.statusCode === 200); }).on('error', () => ok(false)));
const run = (name) => new Promise((ok) => {
  const t = Date.now();
  const c = spawn(process.execPath, [path.join(__dirname, `${name}.cjs`)], { env, cwd: root });
  let out = '';
  c.stdout.on('data', (d) => { out += d; });
  c.stderr.on('data', (d) => { out += d; });
  c.on('close', (code) => { console.log(out.trim()); console.log(`   (${name} : ${((Date.now() - t) / 1000).toFixed(0)} s)\n`); ok(code === 0); });
});

(async () => {
  const only = process.argv.slice(2);
  const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { cwd: root, stdio: 'ignore' });
  for (let i = 0; i < 60 && !(await ping()); i++) await new Promise((r) => setTimeout(r, 500));
  if (!(await ping())) { console.error('vite preview ne répond pas (le site est-il construit ?)'); server.kill(); process.exit(1); }
  const fast = ['layout', 'sheet', 'nav-form', 'timing'].filter((n) => !only.length || only.includes(n));
  const results = await Promise.all(fast.map(run));
  if (!only.length || only.includes('scene')) results.push(await run('scene'));
  server.kill();
  const ok = results.every(Boolean);
  console.log(ok ? 'Tous les tests passent.' : 'Des tests échouent.');
  process.exit(ok ? 0 : 1);
})();

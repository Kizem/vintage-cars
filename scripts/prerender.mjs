/* Writes the pre-rendered pages into dist/ (see src/seo/build.tsx): run by `npm run build`, after the client build
   (dist/) and the build of the site writer (.ssr/). VITE_SITE_URL gives the production address. */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const { buildSite } = await import(join(root, '.ssr', 'build.js'));

const manifest = JSON.parse(readFileSync(join(dist, '.vite', 'manifest.json'), 'utf8'));
const doc = manifest['src/seo/doc.css'];
if (!doc) throw new Error('prerender: src/seo/doc.css missing from the manifest');
const docCss = doc.file.endsWith('.css') ? doc.file : doc.css?.[0];

const files = buildSite({ siteUrl: process.env.VITE_SITE_URL, template: readFileSync(join(dist, 'index.html'), 'utf8'), docCss });
for (const [path, content] of Object.entries(files)) {
  mkdirSync(dirname(join(dist, path)), { recursive: true });
  writeFileSync(join(dist, path), content);
}

/* a CSS entry can leave an empty script behind; the manifest and the writer are not published */
if (doc.file.endsWith('.js')) rmSync(join(dist, doc.file), { force: true });
rmSync(join(dist, '.vite'), { recursive: true, force: true });
rmSync(join(root, '.ssr'), { recursive: true, force: true });

const pages = Object.keys(files).filter((f) => f.endsWith('index.html')).length;
console.log(`prerender: ${pages} pages, ${Object.keys(files).length} files, site ${process.env.VITE_SITE_URL || '(placeholder address)'}`);
if (!existsSync(join(dist, 'fr', 'index.html'))) throw new Error('prerender: fr/index.html missing');

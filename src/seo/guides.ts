/**
 * The guides page: each route opens in a pop-in (<dialog>) instead of a page of its own. The address keeps the
 * route's anchor (/fr/guides/#paris-intemporel), so a link, a shared address or the former page of a route
 * opens the right sheet. Escape, the close link or a click outside closes it; focus returns to the link.
 */
const sheets = new Map([...document.querySelectorAll<HTMLDialogElement>('dialog.dp-pop')].map((d) => [d.id, d]));
let returnTo: HTMLElement | null = null;

const clearHash = () => history.replaceState(null, '', location.pathname + location.search);

function open(id: string, from?: HTMLElement) {
  const d = sheets.get(id);
  if (!d) return false;
  for (const o of sheets.values()) if (o.open && o !== d) o.close();
  if (from && !from.closest('dialog')) returnTo = from;
  if (!d.open) d.showModal();
  d.scrollTop = 0;
  d.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true });
  if (location.hash !== `#${id}`) history.replaceState(null, '', `#${id}`);
  document.documentElement.classList.add('dp-locked');
  return true;
}

for (const d of sheets.values()) {
  d.querySelector('h2')?.setAttribute('tabindex', '-1');
  d.addEventListener('close', () => {
    if ([...sheets.values()].some((o) => o.open)) return;
    document.documentElement.classList.remove('dp-locked');
    /* n'efface que sa propre ancre : une autre fiche peut avoir été demandée entre-temps */
    if (location.hash === `#${d.id}`) clearHash();
    returnTo?.focus({ preventScroll: true });
  });
  /* un clic sur le fond (hors de la fiche) ferme */
  d.addEventListener('click', (e) => {
    if (e.target === d) d.close();
  });
}

document.addEventListener('click', (e) => {
  const a = (e.target as Element).closest<HTMLAnchorElement>('a[data-route], a[data-close]');
  if (!a) return;
  e.preventDefault();
  if (a.hasAttribute('data-close')) a.closest('dialog')?.close();
  else open(a.hash.slice(1), a);
});

const fromHash = () => open(decodeURIComponent(location.hash.slice(1)));
fromHash();
window.addEventListener('hashchange', fromHash);

export {};

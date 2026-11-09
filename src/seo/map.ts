import type { Stop } from './map-view';

/**
 * The map of a route (pages of « Les Guides de Paris »). Nothing is loaded, neither Leaflet nor any
 * OpenStreetMap tile, until the visitor asks for the map. Numbered markers in the order of the route; the
 * journey between two stops is not drawn (it depends on the traffic and restrictions of the day).
 */
for (const box of document.querySelectorAll<HTMLElement>('.dp-map')) {
  const button = box.querySelector<HTMLButtonElement>('.dp-map__show');
  if (!button) continue;
  button.hidden = false;
  button.addEventListener('click', async () => {
    button.disabled = true;
    const { showMap } = await import('./map-view');
    button.remove();
    box.setAttribute('role', 'region');
    box.setAttribute('aria-label', box.dataset.label ?? 'Map');
    showMap(box, JSON.parse(box.dataset.stops ?? '[]') as Stop[]);
  });
}

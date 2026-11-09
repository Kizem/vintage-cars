import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

/** The Leaflet map of a route, loaded only once the visitor asks for it (see map.ts). */
export interface Stop {
  n: number;
  name: string;
  lat: number;
  lng: number;
}

export function showMap(box: HTMLElement, stops: Stop[]) {
  box.classList.add('is-on');
  const map = L.map(box, { scrollWheelZoom: false });
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
  const points = stops.map((s) => {
    const icon = L.divIcon({ className: 'dp-pin', html: `<span>${s.n}</span>`, iconSize: [30, 30], iconAnchor: [15, 15] });
    const label = document.createElement('span');
    label.textContent = `${s.n}. ${s.name}`;
    L.marker([s.lat, s.lng], { icon, title: `${s.n}. ${s.name}`, alt: `${s.n}. ${s.name}` }).addTo(map).bindPopup(label);
    return L.latLng(s.lat, s.lng);
  });
  map.fitBounds(L.latLngBounds(points), { padding: [36, 36] });
  return map;
}

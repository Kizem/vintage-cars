/* Outils de géométrie communs aux trois voitures : courbes, lofts, tubes, formes et textures dessinées. */
import { BufferGeometry, CanvasTexture, CatmullRomCurve3, Float32BufferAttribute, Mesh, SRGBColorSpace, Shape, TubeGeometry, Vector3, type Material } from 'three';
import { lerp, type Pt } from './carspecs';

export type P3 = [number, number, number];

/** Courbe de Catmull-Rom échantillonnée en `count` segments à travers des points [x, y]. */
export function catmull(ctrl: Pt[], count: number): Pt[] {
  const out: Pt[] = []; const n = ctrl.length;
  for (let k = 0; k <= count; k++) {
    const u = (k / count) * (n - 1); const i = Math.min(n - 2, Math.floor(u)); const t = u - i;
    const p0 = ctrl[Math.max(0, i - 1)]; const p1 = ctrl[i]; const p2 = ctrl[i + 1]; const p3 = ctrl[Math.min(n - 1, i + 2)];
    const f = (a: 0 | 1) => .5 * (2 * p1[a] + (p2[a] - p0[a]) * t + (2 * p0[a] - 5 * p1[a] + 4 * p2[a] - p3[a]) * t * t + (3 * p1[a] - p0[a] - 3 * p2[a] + p3[a]) * t * t * t);
    out.push([f(0), f(1)]);
  }
  return out;
}

/** Maille fermée : une suite de coupes [z, y] le long de X, en miroir de part et d'autre de l'axe. */
export function loft(xs: number[], sectionAt: (x: number) => Pt[], opts: { uvH?: number; uvL?: number; caps?: boolean; shift?: (x: number, y: number) => number } = {}) {
  const pos: number[] = []; const uv: number[] = []; const idx: number[] = [];
  const H = opts.uvH || 1.6; const L = opts.uvL || 6;
  let ringN = 0;
  xs.forEach((x) => {
    const half = sectionAt(x);
    const ring = half.concat(half.slice(0, -1).reverse().map(([z, y]): Pt => [-z, y]));
    ringN = ring.length;
    ring.forEach(([z, y]) => { pos.push(opts.shift ? opts.shift(x, y) : x, y, z); uv.push(x / L + .5, y / H); });
  });
  for (let i = 0; i < xs.length - 1; i++) {
    for (let j = 0; j < ringN - 1; j++) {
      const a = i * ringN + j; const b = a + 1; const c = a + ringN; const d = c + 1;
      idx.push(a, c, b, b, c, d);
    }
  }
  const cap = (i: number, flip: boolean) => {
    let cx = 0; let cy = 0;
    for (let j = 0; j < ringN; j++) { cy += pos[(i * ringN + j) * 3 + 1]; }
    cy /= ringN; cx = opts.shift ? opts.shift(xs[i], cy) : pos[i * ringN * 3];
    const base = pos.length / 3;
    pos.push(cx, cy, 0); uv.push(cx / L + .5, cy / H);
    for (let j = 0; j < ringN; j++) { const k = (i * ringN + j) * 3; pos.push(pos[k], pos[k + 1], pos[k + 2]); uv.push(pos[k] / L + .5, pos[k + 1] / H); }
    for (let j = 0; j < ringN - 1; j++) { if (flip) idx.push(base, base + 1 + j + 1, base + 1 + j); else idx.push(base, base + 1 + j, base + 1 + j + 1); }
  };
  if (opts.caps !== false) { cap(0, true); cap(xs.length - 1, false); }
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/** Abscisses des coupes, plus serrées près des extrémités, où la forme change vite. */
export function stations(a: number, b: number, n: number) {
  const out: number[] = [];
  for (let i = 0; i <= n; i++) { const t = i / n; const e = .5 - .5 * Math.cos(Math.PI * t); out.push(lerp(a, b, lerp(t, e, .7))); }
  return out;
}

/** Tube lisse le long de points ; `flatY` < 1 l'aplatit (pare-chocs). */
export function tube(points: P3[], r: number, mat: Material, flatY = 1) {
  const c = new CatmullRomCurve3(points.map((p) => new Vector3(p[0], p[1], p[2])));
  const m = new Mesh(new TubeGeometry(c, Math.max(24, points.length * 8), r, 8, false), mat);
  if (flatY !== 1) {
    const P = m.geometry.attributes.position; const cy = points.reduce((a, p) => a + p[1], 0) / points.length;
    for (let i = 0; i < P.count; i++) P.setY(i, cy + (P.getY(i) - cy) * flatY);
    m.geometry.computeVertexNormals();
  }
  return m;
}

export function canvasTex(w: number, h: number, draw: (g: CanvasRenderingContext2D, w: number, h: number) => void) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d')!, w, h);
  const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; t.anisotropy = 8; return t;
}

/** Rectangle aux angles arrondis, centré. */
export function rrect(w: number, h: number, r: number) {
  const a = new Shape(); a.moveTo(-w / 2 + r, -h / 2); a.lineTo(w / 2 - r, -h / 2); a.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r); a.lineTo(w / 2, h / 2 - r); a.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2); a.lineTo(-w / 2 + r, h / 2); a.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r); a.lineTo(-w / 2, -h / 2 + r); a.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2); return a;
}

/** Texte dessiné pour un monogramme posé sur la carrosserie. */
export function badgeTexture(text: string, color: string, font: string) {
  return canvasTex(256, 64, (g, w, h) => { g.clearRect(0, 0, w, h); g.fillStyle = color; g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, w / 2, h / 2 + 2); });
}

/** Point à l'abscisse curviligne s d'une ligne brisée (longueurs cumulées `cum`). */
function along(poly: Pt[], cum: number[], s: number): Pt {
  const n = poly.length; if (s <= 0) return poly[0]; if (s >= cum[n - 1]) return poly[n - 1];
  let i = 1; while (cum[i] < s) i++;
  const t = (s - cum[i - 1]) / Math.max(1e-9, cum[i] - cum[i - 1]);
  return [lerp(poly[i - 1][0], poly[i][0], t), lerp(poly[i - 1][1], poly[i][1], t)];
}

/**
 * Coupe faite de plusieurs lignes qui se suivent (la fin de l'une est le début de la suivante), aux raccords arrondis :
 * chaque raccord i est remplacé par un arc de rayon `radii[i]`. Le nombre de points rendu ne dépend que de `counts`
 * (segments par ligne) et de `nc` (segments par arc) : les coupes successives d'un loft ont donc la même taille.
 */
export function roundedPath(parts: Pt[][], radii: number[], counts: number[], nc: number): Pt[] {
  const cums = parts.map((p) => { const c = [0]; for (let i = 1; i < p.length; i++) c.push(c[i - 1] + Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1])); return c; });
  const len = cums.map((c) => c[c.length - 1]);
  const r = radii.map((v, i) => Math.min(v, len[i] * .45, len[i + 1] * .45));
  const out: Pt[] = [];
  parts.forEach((p, i) => {
    const s0 = i > 0 ? r[i - 1] : 0; const s1 = len[i] - (i < parts.length - 1 ? r[i] : 0);
    if (i > 0) {
      /* arc : Bézier quadratique entre la fin de la ligne précédente et le début de celle-ci, autour du sommet */
      const a = out[out.length - 1]; const c = p[0]; const b = along(p, cums[i], s0);
      for (let k = 1; k < nc; k++) { const t = k / nc; const u = 1 - t; out.push([u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]]); }
    }
    for (let k = 0; k <= counts[i]; k++) out.push(along(p, cums[i], lerp(s0, s1, k / counts[i])));
  });
  return out;
}

/** Maille en grille : une suite d'anneaux ouverts [x, y, z] de même taille ; uv = (rang de l'anneau, `vs`). */
export function gridGeometry(rings: P3[][], us: number[], vs: number[]) {
  const pos: number[] = []; const uv: number[] = []; const idx: number[] = []; const n = rings[0].length;
  rings.forEach((ring, i) => ring.forEach((p, j) => { pos.push(p[0], p[1], p[2]); uv.push(us[i], vs[j]); }));
  for (let i = 0; i < rings.length - 1; i++) for (let j = 0; j < n - 1; j++) { const a = i * n + j; idx.push(a, a + n, a + 1, a + 1, a + n, a + n + 1); }
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals();
  return g;
}

/** Copie d'une maille dont chaque sommet est déplacé de `d` le long de sa normale. */
export function offsetGeometry(g: BufferGeometry, d: number) {
  const c = g.clone(); const P = c.attributes.position; const N = c.attributes.normal;
  for (let i = 0; i < P.count; i++) P.setXYZ(i, P.getX(i) + N.getX(i) * d, P.getY(i) + N.getY(i) * d, P.getZ(i) + N.getZ(i) * d);
  return c;
}

/** Lame (pare-chocs, baguette) : une section arrondie de hauteur h et d'épaisseur d, promenée le long d'un tracé
    lissé qui reste à hauteur constante ; l'épaisseur est prise à l'horizontale, perpendiculairement au tracé. */
export function blade(points: P3[], h: number, d: number, mat: Material, samples = 64) {
  const c = new CatmullRomCurve3(points.map((p) => new Vector3(p[0], p[1], p[2])), false, 'centripetal');
  const prof: Pt[] = []; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; const cx = Math.cos(a); const cy = Math.sin(a); prof.push([Math.sign(cx) * Math.pow(Math.abs(cx), .5) * d / 2, Math.sign(cy) * Math.pow(Math.abs(cy), .5) * h / 2]); }
  const pos: number[] = []; const idx: number[] = []; const n = prof.length;
  for (let i = 0; i <= samples; i++) {
    const p = c.getPoint(i / samples); const t = c.getTangent(i / samples); const nx = t.z; const nz = -t.x; const l = Math.hypot(nx, nz) || 1;
    prof.forEach(([a, b]) => pos.push(p.x + nx / l * a, p.y + b, p.z + nz / l * a));
  }
  for (let i = 0; i < samples; i++) for (let j = 0; j < n; j++) { const a = i * n + j; const b = i * n + (j + 1) % n; idx.push(a, a + n, b, b, a + n, b + n); }
  for (const i of [0, samples]) for (let j = 1; j < n - 1; j++) idx.push(i * n, i * n + j, i * n + j + 1);
  const g = new BufferGeometry(); g.setAttribute('position', new Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
  const m = new Mesh(g, mat); (m.material as Material).side = 2; return m;
}

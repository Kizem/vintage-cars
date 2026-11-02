import { sideProfileSVG, type CarModelKey } from '../../scene/carspecs';

/** Profil vectoriel de la voiture, affiché quand WebGL n'est pas disponible. */
export function CarProfile({ model }: { model: CarModelKey }) {
  const p = sideProfileSVG(model);
  return (
    <svg className="em-profile" viewBox={p.viewBox} aria-hidden="true">
      <path d={p.body} fill="currentColor" />
      {p.wheels.map((w, i) => (
        <g key={i}>
          <circle cx={w[0]} cy={w[1]} r={w[2]} fill="#0b0d0c" />
          <circle cx={w[0]} cy={w[1]} r={w[2] * 0.6} fill="#c9cbc9" />
        </g>
      ))}
    </svg>
  );
}

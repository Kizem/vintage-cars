/**
 * A turntable seen in perspective: top face, edge, and a glint that travels round the rim.
 * Styled by the showroom (dark, in the hero) and by the enquiry form (light).
 */
export function Plinth({ className = 'showroom-plinth' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 74" fill="none" aria-hidden="true">
      <path d="M8 30 v14 a192 26 0 0 0 384 0 v-14" className="plinth-edge" />
      <ellipse cx="200" cy="30" rx="192" ry="26" className="plinth-top" />
      <ellipse cx="200" cy="30" rx="150" ry="19" className="plinth-ring" />
      <ellipse cx="200" cy="30" rx="192" ry="26" className="plinth-glint" pathLength={1000} />
    </svg>
  );
}

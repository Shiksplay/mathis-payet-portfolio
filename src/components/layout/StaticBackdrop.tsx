/**
 * Fallback statique de la scene 3D.
 *
 * Affiche quand WebGL est indisponible ou quand l'utilisateur a demande des
 * animations reduites. Reprend le motif du noyau reseau en SVG pur (quelques
 * centaines d'octets, aucun script, aucune animation) pour que la page garde
 * son identite visuelle meme sans canvas.
 */
export function StaticBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 grid-blueprint opacity-40" />
      <svg
        className="absolute top-1/2 left-1/2 h-[min(90vh,900px)] w-[min(90vw,900px)] -translate-x-1/2 -translate-y-1/2 opacity-55"
        viewBox="-100 -100 200 200"
        fill="none"
      >
        <defs>
          <radialGradient id="core-glow">
            <stop offset="0" stopColor="var(--color-accent)" stopOpacity="0.30" />
            <stop offset="0.55" stopColor="var(--color-iris)" stopOpacity="0.10" />
            <stop offset="1" stopColor="var(--color-iris)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="core-edge" x1="-80" y1="-80" x2="80" y2="80">
            <stop offset="0" stopColor="var(--color-accent)" stopOpacity="0.55" />
            <stop offset="1" stopColor="var(--color-iris)" stopOpacity="0.35" />
          </linearGradient>
        </defs>

        <circle r="95" fill="url(#core-glow)" />

        {/* Maillage : trois orbites inclinees + rayons, evoque le graphe reseau. */}
        <g stroke="url(#core-edge)" strokeWidth="0.5">
          <ellipse rx="78" ry="30" />
          <ellipse rx="78" ry="30" transform="rotate(60)" />
          <ellipse rx="78" ry="30" transform="rotate(120)" />
          <circle r="52" strokeOpacity="0.5" />
          <circle r="26" strokeOpacity="0.35" />
          <path d="M-78 0H78M0-78V78M-55-55L55 55M-55 55L55-55" strokeOpacity="0.2" />
        </g>

        {/* Noeuds */}
        <g fill="var(--color-accent)">
          <circle r="3.2" fillOpacity="0.9" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <circle
              key={angle}
              r="1.5"
              fillOpacity="0.7"
              transform={`rotate(${angle}) translate(52 0)`}
            />
          ))}
          {[20, 75, 130, 200, 255, 310].map((angle) => (
            <circle
              key={angle}
              r="1.1"
              fillOpacity="0.45"
              transform={`rotate(${angle}) translate(78 0)`}
            />
          ))}
          {[10, 100, 190, 280].map((angle) => (
            <circle
              key={angle}
              r="1.3"
              fillOpacity="0.55"
              transform={`rotate(${angle}) translate(26 0)`}
            />
          ))}
        </g>
      </svg>
    </div>
  )
}

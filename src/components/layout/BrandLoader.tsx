import { useCv } from '@/hooks/useCv'

/**
 * Loader affiche pendant le `Suspense` du chargement de la scene 3D.
 *
 * Volontairement de marque et non generique : monogramme, typographie
 * monospace et pastille cyan, dans la continuite du reste de la page. Il vit
 * derriere le contenu (z-0), donc le texte du hero est deja lisible pendant que
 * three.js se telecharge : le LCP n'attend jamais la 3D.
 */
export function BrandLoader() {
  const { t } = useCv()

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 grid-blueprint opacity-30" />

      <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-5">
        <svg viewBox="0 0 64 64" className="size-12 animate-breathe" aria-hidden="true">
          <defs>
            <linearGradient
              id="loader-mp"
              x1="8"
              y1="8"
              x2="56"
              y2="56"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="var(--color-accent)" />
              <stop offset="1" stopColor="var(--color-iris)" />
            </linearGradient>
          </defs>
          <g
            fill="none"
            stroke="url(#loader-mp)"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M13 45V20l9.5 13L32 20v25" />
            <path d="M41 45V20h7a8 8 0 0 1 0 16h-7" />
          </g>
        </svg>

        <p className="font-mono text-[11px] tracking-[0.25em] text-muted uppercase">
          {t.loader}
          <span className="ml-1 animate-caret text-accent">_</span>
        </p>
      </div>
    </div>
  )
}

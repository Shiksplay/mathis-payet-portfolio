import { useCallback, useRef, type PointerEvent, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { useAppStore } from '@/store/useAppStore'

interface TiltCardProps {
  children: ReactNode
  className?: string
  /** Amplitude d'inclinaison en degres. Reste volontairement faible. */
  maxTilt?: number
  /** Verre plus epais (refraction plus marquee). */
  thick?: boolean
}

/**
 * Carte en verre liquide, inclinable, avec reflet speculaire qui suit la souris.
 *
 * IMPLEMENTATION : la transformation et la position du reflet sont ecrites
 * directement dans le style de l'element (pas de state React), donc aucun
 * re-render pendant le mouvement.
 *
 * Le reflet est un ENFANT reel et non un pseudo-element : `.glass-panel::before`
 * porte deja le reflet diagonal fixe du verre, et `::after` le liseré de survol.
 * Les deux pseudo-elements sont pris.
 *
 * Inclinaison desactivee si `prefers-reduced-motion` ou sur pointeur tactile —
 * un tilt qui se declenche au toucher est desagreable et gene la lecture.
 */
export function TiltCard({ children, className, maxTilt = 4, thick = false }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useAppStore((s) => s.reducedMotion)

  const onPointerMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      const el = ref.current
      if (!el || reducedMotion || e.pointerType !== 'mouse') return

      const rect = el.getBoundingClientRect()
      // Coordonnees normalisees dans [-0.5, 0.5] par rapport au centre.
      const px = (e.clientX - rect.left) / rect.width - 0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5

      el.style.transform = `perspective(1000px) rotateX(${(-py * maxTilt).toFixed(2)}deg) rotateY(${(px * maxTilt).toFixed(2)}deg) translateZ(0)`
      // Position du reflet, consommee par la couche speculaire ci-dessous.
      el.style.setProperty('--mx', `${((px + 0.5) * 100).toFixed(1)}%`)
      el.style.setProperty('--my', `${((py + 0.5) * 100).toFixed(1)}%`)
      el.style.setProperty('--glare', '1')
    },
    [maxTilt, reducedMotion],
  )

  const reset = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = ''
    el.style.setProperty('--glare', '0')
  }, [])

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      className={cn('glass-panel will-change-transform', thick && 'glass-panel--thick', className)}
    >
      {/* Reflet speculaire mobile : c'est le mouvement de cette tache lumineuse
          qui donne la sensation de verre LIQUIDE, la refraction SVG etant
          statique. Compose sur le GPU, aucun recalcul de filtre. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(420px_circle_at_var(--mx,50%)_var(--my,0%),color-mix(in_oklab,var(--color-accent)_13%,transparent),transparent_68%)] opacity-[var(--glare,0)] transition-opacity duration-500"
      />
      {/* `flex flex-1 flex-col` : sans ca, une carte declaree `flex flex-col`
          par son appelant verrait sa chaine flex coupee par ce conteneur, et
          les `flex-1` / alignements en bas de ses enfants seraient ignores. */}
      <div className="relative flex flex-1 flex-col">{children}</div>
    </div>
  )
}

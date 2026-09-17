import { useCallback, useRef, type PointerEvent, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { useAppStore } from '@/store/useAppStore'

interface TiltCardProps {
  children: ReactNode
  className?: string
  /** Amplitude d'inclinaison en degres. Reste volontairement faible. */
  maxTilt?: number
}

/**
 * Carte avec inclinaison 3D legere suivant la souris.
 *
 * IMPLEMENTATION : la transformation est ecrite directement dans le style de
 * l'element (pas de state React), donc aucun re-render pendant le mouvement.
 * Un halo suit le curseur via deux variables CSS (--mx / --my).
 *
 * Desactivee si `prefers-reduced-motion` ou sur pointeur tactile — un tilt qui
 * se declenche au toucher est desagreable et peut gener la lecture.
 */
export function TiltCard({ children, className, maxTilt = 4 }: TiltCardProps) {
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
      el.style.setProperty('--mx', `${((px + 0.5) * 100).toFixed(1)}%`)
      el.style.setProperty('--my', `${((py + 0.5) * 100).toFixed(1)}%`)
    },
    [maxTilt, reducedMotion],
  )

  const reset = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = ''
    el.style.removeProperty('--mx')
    el.style.removeProperty('--my')
  }, [])

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      className={cn(
        'glass-panel group/tilt will-change-transform',
        // Halo doux qui suit le curseur, uniquement quand --mx est defini.
        'before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit]',
        'before:bg-[radial-gradient(420px_circle_at_var(--mx,50%)_var(--my,0%),color-mix(in_oklab,var(--color-accent)_9%,transparent),transparent_70%)]',
        'before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100',
        className,
      )}
    >
      {children}
    </div>
  )
}

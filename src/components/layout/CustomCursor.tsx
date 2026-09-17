import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '@/store/useAppStore'

/** Selecteur des elements consideres comme interactifs. */
const INTERACTIVE = 'a, button, [role="button"], input, select, textarea, [data-cursor]'

/**
 * Curseur personnalise : un point qui suit la souris au pixel pres, double d'un
 * anneau qui le rattrape avec un leger retard et s'ouvre au survol des elements
 * interactifs.
 *
 * POURQUOI UN POINT + UN ANNEAU : masquer le curseur systeme au profit d'un
 * seul anneau "mou" degrade la precision du pointage. Le point suit donc la
 * position reelle sans amortissement (precision preservee), l'anneau ne porte
 * que la personnalite.
 *
 * Ne s'active que sur pointeur fin et si les animations ne sont pas reduites ;
 * dans tous les autres cas le curseur systeme reste celui du navigateur.
 */
export function CustomCursor() {
  const reducedMotion = useAppStore((s) => s.reducedMotion)
  const [enabled, setEnabled] = useState(false)
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const hoveringRef = useRef(false)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    setEnabled(fine && !reducedMotion)
  }, [reducedMotion])

  useEffect(() => {
    if (!enabled) return

    // On masque le curseur natif seulement quand le remplacement est actif.
    document.documentElement.style.cursor = 'none'

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const ring = { x: target.x, y: target.y }
    let raf = 0

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX
      target.y = e.clientY
      // Le point est positionne immediatement : aucun retard de pointage.
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`
      }
    }

    const onOver = (e: PointerEvent) => {
      const hovering = (e.target as Element | null)?.closest?.(INTERACTIVE) != null
      if (hovering === hoveringRef.current) return
      hoveringRef.current = hovering
      ringRef.current?.setAttribute('data-hover', String(hovering))
    }

    // Boucle d'amortissement de l'anneau (lerp exponentiel).
    const loop = () => {
      ring.x += (target.x - ring.x) * 0.18
      ring.y += (target.y - ring.y) * 0.18
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x.toFixed(2)}px, ${ring.y.toFixed(2)}px, 0) translate(-50%, -50%)`
      }
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    raf = requestAnimationFrame(loop)

    return () => {
      document.documentElement.style.cursor = ''
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      cancelAnimationFrame(raf)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-100">
      <div
        ref={ringRef}
        data-hover="false"
        className="absolute top-0 left-0 size-8 rounded-full border border-accent/50 transition-[width,height,background-color,border-color] duration-250 data-[hover=true]:size-12 data-[hover=true]:border-accent data-[hover=true]:bg-accent/10"
      />
      <div ref={dotRef} className="absolute top-0 left-0 size-1 rounded-full bg-accent" />
    </div>
  )
}

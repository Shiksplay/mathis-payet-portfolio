import { useEffect } from 'react'
import { pointerSignal, scrollSignal } from '@/lib/signals'

/**
 * Suit la progression du scroll et la position du pointeur SANS provoquer de
 * re-render React :
 *  - la valeur est ecrite dans `scrollSignal` / `pointerSignal`, lus par la
 *    scene 3D dans `useFrame` ;
 *  - la barre de progression est pilotee par la variable CSS
 *    `--scroll-progress` posee sur <html>, donc en pur CSS (transform: scaleX).
 *
 * Les deux listeners sont passifs et coalesces via requestAnimationFrame.
 */
export function useTrackers(): void {
  useEffect(() => {
    const root = document.documentElement
    let frame = 0

    const readScroll = () => {
      frame = 0
      const max = root.scrollHeight - window.innerHeight
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      scrollSignal.progress = progress
      root.style.setProperty('--scroll-progress', progress.toFixed(4))
    }

    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(readScroll)
    }

    readScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      if (frame !== 0) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  useEffect(() => {
    // Le parallax souris n'a pas de sens sur pointeur tactile : on n'installe
    // meme pas le listener.
    if (window.matchMedia('(pointer: coarse)').matches) return

    const onPointerMove = (e: PointerEvent) => {
      pointerSignal.x = (e.clientX / window.innerWidth) * 2 - 1
      pointerSignal.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }

    const onPointerLeave = () => {
      pointerSignal.x = 0
      pointerSignal.y = 0
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('pointerleave', onPointerLeave)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [])
}

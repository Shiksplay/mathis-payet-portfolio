import { useEffect } from 'react'
import { SECTION_IDS } from '@/data/sections'
import { pointerSignal, scrollSignal } from '@/lib/signals'

/**
 * Suit la progression du scroll et la position du pointeur SANS provoquer de
 * re-render React :
 *  - les valeurs sont ecrites dans `scrollSignal` / `pointerSignal`, lus par la
 *    scene 3D dans `useFrame` ;
 *  - la barre de progression est pilotee par la variable CSS
 *    `--scroll-progress` posee sur <html>, donc en pur CSS (transform: scaleX).
 *
 * Les listeners sont passifs et coalesces via requestAnimationFrame.
 */
export function useTrackers(): void {
  useEffect(() => {
    const root = document.documentElement
    let frame = 0

    /**
     * Centre vertical absolu de chaque section, mesure une fois puis re-mesure
     * a chaque changement de taille du document (resize, switch de langue,
     * ouverture du menu mobile...).
     */
    let centers: number[] = []

    const measure = () => {
      centers = SECTION_IDS.map((id) => {
        const el = document.getElementById(id)
        if (!el) return 0
        const rect = el.getBoundingClientRect()
        return rect.top + window.scrollY + rect.height / 2
      })
    }

    /**
     * Convertit la position de scroll en position continue sur le rail de
     * camera. On compare le CENTRE DU VIEWPORT aux centres des sections : la
     * camera atteint exactement la keyframe d'une section quand cette section
     * est centree a l'ecran.
     */
    const computeTrack = (): number => {
      const last = centers.length - 1
      if (last < 0) return 0

      const viewCenter = window.scrollY + window.innerHeight / 2
      const first = centers[0] ?? 0
      if (viewCenter <= first) return 0
      const lastCenter = centers[last] ?? 0
      if (viewCenter >= lastCenter) return last

      for (let i = 0; i < last; i += 1) {
        const a = centers[i] ?? 0
        const b = centers[i + 1] ?? 0
        if (viewCenter < b) {
          const span = b - a
          return span > 0 ? i + (viewCenter - a) / span : i
        }
      }
      return last
    }

    const read = () => {
      frame = 0
      const max = root.scrollHeight - window.innerHeight
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0

      scrollSignal.progress = progress
      scrollSignal.track = computeTrack()
      root.style.setProperty('--scroll-progress', progress.toFixed(4))
    }

    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(read)
    }

    const onResize = () => {
      measure()
      onScroll()
    }

    measure()
    read()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)

    // Les polices web et le switch de langue modifient la hauteur des sections :
    // un ResizeObserver sur <body> garde les mesures justes sans polling.
    const observer = new ResizeObserver(onResize)
    observer.observe(document.body)

    return () => {
      if (frame !== 0) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      observer.disconnect()
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

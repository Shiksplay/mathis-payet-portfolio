import { useEffect } from 'react'
import { SECTION_IDS } from '@/data/sections'
import { useAppStore } from '@/store/useAppStore'

/**
 * Scrollspy base sur IntersectionObserver.
 *
 * On observe toutes les sections avec une bande de detection centree sur le
 * viewport (`rootMargin` negatif en haut et en bas) : la section "active" est
 * celle qui occupe le milieu de l'ecran, ce qui donne un indicateur de nav
 * beaucoup plus stable qu'un simple calcul d'offset au scroll.
 */
export function useScrollSpy(): void {
  const setActiveSection = useAppStore((s) => s.setActiveSection)

  useEffect(() => {
    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    )
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // On retient l'entree la plus visible parmi celles qui intersectent.
        let best: IntersectionObserverEntry | null = null
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          if (best === null || entry.intersectionRatio > best.intersectionRatio) {
            best = entry
          }
        }
        if (best) setActiveSection(best.target.id)
      },
      {
        rootMargin: '-45% 0px -45% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    )

    for (const el of elements) observer.observe(el)
    return () => observer.disconnect()
  }, [setActiveSection])
}

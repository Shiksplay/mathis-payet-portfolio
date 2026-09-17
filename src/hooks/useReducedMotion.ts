import { useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'

/**
 * Synchronise `prefers-reduced-motion` avec le store, et reagit si l'utilisateur
 * change son reglage systeme en cours de visite (pas seulement au chargement).
 * A monter une seule fois, au niveau de <App />.
 */
export function useReducedMotionSync(): void {
  const setReducedMotion = useAppStore((s) => s.setReducedMotion)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)

    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [setReducedMotion])
}

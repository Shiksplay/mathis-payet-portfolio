import { useEffect } from 'react'
import { useAppStore, type Tier } from '@/store/useAppStore'

/**
 * Feature-detection WebGL : on cree un contexte jetable. Si le navigateur ne
 * peut pas en fournir (pilote bloque, WebGL desactive, machine sans GPU), on
 * bascule sur le fallback statique plutot que d'afficher un canvas noir.
 */
function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl2') ??
      canvas.getContext('webgl') ??
      canvas.getContext('experimental-webgl')
    if (!gl) return false
    // Libere immediatement le contexte : certains navigateurs plafonnent le
    // nombre de contextes WebGL simultanes.
    if (gl instanceof WebGLRenderingContext || gl instanceof WebGL2RenderingContext) {
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
    return true
  } catch {
    return false
  }
}

interface NavigatorWithHints extends Navigator {
  deviceMemory?: number
}

/**
 * Classe l'appareil en 'high' / 'low' / 'none'.
 *
 * Heuristique volontairement conservatrice : au moindre doute on descend en
 * 'low'. Mieux vaut une scene un peu moins dense et 60 fps qu'une scene riche
 * a 20 fps sur le telephone d'un recruteur.
 */
function detectTier(reducedMotion: boolean): Tier {
  if (reducedMotion) return 'none'
  if (!hasWebGL()) return 'none'

  const nav = navigator as NavigatorWithHints
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches
  const narrow = window.matchMedia('(max-width: 768px)').matches
  const cores = nav.hardwareConcurrency ?? 4
  const memory = nav.deviceMemory ?? 8

  if (coarsePointer || narrow) return 'low'
  if (cores <= 4 || memory <= 4) return 'low'
  return 'high'
}

/**
 * Determine le tier au montage et le reevalue si les preferences d'animation
 * changent. A monter une seule fois, au niveau de <App />.
 */
export function useDeviceTierSync(): void {
  const reducedMotion = useAppStore((s) => s.reducedMotion)
  const setTier = useAppStore((s) => s.setTier)

  useEffect(() => {
    setTier(detectTier(reducedMotion))
  }, [reducedMotion, setTier])
}

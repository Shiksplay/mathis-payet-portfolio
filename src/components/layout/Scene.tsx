import { lazy, Suspense } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { BrandLoader } from './BrandLoader'
import { StaticBackdrop } from './StaticBackdrop'

/**
 * Chargement paresseux de la scene 3D.
 *
 * L'import est dynamique : three.js, drei et la chaine de post-processing
 * partent dans un chunk separe, telecharge apres le premier rendu HTML. Le
 * texte du CV est donc peint (et le LCP mesure) sans attendre la 3D.
 */
const SceneCanvas = lazy(() => import('@/three/SceneCanvas'))

/**
 * Aiguillage arriere-plan :
 *  - tier 'none' (pas de WebGL, ou animations reduites) -> fallback SVG
 *    statique, et le chunk three.js n'est JAMAIS telecharge ;
 *  - tier 'low' / 'high' -> canvas 3D, avec loader de marque pendant le
 *    Suspense.
 */
export function Scene() {
  const tier = useAppStore((s) => s.tier)

  if (tier === 'none') return <StaticBackdrop />

  return (
    <Suspense fallback={<BrandLoader />}>
      <SceneCanvas tier={tier} />
    </Suspense>
  )
}

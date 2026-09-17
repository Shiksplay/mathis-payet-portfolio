import { Bloom, ChromaticAberration, EffectComposer, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { useMemo } from 'react'
import { Vector2 } from 'three'

/**
 * POST-PROCESSING
 * ===============
 *
 * Monte uniquement en tier 'high' (voir `SceneCanvas`). Sur mobile, la chaine
 * entiere est retiree : trois passes plein ecran supplementaires sont ce qui
 * coute le plus cher sur un GPU integre, pour un gain visuel faible sur un
 * petit ecran.
 *
 * Reglages volontairement discrets — l'objectif est de faire "rayonner" le
 * noyau, pas de noyer la page dans le halo :
 *
 *  - BLOOM : c'est lui qui transforme des points en sources lumineuses. Le
 *    seuil bas (0.12) capte aussi les aretes faibles, `mipmapBlur` donne un
 *    halo large pour un cout tres inferieur a un flou gaussien classique.
 *
 *  - ABERRATION CHROMATIQUE : 0.0006 en decalage, soit moins d'un pixel au
 *    centre. `radialModulation` la concentre sur les bords de l'ecran, comme
 *    une vraie optique — le texte au centre reste parfaitement net.
 *
 *  - VIGNETTE : assombrit les coins et ramene l'attention vers le centre, la
 *    ou vit le contenu.
 */
export function Effects() {
  // Vector2 stable : le recreer a chaque render relancerait la passe.
  const chromaticOffset = useMemo(() => new Vector2(0.0006, 0.0004), [])

  return (
    <EffectComposer multisampling={2}>
      <Bloom
        intensity={0.85}
        luminanceThreshold={0.12}
        luminanceSmoothing={0.35}
        mipmapBlur
        radius={0.72}
      />
      <ChromaticAberration
        offset={chromaticOffset}
        radialModulation
        modulationOffset={0.45}
        blendFunction={BlendFunction.NORMAL}
      />
      <Vignette offset={0.3} darkness={0.72} eskil={false} blendFunction={BlendFunction.NORMAL} />
    </EffectComposer>
  )
}

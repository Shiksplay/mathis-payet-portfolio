import { AdaptiveDpr } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { INITIAL_KEYFRAME } from '@/lib/cameraKeyframes'
import { Effects } from './Effects'
import { FlowParticles } from './FlowParticles'
import { GradientField } from './GradientField'
import { NetworkCore } from './NetworkCore'
import { PointerParallax } from './PointerParallax'
import { ScrollCamera } from './ScrollCamera'

interface SceneCanvasProps {
  /** 'none' n'arrive jamais ici : App monte alors le fallback statique. */
  tier: 'high' | 'low'
}

/**
 * RACINE DE LA SCENE 3D
 * =====================
 *
 * Canvas plein ecran, `position: fixed`, DERRIERE tout le contenu et sur toute
 * la longueur de la page (il ne defile pas : c'est la camera qui bouge).
 *
 * `pointerEvents: 'none'` a deux roles :
 *   - le contenu HTML au-dessus reste entierement cliquable et selectionnable ;
 *   - R3F ne recevant jamais d'evenement pointeur, aucun raycast n'est jamais
 *     effectue. C'est pourquoi `AdaptiveEvents` de drei est inutile ici et n'est
 *     pas monte : il degrade la reactivite des evenements, or il n'y en a pas.
 *
 * Ce module est charge en `React.lazy` depuis <App /> : three.js (~600 kB) ne
 * part sur le reseau qu'apres le premier rendu HTML, et pas du tout si l'appareil
 * est classe 'none'.
 */
export default function SceneCanvas({ tier }: SceneCanvasProps) {
  const isHigh = tier === 'high'

  return (
    <Canvas
      // Retire le canvas de l'arbre d'accessibilite : c'est un decor.
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
      // Plafond de resolution. AdaptiveDpr descend dans cette plage si le
      // framerate chute ; le plancher a 1 evite une bouillie de pixels.
      dpr={isHigh ? [1, 2] : [1, 1.5]}
      gl={{
        // En tier 'high' l'anticrenelage est assure par le composer
        // (multisampling), inutile de le payer deux fois.
        antialias: !isHigh,
        alpha: true,
        powerPreference: 'high-performance',
        // Le bloom a besoin de valeurs > 1 : on garde donc le framebuffer en
        // espace lineaire et on laisse three gerer la conversion finale.
        preserveDrawingBuffer: false,
      }}
      camera={{
        position: [...INITIAL_KEYFRAME.position],
        fov: INITIAL_KEYFRAME.fov,
        near: 0.1,
        far: 60,
      }}
      // Seuil sous lequel AdaptiveDpr est autorise a reduire la resolution.
      performance={{ min: 0.5 }}
    >
      {/* Baisse le DPR quand le framerate chute, le remonte ensuite. */}
      <AdaptiveDpr pixelated={false} />

      <ScrollCamera />

      {/* Fond de degrade fluide : dessine en premier, en espace ecran, il
          couvre toujours le viewport quelle que soit la camera. */}
      <GradientField intensity={isHigh ? 1 : 0.85} />

      <PointerParallax enabled={isHigh}>
        {/* Nuee en ecoulement autour du noyau : porte la sensation de fluide.
            Coupee sur mobile — c'est l'effet le plus couteux en fill rate
            pour le moins d'information apportee. */}
        {isHigh ? <FlowParticles count={900} radius={4.4} /> : null}

        <NetworkCore
          // Mobile / low-end : densite divisee par trois.
          nodeCount={isHigh ? 420 : 140}
          packetCount={isHigh ? 260 : 70}
          intensity={isHigh ? 1 : 0.85}
        />
      </PointerParallax>

      {isHigh ? <Effects /> : null}
    </Canvas>
  )
}

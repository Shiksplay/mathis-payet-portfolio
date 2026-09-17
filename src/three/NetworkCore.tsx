import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { AdditiveBlending, Color, type Group, type ShaderMaterial } from 'three'
import { createNetworkGraph } from './networkGraph'
import { edgesFragmentShader, edgesVertexShader } from './shaders/edges'
import { nodesFragmentShader, nodesVertexShader } from './shaders/nodes'

/** Couleurs de la palette (miroir des tokens --color-accent / --color-iris). */
const ACCENT = new Color('#00e5ff')
const IRIS = new Color('#7c5cfc')

interface NetworkCoreProps {
  /** Densite du noyau. 420 en tier 'high', 140 en tier 'low'. */
  nodeCount: number
  /** Opacite globale, abaissee sur mobile ou le noyau occupe plus d'ecran. */
  intensity?: number
}

/**
 * LE NOYAU RESEAU
 * ===============
 *
 * Deux objets, donc deux draw calls pour toute la scene :
 *   1. <points>       — les noeuds
 *   2. <lineSegments> — le maillage
 *
 * Les deux partagent le meme groupe parent, qui tourne lentement sur lui-meme.
 * La rotation est appliquee au GROUPE (une matrice) et non aux sommets : elle
 * ne coute rien, quel que soit le nombre de points.
 *
 * MELANGE ADDITIF : `depthWrite` est desactive et le blending est additif, ce
 * qui donne l'accumulation lumineuse voulue la ou les elements se superposent.
 * Le revers est qu'il n'y a plus d'occlusion entre noeuds — sans importance
 * ici, puisqu'on cherche justement un rendu de "lumiere" et non de solide.
 */
export function NetworkCore({ nodeCount, intensity = 1 }: NetworkCoreProps) {
  const groupRef = useRef<Group>(null)
  const nodeMatRef = useRef<ShaderMaterial>(null)
  const edgeMatRef = useRef<ShaderMaterial>(null)

  // Le graphe est genere une seule fois par valeur de nodeCount.
  const graph = useMemo(() => createNetworkGraph({ nodeCount }), [nodeCount])

  // Les uniforms sont crees une fois puis mutes en place dans useFrame.
  // Recreer cet objet a chaque render forcerait three a recompiler le shader.
  const nodeUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 95 },
      uMaxSize: { value: 26 },
      uPixelRatio: { value: 1 },
      uColorA: { value: ACCENT },
      uColorB: { value: IRIS },
      uOpacity: { value: 0.95 * intensity },
    }),
    [intensity],
  )

  const edgeUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: ACCENT },
      uColorB: { value: IRIS },
      uOpacity: { value: 0.16 * intensity },
      // Bornes de l'estompage en profondeur, en unites monde.
      uFadeNear: { value: 2.0 },
      uFadeFar: { value: 9.5 },
    }),
    [intensity],
  )

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime

    // Un seul float envoye au GPU par materiau et par frame.
    if (nodeMatRef.current) {
      nodeUniforms.uTime.value = t
      // AdaptiveDpr fait varier le DPR en cours de route : on resynchronise la
      // taille des points pour qu'ils gardent la meme taille apparente.
      nodeUniforms.uPixelRatio.value = state.gl.getPixelRatio()
    }
    if (edgeMatRef.current) {
      edgeUniforms.uTime.value = t
    }

    // Rotation lente et continue. `delta` est utilise plutot que `elapsedTime`
    // pour rester independant du framerate.
    const group = groupRef.current
    if (group) {
      group.rotation.y += delta * 0.045
      // Leger balancement sur X : casse la symetrie parfaite de la rotation Y
      // et evite l'impression de "globe qui tourne sur un axe".
      group.rotation.x = Math.sin(t * 0.13) * 0.09
    }
  })

  return (
    <group ref={groupRef}>
      {/* ---------- Noeuds ---------- */}
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[graph.positions, 3]} />
          <bufferAttribute attach="attributes-aSeed" args={[graph.seeds, 1]} />
          <bufferAttribute attach="attributes-aScale" args={[graph.scales, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={nodeMatRef}
          vertexShader={nodesVertexShader}
          fragmentShader={nodesFragmentShader}
          uniforms={nodeUniforms}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </points>

      {/* ---------- Maillage ---------- */}
      <lineSegments frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[graph.linePositions, 3]} />
          <bufferAttribute attach="attributes-aSeed" args={[graph.lineSeeds, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={edgeMatRef}
          vertexShader={edgesVertexShader}
          fragmentShader={edgesFragmentShader}
          uniforms={edgeUniforms}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </lineSegments>
    </group>
  )
}

import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { AdditiveBlending, type Group, NormalBlending, type ShaderMaterial } from 'three'
import { useAppStore } from '@/store/useAppStore'
import { DataPackets } from './DataPackets'
import { createNetworkGraph } from './networkGraph'
import { SCENE_PALETTE } from './palette'
import { edgesFragmentShader, edgesVertexShader } from './shaders/edges'
import { nodesFragmentShader, nodesVertexShader } from './shaders/nodes'
import { setColorUniform, setUniform } from './uniforms'

interface NetworkCoreProps {
  /** Densite du noyau. 420 en tier 'high', 140 en tier 'low'. */
  nodeCount: number
  /** Nombre de paquets circulant sur les aretes. */
  packetCount: number
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
 *
 * En theme clair, l'additif est remplace par un melange normal et des couleurs
 * sombres : sur un fond proche du blanc, ajouter de la lumiere ne produit plus
 * rien de visible (voir `palette.ts`).
 */
export function NetworkCore({ nodeCount, packetCount, intensity = 1 }: NetworkCoreProps) {
  const groupRef = useRef<Group>(null)
  const nodeMatRef = useRef<ShaderMaterial>(null)
  const edgeMatRef = useRef<ShaderMaterial>(null)
  const theme = useAppStore((s) => s.theme)
  const blending = SCENE_PALETTE[theme].additive ? AdditiveBlending : NormalBlending

  // Le graphe est genere une seule fois par valeur de nodeCount.
  const graph = useMemo(() => createNetworkGraph({ nodeCount }), [nodeCount])

  // Les uniforms sont crees une fois puis mutes en place a travers le materiau
  // (useFrame pour le temps, l'effet ci-dessous pour la palette). Recreer cet
  // objet a chaque render forcerait three a recompiler le shader.
  const nodeUniforms = useMemo(() => {
    // Lecture NON REACTIVE du store : seule la valeur au montage sert a
    // initialiser les uniforms. Le suivi du theme est la responsabilite de
    // l'effet ci-dessous, qui ecrit dans les materiaux.
    const { core, opacity } = SCENE_PALETTE[useAppStore.getState().theme]
    return {
      uTime: { value: 0 },
      uSize: { value: 95 },
      uMaxSize: { value: 26 },
      uPixelRatio: { value: 1 },
      uColorA: { value: core.accent.clone() },
      uColorB: { value: core.iris.clone() },
      uOpacity: { value: opacity.node * intensity },
    }
  }, [intensity])

  const edgeUniforms = useMemo(() => {
    const { core, opacity } = SCENE_PALETTE[useAppStore.getState().theme]
    return {
      uTime: { value: 0 },
      uColorA: { value: core.accent.clone() },
      uColorB: { value: core.iris.clone() },
      uOpacity: { value: opacity.edge * intensity },
      // Bornes de l'estompage en profondeur, en unites monde.
      uFadeNear: { value: 2.0 },
      uFadeFar: { value: 9.5 },
    }
  }, [intensity])

  // Bascule de theme : la palette part aux deux materiaux.
  useEffect(() => {
    const { core, opacity } = SCENE_PALETTE[theme]
    for (const mat of [nodeMatRef.current, edgeMatRef.current]) {
      setColorUniform(mat, 'uColorA', core.accent)
      setColorUniform(mat, 'uColorB', core.iris)
    }
    setUniform(nodeMatRef.current, 'uOpacity', opacity.node * intensity)
    setUniform(edgeMatRef.current, 'uOpacity', opacity.edge * intensity)
  }, [theme, intensity])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime

    // Les uniforms sont mutes A TRAVERS LE MATERIAU (et non via l'objet
    // memoise) : c'est le canal normal entre le CPU et le GPU dans three.js, et
    // cela evite de toucher une valeur que React considere comme figee.
    // Un seul float part au GPU par materiau et par frame.
    setUniform(nodeMatRef.current, 'uTime', t)
    // AdaptiveDpr fait varier le DPR en cours de route : on resynchronise la
    // taille des points pour qu'ils gardent la meme taille apparente.
    setUniform(nodeMatRef.current, 'uPixelRatio', state.gl.getPixelRatio())
    setUniform(edgeMatRef.current, 'uTime', t)

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
          blending={blending}
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
          blending={blending}
        />
      </lineSegments>

      {/* ---------- Trafic ----------
          Place DANS le groupe : les paquets tournent avec le noyau, donc ils
          restent solidaires des aretes qu'ils parcourent. */}
      <DataPackets graph={graph} count={packetCount} intensity={intensity} />
    </group>
  )
}

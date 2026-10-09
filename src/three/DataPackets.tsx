import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { AdditiveBlending, NormalBlending, type ShaderMaterial } from 'three'
import { useAppStore } from '@/store/useAppStore'
import { createPackets, type NetworkGraph } from './networkGraph'
import { SCENE_PALETTE } from './palette'
import { packetsFragmentShader, packetsVertexShader } from './shaders/packets'
import { setColorUniform, setUniform } from './uniforms'

interface DataPacketsProps {
  graph: NetworkGraph
  /** Nombre de paquets en circulation. */
  count: number
  intensity?: number
}

/**
 * Trafic circulant sur le maillage : un troisieme et dernier draw call.
 *
 * Les paquets sont generes une seule fois a partir des aretes du graphe, puis
 * animes entierement dans le vertex shader (voir `shaders/packets.ts`).
 */
export function DataPackets({ graph, count, intensity = 1 }: DataPacketsProps) {
  const matRef = useRef<ShaderMaterial>(null)
  const theme = useAppStore((s) => s.theme)
  const palette = SCENE_PALETTE[theme]

  const packets = useMemo(() => createPackets(graph, count), [graph, count])

  const uniforms = useMemo(() => {
    // Lecture NON REACTIVE du store : voir GradientField.
    const { core, opacity } = SCENE_PALETTE[useAppStore.getState().theme]
    return {
      uTime: { value: 0 },
      uSize: { value: 150 },
      uMaxSize: { value: 30 },
      uPixelRatio: { value: 1 },
      uColorCore: { value: core.packetCore.clone() },
      uColorEdge: { value: core.packetEdge.clone() },
      uOpacity: { value: opacity.packet * intensity },
    }
  }, [intensity])

  // Bascule de theme : ecriture dans le materiau, pas dans l'objet memoise.
  useEffect(() => {
    const { core, opacity } = SCENE_PALETTE[theme]
    setColorUniform(matRef.current, 'uColorCore', core.packetCore)
    setColorUniform(matRef.current, 'uColorEdge', core.packetEdge)
    setUniform(matRef.current, 'uOpacity', opacity.packet * intensity)
  }, [theme, intensity])

  useFrame((state) => {
    const mat = matRef.current
    if (!mat) return
    const uTime = mat.uniforms.uTime
    if (uTime) uTime.value = state.clock.elapsedTime
    const uPixelRatio = mat.uniforms.uPixelRatio
    if (uPixelRatio) uPixelRatio.value = state.gl.getPixelRatio()
  })

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        {/* `position` = point de depart du paquet. */}
        <bufferAttribute attach="attributes-position" args={[packets.starts, 3]} />
        <bufferAttribute attach="attributes-aEnd" args={[packets.ends, 3]} />
        <bufferAttribute attach="attributes-aOffset" args={[packets.offsets, 1]} />
        <bufferAttribute attach="attributes-aSpeed" args={[packets.speeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={packetsVertexShader}
        fragmentShader={packetsFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={palette.additive ? AdditiveBlending : NormalBlending}
      />
    </points>
  )
}

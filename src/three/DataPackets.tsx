import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { AdditiveBlending, Color, type ShaderMaterial } from 'three'
import { createPackets, type NetworkGraph } from './networkGraph'
import { packetsFragmentShader, packetsVertexShader } from './shaders/packets'

const CORE = new Color('#eafcff') // coeur presque blanc
const EDGE = new Color('#00e5ff') // halo cyan

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

  const packets = useMemo(() => createPackets(graph, count), [graph, count])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 150 },
      uMaxSize: { value: 30 },
      uPixelRatio: { value: 1 },
      uColorCore: { value: CORE },
      uColorEdge: { value: EDGE },
      uOpacity: { value: intensity },
    }),
    [intensity],
  )

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
        blending={AdditiveBlending}
      />
    </points>
  )
}

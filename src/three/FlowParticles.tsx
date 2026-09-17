import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { AdditiveBlending, Color, type ShaderMaterial } from 'three'
import { flowFragmentShader, flowVertexShader } from './shaders/flow'

const FLOW_COLOR = new Color('#7fd6ff') // cyan desature : ambiance, pas accent

interface FlowParticlesProps {
  count: number
  /** Rayon du nuage. Deborde volontairement du noyau reseau. */
  radius?: number
  intensity?: number
}

/** PRNG graine : le nuage a la meme forme a chaque chargement. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Nuee de particules en ecoulement autour du noyau.
 *
 * Distribution en COQUILLE EPAISSE plutot qu'en sphere pleine : le centre est
 * deja occupe par le noyau reseau, y empiler des particules ne ferait que
 * saturer le bloom sans rien ajouter de lisible.
 */
export function FlowParticles({ count, radius = 4.2, intensity = 1 }: FlowParticlesProps) {
  const matRef = useRef<ShaderMaterial>(null)

  const geometry = useMemo(() => {
    const rand = mulberry32(4242)
    const positions = new Float32Array(count * 3)
    const seeds = new Float32Array(count)
    const scales = new Float32Array(count)

    for (let i = 0; i < count; i += 1) {
      // Direction uniforme sur la sphere (methode de Marsaglia) : eviter de
      // tirer theta et phi au sort, qui entasse les points aux poles.
      const u = rand() * 2 - 1
      const theta = rand() * Math.PI * 2
      const ringRadius = Math.sqrt(Math.max(0, 1 - u * u))

      // Coquille epaisse : rayon entre 55 % et 100 % du rayon nominal.
      const r = radius * (0.55 + rand() * 0.45)

      positions[i * 3] = Math.cos(theta) * ringRadius * r
      // Nuee aplatie sur Y (x0.55) : evoque un disque en rotation, ce qui rend
      // le cisaillement bien plus lisible qu'une sphere parfaite.
      positions[i * 3 + 1] = u * r * 0.55
      positions[i * 3 + 2] = Math.sin(theta) * ringRadius * r

      seeds[i] = rand()
      scales[i] = 0.35 + rand() * 0.65
    }

    return { positions, seeds, scales }
  }, [count, radius])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 42 },
      uMaxSize: { value: 9 },
      uPixelRatio: { value: 1 },
      uSwirl: { value: 1 },
      uColor: { value: FLOW_COLOR },
      uOpacity: { value: 0.5 * intensity },
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
        <bufferAttribute attach="attributes-position" args={[geometry.positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[geometry.seeds, 1]} />
        <bufferAttribute attach="attributes-aScale" args={[geometry.scales, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={flowVertexShader}
        fragmentShader={flowFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  )
}

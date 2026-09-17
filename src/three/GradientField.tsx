import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { Color, type ShaderMaterial } from 'three'
import { pointerSignal } from '@/lib/signals'
import { gradientFieldFragmentShader, gradientFieldVertexShader } from './shaders/gradientField'

/** Palette (miroir des tokens CSS). */
const ABYSS = new Color('#05070a')
const DEEP = new Color('#0b1220')
const ACCENT = new Color('#00e5ff')
const IRIS = new Color('#7c5cfc')

interface GradientFieldProps {
  /** Attenue le fond sur mobile, ou il occupe proportionnellement plus d'ecran. */
  intensity?: number
}

/**
 * Fond de degrade fluide, dessine derriere toute la scene.
 *
 * Le plan est un simple 2x2 dont le vertex shader ecrit directement en clip
 * space : il couvre donc tout le viewport en permanence, independamment de la
 * camera pilotee par le scroll.
 *
 * `depthTest` et `depthWrite` sont desactives et `renderOrder` est negatif :
 * le quad est dessine en premier et n'interfere jamais avec le noyau reseau
 * qui passe par-dessus en melange additif.
 */
export function GradientField({ intensity = 1 }: GradientFieldProps) {
  const matRef = useRef<ShaderMaterial>(null)
  const { size } = useThree()

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: [0, 0] as [number, number] },
      uAspect: { value: 1 },
      uIntensity: { value: intensity },
      uAbyss: { value: ABYSS },
      uDeep: { value: DEEP },
      uAccent: { value: ACCENT },
      uIris: { value: IRIS },
    }),
    [intensity],
  )

  useFrame((state, delta) => {
    const mat = matRef.current
    if (!mat) return

    const uTime = mat.uniforms.uTime
    if (uTime) uTime.value = state.clock.elapsedTime

    const uAspect = mat.uniforms.uAspect
    if (uAspect) uAspect.value = size.width / Math.max(1, size.height)

    // Suivi amorti de la souris : le fond respire avec le pointeur sans jamais
    // le coller. Lissage exponentiel independant du framerate.
    const uPointer = mat.uniforms.uPointer
    if (uPointer) {
      const p = uPointer.value as [number, number]
      const k = 1 - Math.exp(-delta * 1.6)
      p[0] += (pointerSignal.x - p[0]) * k
      p[1] += (pointerSignal.y - p[1]) * k
    }
  })

  return (
    <mesh frustumCulled={false} renderOrder={-10}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={gradientFieldVertexShader}
        fragmentShader={gradientFieldFragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  )
}

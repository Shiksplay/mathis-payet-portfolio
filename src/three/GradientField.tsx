import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import type { ShaderMaterial } from 'three'
import { pointerSignal } from '@/lib/signals'
import { useAppStore } from '@/store/useAppStore'
import { SCENE_PALETTE } from './palette'
import { gradientFieldFragmentShader, gradientFieldVertexShader } from './shaders/gradientField'
import { setColorUniform, setUniform } from './uniforms'

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
 * qui passe par-dessus (en melange additif, ou normal en theme clair).
 */
export function GradientField({ intensity = 1 }: GradientFieldProps) {
  const matRef = useRef<ShaderMaterial>(null)
  const { size } = useThree()
  const theme = useAppStore((s) => s.theme)

  // ATTENUATION MOBILE : `intensity` multiplie la couleur finale, ce qui revient
  // a l'assombrir. Sur fond sombre c'est l'effet voulu ; sur fond clair cela
  // virerait la page au gris, donc le facteur y est neutralise.
  const fieldIntensity = theme === 'light' ? 1 : intensity

  const uniforms = useMemo(() => {
    // Lecture NON REACTIVE du store : seule la palette du montage sert a
    // l'initialisation, pour que la page soit peinte juste des la premiere
    // frame. Le suivi du theme est la responsabilite de l'effet ci-dessous,
    // qui ecrit dans le materiau — l'objet memoise, lui, n'est jamais mute.
    const { field } = SCENE_PALETTE[useAppStore.getState().theme]
    return {
      uTime: { value: 0 },
      uPointer: { value: [0, 0] as [number, number] },
      uAspect: { value: 1 },
      uIntensity: { value: fieldIntensity },
      uFloor: { value: field.floor },
      uAbyss: { value: field.base.clone() },
      uDeep: { value: field.veil.clone() },
      uAccent: { value: field.accent.clone() },
      uIris: { value: field.iris.clone() },
    }
  }, [fieldIntensity])

  useEffect(() => {
    const mat = matRef.current
    const { field } = SCENE_PALETTE[theme]
    setColorUniform(mat, 'uAbyss', field.base)
    setColorUniform(mat, 'uDeep', field.veil)
    setColorUniform(mat, 'uAccent', field.accent)
    setColorUniform(mat, 'uIris', field.iris)
    setUniform(mat, 'uFloor', field.floor)
    setUniform(mat, 'uIntensity', fieldIntensity)
  }, [theme, fieldIntensity])

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

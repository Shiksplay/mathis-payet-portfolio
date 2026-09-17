import { useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import { useRef, type ReactNode } from 'react'
import type { Group } from 'three'
import { pointerSignal } from '@/lib/signals'

interface PointerParallaxProps {
  children: ReactNode
  enabled?: boolean
}

/**
 * PARALLAX SOURIS
 * ===============
 *
 * Applique un tres leger decalage et une rotation au groupe enfant en fonction
 * de la position de la souris.
 *
 * L'effet porte sur l'OBJET, pas sur la camera : celle-ci est deja pilotee par
 * le scroll et fait un `lookAt` a chaque frame, donc toute correction appliquee
 * a la camera serait immediatement ecrasee.
 *
 * Amplitudes volontairement minuscules (0.2 unite de translation, ~7 degres de
 * rotation) et fortement amorties : on cherche une sensation de profondeur, pas
 * un objet qui suit le curseur.
 */
export function PointerParallax({ children, enabled = true }: PointerParallaxProps) {
  const ref = useRef<Group>(null)

  useFrame((_state, delta) => {
    const group = ref.current
    if (!group || !enabled) return

    // Le noyau se decale a l'inverse de la souris : le regard "pousse" l'objet.
    easing.damp3(
      group.position,
      [pointerSignal.x * -0.2, pointerSignal.y * -0.14, 0],
      0.7,
      delta,
    )
    easing.damp(group.rotation, 'y', pointerSignal.x * 0.11, 0.8, delta)
    easing.damp(group.rotation, 'x', -pointerSignal.y * 0.08, 0.8, delta)
  })

  return <group ref={ref}>{children}</group>
}

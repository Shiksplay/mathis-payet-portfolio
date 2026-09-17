import { useFrame, useThree } from '@react-three/fiber'
import { easing } from 'maath'
import { useMemo } from 'react'
import { PerspectiveCamera, Vector3 } from 'three'
import { CAMERA_TRACK } from '@/lib/cameraKeyframes'
import { scrollSignal } from '@/lib/signals'

/** Lissage cubique : supprime les cassures de vitesse aux keyframes. */
function smoothstep(t: number): number {
  return t * t * (3 - 2 * t)
}

/**
 * CAMERA PILOTEE PAR LE SCROLL
 * ============================
 *
 * `scrollSignal.track` donne la position continue sur le rail de keyframes
 * (0 = section 1, 1 = section 2, 2.4 = 40 % entre la section 3 et la 4).
 *
 * A chaque frame :
 *   1. on interpole lineairement entre les deux keyframes encadrantes, avec un
 *      `smoothstep` sur la fraction pour adoucir les passages ;
 *   2. on fait TENDRE la camera vers cette cible avec `easing.damp3` plutot que
 *      de l'y placer directement. C'est ce qui donne l'inertie : un coup de
 *      molette brutal ne teleporte pas la camera, elle rattrape sa cible.
 *
 * POURQUOI PAS ScrollControls de drei : ce helper deplace le contenu HTML dans
 * un overlay a l'interieur du canvas, ce qui est incompatible avec un canvas
 * en arriere-plan et degrade l'accessibilite et l'indexation du texte. On lit
 * donc le scroll naturel du document (voir `useTrackers`).
 */
export function ScrollCamera() {
  const camera = useThree((s) => s.camera)

  // Vecteurs de travail alloues une fois : rien n'est alloue dans useFrame.
  const work = useMemo(
    () => ({
      desiredPosition: new Vector3(),
      desiredTarget: new Vector3(),
      // Cible reellement regardee : elle est amortie separement de la position,
      // sinon le regard "claque" d'un point d'interet a l'autre.
      lookAt: new Vector3(0, 0, 0),
    }),
    [],
  )

  useFrame((_state, delta) => {
    const last = CAMERA_TRACK.length - 1
    if (last < 0) return

    const t = Math.min(last, Math.max(0, scrollSignal.track))
    const i = Math.min(last, Math.floor(t))
    const j = Math.min(last, i + 1)
    const f = smoothstep(t - i)

    const a = CAMERA_TRACK[i]
    const b = CAMERA_TRACK[j]
    if (!a || !b) return

    work.desiredPosition.set(
      a.position[0] + (b.position[0] - a.position[0]) * f,
      a.position[1] + (b.position[1] - a.position[1]) * f,
      a.position[2] + (b.position[2] - a.position[2]) * f,
    )
    work.desiredTarget.set(
      a.target[0] + (b.target[0] - a.target[0]) * f,
      a.target[1] + (b.target[1] - a.target[1]) * f,
      a.target[2] + (b.target[2] - a.target[2]) * f,
    )
    const desiredFov = a.fov + (b.fov - a.fov) * f

    // `smoothTime` en secondes : duree approximative pour rattraper la cible.
    // 0.45 s donne une inertie perceptible mais jamais mollassonne.
    easing.damp3(camera.position, work.desiredPosition, 0.45, delta)
    easing.damp3(work.lookAt, work.desiredTarget, 0.55, delta)

    if (camera instanceof PerspectiveCamera) {
      easing.damp(camera, 'fov', desiredFov, 0.5, delta)
      camera.updateProjectionMatrix()
    }

    camera.lookAt(work.lookAt)
  })

  return null
}

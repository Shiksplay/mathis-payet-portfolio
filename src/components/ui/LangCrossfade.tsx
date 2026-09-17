import { useEffect, useRef, type ReactNode } from 'react'
import { useAppStore } from '@/store/useAppStore'

/**
 * Transition douce du texte lors du changement de langue.
 *
 * CHOIX D'IMPLEMENTATION : on fait plonger l'opacite du bloc de contenu puis on
 * la remonte, le texte etant echange pendant la plongee. On n'utilise PAS un
 * vrai cross-fade A/B (AnimatePresence) car il faudrait monter les deux
 * versions simultanement : la page doublerait de hauteur le temps de la
 * transition et la position de scroll sauterait. Ici le DOM reste stable, donc
 * ni saut de scroll ni decalage de mise en page.
 *
 * L'animation passe par la Web Animations API plutot que par un state React :
 * elle est purement visuelle et n'a aucune raison de provoquer un rendu.
 */
export function LangCrossfade({ children }: { children: ReactNode }) {
  const lang = useAppStore((s) => s.lang)
  const reducedMotion = useAppStore((s) => s.reducedMotion)
  const ref = useRef<HTMLDivElement>(null)
  const isFirstRender = useRef(true)

  useEffect(() => {
    // Pas de transition au premier rendu : la langue initiale n'est pas un
    // changement.
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (reducedMotion) return

    const el = ref.current
    if (!el || typeof el.animate !== 'function') return

    const animation = el.animate([{ opacity: 0.12 }, { opacity: 1 }], {
      duration: 340,
      easing: 'ease-out',
    })

    return () => animation.cancel()
  }, [lang, reducedMotion])

  return <div ref={ref}>{children}</div>
}

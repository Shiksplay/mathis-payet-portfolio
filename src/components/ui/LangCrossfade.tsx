import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useAppStore } from '@/store/useAppStore'

/**
 * Transition douce du texte lors du changement de langue.
 *
 * CHOIX D'IMPLEMENTATION : on fait plonger l'opacite du bloc de contenu puis on
 * la remonte, le texte etant echange au point le plus bas. On n'utilise PAS un
 * vrai cross-fade A/B (AnimatePresence) car il faudrait monter les deux
 * versions simultanement : la page doublerait de hauteur le temps de la
 * transition et la position de scroll sauterait. Ici le DOM reste stable, donc
 * ni saut de scroll ni decalage de mise en page.
 */
export function LangCrossfade({ children }: { children: ReactNode }) {
  const lang = useAppStore((s) => s.lang)
  const reducedMotion = useAppStore((s) => s.reducedMotion)
  const [dipping, setDipping] = useState(false)
  const isFirstRender = useRef(true)

  useEffect(() => {
    // Pas de transition au premier rendu : la langue initiale n'est pas un
    // changement.
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (reducedMotion) return

    setDipping(true)
    const id = window.setTimeout(() => setDipping(false), 170)
    return () => window.clearTimeout(id)
  }, [lang, reducedMotion])

  return (
    <div
      style={{
        opacity: dipping ? 0.12 : 1,
        transition: reducedMotion ? 'none' : 'opacity 170ms ease-out',
      }}
    >
      {children}
    </div>
  )
}

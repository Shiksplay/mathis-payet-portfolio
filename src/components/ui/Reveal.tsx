// `motion/react-m` au lieu de `motion/react` : composants alleges dont les
// fonctionnalites sont injectees par le <LazyMotion> monte dans <App />. C'est
// ce qui evite d'embarquer tout le moteur d'animation dans le bundle initial.
// Cette entree exporte les elements directement (div, span...), d'ou l'import
// de namespace plutot qu'un `import { m }`.
import * as m from 'motion/react-m'
import type { ReactNode } from 'react'
import { useAppStore } from '@/store/useAppStore'

interface RevealProps {
  children: ReactNode
  /** Decalage en secondes, pour cascader plusieurs Reveal. */
  delay?: number
  /** Distance de translation initiale, en px. */
  y?: number
  className?: string
}

/**
 * Apparition fade + slide a l'entree dans le viewport.
 * Sous `prefers-reduced-motion`, le contenu est rendu directement, sans
 * animation ni opacite initiale (jamais de contenu invisible pour cause
 * d'animation desactivee).
 */
export function Reveal({ children, delay = 0, y = 24, className }: RevealProps) {
  const reducedMotion = useAppStore((s) => s.reducedMotion)

  if (reducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </m.div>
  )
}

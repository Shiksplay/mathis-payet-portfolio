import { motion } from 'motion/react'
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
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  )
}

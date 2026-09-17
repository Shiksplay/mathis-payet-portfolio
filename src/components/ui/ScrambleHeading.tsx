import { useInView } from 'motion/react'
import { useRef } from 'react'
import { useTextScramble } from '@/hooks/useTextScramble'
import { cn } from '@/lib/cn'
import { useAppStore } from '@/store/useAppStore'

type HeadingTag = 'h1' | 'h2' | 'h3' | 'p' | 'span'

interface ScrambleHeadingProps {
  text: string
  as?: HeadingTag
  className?: string
  id?: string
  /** Vitesse de revelation, en ms par caractere. */
  msPerChar?: number
}

/**
 * Titre avec effet "decrypt". Se declenche a la premiere entree dans le
 * viewport, une seule fois.
 *
 * ACCESSIBILITE : le texte brouille est masque aux technologies d'assistance
 * (`aria-hidden`) et le texte final est expose via `aria-label`. Un lecteur
 * d'ecran n'entend donc jamais la suite de glyphes aleatoires.
 */
export function ScrambleHeading({
  text,
  as = 'h2',
  className,
  id,
  msPerChar = 26,
}: ScrambleHeadingProps) {
  // La balise est choisie a l'execution. On la restreint a un type d'element
  // concret pour TypeScript : les props utilisees ici (ref/id/className) sont
  // communes a toutes les balises autorisees par `HeadingTag`.
  const Tag = as as 'h2'
  const ref = useRef<HTMLHeadingElement>(null)
  const reducedMotion = useAppStore((s) => s.reducedMotion)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const display = useTextScramble(text, inView && !reducedMotion, msPerChar)

  return (
    <Tag ref={ref} id={id} className={cn(className)} aria-label={text}>
      <span aria-hidden="true">{display}</span>
    </Tag>
  )
}

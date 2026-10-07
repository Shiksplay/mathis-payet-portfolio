import { useInView } from 'motion/react'
import * as m from 'motion/react-m'
import { useRef } from 'react'
import { cn } from '@/lib/cn'
import { useAppStore } from '@/store/useAppStore'

type HeadingTag = 'h1' | 'h2'

interface DisplayHeadingProps {
  text: string
  as?: HeadingTag
  id?: string
  className?: string
}

/**
 * TITRE DISPLAY SURDIMENSIONNE
 * ============================
 *
 * Traitement typographique inspire de landonorris.com : capitales, echelle
 * enorme, interlignage tres serre, et une REVELATION PAR MASQUE — les mots
 * montent depuis le bas d'un conteneur en `overflow: hidden`, avec un leger
 * decalage entre chaque mot. Le mouvement guide l'oeil vers le titre de la
 * section qui arrive ; il reste court (0,45 s) pour ne pas retarder la lecture.
 *
 * L'effet "decrypt" (brouillage) a ete retire des titres de section : repete
 * sur chaque section, il ne signalait plus rien. Il reste sur le seul <h1>
 * (le nom, voir `ScrambleHeading`), ou il porte l'identite cybersecurite.
 *
 * ACCESSIBILITE : le texte est porte par `aria-label` sur le titre, et le
 * rendu decoupe en mots est `aria-hidden`. Un lecteur d'ecran entend un titre
 * propre, jamais une suite de mots isoles.
 */
export function DisplayHeading({ text, as = 'h2', id, className }: DisplayHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null)
  const reducedMotion = useAppStore((s) => s.reducedMotion)
  const inView = useInView(ref, { once: true, amount: 0.35 })

  const words = text.split(' ')

  const Tag = as as 'h2'

  return (
    <Tag
      ref={ref}
      id={id}
      aria-label={text}
      className={cn(
        'font-display font-semibold uppercase',
        'text-[clamp(2.25rem,7.5vw,5.5rem)] leading-[0.88] tracking-[-0.03em]',
        className,
      )}
    >
      {words.map((word, i) => (
        // Le masque : chaque mot vit dans une fenetre qui rogne son
        // debordement, ce qui permet de le faire monter "depuis dessous".
        <span
          key={i}
          aria-hidden="true"
          className="mr-[0.22em] inline-block overflow-hidden pb-[0.06em] align-bottom"
        >
          {reducedMotion ? (
            <span className="inline-block">{word}</span>
          ) : (
            <m.span
              className="inline-block"
              initial={{ y: '110%' }}
              animate={inView ? { y: '0%' } : { y: '110%' }}
              transition={{
                duration: 0.45,
                delay: i * 0.05,
                ease: [0.2, 0.8, 0.2, 1],
              }}
            >
              {word}
            </m.span>
          )}
        </span>
      ))}
    </Tag>
  )
}

import { useInView } from 'motion/react'
import * as m from 'motion/react-m'
import { useMemo, useRef } from 'react'
import { useTextScramble } from '@/hooks/useTextScramble'
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
 * enorme, interlignage tres serre, et surtout une REVELATION PAR MASQUE — les
 * mots montent depuis le bas d'un conteneur en `overflow: hidden`, comme des
 * panneaux qui se soulevent, avec un decalage entre chaque mot.
 *
 * Deux animations se superposent volontairement :
 *   1. le glissement vertical, qui donne le poids et le rythme ;
 *   2. l'effet "decrypt" du texte, qui rappelle l'identite cybersecurite.
 *
 * Le brouillage conserve la longueur ET les espaces de la chaine (voir
 * `useTextScramble`), donc les frontieres de mots restent stables pendant
 * toute l'animation : la mise en page ne bouge jamais.
 *
 * ACCESSIBILITE : le texte final est porte par `aria-label` sur le titre, et
 * tout le rendu decoupe est `aria-hidden`. Un lecteur d'ecran entend un titre
 * propre, jamais une suite de mots isoles ni des glyphes aleatoires.
 */
export function DisplayHeading({ text, as = 'h2', id, className }: DisplayHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null)
  const reducedMotion = useAppStore((s) => s.reducedMotion)
  const inView = useInView(ref, { once: true, amount: 0.35 })

  const display = useTextScramble(text, inView && !reducedMotion, 18)

  // Le decoupage suit la chaine BROUILLEE, dont les espaces sont preserves.
  const words = useMemo(() => display.split(' '), [display])

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
          // Index comme cle : les mots changent de contenu a chaque frame
          // pendant le brouillage, mais jamais de position.
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
                duration: 0.85,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1],
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

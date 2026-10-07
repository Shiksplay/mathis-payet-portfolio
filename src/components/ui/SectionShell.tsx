import type { ReactNode } from 'react'
import type { ContentSectionId } from '@/data/sections'
import { useCv } from '@/hooks/useCv'
import { cn } from '@/lib/cn'
import { DisplayHeading } from './DisplayHeading'

interface SectionShellProps {
  id: ContentSectionId
  /** Numero affiche en monospace (ex. "02"). */
  index: string
  title: string
  /** Ligne d'accroche courte sous le titre, optionnelle. */
  kicker?: string
  children: ReactNode
  className?: string
  /** Contenu pleine largeur (galerie horizontale) au lieu de la colonne de lecture. */
  wide?: boolean
}

/**
 * Enveloppe commune a toutes les sections de contenu.
 *
 * STRUCTURE (inspiree des sites editoriaux type landonorris.com)
 * --------------------------------------------------------------
 *   1. un filet pleine largeur avec le numero de la section et la RUBRIQUE DU
 *      PDF a laquelle elle correspond ("CV › Formation") : le recruteur qui a
 *      le CV sous les yeux sait ou il en est ;
 *   2. un titre display surdimensionne qui occupe toute la largeur, suivi le
 *      cas echeant de l'accroche et de la ligne "ce que le CV ne dit pas" ;
 *   3. le contenu, ramene dans une colonne de lecture etroite.
 *
 * Le contraste d'echelle entre (2) et (3) est ce qui fait respirer la page :
 * une affirmation enorme, puis du texte a taille confortable. Le CV reste
 * parfaitement lisible — on ne sacrifie pas la lecture a l'effet.
 *
 * Semantique : un <section> etiquete par son <h2> via `aria-labelledby`.
 */
export function SectionShell({
  id,
  index,
  title,
  kicker,
  children,
  className,
  wide = false,
}: SectionShellProps) {
  const { c, t } = useCv()
  const titleId = `${id}-title`
  const beyond = c.beyondCv?.[id]

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={cn('relative py-20 sm:py-28 md:py-36', className)}
    >
      {/* ---------- Bandeau de titre, pleine largeur ---------- */}
      <div className="mx-auto max-w-[110rem] px-6 sm:px-10">
        <div className="flex items-center gap-5 border-t border-hairline pt-5">
          <span aria-hidden="true" className="font-mono text-xs text-accent">
            {index}
          </span>
          <span aria-hidden="true" className="h-px flex-1 bg-hairline/70" />
          <span className="label-mono text-right">{t.cvBridge.rubrics[id]}</span>
        </div>

        <DisplayHeading
          id={titleId}
          text={title}
          className="mt-7 text-ink sm:mt-9"
        />

        {kicker ? <p className="mt-5 max-w-2xl text-base text-muted sm:text-lg">{kicker}</p> : null}

        {beyond ? (
          <p className="mt-5 max-w-2xl border-l-2 border-accent/60 pl-4 text-base leading-relaxed text-ink/90">
            <span className="label-mono block text-accent/80">{t.cvBridge.beyondCv}</span>
            <span className="mt-1 block">{beyond}</span>
          </p>
        ) : null}
      </div>

      {/* ---------- Contenu ---------- */}
      <div
        className={cn(
          'mt-14 px-6 sm:mt-20 sm:px-10',
          // La colonne de lecture est decalee a droite et plafonnee : la
          // longueur de ligne reste confortable meme sur tres grand ecran.
          wide ? 'mx-auto max-w-[110rem]' : 'mx-auto max-w-6xl lg:pl-[16.666%]',
        )}
      >
        {children}
      </div>
    </section>
  )
}

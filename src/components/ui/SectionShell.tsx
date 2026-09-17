import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { DisplayHeading } from './DisplayHeading'

interface SectionShellProps {
  id: string
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
 *   1. un filet pleine largeur avec le numero et le nom de la section ;
 *   2. un titre display surdimensionne qui occupe toute la largeur ;
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
  const titleId = `${id}-title`

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
          {kicker ? (
            <span className="label-mono hidden sm:inline">{kicker}</span>
          ) : null}
        </div>

        <DisplayHeading
          id={titleId}
          text={title}
          className="mt-7 text-ink sm:mt-9"
        />
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

/**
 * Bandeau defilant entre deux sections.
 *
 * Emprunte au vocabulaire des sites de sport automobile : une bande de texte
 * en capitales qui glisse en continu, purement rythmique. Elle sert de
 * respiration entre deux blocs de contenu dense.
 *
 * Le contenu est duplique deux fois et la piste translatee de -50 % : la
 * boucle est donc invisible. `aria-hidden` car c'est un ornement, pas de
 * l'information.
 */
export function Marquee({ items }: { items: string[] }) {
  // Duplique la liste : la seconde moitie prend le relais quand la premiere
  // sort du cadre, ce qui rend la boucle continue.
  const track = [...items, ...items]

  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden border-y border-hairline/60 py-4 select-none"
      style={{
        // Les extremites s'effacent : la bande ne "coupe" pas net sur les bords.
        maskImage: 'linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)',
      }}
    >
      <div className="animate-marquee flex w-max items-center gap-10">
        {track.map((item, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="font-mono text-[11px] tracking-[0.3em] whitespace-nowrap text-muted/70 uppercase">
              {item}
            </span>
            <span className="size-1 shrink-0 rounded-full bg-accent/50" />
          </span>
        ))}
      </div>
    </div>
  )
}

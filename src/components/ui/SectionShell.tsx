import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { ScrambleHeading } from './ScrambleHeading'

interface SectionShellProps {
  id: string
  /** Numero affiche en monospace a gauche du titre (ex. "02"). */
  index: string
  title: string
  /** Ligne d'accroche courte sous le titre, optionnelle. */
  kicker?: string
  children: ReactNode
  className?: string
}

/**
 * Enveloppe commune a toutes les sections de contenu.
 *
 * Assure la coherence structurelle et semantique : un <section> etiquete par
 * son <h2> (`aria-labelledby`), une grille asymetrique 12 colonnes ou le titre
 * occupe la colonne de gauche sur grand ecran et se replie au-dessus du
 * contenu sur mobile.
 */
export function SectionShell({
  id,
  index,
  title,
  kicker,
  children,
  className,
}: SectionShellProps) {
  const titleId = `${id}-title`

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={cn('relative px-6 py-24 sm:px-8 md:py-32', className)}
    >
      <div className="mx-auto grid max-w-6xl gap-x-12 gap-y-10 lg:grid-cols-12">
        <header className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
          <div className="flex items-baseline gap-3">
            <span aria-hidden="true" className="font-mono text-xs text-accent/70">
              {index}
            </span>
            <span className="h-px w-8 bg-hairline" aria-hidden="true" />
          </div>
          <ScrambleHeading
            as="h2"
            id={titleId}
            text={title}
            className="mt-4 text-3xl font-semibold text-ink sm:text-4xl"
          />
          {kicker ? <p className="mt-3 max-w-xs text-sm text-muted">{kicker}</p> : null}
        </header>

        <div className="lg:col-span-8">{children}</div>
      </div>
    </section>
  )
}

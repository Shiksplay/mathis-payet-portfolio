import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * CONTROLE SEGMENTE
 * =================
 *
 * Coquille commune aux bascules de la nav (langue, theme).
 *
 * POURQUOI UN COMPOSANT PARTAGE : les deux bascules sont cote a cote dans la
 * barre de navigation. La moindre divergence de rayon, de hauteur ou de
 * padding se lit immediatement comme un defaut d'alignement. En factorisant la
 * coquille, les deux pastilles sont identiques par construction, et un futur
 * ajustement visuel se fait en un seul endroit.
 *
 * POURQUOI DEUX BOUTONS PLUTOT QU'UN INTERRUPTEUR : l'etat courant est
 * explicite pour un lecteur d'ecran (`aria-pressed` sur chaque option) et
 * chaque valeur est atteignable directement au clavier, sans deviner ce que
 * fait la bascule.
 */
export function SegmentedControl({
  label,
  className,
  children,
}: {
  /** Libelle du groupe, annonce avant les options. */
  label: string
  /** exactOptionalPropertyTypes : les appelants transmettent un `className` optionnel. */
  className?: string | undefined
  children: ReactNode
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        'relative flex items-center gap-0.5 rounded-full border border-hairline bg-deep/50 p-0.5 backdrop-blur-md',
        className,
      )}
    >
      {children}
    </div>
  )
}

interface SegmentProps {
  active: boolean
  onSelect: () => void
  /** Libelle accessible. Sert de texte visible quand `children` est absent. */
  label: string
  /**
   * Contenu visible a la place du libelle (une icone, typiquement). Le libelle
   * reste alors porte par `aria-label` et par l'infobulle.
   */
  children?: ReactNode
}

/** Une option du controle segmente. */
export function Segment({ active, onSelect, label, children }: SegmentProps) {
  const iconOnly = children !== undefined

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      aria-label={iconOnly ? label : undefined}
      title={iconOnly ? label : undefined}
      className={cn(
        // `min-h` fige la hauteur quel que soit le contenu : une icone et deux
        // lettres de texte ne produisent pas la meme boite de ligne.
        'inline-flex min-h-6 items-center justify-center rounded-full py-1',
        // Une icone a besoin d'un peu moins d'air lateral que deux lettres pour
        // paraitre centree — et les quelques pixels gagnes font tenir les deux
        // pastilles cote a cote sur les ecrans de 320 px.
        iconOnly ? 'px-2.5' : 'px-3',
        'font-mono text-[11px] tracking-widest uppercase transition-colors duration-300',
        active ? 'bg-accent text-abyss' : 'text-muted hover:text-ink',
      )}
    >
      {children ?? label}
    </button>
  )
}

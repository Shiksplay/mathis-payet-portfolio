import type { CSSProperties } from 'react'
import { useEffect } from 'react'
import { useCv } from '@/hooks/useCv'
import { useAppStore } from '@/store/useAppStore'

// 40 caracteres au total : 400 ms de frappe + 100 de pause + 100 de maintien
// + 250 de fondu = 850 ms.
const MS_PER_CHAR = 10
const LINE_PAUSE = 100
const HOLD_AFTER = 100

/**
 * SEQUENCE DE BOOT — version non bloquante
 * ========================================
 *
 * Petite console qui tape deux lignes dans un coin de l'ecran puis s'efface,
 * le tout en moins d'une seconde, UNE SEULE FOIS par session d'onglet (drapeau
 * en sessionStorage, gere par le store).
 *
 * Elle ne masque rien et ne capture rien : `pointer-events: none`, pas de
 * focus, pas d'ecoute clavier. Le contenu est lisible et utilisable des le
 * premier rendu — l'ancienne version plein ecran faisait attendre ~3,7 s un
 * recruteur qui vient justement chercher ce contenu.
 *
 * La frappe et le fondu sont des animations CSS (`clip-path` en `steps()`,
 * puis opacite) : aucun rendu React par frame. La fin du fondu demonte le
 * composant via `onAnimationEnd`.
 *
 * Purement decorative (`aria-hidden`), et absente sous reduced-motion.
 */
export function BootSequence() {
  const bootDone = useAppStore((s) => s.bootDone)
  const reducedMotion = useAppStore((s) => s.reducedMotion)
  const finishBoot = useAppStore((s) => s.finishBoot)
  const { t } = useCv()

  // Animations reduites : on marque la sequence comme vue et on n'affiche rien.
  useEffect(() => {
    if (reducedMotion && !bootDone) finishBoot()
  }, [reducedMotion, bootDone, finishBoot])

  if (bootDone || reducedMotion) return null

  // Instant de depart de chaque ligne : somme des lignes precedentes.
  const lines = t.boot.lines.map((text, i, all) => ({
    text,
    duration: text.length * MS_PER_CHAR,
    start: all.slice(0, i).reduce((sum, prev) => sum + prev.length * MS_PER_CHAR + LINE_PAUSE, 0),
  }))
  const last = lines[lines.length - 1]
  const outDelay = (last ? last.start + last.duration : 0) + HOLD_AFTER

  return (
    <div
      aria-hidden="true"
      className="boot-console pointer-events-none fixed right-4 bottom-4 z-40 rounded-xl border border-hairline/80 bg-abyss/80 px-4 py-3 font-mono text-[11px] backdrop-blur-sm sm:right-8 sm:bottom-8 sm:text-xs"
      style={{ '--out-delay': `${outDelay}ms` } as CSSProperties}
      onAnimationEnd={(e) => {
        // Les lignes emettent aussi animationend (bubbling) : seul le fondu
        // du conteneur termine la sequence.
        if (e.target === e.currentTarget) finishBoot()
      }}
    >
      {lines.map(({ text, start, duration }, i) => (
        <span
          key={text}
          className={`boot-line block py-px whitespace-pre ${i === lines.length - 1 ? 'text-accent' : 'text-muted'}`}
          style={
            {
              '--chars': text.length,
              '--type-ms': `${duration}ms`,
              '--delay': `${start}ms`,
            } as CSSProperties
          }
        >
          {text}
        </span>
      ))}
    </div>
  )
}

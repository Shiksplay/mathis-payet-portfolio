import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useCv } from '@/hooks/useCv'
import { useAppStore } from '@/store/useAppStore'

const MS_PER_CHAR = 13
const LINE_PAUSE = 190
const HOLD_AFTER = 620
const FADE_MS = 420

/**
 * SEQUENCE DE BOOT
 * ================
 *
 * Overlay plein ecran facon terminal, joue UNE SEULE FOIS par session d'onglet
 * (drapeau en sessionStorage, gere par le store). Skippable, et entierement
 * ignoree si `prefers-reduced-motion` est actif.
 *
 * ACCESSIBILITE : le texte qui s'ecrit est purement decoratif
 * (`aria-hidden`). L'overlay expose en revanche un vrai <button> plein ecran,
 * focus des le montage, dont le libelle explique comment passer la sequence :
 * un utilisateur au clavier ou au lecteur d'ecran n'est jamais bloque, et
 * n'entend pas le texte se construire caractere par caractere.
 */
export function BootSequence() {
  const bootDone = useAppStore((s) => s.bootDone)
  const reducedMotion = useAppStore((s) => s.reducedMotion)
  const finishBoot = useAppStore((s) => s.finishBoot)
  const { t } = useCv()

  const lines = t.boot.lines
  const [revealed, setRevealed] = useState<number[]>(() => lines.map(() => 0))
  const [fading, setFading] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  /**
   * Instant de demarrage de chaque ligne, cumule. Calcule une fois : la boucle
   * d'animation n'a plus qu'a comparer le temps ecoule a ces bornes.
   */
  const lineStarts = useMemo(() => {
    const starts: number[] = []
    let cursor = 0
    for (const line of lines) {
      starts.push(cursor)
      cursor += line.length * MS_PER_CHAR + LINE_PAUSE
    }
    return starts
  }, [lines])

  const dismiss = useCallback(() => {
    setFading(true)
    window.setTimeout(finishBoot, FADE_MS)
  }, [finishBoot])

  // Animations reduites : on marque la sequence comme vue et on n'affiche rien.
  useEffect(() => {
    if (reducedMotion && !bootDone) finishBoot()
  }, [reducedMotion, bootDone, finishBoot])

  // Boucle de frappe.
  useEffect(() => {
    if (bootDone || reducedMotion) return

    buttonRef.current?.focus()

    let raf = 0
    const start = performance.now()
    const lastLineStart = lineStarts[lineStarts.length - 1] ?? 0
    const lastLine = lines[lines.length - 1] ?? ''
    const total = lastLineStart + lastLine.length * MS_PER_CHAR

    const tick = (now: number) => {
      const elapsed = now - start

      setRevealed(
        lines.map((line, i) => {
          const startAt = lineStarts[i] ?? 0
          if (elapsed < startAt) return 0
          return Math.min(line.length, Math.floor((elapsed - startAt) / MS_PER_CHAR))
        }),
      )

      if (elapsed < total) {
        raf = requestAnimationFrame(tick)
      } else {
        window.setTimeout(dismiss, HOLD_AFTER)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [bootDone, reducedMotion, lines, lineStarts, dismiss])

  // Skip au clavier, en plus du clic sur l'overlay.
  useEffect(() => {
    if (bootDone || reducedMotion) return
    const onKeyDown = () => dismiss()
    window.addEventListener('keydown', onKeyDown, { once: true })
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [bootDone, reducedMotion, dismiss])

  if (bootDone || reducedMotion) return null

  return (
    <div
      className="fixed inset-0 z-110 bg-abyss transition-opacity"
      style={{ opacity: fading ? 0 : 1, transitionDuration: `${FADE_MS}ms` }}
    >
      <div className="absolute inset-0 grid-blueprint opacity-30" aria-hidden="true" />

      {/* Zone de clic plein ecran = bouton de skip accessible. */}
      <button
        ref={buttonRef}
        type="button"
        onClick={dismiss}
        className="absolute inset-0 flex cursor-pointer items-center justify-center px-6 text-left"
      >
        <span className="sr-only">{t.boot.skip}</span>

        <span aria-hidden="true" className="w-full max-w-lg font-mono text-[13px] sm:text-sm">
          {lines.map((line, i) => {
            const count = revealed[i] ?? 0
            if (count === 0) return null
            const isLast = i === lines.length - 1
            return (
              <span key={line} className="block py-[3px] whitespace-pre-wrap">
                <span className={isLast ? 'text-accent' : 'text-muted'}>
                  {line.slice(0, count)}
                </span>
                {/* Curseur sur la derniere ligne en cours de frappe. */}
                {count < line.length ? <span className="animate-caret text-accent">▊</span> : null}
              </span>
            )
          })}
        </span>
      </button>

      <p
        aria-hidden="true"
        className="absolute inset-x-0 bottom-8 text-center font-mono text-[10px] tracking-[0.2em] text-muted/40 uppercase"
      >
        {t.boot.skip}
      </p>
    </div>
  )
}

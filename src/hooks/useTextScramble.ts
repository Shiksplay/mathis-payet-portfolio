import { useEffect, useState } from 'react'

/** Jeu de glyphes du brouillage : volontairement "technique", pas alphabetique. */
const GLYPHS = '!<>-_\\/[]{}=+*^?#01x%$&@'

function randomGlyph(): string {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? '#'
}

/** Brouille une chaine en conservant sa longueur et ses espaces. */
function scramble(text: string, revealedCount: number): string {
  let out = ''
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i] ?? ''
    // Les espaces et retours restent intacts : la mise en page ne bouge jamais.
    out += i < revealedCount || ch === ' ' || ch === '\n' ? ch : randomGlyph()
  }
  return out
}

/**
 * Effet "decrypt" : le texte apparait de gauche a droite, les caracteres pas
 * encore reveles clignotant en glyphes aleatoires, jusqu'a se stabiliser sur
 * le texte final.
 *
 * - La longueur de la chaine est constante du debut a la fin : aucun
 *   decalage de mise en page (CLS) pendant l'animation.
 * - `enabled: false` (reduced-motion, ou section hors ecran) renvoie
 *   immediatement le texte final.
 *
 * @param text     Texte final.
 * @param enabled  Lance l'animation. Repasser a false fige le texte final.
 * @param msPerChar Vitesse de revelation.
 */
export function useTextScramble(text: string, enabled: boolean, msPerChar = 26): string {
  const [display, setDisplay] = useState(() => (enabled ? scramble(text, 0) : text))

  useEffect(() => {
    // Rien a animer : le texte final est renvoye directement au retour du hook,
    // sans passer par un setState (qui declencherait un rendu en cascade).
    if (!enabled) return

    let raf = 0
    let frame = 0
    const start = performance.now()
    const total = text.length * msPerChar + 250

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / total)

      // On ne redessine qu'une frame sur deux : le brouillage parait plus
      // "terminal" a ~30 Hz qu'a 60 Hz, et cela divise par deux les re-renders.
      frame += 1
      if (frame % 2 === 0 || t === 1) {
        setDisplay(t === 1 ? text : scramble(text, Math.floor(t * text.length)))
      }

      if (t < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [text, enabled, msPerChar])

  return enabled ? display : text
}

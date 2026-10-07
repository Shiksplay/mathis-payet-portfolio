import { useInView } from 'motion/react'
import { useRef } from 'react'
import type { Schematic } from '@/data/cv'

const WIDTH = 320
const BOX_W = 84
const BOX_H = 30
const BOX_Y = 18

/**
 * SCHEMA LINEAIRE SIMPLIFIE (ex. ToIP du stage)
 * =============================================
 *
 * Elements alignes de gauche a droite et relies par un trait. `count` > 1
 * dessine une pile de cartes (plusieurs postes). Volontairement generique :
 * aucun detail interne de l'organisation.
 *
 * Seule animation : au premier passage, les elements apparaissent l'un apres
 * l'autre (opacite + translation, CSS `.sch-node`). En reduced-motion, la
 * regle globale neutralise l'animation et tout est visible.
 *
 * <figure> + <figcaption> ; la liste des elements est aussi donnee en texte
 * (sr-only) puisque le SVG est decoratif.
 */
export function SchematicDiagram({ schematic }: { schematic: Schematic }) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const { nodes, caption } = schematic
  const slot = WIDTH / nodes.length

  return (
    <figure ref={ref} className="mt-7 border-t border-hairline/60 pt-5" data-inview={inView}>
      <svg viewBox={`0 0 ${WIDTH} 76`} className="h-auto w-full max-w-md" aria-hidden="true" focusable="false">
        {nodes.map((node, i) => {
          const cx = slot * i + slot / 2
          const x = cx - BOX_W / 2
          const stack = Math.min(node.count ?? 1, 3)
          return (
            <g key={node.label} className="sch-node" style={{ animationDelay: `${i * 140}ms` }}>
              {/* Lien vers l'element suivant. */}
              {i < nodes.length - 1 ? (
                <line
                  x1={x + BOX_W}
                  y1={BOX_Y + BOX_H / 2}
                  x2={x + slot}
                  y2={BOX_Y + BOX_H / 2}
                  className="cs-stroke"
                />
              ) : null}
              {/* Pile : cartes decalees derriere la principale. */}
              {Array.from({ length: stack - 1 }, (_, k) => stack - 1 - k).map((offset) => (
                <rect
                  key={offset}
                  x={x + offset * 4}
                  y={BOX_Y - offset * 4}
                  width={BOX_W}
                  height={BOX_H}
                  rx="6"
                  className="cs-stroke cs-fill"
                />
              ))}
              <rect x={x} y={BOX_Y} width={BOX_W} height={BOX_H} rx="6" className="cs-stroke cs-fill" />
              <text x={cx} y={BOX_Y + BOX_H + 18} textAnchor="middle" className="cs-label cs-label--sm">
                {node.label}
              </text>
            </g>
          )
        })}
      </svg>
      <span className="sr-only">{nodes.map((n) => n.label).join(' → ')}</span>
      <figcaption className="mt-2 text-xs leading-relaxed text-muted">{caption}</figcaption>
    </figure>
  )
}

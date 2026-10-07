import { useEffect, useRef, useState } from 'react'
import type { DiagramNodeId } from '@/data/cv'
import { CaseStudyDiagram, type NodeState } from '@/components/case-study/CaseStudyDiagram'
import { SectionShell } from '@/components/ui/SectionShell'
import { useCv } from '@/hooks/useCv'
import { cn } from '@/lib/cn'
import { useAppStore } from '@/store/useAppStore'

const NODE_IDS: readonly DiagramNodeId[] = ['vmware', 'sites', 'vpn', 'services', 'firewall', 'pentest']

/**
 * Ligne de lecture, en px depuis le haut du viewport : l'etape qui la croise
 * est l'etape active.
 *
 * En deux colonnes (lg+), c'est le centre de l'ecran. En une colonne, le
 * schema epingle occupe le haut de l'ecran : la ligne est placee au centre de
 * la zone VISIBLE sous lui — au centre de l'ecran, elle tomberait derriere le
 * schema et l'etape "active" serait cachee.
 */
function readingLine(figure: HTMLElement | null): number {
  const vh = window.innerHeight
  if (!figure || window.matchMedia('(min-width: 1024px)').matches) return vh / 2
  const stuckBottom = (parseFloat(getComputedStyle(figure).top) || 0) + figure.offsetHeight
  return stuckBottom + (vh - stuckBottom) / 2
}

/**
 * ETUDE DE CAS — schema qui se construit au fil du scroll
 * =======================================================
 *
 * Le CV dit QUOI (une liste de technologies) ; cette section montre dans quel
 * ORDRE l'infrastructure a ete construite. Le schema est epingle
 * (`position: sticky`) pendant que les etapes defilent ; l'etape qui croise la
 * ligne de lecture allume ses elements, les etapes passees restent visibles,
 * les suivantes sont attenuees.
 *
 * PILOTAGE : un IntersectionObserver dont la bande de detection (2 px) est la
 * ligne de lecture. Il n'ecrit qu'un state (`active`), qui ne change qu'au
 * passage d'une etape a l'autre : aucun rendu par frame. Pas de GSAP : sticky
 * + IO couvrent l'epinglage et le sequencage.
 *
 * ACCESSIBILITE
 *  - <figure> + <figcaption> ; le SVG est decoratif, l'equivalent textuel est
 *    la liste ordonnee des etapes.
 *  - Navigation clavier : une liste de boutons d'etapes (`aria-current="step"`)
 *    qui activent l'etape et font defiler jusqu'a son texte.
 *  - Reduced-motion : pas de sticky ni de transition, schema complet et
 *    etapes toutes lisibles d'emblee.
 */
export function CaseStudy() {
  const { c, t } = useCv()
  const cs = c.caseStudy
  const reducedMotion = useAppStore((s) => s.reducedMotion)
  const [active, setActive] = useState(0)
  const figureRef = useRef<HTMLElement>(null)
  const stepRefs = useRef<(HTMLLIElement | null)[]>([])
  /**
   * Vrai pendant le defilement fluide declenche par un bouton d'etape :
   * l'observer ignore alors les etapes traversees (sinon l'etape active
   * clignoterait de l'une a l'autre). Libere a `scrollend`, ou au bout de
   * 1,5 s si l'evenement n'est pas supporte ou si l'utilisateur interrompt.
   */
  const programmaticScroll = useRef(false)

  useEffect(() => {
    if (reducedMotion) return
    let observer: IntersectionObserver | null = null

    // La bande de detection depend de la hauteur du schema et du viewport :
    // l'observer est reconstruit quand l'une ou l'autre change.
    const build = () => {
      observer?.disconnect()
      const line = readingLine(figureRef.current)
      const vh = window.innerHeight
      observer = new IntersectionObserver(
        (entries) => {
          if (programmaticScroll.current) return
          for (const entry of entries) {
            if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.step))
          }
        },
        { rootMargin: `-${Math.round(line - 1)}px 0px -${Math.round(vh - line - 1)}px 0px` },
      )
      for (const el of stepRefs.current) if (el) observer.observe(el)
    }

    build()
    const resize = new ResizeObserver(build)
    if (figureRef.current) resize.observe(figureRef.current)
    window.addEventListener('resize', build)
    return () => {
      observer?.disconnect()
      resize.disconnect()
      window.removeEventListener('resize', build)
    }
  }, [reducedMotion, cs.steps.length])

  const steps = cs.steps
  const total = steps.length

  // Etat de chaque element du schema, d'apres l'etape ou il apparait.
  const states = Object.fromEntries(
    NODE_IDS.map((id) => {
      if (reducedMotion) return [id, 'static']
      const at = steps.findIndex((s) => s.nodes.includes(id))
      const state: NodeState = at < active ? 'done' : at === active ? 'active' : 'pending'
      return [id, state]
    }),
  ) as Record<DiagramNodeId, NodeState>

  /** Etape dont le centre est le plus proche de la ligne de lecture. */
  const syncToReadingLine = () => {
    const line = readingLine(figureRef.current)
    let best = 0
    let bestDistance = Number.POSITIVE_INFINITY
    stepRefs.current.forEach((el, i) => {
      if (!el) return
      const rect = el.getBoundingClientRect()
      const distance = Math.abs(rect.top + rect.height / 2 - line)
      if (distance < bestDistance) {
        bestDistance = distance
        best = i
      }
    })
    setActive(best)
  }

  const goTo = (index: number) => {
    const el = stepRefs.current[index]
    setActive(index)
    if (!el) return

    if (!reducedMotion) {
      programmaticScroll.current = true
      let timer = 0
      const release = () => {
        window.clearTimeout(timer)
        window.removeEventListener('scrollend', release)
        programmaticScroll.current = false
        syncToReadingLine()
      }
      window.addEventListener('scrollend', release)
      timer = window.setTimeout(release, 1500)
    }

    // Amene le centre de l'etape sur la ligne de lecture (et non au centre de
    // l'ecran, qui peut etre masque par le schema en une colonne).
    const rect = el.getBoundingClientRect()
    window.scrollTo({
      top: window.scrollY + rect.top + rect.height / 2 - readingLine(figureRef.current),
      behavior: reducedMotion ? 'auto' : 'smooth',
    })
  }

  return (
    <SectionShell id="etude-de-cas" index="03" title={cs.title} kicker={cs.intro} wide>
      {/* Flex en colonne sous lg, grille au-dela : un element sticky est
          confine a son bloc conteneur, qui est la CELLULE pour un item de
          grille. En une seule colonne, le schema ne collerait jamais ; dans un
          conteneur flex, il colle sur toute la hauteur des etapes. */}
      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
        {/* ---------- Schema (epingle) ---------- */}
        <figure
          ref={figureRef}
          className={cn(
            'glass-panel glass-panel--thick z-10 self-start p-4 sm:p-6',
            // Sous lg, les etapes defilent SOUS le schema : fond opaque.
            'max-lg:bg-abyss/95',
            !reducedMotion && 'sticky top-[4.75rem] lg:top-28',
          )}
        >
          <CaseStudyDiagram labels={cs.labels} states={states} />

          {/* Progression : transform seul. */}
          <div className="mt-4 h-px bg-hairline" aria-hidden="true">
            <div
              className="h-full origin-left bg-accent transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
              style={{ transform: `scaleX(${reducedMotion ? 1 : (active + 1) / total})` }}
            />
          </div>

          <nav aria-label={t.caseStudy.stepsNav} className="mt-4">
            <ol className="flex flex-wrap gap-2">
              {steps.map((step, i) => (
                <li key={step.id}>
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={!reducedMotion && i === active ? 'step' : undefined}
                    aria-label={`${t.caseStudy.step} ${i + 1} : ${step.title}`}
                    className="cs-step-btn"
                    data-active={!reducedMotion && i === active}
                  >
                    <span className="font-mono">{String(i + 1).padStart(2, '0')}</span>
                    {/* Titre visible sur grand ecran seulement : sur mobile
                        le schema epingle doit rester compact. */}
                    <span className="hidden xl:inline">{step.title}</span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>
          <figcaption className="mt-3 text-[11px] leading-relaxed text-muted sm:text-xs">
            {cs.caption}
          </figcaption>
        </figure>

        {/* ---------- Etapes ---------- */}
        <ol className="relative">
          {steps.map((step, i) => (
            <li
              key={step.id}
              ref={(el) => {
                stepRefs.current[i] = el
              }}
              data-step={i}
              id={`etape-${step.id}`}
              className={cn(
                'flex items-center',
                reducedMotion ? 'py-3' : 'min-h-[40vh] py-6 lg:min-h-[68vh]',
              )}
            >
              {/* Fond propre : le texte reste lisible par-dessus le noyau 3D. */}
              <article
                className="cs-step w-full rounded-2xl border border-hairline/60 bg-abyss/70 p-5 backdrop-blur-sm sm:p-6"
                data-active={reducedMotion || i === active}
              >
                <p className="label-mono text-accent/80">
                  {t.caseStudy.step} {String(i + 1).padStart(2, '0')}
                  <span className="text-muted/60"> / {String(total).padStart(2, '0')}</span>
                </p>
                <h3 className="mt-3 font-display text-2xl leading-tight font-semibold text-ink sm:text-3xl">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink/80">{step.body}</p>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </SectionShell>
  )
}

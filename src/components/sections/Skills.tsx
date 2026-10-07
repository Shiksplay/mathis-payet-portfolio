import { ArrowRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { SkillId } from '@/data/cv'
import { Reveal } from '@/components/ui/Reveal'
import { SectionShell } from '@/components/ui/SectionShell'
import { useCv } from '@/hooks/useCv'
import { buildProofIndex, type Proof } from '@/lib/proofs'

/**
 * COMPETENCES -> PREUVES
 * ======================
 *
 * Le PDF liste deja les competences. Ici, chaque competence mise en oeuvre
 * dans une experience (`uses` dans `cv.ts`) devient un bouton : au survol, au
 * focus ou au toucher, un panneau sous sa categorie indique OU elle a ete
 * mise en oeuvre, avec un lien vers la carte correspondante (qui s'eclaire a
 * l'arrivee, via `:target`, voir `index.css`).
 *
 * Une competence sans preuve declaree reste une simple etiquette.
 *
 * ACCESSIBILITE : chaque bouton porte `aria-expanded` / `aria-controls` vers le
 * panneau de sa categorie, et une description (`aria-describedby`) qui donne
 * la preuve directement : un lecteur d'ecran l'entend sans avoir a atteindre
 * le panneau. Echap referme le panneau.
 *
 * Le panneau reserve sa hauteur : l'afficher ne decale pas la mise en page.
 */
export function Skills() {
  const { c, t } = useCv()
  const categories = Object.entries(c.skills)
  const proofs = useMemo(() => buildProofIndex(c), [c])
  const [active, setActive] = useState<SkillId | null>(null)

  return (
    <SectionShell id="competences" index="06" title={t.headings.skills}>
      {/* Fond propre a la legende : sans lui, elle se perd sur le noyau 3D. */}
      <p className="mb-10 flex max-w-2xl items-start gap-3 rounded-xl border border-hairline/70 bg-abyss/70 px-4 py-3 text-sm leading-relaxed text-ink/80 backdrop-blur-sm">
        <span aria-hidden="true" className="skill-dot mt-[7px]" data-proven="true" />
        {t.proofs.legend}
      </p>

      <div className="space-y-10" onKeyDown={(e) => e.key === 'Escape' && setActive(null)}>
        {categories.map(([category, items], groupIndex) => {
          const panelId = `proofs-${groupIndex}`
          const hasProven = items.some((item) => proofs.has(item.id))
          const activeHere = items.some((item) => item.id === active) ? active : null
          const activeProofs = activeHere ? (proofs.get(activeHere) ?? []) : []

          return (
            <Reveal key={category} delay={groupIndex * 0.06}>
              <div>
                {/* Intitule de categorie, traite comme une etiquette technique. */}
                <div className="flex items-center gap-4">
                  <h3 className="label-mono text-ink/70">{category}</h3>
                  <span className="h-px flex-1 bg-hairline" aria-hidden="true" />
                  <span className="font-mono text-[11px] text-muted/50">
                    {String(items.length).padStart(2, '0')}
                  </span>
                </div>

                <ul className="mt-5 flex flex-wrap gap-2.5">
                  {items.map((item) => {
                    const itemProofs = proofs.get(item.id)
                    if (!itemProofs) {
                      return (
                        <li key={item.id}>
                          <span className="skill-node">{item.label}</span>
                        </li>
                      )
                    }
                    const descId = `proof-desc-${item.id}`
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          className="skill-node"
                          data-proven="true"
                          data-active={activeHere === item.id}
                          aria-expanded={activeHere === item.id}
                          aria-controls={panelId}
                          aria-describedby={descId}
                          onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(item.id)}
                          onFocus={() => setActive(item.id)}
                          onClick={() => setActive(item.id)}
                        >
                          {item.label}
                        </button>
                        <span id={descId} className="sr-only">
                          {`${t.proofs.provenBy} : ${itemProofs.map((p) => p.title).join(' ; ')}`}
                        </span>
                      </li>
                    )
                  })}
                </ul>

                {hasProven ? (
                  <div id={panelId} className="mt-3 min-h-12">
                    {/* `key` : chaque nouvelle competence remonte le bloc, ce
                        qui rejoue l'entree CSS `proof-in` (200 ms). Sortie
                        instantanee, plus discrete que l'entree. */}
                    {activeHere && activeProofs.length > 0 ? (
                      <div key={activeHere} className="proof-in">
                        <ProofList proofs={activeProofs} />
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </Reveal>
          )
        })}

        {/* Savoir-etre : meme grammaire visuelle, mais sans pastille d'accent,
            pour ne pas les mettre au meme niveau que les competences techniques. */}
        <Reveal delay={categories.length * 0.06}>
          <div>
            <div className="flex items-center gap-4">
              <h3 className="label-mono text-ink/70">{t.headings.softSkills}</h3>
              <span className="h-px flex-1 bg-hairline" aria-hidden="true" />
            </div>
            <ul className="mt-5 flex flex-wrap gap-2.5">
              {c.softSkills.map((skill) => (
                <li
                  key={skill}
                  className="rounded-full border border-hairline/70 px-3.5 py-1.5 text-[13px] text-muted transition-colors hover:border-iris/45 hover:text-ink"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  )
}

function ProofList({ proofs }: { proofs: Proof[] }) {
  const { t } = useCv()
  return (
    <ul className="space-y-1.5">
      {proofs.map((proof) => (
        <li key={proof.href + proof.title}>
          <a
            href={proof.href}
            className="group/proof inline-flex items-start gap-2 text-sm leading-snug text-muted transition-colors hover:text-ink"
          >
            <ArrowRight
              aria-hidden="true"
              className="mt-[3px] size-3.5 shrink-0 text-accent transition-transform duration-200 group-hover/proof:translate-x-0.5"
            />
            <span>
              {t.proofs.provenBy}{' '}
              <span className="text-ink underline decoration-accent/40 underline-offset-4 group-hover/proof:decoration-accent">
                {proof.title}
              </span>{' '}
              <span className="font-mono text-[11px] text-muted/70">· {proof.period}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}

import { Reveal } from '@/components/ui/Reveal'
import { SectionShell } from '@/components/ui/SectionShell'
import { useCv } from '@/hooks/useCv'

export function Skills() {
  const { c, t } = useCv()
  const categories = Object.entries(c.skills)

  return (
    <SectionShell id="competences" index="05" title={t.headings.skills}>
      <div className="space-y-10">
        {categories.map(([category, items], groupIndex) => (
          <Reveal key={category} delay={groupIndex * 0.08}>
            <div>
              {/* Intitule de categorie, traite comme une etiquette technique. */}
              <div className="flex items-center gap-4">
                <h3 className="label-mono text-ink/70">{category}</h3>
                <span className="h-px flex-1 bg-hairline" aria-hidden="true" />
                <span className="font-mono text-[11px] text-muted/50">
                  {String(items.length).padStart(2, '0')}
                </span>
              </div>

              {/* Les noeuds s'illuminent en cascade a l'entree dans la section :
                  le delai est indexe sur la position du tag, ce qui donne une
                  propagation de gauche a droite, comme un reseau qui s'active. */}
              <ul className="mt-5 flex flex-wrap gap-2.5">
                {items.map((item, itemIndex) => (
                  <li key={item}>
                    <Reveal delay={groupIndex * 0.08 + itemIndex * 0.035} y={8}>
                      <span className="skill-node">{item}</span>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}

        {/* Savoir-etre : meme grammaire visuelle, mais sans pastille d'accent,
            pour ne pas les mettre au meme niveau que les competences techniques. */}
        <Reveal delay={categories.length * 0.08}>
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

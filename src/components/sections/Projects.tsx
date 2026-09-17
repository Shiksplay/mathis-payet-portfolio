import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { SectionShell } from '@/components/ui/SectionShell'
import { TiltCard } from '@/components/ui/TiltCard'
import { useCv } from '@/hooks/useCv'

/**
 * GALERIE DE PROJETS
 * ==================
 *
 * Bande a defilement horizontal, sur le modele des galeries editoriales
 * (landonorris.com aligne ainsi sa collection de casques) : elle permet de
 * presenter des projets a grande echelle sans allonger indefiniment la page.
 *
 * ACCESSIBILITE — le point sensible d'un defilement horizontal.
 * Les cartes ne sont pas des liens (aucune URL de projet n'existe a ce jour),
 * donc rien n'y est focusable : sans precaution, un utilisateur au clavier ne
 * pourrait tout simplement pas atteindre les projets 2 et 3. Le conteneur est
 * donc lui-meme focusable (`tabIndex={0}`) et annonce comme region : au focus,
 * les fleches font defiler la bande. C'est le comportement natif du
 * navigateur, on ne reimplemente aucun raccourci.
 *
 * Le contenu vient du portfolio existant (mathis-p-portfolio.lovable.app).
 */
export function Projects() {
  const { c, t, lang } = useCv()

  return (
    <SectionShell id="projets" index="03" title={t.headings.projects} wide>
      {/* Affordance de glissement : affichee uniquement quand la bande defile
          reellement, donc masquee a partir de lg ou elle devient une grille. */}
      <p className="label-mono mb-6 flex items-center gap-3 lg:hidden">
        <span aria-hidden="true" className="h-px w-8 bg-accent/50" />
        {t.headings.projectsKicker}
      </p>

      <Reveal>
        {/* BANDE HORIZONTALE SOUS lg, GRILLE 3 COLONNES AU-DELA.
            Avec trois projets, un defilement horizontal sur un ecran large ne
            produirait qu'une centaine de pixels de course : une affordance de
            glissement qui ne sert a rien. En dessous de lg, en revanche, la
            bande a defilement est exactement le bon format. */}
        <div
          // Region focusable : rend la bande parcourable au clavier tant
          // qu'elle defile reellement.
          tabIndex={0}
          role="region"
          aria-label={t.headings.projects}
          className="scrollbar-none -mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 sm:-mx-10 sm:gap-7 sm:px-10 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0 lg:pb-0"
        >
          {c.projects.map((project) => (
            <article
              key={project.title}
              className="flex w-[min(85vw,30rem)] shrink-0 snap-start lg:w-auto"
            >
              <TiltCard thick maxTilt={5} className="group/card flex w-full flex-col p-7 sm:p-9">
                {/* Numero de projet en filigrane : ancre visuelle a grande
                    echelle, typique du traitement editorial. */}
                <div className="flex items-start justify-between gap-6">
                  <span
                    aria-hidden="true"
                    className="font-display text-6xl leading-none font-semibold text-ink/[0.07] transition-colors duration-500 group-hover/card:text-accent/25 sm:text-7xl"
                  >
                    {project.index}
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    className="mt-2 size-5 shrink-0 text-muted/40 transition-all duration-500 group-hover/card:translate-x-1 group-hover/card:text-accent"
                  />
                </div>

                <h3 className="mt-8 font-display text-xl leading-tight font-semibold text-ink sm:text-2xl">
                  {project.title}
                </h3>

                <p className="mt-4 flex-1 text-[15px] leading-relaxed text-muted">
                  {project.desc}
                </p>

                <ul className="mt-7 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-hairline/80 px-3 py-1 font-mono text-[10px] tracking-[0.14em] text-muted uppercase transition-colors duration-500 group-hover/card:border-accent/35 group-hover/card:text-ink"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </TiltCard>
            </article>
          ))}
        </div>
      </Reveal>

      <span className="sr-only lg:hidden">
        {lang === 'fr'
          ? 'Utilisez les flèches gauche et droite pour parcourir les projets.'
          : 'Use the left and right arrow keys to browse the projects.'}
      </span>
    </SectionShell>
  )
}

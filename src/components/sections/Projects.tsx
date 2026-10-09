import type { Project } from '@/data/cv'
import type { UiStrings } from '@/data/ui'
import { Reveal } from '@/components/ui/Reveal'
import { SectionShell } from '@/components/ui/SectionShell'
import { TiltCard } from '@/components/ui/TiltCard'
import { useCv } from '@/hooks/useCv'
import { cn } from '@/lib/cn'

/**
 * Badge d'etat. N'apparait que pour un projet en cours : un badge « termine »
 * sur trois cartes sur quatre serait du bruit, pas de l'information.
 *
 * L'etat n'est JAMAIS porte par la seule couleur — le libelle est ecrit.
 */
function OngoingBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-accent/35 bg-accent/[0.07] px-3 py-1 font-mono text-[10px] tracking-[0.14em] text-accent uppercase">
      <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
      {label}
    </span>
  )
}

/** Intitule d'un bloc deplie (Competences / Bilan / Ressenti). */
function BlockLabel({ children }: { children: string }) {
  return (
    <h4 className="label-mono flex items-center gap-3">
      <span aria-hidden="true" className="h-px w-6 bg-accent/50" />
      {children}
    </h4>
  )
}

/**
 * UNE ENTREE DE LA GALERIE
 *
 * Deux formats dans une seule carte, selon ce que `cv.ts` contient :
 *
 *  - CARTE DETAILLEE — le projet porte contexte, competences, bilan et
 *    ressenti. Mise en page editoriale en deux colonnes sur grand ecran :
 *    a gauche l'identite du projet (quoi, quand, avec quelles technos), a
 *    droite la preuve (ce qui a ete mis en oeuvre, ce que ca a donne, ce que
 *    Mathis en retient). C'est la lecture d'un recruteur : il situe, puis il
 *    verifie.
 *  - CARTE COMPACTE — le projet n'a que titre, description et etiquettes. Elle
 *    n'essaie pas de faire semblant d'etre detaillee : elle est plus courte,
 *    et le rythme de la galerie s'en trouve plutot renforce.
 */
function ProjectCard({ project, t }: { project: Project; t: UiStrings }) {
  const detailed = project.context !== undefined || project.outcome !== undefined

  return (
    <TiltCard
      // Inclinaison tres faible : sur une carte pleine largeur, le meme angle
      // que sur une vignette donnerait un basculement de plusieurs dizaines de
      // pixels sur les bords, et le texte deviendrait penible a lire.
      maxTilt={2}
      className={cn(
        'group/card flex w-full flex-col',
        detailed ? 'p-7 sm:p-10 lg:p-12' : 'p-7 sm:p-9',
      )}
    >
      {/* ---------- En-tete : numero en filigrane + etat ---------- */}
      <div className="flex items-start justify-between gap-6">
        <span
          aria-hidden="true"
          className="font-display text-6xl leading-none font-semibold text-ink/[0.07] transition-colors duration-500 group-hover/card:text-accent/25 sm:text-7xl"
        >
          {project.index}
        </span>
        {project.status === 'ongoing' ? <OngoingBadge label={t.projects.ongoing} /> : null}
      </div>

      <div className={cn('mt-8', detailed && 'lg:grid lg:grid-cols-12 lg:gap-x-14')}>
        {/* ---------- Colonne 1 : de quoi il s'agit ---------- */}
        <div className={cn(detailed && 'lg:col-span-5')}>
          {project.period ? <p className="label-mono">{project.period}</p> : null}

          <h3 className="mt-3 font-display text-xl leading-tight font-semibold text-ink sm:text-2xl lg:text-[1.75rem]">
            {project.title}
          </h3>

          {project.context ? (
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">{project.context}</p>
          ) : null}

          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink/85 sm:text-base">
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
        </div>

        {/* ---------- Colonne 2 : la preuve ---------- */}
        {detailed ? (
          <div className="mt-12 space-y-9 lg:col-span-7 lg:mt-0">
            {project.skills ? (
              <div>
                <BlockLabel>{t.projects.skills}</BlockLabel>
                {/* `.skill-node` : meme pastille que la section Competences.
                    Elle porte une puce et une bordure, donc elle reste lisible
                    sans distinguer les couleurs. */}
                <ul className="mt-4 flex flex-wrap gap-2">
                  {project.skills.map((skill) => (
                    <li key={skill} className="skill-node">
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {project.outcome ? (
              <div>
                <BlockLabel>{t.projects.outcome}</BlockLabel>
                <p className="mt-4 text-[15px] leading-relaxed text-muted">{project.outcome}</p>
              </div>
            ) : null}

            {project.reflection ? (
              <div>
                <BlockLabel>{t.projects.reflection}</BlockLabel>
                {/* Le ressenti est a la premiere personne : le filet d'accent
                    et l'italique le detachent du compte rendu factuel. */}
                <p className="mt-4 border-l-2 border-accent/40 pl-5 text-[15px] leading-relaxed text-ink/80 italic">
                  {project.reflection}
                </p>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </TiltCard>
  )
}

/**
 * LA GALERIE DE PROJETS
 * =====================
 *
 * POURQUOI CETTE SECTION NE RESSEMBLE A AUCUNE AUTRE
 * --------------------------------------------------
 * Le CV dit QUOI ; le portfolio doit montrer COMMENT et en apporter la preuve.
 * Cette section est l'endroit ou cette promesse se tient, elle doit donc se
 * lire comme une piece a part et non comme un paragraphe de plus. Trois
 * leviers, tous bases sur des tokens existants :
 *
 *   1. un APLAT pleine largeur (`surface` sur SectionShell) : la galerie cesse
 *      de flotter au-dessus de la scene 3D, on y entre ;
 *   2. des cartes PLEINE LARGEUR empilees, au lieu de la bande a trois
 *      vignettes — c'est ce qui permet de deplier la preuve ;
 *   3. une mise en page interne en deux colonnes, qui rompt avec la colonne de
 *      lecture unique du reste de la page.
 *
 * CE QUI A DISPARU AU PASSAGE : la bande a defilement horizontal, sa region
 * focusable et son mode d'emploi au clavier. Ils existaient uniquement pour
 * qu'un utilisateur au clavier puisse atteindre les cartes 2 et 3 d'un
 * carrousel. Sans carrousel, le probleme n'existe plus : tout est dans le flux
 * du document, donc atteignable par defilement normal. Supprimer un contournement
 * d'accessibilite en supprimant sa cause vaut mieux que le maintenir.
 *
 * Le contenu vient integralement de `src/data/cv.ts`.
 */
export function Projects() {
  const { c, t } = useCv()

  return (
    <SectionShell
      id="projets"
      index="03"
      title={t.headings.projects}
      kicker={t.headings.projectsKicker}
      wide
      surface
    >
      <div className="mx-auto flex max-w-[82rem] flex-col gap-8 sm:gap-10">
        {c.projects.map((project, i) => (
          <Reveal
            key={project.title}
            // Cascade courte et plafonnee : au-dela de trois crans, les
            // dernieres cartes arrivent apres le regard du visiteur.
            delay={Math.min(i, 3) * 0.08}
            duration={0.4}
            y={20}
            className="flex"
          >
            <ProjectCard project={project} t={t} />
          </Reveal>
        ))}
      </div>
    </SectionShell>
  )
}

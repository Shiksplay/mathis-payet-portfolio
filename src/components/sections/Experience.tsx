import { Reveal } from '@/components/ui/Reveal'
import { SectionShell } from '@/components/ui/SectionShell'
import { TiltCard } from '@/components/ui/TiltCard'
import { useCv } from '@/hooks/useCv'

export function Experience() {
  const { c, t } = useCv()

  return (
    <SectionShell id="experience" index="02" title={t.headings.experience}>
      {/* Timeline : un filet vertical continu, un noeud par entree. La liste
          est un <ol> — l'ordre chronologique porte du sens. */}
      <ol className="relative space-y-6 before:absolute before:top-2 before:bottom-2 before:left-[7px] before:w-px before:bg-gradient-to-b before:from-accent/45 before:via-hairline before:to-transparent sm:space-y-8">
        {c.experiences.map((xp, index) => (
          <li key={xp.title} className="relative pl-9 sm:pl-12">
            {/* Noeud de la timeline, aligne sur le filet. */}
            <span
              aria-hidden="true"
              className="absolute top-8 left-0 flex size-[15px] items-center justify-center rounded-full border border-accent/35 bg-abyss"
            >
              <span className="size-[5px] rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]" />
            </span>

            <Reveal delay={index * 0.1}>
              <TiltCard className="p-6 sm:p-8">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                  <p className="label-mono text-accent/80">{xp.period}</p>
                  <p className="label-mono">{xp.type}</p>
                </div>

                <h3 className="mt-4 font-display text-xl leading-snug font-semibold text-ink sm:text-2xl">
                  {xp.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{xp.org}</p>

                <ul className="mt-6 space-y-3">
                  {xp.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3.5 text-[15px] leading-relaxed text-ink/80">
                      {/* Puce en accent, alignee sur la premiere ligne de texte. */}
                      <span
                        aria-hidden="true"
                        className="mt-[9px] size-1 shrink-0 rounded-full bg-accent/70"
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </TiltCard>
            </Reveal>
          </li>
        ))}
      </ol>
    </SectionShell>
  )
}

import { GraduationCap } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { SectionShell } from '@/components/ui/SectionShell'
import { TiltCard } from '@/components/ui/TiltCard'
import { useCv } from '@/hooks/useCv'

export function Education() {
  const { c, t } = useCv()

  return (
    <SectionShell id="formation" index="03" title={t.headings.education}>
      <ol className="grid gap-5 sm:grid-cols-2">
        {c.education.map((step, index) => (
          <li key={step.title}>
            <Reveal delay={index * 0.1} className="h-full">
              <TiltCard className="flex h-full flex-col p-6 sm:p-7" maxTilt={5}>
                <div className="flex items-center justify-between gap-4">
                  <GraduationCap className="size-5 text-accent/70" aria-hidden="true" />
                  <p className="label-mono text-accent/80">{step.period}</p>
                </div>
                <h3 className="mt-5 font-display text-lg leading-snug font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-muted">{step.org}</p>
              </TiltCard>
            </Reveal>
          </li>
        ))}
      </ol>
    </SectionShell>
  )
}

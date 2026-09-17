import { Trophy } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { SectionShell } from '@/components/ui/SectionShell'
import { TiltCard } from '@/components/ui/TiltCard'
import { useCv } from '@/hooks/useCv'

export function Activities() {
  const { c, t } = useCv()

  return (
    <SectionShell id="engagements" index="05" title={t.headings.activities}>
      <ul className="grid gap-5 sm:grid-cols-2">
        {c.activities.map((activity, index) => (
          <li key={activity.title}>
            <Reveal delay={index * 0.1} className="h-full">
              <TiltCard className="flex h-full flex-col p-6 sm:p-7" maxTilt={5}>
                <div className="flex items-center justify-between gap-4">
                  <Trophy className="size-5 text-iris/70" aria-hidden="true" />
                  <p className="label-mono text-iris/80">{activity.period}</p>
                </div>
                <h3 className="mt-5 font-display text-lg leading-snug font-semibold text-ink">
                  {activity.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted">{activity.desc}</p>
              </TiltCard>
            </Reveal>
          </li>
        ))}
      </ul>
    </SectionShell>
  )
}

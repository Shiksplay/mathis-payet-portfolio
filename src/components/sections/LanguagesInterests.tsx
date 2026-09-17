import { Heart, Languages } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { SectionShell } from '@/components/ui/SectionShell'
import { useCv } from '@/hooks/useCv'

/**
 * Bloc compact : langues et centres d'interet partagent une section, car ni
 * l'une ni l'autre ne justifie une section pleine — et les etirer artificiellement
 * donnerait l'impression de remplir.
 */
export function LanguagesInterests() {
  const { c, t } = useCv()

  return (
    <SectionShell id="langues" index="07" title={t.headings.languages}>
      <Reveal>
        <div className="glass-panel grid gap-8 p-6 sm:grid-cols-2 sm:p-8">
        <div>
          <h3 className="label-mono flex items-center gap-2.5 text-ink/70">
            <Languages className="size-4 text-accent/70" aria-hidden="true" />
            {t.headings.languages}
          </h3>
          <ul className="mt-5 space-y-2.5">
            {c.languages.map((language) => (
              <li key={language.name} className="flex items-baseline justify-between gap-4">
                <span className="text-[15px] text-ink">{language.name}</span>
                <span className="font-mono text-xs text-accent/80">{language.level}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="sm:border-l sm:border-hairline sm:pl-8">
          <h3 className="label-mono flex items-center gap-2.5 text-ink/70">
            <Heart className="size-4 text-iris/70" aria-hidden="true" />
            {t.headings.interests}
          </h3>
          <ul className="mt-5 flex flex-wrap gap-2">
            {c.interests.map((interest) => (
              <li
                key={interest}
                className="rounded-full border border-hairline/70 px-3.5 py-1.5 text-[13px] text-muted"
              >
                {interest}
              </li>
            ))}
          </ul>
        </div>
        </div>
      </Reveal>
    </SectionShell>
  )
}

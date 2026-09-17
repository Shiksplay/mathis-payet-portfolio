import { Reveal } from '@/components/ui/Reveal'
import { SectionShell } from '@/components/ui/SectionShell'
import { useCv } from '@/hooks/useCv'

export function Profile() {
  const { c, t } = useCv()

  return (
    <SectionShell id="profil" index="01" title={t.headings.profile}>
      <Reveal>
        {/* Pas de panneau vitre ici : le texte de profil est le seul contenu de
            la section, il gagne a flotter directement sur la scene 3D. Un
            filet vertical en accent tient le bloc. */}
        <div className="relative border-l border-hairline pl-6 sm:pl-8">
          <span
            aria-hidden="true"
            className="absolute top-0 -left-px h-20 w-px bg-gradient-to-b from-accent to-transparent"
          />
          <p className="max-w-3xl text-lg leading-[1.75] text-ink/85 sm:text-xl sm:leading-[1.7]">
            {c.profile}
          </p>
        </div>
      </Reveal>
    </SectionShell>
  )
}

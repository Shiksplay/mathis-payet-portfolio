import { ArrowDown, Download, MapPin, Send } from 'lucide-react'
import { ActionButton } from '@/components/ui/ActionButton'
import { Reveal } from '@/components/ui/Reveal'
import { ScrambleHeading } from '@/components/ui/ScrambleHeading'
import { useCv } from '@/hooks/useCv'

export function Hero() {
  const { c, t } = useCv()

  return (
    <section id="hero" className="relative flex min-h-svh items-center px-6 py-28 sm:px-8">
      {/* Voile de lisibilite : le noyau est certes decale a droite par le
          cadrage de la camera, mais ses noeuds les plus externes atteignent
          encore la zone de texte. Ce degrade garantit le contraste du H1 sans
          masquer le noyau. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-full max-w-[56rem] bg-gradient-to-r from-abyss/95 via-abyss/75 to-transparent"
      />

      <div className="relative mx-auto w-full max-w-6xl">
        {/* Badge de disponibilite : l'information la plus importante pour un
            recruteur, donc la premiere lue. */}
        <Reveal y={12}>
          <p className="inline-flex items-center gap-2.5 rounded-full border border-accent/25 bg-accent/[0.06] px-4 py-1.5 backdrop-blur-sm">
            <span className="relative flex size-1.5" aria-hidden="true">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-70" />
              <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
            </span>
            <span className="font-mono text-[11px] tracking-[0.14em] text-accent uppercase">
              {c.availability}
            </span>
          </p>
        </Reveal>

        {/* Unique <h1> de la page. */}
        <ScrambleHeading
          as="h1"
          text={c.name}
          msPerChar={44}
          className="mt-7 font-display text-[clamp(2.75rem,11vw,7.5rem)] leading-[0.92] font-semibold tracking-tight text-ink"
        />

        <Reveal delay={0.15} y={16}>
          <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="h-px w-12 bg-gradient-to-r from-accent to-transparent" aria-hidden="true" />
            <span className="font-mono text-xs tracking-[0.2em] text-accent uppercase sm:text-sm">
              {c.title}
            </span>
          </p>
        </Reveal>

        {/* Accroche du portfolio, seule phrase du hero.
            La premiere phrase du profil y figurait aussi, mais les deux
            commencaient par "Étudiant" : la repetition sautait aux yeux. Le
            profil complet est de toute facon juste en dessous (section 01), et
            un hero court porte mieux. */}
        <Reveal delay={0.22}>
          <p className="mt-8 max-w-2xl text-xl leading-snug text-ink/90 sm:text-2xl">
            {c.tagline}
          </p>
        </Reveal>

        <Reveal delay={0.35}>
          <div className="mt-11 flex flex-wrap items-center gap-3">
            <ActionButton
              href="/cv/CV_Mathis_Payet.pdf"
              variant="primary"
              icon={Download}
              download="CV_Mathis_Payet.pdf"
            >
              {t.hero.downloadCv}
            </ActionButton>
            <ActionButton href="#contact" icon={Send}>
              {t.hero.contactMe}
            </ActionButton>
          </div>
        </Reveal>

        <Reveal delay={0.5}>
          <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs text-muted/80">
            <span className="inline-flex items-center gap-2 font-mono tracking-wider">
              <MapPin className="size-3.5 text-accent/60" aria-hidden="true" />
              {c.location}
            </span>
            <span className="inline-flex items-center gap-2 font-mono tracking-wider">
              <ArrowDown className="size-3.5 animate-bounce text-accent/60" aria-hidden="true" />
              {t.hero.scrollHint}
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

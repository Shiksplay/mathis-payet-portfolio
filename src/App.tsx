import { CustomCursor } from '@/components/layout/CustomCursor'
import { Footer } from '@/components/layout/Footer'
import { Nav } from '@/components/layout/Nav'
import { Scene } from '@/components/layout/Scene'
import { ScrollProgressBar } from '@/components/layout/ScrollProgressBar'
import { SkipLink } from '@/components/layout/SkipLink'
import { LangCrossfade } from '@/components/ui/LangCrossfade'
import { SectionShell } from '@/components/ui/SectionShell'
import { useCv } from '@/hooks/useCv'
import { useDeviceTierSync } from '@/hooks/useDeviceTier'
import { useReducedMotionSync } from '@/hooks/useReducedMotion'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { useTrackers } from '@/hooks/useTrackers'

export default function App() {
  // Ces quatre hooks sont montes une seule fois, ici.
  useReducedMotionSync()
  useDeviceTierSync()
  useTrackers()
  useScrollSpy()

  const { c, t } = useCv()

  return (
    <>
      {/* Arriere-plan (canvas 3D ou fallback) — z-0, derriere tout le reste. */}
      <Scene />

      <SkipLink />
      <ScrollProgressBar />
      <CustomCursor />
      <Nav />

      {/* Tout le contenu vit au-dessus du canvas. */}
      <div className="relative z-10">
        <LangCrossfade>
          <main>
            <section id="hero" className="flex min-h-svh items-center px-6 sm:px-8">
              <div className="mx-auto w-full max-w-6xl">
                <h1 className="font-display text-5xl font-semibold sm:text-7xl">{c.name}</h1>
                <p className="mt-4 text-accent">{c.title}</p>
              </div>
            </section>

            <SectionShell id="profil" index="01" title={t.headings.profile}>
              <p className="text-lg leading-relaxed text-muted">{c.profile}</p>
            </SectionShell>

            {/* Sections restantes ajoutees en phase 4. */}
            <div id="experience" />
            <div id="formation" />
            <div id="competences" />
            <div id="engagements" />
            <div id="langues" />
            <div id="contact" />
          </main>
        </LangCrossfade>

        <Footer />
      </div>
    </>
  )
}

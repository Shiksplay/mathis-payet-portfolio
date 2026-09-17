import { CustomCursor } from '@/components/layout/CustomCursor'
import { Footer } from '@/components/layout/Footer'
import { Nav } from '@/components/layout/Nav'
import { ScrollProgressBar } from '@/components/layout/ScrollProgressBar'
import { SkipLink } from '@/components/layout/SkipLink'
import { StaticBackdrop } from '@/components/layout/StaticBackdrop'
import { LangCrossfade } from '@/components/ui/LangCrossfade'
import { SectionShell } from '@/components/ui/SectionShell'
import { useCv } from '@/hooks/useCv'
import { useDeviceTierSync } from '@/hooks/useDeviceTier'
import { useReducedMotionSync } from '@/hooks/useReducedMotion'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { useTrackers } from '@/hooks/useTrackers'

export default function App() {
  useReducedMotionSync()
  useDeviceTierSync()
  useTrackers()
  useScrollSpy()

  const { c, t } = useCv()

  return (
    <>
      <StaticBackdrop />
      <SkipLink />
      <ScrollProgressBar />
      <CustomCursor />
      <Nav />

      <LangCrossfade>
        <main>
          <section id="hero" className="flex min-h-svh items-center px-6 sm:px-8">
            <div className="mx-auto max-w-6xl">
              <h1 className="font-display text-5xl font-semibold sm:text-7xl">{c.name}</h1>
              <p className="mt-4 text-accent">{c.title}</p>
            </div>
          </section>

          <SectionShell id="profil" index="01" title={t.headings.profile}>
            <p className="text-lg leading-relaxed text-muted">{c.profile}</p>
          </SectionShell>
        </main>
      </LangCrossfade>

      <Footer />
    </>
  )
}

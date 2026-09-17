import { BootSequence } from '@/components/boot/BootSequence'
import { CustomCursor } from '@/components/layout/CustomCursor'
import { Footer } from '@/components/layout/Footer'
import { Nav } from '@/components/layout/Nav'
import { Scene } from '@/components/layout/Scene'
import { ScrollProgressBar } from '@/components/layout/ScrollProgressBar'
import { SkipLink } from '@/components/layout/SkipLink'
import { Activities } from '@/components/sections/Activities'
import { Contact } from '@/components/sections/Contact'
import { Education } from '@/components/sections/Education'
import { Experience } from '@/components/sections/Experience'
import { Hero } from '@/components/sections/Hero'
import { LanguagesInterests } from '@/components/sections/LanguagesInterests'
import { Profile } from '@/components/sections/Profile'
import { Skills } from '@/components/sections/Skills'
import { LangCrossfade } from '@/components/ui/LangCrossfade'
import { useDeviceTierSync } from '@/hooks/useDeviceTier'
import { useReducedMotionSync } from '@/hooks/useReducedMotion'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { useTrackers } from '@/hooks/useTrackers'

export default function App() {
  // Hooks globaux, montes une seule fois : preferences d'animation, capacite
  // graphique, suivi scroll/pointeur, scrollspy.
  useReducedMotionSync()
  useDeviceTierSync()
  useTrackers()
  useScrollSpy()

  return (
    <>
      {/* Arriere-plan : canvas 3D persistant (z-0) ou fallback statique. */}
      <Scene />

      <SkipLink />
      <ScrollProgressBar />
      <CustomCursor />
      <Nav />

      {/* Tout le contenu du CV vit au-dessus du canvas. */}
      <div className="relative z-10">
        <LangCrossfade>
          <main>
            <Hero />
            <Profile />
            <Experience />
            <Education />
            <Skills />
            <Activities />
            <LanguagesInterests />
            <Contact />
          </main>
        </LangCrossfade>

        <Footer />
      </div>

      {/* Overlay de boot : au-dessus de tout, une seule fois par session. */}
      <BootSequence />
    </>
  )
}

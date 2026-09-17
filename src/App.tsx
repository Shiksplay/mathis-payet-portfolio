import { domAnimation, LazyMotion } from 'motion/react'
import { useMemo } from 'react'
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
import { Projects } from '@/components/sections/Projects'
import { Skills } from '@/components/sections/Skills'
import { Marquee } from '@/components/ui/SectionShell'
import { LangCrossfade } from '@/components/ui/LangCrossfade'
import { LiquidGlassFilters } from '@/components/ui/LiquidGlassFilters'
import { useCv } from '@/hooks/useCv'
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

  const { c } = useCv()

  /**
   * Mots-cles du bandeau defilant, DERIVES des competences du CV plutot que
   * ressaisis : impossible qu'ils divergent du contenu reel. On prend les deux
   * premieres entrees de chaque categorie pour garder une bande courte.
   */
  const marqueeItems = useMemo(
    () => Object.values(c.skills).flatMap((items) => items.slice(0, 2)),
    [c.skills],
  )

  return (
    // `domAnimation` fournit uniquement les fonctionnalites necessaires
    // (animations DOM + gestes de base), au lieu du moteur complet.
    // `strict` fait echouer le build a l'usage d'un `motion.*` non allege :
    // garde-fou contre une regression de taille de bundle.
    <LazyMotion features={domAnimation} strict>
      {/* Definitions des filtres de refraction du verre liquide, referencees
          depuis le CSS. Doit etre dans le DOM pour que Chromium les applique. */}
      <LiquidGlassFilters />

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

            {/* Bandeaux defilants : respiration rythmique entre deux blocs
                denses. Les mots-cles sont derives de `cv.skills`, donc ils
                restent justes si les competences evoluent. */}
            <Marquee items={marqueeItems} />

            <Experience />
            <Projects />
            <Education />

            <Marquee items={marqueeItems} />

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
    </LazyMotion>
  )
}

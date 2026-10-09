import { Color } from 'three'
import type { Theme } from '@/store/useAppStore'

/**
 * PALETTE DE LA SCENE 3D, PAR THEME
 * =================================
 *
 * Miroir des tokens CSS (`--color-*` dans index.css) : le canvas peint le fond
 * de la page, il doit donc basculer avec elle. Les valeurs sont dupliquees ici
 * plutot que lues depuis le CSS parce qu'un shader a besoin de `THREE.Color`
 * en espace lineaire, pas d'une chaine CSS a reparser a chaque frame.
 *
 * DEUX AJUSTEMENTS NON EVIDENTS EN THEME CLAIR
 * --------------------------------------------
 * 1. MELANGE. Le noyau reseau est dessine en melange ADDITIF : parfait sur un
 *    fond noir (la lumiere s'accumule), inutilisable sur un fond clair ou tout
 *    ce qu'on ajoute sature vers le blanc et disparait. En clair on repasse
 *    donc en melange NORMAL avec des couleurs sombres : le graphe se lit alors
 *    comme un trace a l'encre, et non comme une lumiere eteinte.
 * 2. BLOOM. Le seuil de luminance du bloom (0.12) est en dessous de la
 *    luminance d'un fond clair : la passe ferait rayonner le fond lui-meme et
 *    noierait la page dans un halo. Le bloom est donc coupe en clair.
 */
export interface ScenePalette {
  /** Fond de degrade (GradientField). */
  field: {
    base: Color
    veil: Color
    accent: Color
    iris: Color
    /**
     * Luminosite des coins (vignettage). En sombre on assombrit nettement
     * (0.55) pour concentrer la lumiere au centre ; en clair, assombrir
     * reviendrait a poser du gris sale dans les angles.
     */
    floor: number
  }
  /** Noyau reseau, trafic et nuee de particules. */
  core: {
    accent: Color
    iris: Color
    packetCore: Color
    packetEdge: Color
    flow: Color
  }
  /** Melange additif (fond sombre) ou normal (fond clair). */
  additive: boolean
  /** Le bloom est reserve au fond sombre. */
  bloom: boolean
  /**
   * Opacites de base, recalibrees par mode de melange : en additif l'intensite
   * s'accumule, en normal c'est l'alpha seul qui porte la densite.
   */
  opacity: {
    node: number
    edge: number
    packet: number
    flow: number
  }
}

export const SCENE_PALETTE: Record<Theme, ScenePalette> = {
  dark: {
    field: {
      base: new Color('#05070a'),
      veil: new Color('#0b1220'),
      accent: new Color('#00e5ff'),
      iris: new Color('#7c5cfc'),
      floor: 0.55,
    },
    core: {
      accent: new Color('#00e5ff'),
      iris: new Color('#7c5cfc'),
      packetCore: new Color('#eafcff'), // coeur presque blanc
      packetEdge: new Color('#00e5ff'), // halo cyan
      flow: new Color('#7fd6ff'), // cyan desature : ambiance, pas accent
    },
    additive: true,
    bloom: true,
    opacity: { node: 0.95, edge: 0.16, packet: 1, flow: 0.5 },
  },
  light: {
    field: {
      base: new Color('#eef1f6'),
      veil: new Color('#ffffff'),
      // Teintes PALES, et non l'accent du theme : le shader les melange
      // jusqu'a 35 %, une couleur saturee donnerait un fond criard sous le
      // texte. Le contraste, c'est l'encre qui le porte.
      accent: new Color('#a9d8e6'),
      iris: new Color('#cdbdf3'),
      floor: 0.96,
    },
    core: {
      accent: new Color('#0e7490'),
      iris: new Color('#6d28d9'),
      packetCore: new Color('#13425a'), // coeur d'encre, pas tout a fait noir
      packetEdge: new Color('#0e7490'),
      flow: new Color('#7c9fb8'),
    },
    additive: false,
    bloom: false,
    // Plus basses qu'en sombre : en melange normal, chaque point est un aplat
    // et non une lumiere qui s'accumule. Au-dela, le graphe se met a mitrailler
    // la page de points noirs au lieu de la texturer.
    opacity: { node: 0.55, edge: 0.26, packet: 0.7, flow: 0.22 },
  },
}

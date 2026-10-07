import { create } from 'zustand'
import { LANGS, type Lang } from '@/data/cv'

const LANG_KEY = 'mp.lang'
const BOOT_KEY = 'mp.boot'

/**
 * Niveau de capacite graphique de l'appareil, determine une seule fois au
 * montage (voir `useDeviceTier`) :
 *  - 'high' : desktop avec WebGL -> scene complete + post-processing
 *  - 'low'  : mobile / peu de coeurs -> scene allegee, pas de post-processing
 *  - 'none' : WebGL indisponible ou animations reduites -> fallback statique
 */
export type Tier = 'high' | 'low' | 'none'

interface AppState {
  lang: Lang
  setLang: (lang: Lang) => void
  toggleLang: () => void

  /** Section actuellement visible (scrollspy) — pilote la nav et la camera. */
  activeSection: string
  setActiveSection: (id: string) => void

  reducedMotion: boolean
  setReducedMotion: (value: boolean) => void

  tier: Tier
  setTier: (tier: Tier) => void

  /** La sequence de boot a-t-elle deja ete jouee/passee ? */
  bootDone: boolean
  finishBoot: () => void
}

function isLang(value: string | null): value is Lang {
  return value !== null && (LANGS as readonly string[]).includes(value)
}

/**
 * Langue initiale : preference enregistree > langue du navigateur > FR.
 */
function detectInitialLang(): Lang {
  if (typeof window === 'undefined') return 'fr'
  try {
    const stored = window.localStorage.getItem(LANG_KEY)
    if (isLang(stored)) return stored
  } catch {
    /* localStorage indisponible (navigation privee, cookies bloques) */
  }
  const nav = window.navigator.language?.toLowerCase() ?? ''
  return nav.startsWith('en') ? 'en' : 'fr'
}

/** La sequence de boot ne se joue qu'une fois par session d'onglet. */
function detectBootDone(): boolean {
  if (typeof window === 'undefined') return true
  try {
    return window.sessionStorage.getItem(BOOT_KEY) === '1'
  } catch {
    return false
  }
}

/**
 * Valeur initiale lue des la creation du store, et non dans un effet : sinon le
 * premier rendu voit `false`, `useDeviceTierSync` calcule un tier 'high'/'low'
 * avec cette valeur perimee, et le `React.lazy` de la scene part telecharger
 * three.js avant que la preference reelle ne soit appliquee.
 */
function detectReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function persistLang(lang: Lang): void {
  try {
    window.localStorage.setItem(LANG_KEY, lang)
  } catch {
    /* ignore */
  }
}

/** Tient l'attribut lang de <html> synchronise avec la langue active. */
function applyHtmlLang(lang: Lang): void {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang
  }
}

const initialLang = detectInitialLang()
applyHtmlLang(initialLang)

export const useAppStore = create<AppState>()((set, get) => ({
  lang: initialLang,
  setLang: (lang) => {
    if (get().lang === lang) return
    persistLang(lang)
    applyHtmlLang(lang)
    set({ lang })
  },
  toggleLang: () => {
    const next: Lang = get().lang === 'fr' ? 'en' : 'fr'
    persistLang(next)
    applyHtmlLang(next)
    set({ lang: next })
  },

  activeSection: 'hero',
  setActiveSection: (id) => {
    if (get().activeSection !== id) set({ activeSection: id })
  },

  reducedMotion: detectReducedMotion(),
  setReducedMotion: (value) => set({ reducedMotion: value }),

  tier: 'none',
  setTier: (tier) => set({ tier }),

  bootDone: detectBootDone(),
  finishBoot: () => {
    try {
      window.sessionStorage.setItem(BOOT_KEY, '1')
    } catch {
      /* ignore */
    }
    set({ bootDone: true })
  },
}))

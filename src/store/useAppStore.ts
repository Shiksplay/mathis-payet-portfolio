import { create } from 'zustand'
import { LANGS, type Lang } from '@/data/cv'

const LANG_KEY = 'mp.lang'
const BOOT_KEY = 'mp.boot'
/** Doit rester identique a la cle lue par le script anti-flash de index.html. */
const THEME_KEY = 'mp.theme'

/**
 * Theme visuel. 'dark' est le theme de base du site (fond quasi noir) ; 'light'
 * est la variante claire, declenchee uniquement par le bouton de la nav.
 */
export type Theme = 'dark' | 'light'

/** Couleur de la barre de navigateur, accordee au token --color-abyss. */
const THEME_COLOR: Record<Theme, string> = {
  dark: '#05070a',
  light: '#eef1f6',
}

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

  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void

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

/**
 * Theme initial : preference enregistree, sinon le theme de base du site.
 *
 * `prefers-color-scheme` est VOLONTAIREMENT ignore. Le dark est l'identite du
 * portfolio, pas un reglage de confort : un visiteur en preference systeme
 * claire verrait sinon une version du site qui n'est pas celle pensee par
 * defaut. Le clair reste a un clic, et ce clic est memorise.
 */
function detectInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  try {
    return window.localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

function persistTheme(theme: Theme): void {
  try {
    window.localStorage.setItem(THEME_KEY, theme)
  } catch {
    /* ignore */
  }
}

/**
 * Applique le theme au document : un seul attribut, `data-theme` sur <html>,
 * qui redefinit les tokens de couleur (voir index.css). Les deux balises meta
 * suivent pour que le chrome du navigateur (barre d'adresse mobile, widgets
 * natifs, barres de defilement) s'accorde au theme choisi.
 */
function applyHtmlTheme(theme: Theme): void {
  if (typeof document === 'undefined') return

  document.documentElement.dataset.theme = theme

  const themeColor = document.querySelector('meta[name="theme-color"]')
  themeColor?.setAttribute('content', THEME_COLOR[theme])

  const colorScheme = document.querySelector('meta[name="color-scheme"]')
  colorScheme?.setAttribute('content', theme)
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

// Le script inline de index.html a deja pose `data-theme` avant le premier
// rendu (pas de flash). On reapplique ici pour couvrir les cas ou ce script
// n'a pas tourne et pour synchroniser les balises meta.
const initialTheme = detectInitialTheme()
applyHtmlTheme(initialTheme)

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

  theme: initialTheme,
  setTheme: (theme) => {
    if (get().theme === theme) return
    persistTheme(theme)
    applyHtmlTheme(theme)
    set({ theme })
  },
  toggleTheme: () => {
    const next: Theme = get().theme === 'dark' ? 'light' : 'dark'
    persistTheme(next)
    applyHtmlTheme(next)
    set({ theme: next })
  },

  activeSection: 'hero',
  setActiveSection: (id) => {
    if (get().activeSection !== id) set({ activeSection: id })
  },

  reducedMotion: false,
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

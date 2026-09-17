import { Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { SECTIONS } from '@/data/sections'
import { useCv } from '@/hooks/useCv'
import { cn } from '@/lib/cn'
import { useAppStore } from '@/store/useAppStore'
import { LangToggle } from './LangToggle'

const NAV_SECTIONS = SECTIONS.filter((s) => s.inNav)

/** Monogramme "MP" — meme construction geometrique que le favicon. */
function Monogram() {
  return (
    <svg viewBox="0 0 64 64" className="size-8" aria-hidden="true">
      <defs>
        <linearGradient id="nav-mp" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--color-accent)" />
          <stop offset="1" stopColor="var(--color-iris)" />
        </linearGradient>
      </defs>
      <g
        fill="none"
        stroke="url(#nav-mp)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M13 45V20l9.5 13L32 20v25" />
        <path d="M41 45V20h7a8 8 0 0 1 0 16h-7" />
      </g>
    </svg>
  )
}

export function Nav() {
  const { lang, c, t } = useCv()
  const activeSection = useAppStore((s) => s.activeSection)
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // Fermeture du menu mobile : Echap, ou clic hors du panneau.
  useEffect(() => {
    if (!open) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    const onPointerDown = (e: PointerEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-80">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 sm:px-8">
        {/* Retour en haut de page */}
        <a
          href="#hero"
          className="flex items-center gap-3 rounded-full transition-opacity hover:opacity-80"
          aria-label={c.name}
        >
          <Monogram />
          <span className="hidden font-mono text-[11px] tracking-[0.2em] text-muted uppercase sm:inline">
            {c.name}
          </span>
        </a>

        <div className="flex items-center gap-2">
          {/* Navigation desktop */}
          <nav aria-label={lang === 'fr' ? 'Navigation principale' : 'Main navigation'}>
            <ul className="hidden items-center gap-7 text-sm md:flex">
              {NAV_SECTIONS.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="nav-link"
                    data-active={activeSection === section.id}
                    aria-current={activeSection === section.id ? 'true' : undefined}
                  >
                    {section.label[lang]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <LangToggle className="ml-2" />

          {/* Bouton menu mobile */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t.nav.closeMenu : t.nav.menu}
            className="flex size-9 items-center justify-center rounded-full border border-hairline text-ink transition-colors hover:border-accent/50 hover:text-accent md:hidden"
          >
            {open ? (
              <X className="size-4" aria-hidden="true" />
            ) : (
              <Menu className="size-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Panneau mobile — retire du DOM quand ferme, pour ne pas piéger le focus. */}
      {open ? (
        <div ref={panelRef} className="px-6 pb-4 md:hidden">
          <nav
            id="mobile-nav"
            aria-label={lang === 'fr' ? 'Navigation principale' : 'Main navigation'}
            className="glass-panel overflow-hidden p-2"
          >
            <ul className="flex flex-col">
              {NAV_SECTIONS.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    onClick={() => setOpen(false)}
                    aria-current={activeSection === section.id ? 'true' : undefined}
                    className={cn(
                      'block rounded-xl px-4 py-3 text-sm transition-colors',
                      activeSection === section.id
                        ? 'bg-accent/10 text-accent'
                        : 'text-muted hover:bg-white/5 hover:text-ink',
                    )}
                  >
                    {section.label[lang]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      ) : null}
    </header>
  )
}

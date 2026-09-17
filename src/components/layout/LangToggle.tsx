import { LANGS, type Lang } from '@/data/cv'
import { useCv } from '@/hooks/useCv'
import { cn } from '@/lib/cn'
import { useAppStore } from '@/store/useAppStore'

/**
 * Bascule FR / EN.
 *
 * Implemente comme un groupe de deux boutons avec `aria-pressed` plutot qu'un
 * interrupteur unique : l'etat courant est explicite pour un lecteur d'ecran, et
 * chaque langue est atteignable directement au clavier.
 */
export function LangToggle({ className }: { className?: string }) {
  const lang = useAppStore((s) => s.lang)
  const setLang = useAppStore((s) => s.setLang)
  const { t } = useCv()

  return (
    <div
      role="group"
      aria-label={t.nav.langLabel}
      className={cn(
        'relative flex items-center gap-0.5 rounded-full border border-hairline bg-deep/50 p-0.5 backdrop-blur-md',
        className,
      )}
    >
      {LANGS.map((code: Lang) => {
        const active = code === lang
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={active}
            className={cn(
              'rounded-full px-3 py-1 font-mono text-[11px] tracking-widest uppercase transition-colors duration-300',
              active ? 'bg-accent text-abyss' : 'text-muted hover:text-ink',
            )}
          >
            {code}
          </button>
        )
      })}
    </div>
  )
}

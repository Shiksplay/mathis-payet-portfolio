import { Moon, Sun } from 'lucide-react'
import { useCv } from '@/hooks/useCv'
import { Segment, SegmentedControl } from '@/components/ui/SegmentedControl'
import { useAppStore, type Theme } from '@/store/useAppStore'

/**
 * Bascule theme sombre / theme clair.
 *
 * Meme forme et meme grammaire d'interaction que <LangToggle /> : deux options
 * dans une pastille en verre, l'option active en accent plein. Les icones
 * remplacent le texte (le libelle part dans `aria-label` et dans l'infobulle)
 * pour que la nav reste lisible sur mobile, ou l'espace horizontal est compte.
 *
 * Le changement de theme lui-meme ne touche a aucune classe : le store pose
 * `data-theme` sur <html>, ce qui redefinit les tokens de couleur (index.css).
 * Toute la page suit, y compris la scene 3D qui lit le theme dans le store.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useAppStore((s) => s.theme)
  const setTheme = useAppStore((s) => s.setTheme)
  const { t } = useCv()

  const options: { value: Theme; label: string; Icon: typeof Sun }[] = [
    { value: 'dark', label: t.nav.themeDark, Icon: Moon },
    { value: 'light', label: t.nav.themeLight, Icon: Sun },
  ]

  return (
    <SegmentedControl label={t.nav.themeLabel} className={className}>
      {options.map(({ value, label, Icon }) => (
        <Segment
          key={value}
          active={value === theme}
          onSelect={() => setTheme(value)}
          label={label}
        >
          <Icon className="size-3.5" aria-hidden="true" />
        </Segment>
      ))}
    </SegmentedControl>
  )
}

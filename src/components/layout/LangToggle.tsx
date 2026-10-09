import { LANGS, type Lang } from '@/data/cv'
import { useCv } from '@/hooks/useCv'
import { Segment, SegmentedControl } from '@/components/ui/SegmentedControl'
import { useAppStore } from '@/store/useAppStore'

/**
 * Bascule FR / EN.
 *
 * Partage sa coquille avec <ThemeToggle /> (voir `SegmentedControl`) : les deux
 * pastilles de la nav sont ainsi rigoureusement identiques.
 */
export function LangToggle({ className }: { className?: string }) {
  const lang = useAppStore((s) => s.lang)
  const setLang = useAppStore((s) => s.setLang)
  const { t } = useCv()

  return (
    <SegmentedControl label={t.nav.langLabel} className={className}>
      {LANGS.map((code: Lang) => (
        <Segment
          key={code}
          active={code === lang}
          onSelect={() => setLang(code)}
          label={code}
        />
      ))}
    </SegmentedControl>
  )
}

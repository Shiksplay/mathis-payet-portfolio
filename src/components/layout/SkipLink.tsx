import { useCv } from '@/hooks/useCv'

/**
 * Premier element focusable de la page : permet de sauter la navigation au
 * clavier. Invisible jusqu'a la prise de focus.
 */
export function SkipLink() {
  const { t } = useCv()

  return (
    <a
      href="#profil"
      className="sr-only-focusable fixed top-4 left-4 z-100 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-abyss"
    >
      {t.skipToContent}
    </a>
  )
}

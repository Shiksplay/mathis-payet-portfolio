import { cv, type CvContent, type Lang } from '@/data/cv'
import { ui, type UiStrings } from '@/data/ui'
import { useAppStore } from '@/store/useAppStore'

/**
 * Point d'acces unique au contenu traduit. Tout composant qui affiche du texte
 * passe par ici, ce qui garantit que le switch de langue se propage partout.
 */
export function useCv(): { lang: Lang; c: CvContent; t: UiStrings } {
  const lang = useAppStore((s) => s.lang)
  return { lang, c: cv[lang], t: ui[lang] }
}

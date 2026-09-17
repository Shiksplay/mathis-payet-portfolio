import type { Lang } from './cv'

/**
 * Definition des sections de la page, dans l'ordre du DOM.
 *
 * `id` sert a la fois d'ancre (#id), de cible du scrollspy et de cle de
 * correspondance avec les keyframes de camera (voir `lib/cameraKeyframes.ts`).
 * `inNav` permet d'exclure une section de la navigation sans la retirer du flux.
 */
export interface SectionDef {
  id: string
  label: Record<Lang, string>
  inNav: boolean
}

export const SECTIONS: readonly SectionDef[] = [
  { id: 'hero', label: { fr: 'Accueil', en: 'Home' }, inNav: false },
  { id: 'profil', label: { fr: 'Profil', en: 'Profile' }, inNav: true },
  { id: 'experience', label: { fr: 'Expérience', en: 'Experience' }, inNav: true },
  { id: 'formation', label: { fr: 'Formation', en: 'Education' }, inNav: true },
  { id: 'competences', label: { fr: 'Compétences', en: 'Skills' }, inNav: true },
  { id: 'engagements', label: { fr: 'Engagements', en: 'Activities' }, inNav: true },
  { id: 'langues', label: { fr: 'Langues', en: 'Languages' }, inNav: false },
  { id: 'contact', label: { fr: 'Contact', en: 'Contact' }, inNav: true },
] as const

export const SECTION_IDS: readonly string[] = SECTIONS.map((s) => s.id)

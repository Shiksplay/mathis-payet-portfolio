import type { CvContent, SkillId } from '@/data/cv'

/** Un endroit du site ou une competence a ete mise en oeuvre. */
export interface Proof {
  /** Ancre de la carte correspondante. */
  href: string
  title: string
  period: string
}

/**
 * Index competence -> preuves, derive de `Experience.uses` et `Project.uses`.
 *
 * Rien n'est deduit ici : une competence n'a de preuve que si une experience
 * ou un projet la declare explicitement dans `cv.ts`.
 */
export function buildProofIndex(c: CvContent): Map<SkillId, Proof[]> {
  const index = new Map<SkillId, Proof[]>()
  const add = (id: SkillId, proof: Proof) => {
    const list = index.get(id)
    if (list) list.push(proof)
    else index.set(id, [proof])
  }

  for (const xp of c.experiences) {
    for (const id of xp.uses ?? []) {
      add(id, { href: `#xp-${xp.id}`, title: xp.title, period: xp.period })
    }
  }
  for (const project of c.projects) {
    for (const id of project.uses ?? []) {
      add(id, { href: '#projets', title: project.title, period: project.index })
    }
  }
  return index
}

/** Libelle traduit de chaque competence, pour l'afficher hors de sa categorie. */
export function buildSkillLabels(c: CvContent): Map<SkillId, string> {
  return new Map(
    Object.values(c.skills)
      .flat()
      .map((skill) => [skill.id, skill.label] as const),
  )
}

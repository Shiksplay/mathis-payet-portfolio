/**
 * "Signaux" mutables partages entre le DOM et la scene 3D.
 *
 * POURQUOI PAS ZUSTAND ICI : le scroll et la souris changent a chaque frame.
 * Les stocker dans un store React declencherait un re-render par frame et
 * ruinerait les performances. On les ecrit donc dans des objets mutables que
 * `useFrame` lit directement, hors du cycle de rendu React.
 */

export const scrollSignal = {
  /** Progression du scroll de la page, normalisee entre 0 et 1. */
  progress: 0,
  /**
   * Position continue le long du rail de camera, exprimee en index de
   * keyframe : 0 = premiere section, 2.5 = a mi-chemin entre la 3e et la 4e.
   * Calculee a partir des positions reelles des sections dans le document,
   * pas d'une simple regle de trois sur le scroll — les sections n'ont pas
   * toutes la meme hauteur.
   */
  track: 0,
}

/** Position du pointeur normalisee dans [-1, 1] sur les deux axes. */
export const pointerSignal = { x: 0, y: 0 }

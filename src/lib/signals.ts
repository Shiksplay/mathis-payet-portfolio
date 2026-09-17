/**
 * "Signaux" mutables partages entre le DOM et la scene 3D.
 *
 * POURQUOI PAS ZUSTAND ICI : le scroll et la souris changent a chaque frame.
 * Les stocker dans un store React declencherait un re-render par frame et
 * ruinerait les performances. On les ecrit donc dans des objets mutables que
 * `useFrame` lit directement, hors du cycle de rendu React.
 */

/** Progression du scroll de la page, normalisee entre 0 et 1. */
export const scrollSignal = { progress: 0 }

/** Position du pointeur normalisee dans [-1, 1] sur les deux axes. */
export const pointerSignal = { x: 0, y: 0 }

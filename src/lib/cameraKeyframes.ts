import { SECTION_IDS } from '@/data/sections'

export interface CameraKeyframe {
  position: readonly [number, number, number]
  /** Point vise par la camera. */
  target: readonly [number, number, number]
  fov: number
}

/**
 * UN POINT DE VUE PAR SECTION
 * ===========================
 *
 * L'ordre de ce tableau suit exactement `SECTION_IDS`. La camera interpole
 * entre deux keyframes consecutives selon la position du scroll (voir
 * `ScrollCamera`), ce qui donne un travelling continu ou chaque section du CV
 * correspond a un cadrage distinct du noyau reseau.
 *
 * Le noyau a un rayon d'environ 2.45 unites, centre sur l'origine. Une camera
 * a z=7.4 le cadre en entier ; a z=1.5 elle est a l'interieur.
 *
 * Pour retoucher un cadrage : modifier la ligne correspondante, rien d'autre.
 * Les valeurs sont volontairement lisibles plutot que calculees.
 */
const KEYFRAMES_BY_SECTION: Record<string, CameraKeyframe> = {
  // Plan large, noyau centre et un peu bas : laisse la place au titre H1.
  hero: { position: [0, 0.25, 7.4], target: [0, -0.1, 0], fov: 42 },

  // On se rapproche en diagonale : le maillage commence a se lire.
  profil: { position: [2.9, 1.1, 4.6], target: [0, 0, 0], fov: 46 },

  // Travelling lateral oppose, plus bas : sensation de tourner autour du noyau.
  experience: { position: [-3.7, -0.6, 3.9], target: [0.2, 0, 0], fov: 50 },

  // Vue de dessus : change radicalement la silhouette percue du graphe.
  formation: { position: [0.9, 4.0, 4.1], target: [0, 0, 0], fov: 48 },

  // A L'INTERIEUR du noyau : les noeuds passent de part et d'autre du cadre.
  // C'est le pic dramatique de la page, place sur la section Competences.
  competences: { position: [0.2, -0.3, 1.5], target: [0, 0, -1], fov: 62 },

  // On ressort par le haut-arriere gauche.
  engagements: { position: [-2.7, 2.4, 5.0], target: [0, 0, 0], fov: 45 },

  // Dernier balancement a droite avant le recul final.
  langues: { position: [3.6, -2.0, 4.8], target: [0, 0, 0], fov: 45 },

  // Recul maximal, noyau petit et calme : la page se referme.
  contact: { position: [0, -0.3, 8.8], target: [0, 0, 0], fov: 40 },
}

/** Keyframe de repli si une section n'a pas de cadrage declare. */
const FALLBACK: CameraKeyframe = { position: [0, 0, 7.4], target: [0, 0, 0], fov: 45 }

/** Rail de la camera, aligne sur l'ordre du DOM. */
export const CAMERA_TRACK: readonly CameraKeyframe[] = SECTION_IDS.map(
  (id) => KEYFRAMES_BY_SECTION[id] ?? FALLBACK,
)

export const INITIAL_KEYFRAME: CameraKeyframe = CAMERA_TRACK[0] ?? FALLBACK

import type { Color, ShaderMaterial } from 'three'

/**
 * ECRITURE DANS LES UNIFORMS, PAR LE MATERIAU
 * ===========================================
 *
 * Toutes les valeurs qui changent apres le montage (temps, DPR, palette du
 * theme) passent par ces deux helpers plutot que par l'objet `uniforms`
 * memoise rendu a <shaderMaterial>. Deux raisons :
 *
 *  1. Cet objet est un argument de hook : React le considere comme figé, et le
 *     muter est signale par le linter.
 *  2. `material.uniforms` est le canal normal entre le CPU et le GPU dans
 *     three.js — trois.js lit ces valeurs a chaque frame, sans recompiler le
 *     shader ni recreer le materiau.
 *
 * `ShaderMaterial.uniforms` est indexe par chaine, donc typé comme
 * potentiellement absent sous `noUncheckedIndexedAccess` : la garde evite un
 * plantage si un uniform est renomme dans le shader sans l'etre ici.
 */
export function setUniform(material: ShaderMaterial | null, name: string, value: number): void {
  const uniform = material?.uniforms[name]
  if (uniform) uniform.value = value
}

/** Variante couleur : recopie la teinte en place, sans remplacer l'instance. */
export function setColorUniform(
  material: ShaderMaterial | null,
  name: string,
  color: Color,
): void {
  const uniform = material?.uniforms[name]
  if (uniform) (uniform.value as Color).copy(color)
}

/**
 * Normalise un numero de telephone en URI `tel:`.
 *
 * Le CV donne le numero au format local FR ("06 92 46 38 59") et au format
 * international EN ("+262 6 92 46 38 59"). Les deux designent le meme numero :
 * on retire les espaces et, pour la forme locale, on remplace le 0 initial par
 * l'indicatif de La Reunion (+262) deja present dans la version anglaise.
 */
export function telHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '')
  if (digits.startsWith('+')) return `tel:${digits}`
  if (digits.startsWith('0')) return `tel:+262${digits.slice(1)}`
  return `tel:${digits}`
}

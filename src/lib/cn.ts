/** Concatene des classes conditionnelles sans dependance externe. */
export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ')
}

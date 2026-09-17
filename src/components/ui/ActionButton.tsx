import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface ActionButtonProps {
  href: string
  children: ReactNode
  variant?: 'primary' | 'ghost'
  icon?: LucideIcon
  /** Telechargement direct (bouton CV). */
  download?: string
  /** Ouvre dans un nouvel onglet avec rel de securite. */
  external?: boolean
  className?: string
}

const base =
  'group inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3 text-sm font-medium transition-all duration-300'

const variants = {
  // Accent plein : un seul par zone d'ecran, pour garder la hierarchie claire.
  primary: cn(
    'bg-accent text-abyss',
    'hover:shadow-[0_0_34px_-8px_var(--color-accent)] hover:brightness-110',
  ),
  ghost: cn(
    'border border-hairline text-ink',
    'hover:border-accent/55 hover:bg-accent/5 hover:text-accent',
  ),
} as const

export function ActionButton({
  href,
  children,
  variant = 'ghost',
  icon: Icon,
  download,
  external = false,
  className,
}: ActionButtonProps) {
  return (
    <a
      href={href}
      className={cn(base, variants[variant], className)}
      {...(download !== undefined ? { download } : {})}
      {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
    >
      {Icon ? (
        <Icon
          aria-hidden="true"
          className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
        />
      ) : null}
      {children}
    </a>
  )
}

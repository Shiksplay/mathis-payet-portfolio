import { ArrowUp } from 'lucide-react'
import { useCv } from '@/hooks/useCv'

export function Footer() {
  const { c, t } = useCv()

  return (
    <footer className="relative border-t border-hairline/70 px-6 py-10 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 sm:flex-row">
        <p className="font-mono text-[11px] tracking-wider text-muted">
          © {new Date().getFullYear()} {c.name} — {t.footer.rights}
        </p>
        <p className="text-center font-mono text-[11px] tracking-wider text-muted/70 sm:text-right">
          {t.footer.builtWith}
        </p>
        <a
          href="#hero"
          aria-label={c.name}
          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-hairline text-muted transition-colors hover:border-accent/50 hover:text-accent"
        >
          <ArrowUp className="size-4" aria-hidden="true" />
        </a>
      </div>
    </footer>
  )
}

// lucide-react v1 ne fournit plus d'icones de marque : on utilise une icone
// generique (IdCard) pour LinkedIn, ce qui respecte aussi la contrainte
// "pas de logos de marques tierces".
import { ArrowUpRight, Check, Copy, IdCard, Mail, MapPin, Phone } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Reveal } from '@/components/ui/Reveal'
import { SectionShell } from '@/components/ui/SectionShell'
import { useCv } from '@/hooks/useCv'
import { telHref } from '@/lib/text'

/**
 * Bouton "copier" pour l'e-mail et le telephone.
 *
 * L'etat de confirmation est annonce via `aria-live` : un utilisateur de
 * lecteur d'ecran entend "Copie" sans avoir a deviner que quelque chose s'est
 * passe. Echoue silencieusement si le presse-papiers est refuse (HTTP non
 * securise, permission bloquee) — le lien direct reste utilisable.
 */
function CopyButton({ value, label, copiedLabel }: { value: string; label: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false)

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      /* presse-papiers indisponible : on ne casse rien */
    }
  }, [value])

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={`${label} : ${value}`}
      className="flex size-9 shrink-0 items-center justify-center rounded-full border border-hairline text-muted transition-colors hover:border-accent/50 hover:text-accent"
    >
      {copied ? (
        <Check className="size-4 text-accent" aria-hidden="true" />
      ) : (
        <Copy className="size-4" aria-hidden="true" />
      )}
      <span className="sr-only" aria-live="polite">
        {copied ? copiedLabel : ''}
      </span>
    </button>
  )
}

export function Contact() {
  const { c, t } = useCv()

  return (
    <SectionShell id="contact" index="07" title={t.headings.contact} kicker={t.contact.intro}>
      <ul className="grid gap-4 sm:grid-cols-2">
        {/* E-mail */}
        <li className="glass-panel flex items-center gap-4 p-5">
          <Mail className="size-5 shrink-0 text-accent/70" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="label-mono">{t.contact.emailLabel}</p>
            <a
              href={`mailto:${c.email}`}
              className="mt-1 block truncate text-[15px] text-ink transition-colors hover:text-accent"
            >
              {c.email}
            </a>
          </div>
          <CopyButton value={c.email} label={t.contact.copy} copiedLabel={t.contact.copied} />
        </li>

        {/* Telephone */}
        <li className="glass-panel flex items-center gap-4 p-5">
          <Phone className="size-5 shrink-0 text-accent/70" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="label-mono">{t.contact.phoneLabel}</p>
            <a
              href={telHref(c.phone)}
              className="mt-1 block truncate text-[15px] text-ink transition-colors hover:text-accent"
            >
              {c.phone}
            </a>
          </div>
          <CopyButton value={c.phone} label={t.contact.copy} copiedLabel={t.contact.copied} />
        </li>

        {/* LinkedIn */}
        <li className="glass-panel flex items-center gap-4 p-5">
          <IdCard className="size-5 shrink-0 text-accent/70" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="label-mono">{t.contact.linkedinLabel}</p>
            <a
              href={c.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className="group mt-1 inline-flex items-center gap-1.5 text-[15px] text-ink transition-colors hover:text-accent"
            >
              <span className="truncate">mathis-payet</span>
              <ArrowUpRight
                className="size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </a>
          </div>
        </li>

        {/* Localisation — information, pas un lien. */}
        <li className="glass-panel flex items-center gap-4 p-5">
          <MapPin className="size-5 shrink-0 text-accent/70" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="label-mono">{t.contact.locationLabel}</p>
            <p className="mt-1 text-[15px] text-ink">{c.location}</p>
          </div>
        </li>
      </ul>

      <Reveal delay={0.15}>
        <p className="mt-8 font-mono text-[11px] tracking-[0.18em] text-muted/60 uppercase">
          {c.availability}
        </p>
      </Reveal>
    </SectionShell>
  )
}

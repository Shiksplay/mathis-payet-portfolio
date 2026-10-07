import type { CaseStudy, DiagramNodeId } from '@/data/cv'

/**
 * Etat d'un element du schema :
 *  - 'pending' : etape pas encore atteinte (tres attenue) ;
 *  - 'done'    : etape passee (visible, sans accent) ;
 *  - 'active'  : etape en cours (accent + micro-animation) ;
 *  - 'static'  : reduced-motion, tout est visible d'emblee.
 */
export type NodeState = 'pending' | 'done' | 'active' | 'static'

interface Props {
  labels: CaseStudy['labels']
  states: Record<DiagramNodeId, NodeState>
}

/**
 * SCHEMA DE PRINCIPE DE L'INFRASTRUCTURE
 * ======================================
 *
 * SVG pur, decoratif (`aria-hidden`) : l'information equivalente est la liste
 * ordonnee des etapes, lue normalement par les lecteurs d'ecran.
 *
 * Chaque element est un <g data-node data-state> ; tout le rendu d'etat vit en
 * CSS (`index.css`, bloc "ETUDE DE CAS") et n'anime que `opacity` et
 * `transform`. Les traits de base sont en `muted`, les calques `.cs-hl` en
 * accent ne s'allument que sur l'etape active.
 */
export function CaseStudyDiagram({ labels, states }: Props) {
  return (
    <svg viewBox="0 0 420 260" className="h-auto w-full" aria-hidden="true" focusable="false">
      {/* 1. Hyperviseur : cadre qui contient tout le reseau virtuel. */}
      <g className="cs-node" data-node="vmware" data-state={states.vmware}>
        <rect x="6" y="6" width="408" height="248" rx="14" className="cs-stroke" strokeDasharray="4 6" />
        <rect x="6" y="6" width="408" height="248" rx="14" className="cs-hl cs-hl-stroke" strokeDasharray="4 6" />
        <text x="20" y="26" className="cs-label">
          {labels.vmware}
        </text>
      </g>

      {/* 1bis. Les sites (deux, le minimum de "multisite"). */}
      <g className="cs-node" data-node="sites" data-state={states.sites}>
        {[30, 262].map((x, i) => (
          <g key={x}>
            <rect x={x} y="56" width="128" height="104" rx="10" className="cs-stroke cs-fill" />
            <rect x={x} y="56" width="128" height="104" rx="10" className="cs-hl cs-hl-stroke" />
            <text x={x + 14} y="76" className="cs-label">
              {i === 0 ? labels.site1 : labels.site2}
            </text>
            {/* Postes generiques du LAN. */}
            {[0, 1, 2].map((k) => (
              <rect
                key={k}
                x={x + 16 + k * 34}
                y="118"
                width="22"
                height="16"
                rx="3"
                className="cs-stroke"
              />
            ))}
          </g>
        ))}
      </g>

      {/* 2. Tunnel VPN entre les sites, avec un paquet qui le traverse. */}
      <g className="cs-node" data-node="vpn" data-state={states.vpn}>
        <line x1="166" y1="102" x2="254" y2="102" className="cs-stroke" />
        <line x1="166" y1="114" x2="254" y2="114" className="cs-stroke" />
        <line x1="166" y1="102" x2="254" y2="102" className="cs-hl cs-hl-stroke" />
        <line x1="166" y1="114" x2="254" y2="114" className="cs-hl cs-hl-stroke" />
        <text x="210" y="94" textAnchor="middle" className="cs-label">
          {labels.vpn}
        </text>
        <circle cx="172" cy="108" r="3.5" className="cs-packet" />
      </g>

      {/* 3. Services internes, partages par les sites. */}
      <g className="cs-node" data-node="services" data-state={states.services}>
        <path d="M150 196 L94 160 M270 196 L326 160" className="cs-stroke" strokeDasharray="3 4" />
        <rect x="96" y="196" width="228" height="40" rx="8" className="cs-stroke cs-fill" />
        <rect x="96" y="196" width="228" height="40" rx="8" className="cs-hl cs-hl-stroke" />
        <text x="210" y="220" textAnchor="middle" className="cs-label cs-label--strong">
          {labels.services}
        </text>
      </g>

      {/* 4. Filtrage en bordure de chaque site. */}
      <g className="cs-node" data-node="firewall" data-state={states.firewall}>
        {[154, 256].map((x) => (
          <g key={x}>
            <rect x={x} y="92" width="10" height="32" rx="2" className="cs-stroke cs-fill" />
            <rect x={x} y="92" width="10" height="32" rx="2" className="cs-hl cs-hl-fill" />
            <path d={`M${x} 102.5h10M${x} 113h10M${x + 5} 92v10.5M${x + 5} 113v11`} className="cs-stroke" />
          </g>
        ))}
        {/* Sous les sites (et non entre eux) : le libelle n'y touche aucun cadre. */}
        <text x="210" y="182" textAnchor="middle" className="cs-label">
          {labels.firewall}
        </text>
      </g>

      {/* 5. Test d'intrusion : sonde exterieure qui vise les points d'entree. */}
      <g className="cs-node" data-node="pentest" data-state={states.pentest}>
        <path d="M210 46 L159 92 M210 46 L261 92" className="cs-stroke cs-scan" strokeDasharray="2 4" />
        <circle cx="210" cy="36" r="10" className="cs-stroke cs-fill" />
        <circle cx="210" cy="36" r="10" className="cs-hl cs-hl-stroke" />
        <path d="M210 22v7M210 43v7M196 36h7M217 36h7" className="cs-stroke" />
        <text x="228" y="40" className="cs-label">
          {labels.pentest}
        </text>
      </g>
    </svg>
  )
}

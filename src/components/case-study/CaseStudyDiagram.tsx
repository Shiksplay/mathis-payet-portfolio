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

interface BoxProps {
  x: number
  y: number
  w: number
  h: number
  r?: number
  dashed?: boolean
}

/** Cadre de base + son calque d'accent (allume sur l'etape active). */
function Box({ x, y, w, h, r = 6, dashed = false }: BoxProps) {
  const dash = dashed ? '4 6' : undefined
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx={r} className="cs-stroke cs-fill" strokeDasharray={dash} />
      <rect x={x} y={y} width={w} height={h} rx={r} className="cs-hl cs-hl-stroke" strokeDasharray={dash} />
    </>
  )
}

/** Pare-feu : un "mur" de briques. */
function Wall({ x, y }: { x: number; y: number }) {
  return (
    <>
      <rect x={x} y={y} width="10" height="34" rx="2" className="cs-stroke cs-fill" />
      <rect x={x} y={y} width="10" height="34" rx="2" className="cs-hl cs-hl-fill" />
      <path
        d={`M${x} ${y + 11}h10M${x} ${y + 23}h10M${x + 5} ${y}v11M${x + 5} ${y + 23}v11`}
        className="cs-stroke"
      />
      <text x={x + 5} y={y + 48} textAnchor="middle" className="cs-label cs-label--xs">
        FW
      </text>
    </>
  )
}

/**
 * TOPOLOGIE SIMPLIFIEE DU PROJET
 * ==============================
 *
 * Reprise du schema d'architecture de Mathis, simplifiee : siege (clients,
 * pare-feu interne, DMZ, LAN serveurs, proxy, pare-feu de bordure), tunnel
 * IPsec, succursale (RODC). Aucune adresse, aucun identifiant.
 *
 * SVG decoratif (`aria-hidden`) : l'equivalent textuel est la liste ordonnee
 * des etapes. Chaque <g data-node data-state> est pilote en CSS (`index.css`,
 * bloc "ETUDE DE CAS"), qui n'anime que `opacity` et `transform`.
 *
 * Le tunnel IPsec n'a pas ete finalise pendant le projet : il est dessine en
 * pointilles, en couleur secondaire, et son paquet s'efface a mi-chemin au
 * lieu de traverser. Le schema ne pretend pas a plus que le compte rendu.
 */
export function CaseStudyDiagram({ labels, states }: Props) {
  return (
    <svg viewBox="0 0 440 300" className="h-auto w-full" aria-hidden="true" focusable="false">
      {/* ---------- Siege ---------- */}
      <g className="cs-node" data-node="hq" data-state={states.hq}>
        <Box x={4} y={4} w={248} h={292} r={14} dashed />
        <text x="14" y="19" className="cs-label cs-label--sm">
          {labels.hq}
        </text>
      </g>

      {/* Zones cloisonnees : clients, DMZ, serveurs. */}
      <g className="cs-node" data-node="zones" data-state={states.zones}>
        <Box x={12} y={112} w={64} h={86} r={8} />
        <text x="20" y="128" className="cs-label cs-label--sm">
          {labels.clients}
        </text>
        {[20, 38, 56].map((x) => (
          <rect key={x} x={x} y="158" width="12" height="10" rx="2" className="cs-stroke" />
        ))}

        <Box x={104} y={24} w={144} h={76} r={8} />
        <text x="112" y="40" className="cs-label cs-label--sm">
          {labels.dmz}
        </text>

        <Box x={104} y={204} w={144} h={84} r={8} />
        <text x="112" y="220" className="cs-label cs-label--sm">
          {labels.lan}
        </text>
      </g>

      {/* Pare-feu interne, au centre, relie aux trois zones. */}
      <g className="cs-node" data-node="fwint" data-state={states.fwint}>
        <path d="M76 150H84M89 122V62H104M89 156V246H104" className="cs-stroke" />
        <Wall x={84} y={122} />
      </g>

      {/* Active Directory / DNS interne (role de Mathis). */}
      <g className="cs-node" data-node="ad" data-state={states.ad}>
        <Box x={112} y={232} w={52} h={44} />
        <text x="138" y="258" textAnchor="middle" className="cs-label cs-label--xs cs-label--strong">
          {labels.ad}
        </text>
      </g>

      {/* DMZ : DNS publics, serveurs web, repartiteur (role de Mathis). */}
      <g className="cs-node" data-node="dmz" data-state={states.dmz}>
        <Box x={110} y={52} w={40} h={36} />
        <text x="130" y="74" textAnchor="middle" className="cs-label cs-label--xs cs-label--strong">
          {labels.dns}
        </text>
        <Box x={154} y={52} w={40} h={36} />
        <text x="174" y="74" textAnchor="middle" className="cs-label cs-label--xs cs-label--strong">
          {labels.web}
        </text>
        <Box x={198} y={52} w={44} h={36} />
        <text x="220" y="74" textAnchor="middle" className="cs-label cs-label--xs cs-label--strong">
          {labels.lb}
        </text>
      </g>

      {/* Services internes du LAN serveurs. */}
      <g className="cs-node" data-node="services" data-state={states.services}>
        <Box x={170} y={232} w={72} h={44} />
        <text x="206" y="251" textAnchor="middle" className="cs-label cs-label--xs">
          {labels.services1}
        </text>
        <text x="206" y="266" textAnchor="middle" className="cs-label cs-label--xs">
          {labels.services2}
        </text>
      </g>

      {/* Sortie du siege : proxy puis pare-feu de bordure. */}
      <g className="cs-node" data-node="edge" data-state={states.edge}>
        <path d="M94 139H118M162 139H226M236 139H252" className="cs-stroke" />
        <Box x={118} y={127} w={44} h={24} />
        <text x="140" y="143" textAnchor="middle" className="cs-label cs-label--xs">
          {labels.proxy}
        </text>
        <Wall x={226} y={122} />
      </g>

      {/* Tunnel IPsec : non finalise pendant le projet. */}
      <g className="cs-node" data-node="vpn" data-state={states.vpn}>
        <path d="M252 133H344M252 145H344" className="cs-warn-stroke" strokeDasharray="5 4" />
        <text x="298" y="124" textAnchor="middle" className="cs-label cs-label--sm">
          {labels.vpn}
        </text>
        <text x="298" y="162" textAnchor="middle" className="cs-label cs-label--xs cs-label--warn">
          {labels.vpnStatus}
        </text>
        <circle cx="258" cy="139" r="3.5" className="cs-packet" />
        <text x="351" y="286" textAnchor="middle" className="cs-label cs-label--xs">
          {labels.backup}
        </text>
      </g>

      {/* Succursale : pare-feu + controleur en lecture seule. */}
      <g className="cs-node" data-node="branch" data-state={states.branch}>
        <Box x={336} y={86} w={98} h={112} r={10} />
        <text x="344" y="102" className="cs-label cs-label--sm">
          {labels.branch}
        </text>
        <path d="M354 139H364" className="cs-stroke" />
        <Wall x={344} y={122} />
        <Box x={364} y={127} w={62} h={24} />
        <text x="395" y="143" textAnchor="middle" className="cs-label cs-label--xs cs-label--strong">
          {labels.rodc}
        </text>
      </g>
    </svg>
  )
}

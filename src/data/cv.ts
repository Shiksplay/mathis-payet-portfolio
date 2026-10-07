/**
 * Source de verite unique du contenu du CV (FR / EN).
 *
 * Aucun texte du site ne doit etre ecrit en dur ailleurs : tout passe par ce
 * fichier via le hook `useCv()`. Les deux langues partagent strictement la meme
 * forme (`CvContent`), ce qui garantit qu'aucune cle ne peut manquer d'un cote.
 */

import type { ContentSectionId } from './sections'

export type Lang = 'fr' | 'en'

export const LANGS: readonly Lang[] = ['fr', 'en'] as const

/**
 * Identifiants stables des competences, communs aux deux langues.
 *
 * Ils servent a relier une competence aux experiences et projets qui la
 * PROUVENT (`uses`) : le typage interdit une faute de frappe, et la parite
 * FR/EN vient de ce que les identifiants ne se traduisent pas.
 */
export const SKILL_IDS = [
  'vlan',
  'dhcp',
  'dns',
  'routing',
  'active-directory',
  'gpo',
  'acl',
  'windows-server',
  'firewall',
  'pfsense',
  'stormshield',
  'pentest',
  'security-testing',
  'dmz',
  'wireshark',
  'nmap',
  'ssl',
  'vpn',
  'vmware',
  'virtualbox',
  'docker',
  'linux',
  'squid',
  'apache',
  'nginx',
  'mysql',
  'rdp',
  'python',
  'c-cpp',
  'js-ts',
  'react',
  'nodejs',
  'web-dev',
  'glpi',
  'asterisk',
  'anssi-mooc',
] as const

export type SkillId = (typeof SKILL_IDS)[number]

export interface Skill {
  id: SkillId
  label: string
}

/** Ancres des experiences (identiques en FR et en EN). */
export type ExperienceId = 'stage-region-reunion' | 'infra-multisite'

export interface Experience {
  /** Ancre HTML de la carte (`#xp-<id>`), cible des liens "preuve". */
  id: ExperienceId
  title: string
  org: string
  type: string
  period: string
  bullets: string[]
  /**
   * Competences mises en oeuvre, UNIQUEMENT si le texte de l'experience (ou
   * Mathis) l'atteste. Une competence sans preuve n'est reliee a rien.
   */
  uses?: SkillId[]
  /**
   * Petit schema de principe affiche dans la carte (ex. ToIP du stage).
   * Simplifie et sans aucune information interne de l'organisation.
   */
  schematic?: Schematic
}

/** Schema lineaire "A -> B -> C" (voir `SchematicDiagram`). */
export interface Schematic {
  /** Elements de gauche a droite ; `count` > 1 dessine une pile (postes). */
  nodes: { label: string; count?: number }[]
  caption: string
}

/**
 * Elements du schema de l'etude de cas (voir `CaseStudyDiagram`). Chaque
 * element apparait a UNE etape.
 */
export type DiagramNodeId =
  | 'hq'
  | 'zones'
  | 'fwint'
  | 'ad'
  | 'dmz'
  | 'services'
  | 'edge'
  | 'vpn'
  | 'branch'

/** Libelles du schema (traduits). */
export type DiagramLabelId =
  | 'hq'
  | 'branch'
  | 'clients'
  | 'dmz'
  | 'lan'
  | 'dns'
  | 'web'
  | 'lb'
  | 'ad'
  | 'services1'
  | 'services2'
  | 'proxy'
  | 'vpn'
  | 'vpnStatus'
  | 'backup'
  | 'rodc'

export interface CaseStudyStep {
  id: string
  title: string
  body: string
  /** Elements du schema qui apparaissent a cette etape. */
  nodes: DiagramNodeId[]
  /** Etape realisee personnellement par Mathis (badge "Mon role"). */
  mine?: boolean
}

/**
 * Etude de cas animee d'une experience.
 *
 * REGLE : le contenu ne reprend que ce que Mathis atteste (CV, compte rendu
 * du projet, reponses). Aucune donnee interne : ni adressage, ni identifiant,
 * ni nom de domaine, ni nom de co-equipier.
 */
export interface CaseStudy {
  experienceId: ExperienceId
  title: string
  intro: string
  caption: string
  labels: Record<DiagramLabelId, string>
  steps: CaseStudyStep[]
  /** Bilan chiffre et enseignements, tires du compte rendu. */
  outcome?: {
    stat: string
    statLabel: string
    lessons: string[]
  }
}

export interface Education {
  title: string
  org: string
  period: string
}

export interface Activity {
  title: string
  period: string
  desc: string
}

export interface LanguageSkill {
  name: string
  level: string
}

/**
 * Projet personnel ou academique.
 *
 * Contenu repris du portfolio existant (mathis-p-portfolio.lovable.app) :
 * rien n'est invente ici non plus.
 */
export interface Project {
  title: string
  desc: string
  /** Etiquettes courtes affichees sous la carte. */
  tags: string[]
  /** Numero de reference du projet dans la galerie ("01", "02"...). */
  index: string
  /** Competences prouvees par ce projet (meme regle que `Experience.uses`). */
  uses?: SkillId[]
}

export interface CvContent {
  name: string
  title: string
  location: string
  phone: string
  email: string
  linkedin: string
  availability: string
  /** Accroche courte du portfolio, affichee sous le nom dans le hero. */
  tagline: string
  profile: string
  projects: Project[]
  experiences: Experience[]
  /** Etude de cas animee (section `etude-de-cas`). */
  caseStudy: CaseStudy
  education: Education[]
  /** Cle = nom de categorie (traduit), valeur = liste de competences. */
  skills: Record<string, Skill[]>
  softSkills: string[]
  activities: Activity[]
  languages: LanguageSkill[]
  interests: string[]
  /**
   * "Ce que le CV ne dit pas", par section : une phrase de Mathis, affichee
   * sous le titre de la section. Optionnel ; rien n'est rendu tant que ce
   * n'est pas renseigne (aucun texte invente).
   */
  beyondCv?: Partial<Record<ContentSectionId, string>>
}

export const cv: Record<Lang, CvContent> = {
  fr: {
    name: 'Mathis Payet',
    title: 'Réseaux & Télécommunications — Cybersécurité',
    location: 'Le Tampon, La Réunion (97430)',
    phone: '06 92 46 38 59',
    email: 'mathis.payet@rt-iut.re',
    linkedin: 'https://linkedin.com/in/mathis-payet-a45379341',
    availability: 'Disponible pour une alternance — année scolaire 2026-2027',
    // Reformule le profil du CV ("configuration, securisation et gestion
    // d'infrastructures reseau") : aligne l'accroche sur l'alternance visee.
    tagline: 'Étudiant en cybersécurité, je configure et sécurise des infrastructures réseau',
    profile:
      "Étudiant entrant en 3e année de BUT Réseaux et Télécommunications, parcours Cybersécurité, à l'IUT de La Réunion. Je recherche une alternance en administration et sécurité des réseaux pour l'année scolaire 2026-2027. Curieux et rigoureux, je souhaite mettre en pratique mes compétences en configuration, sécurisation et gestion d'infrastructures réseau au sein d'une équipe technique.",
    // Ordre : le projet lie a l'infrastructure (salle serveur) d'abord,
    // coherent avec l'alternance visee en administration/securite reseaux.
    projects: [
      {
        index: '01',
        title: 'SAÉ 1.02 — Système de mesure Température/Hygrométrie avec Raspberry Pi',
        desc: "Système de supervision de la température et de l'humidité d'une salle serveur",
        tags: ['IoT', 'Raspberry Pi', 'Capteurs'],
      },
      {
        index: '02',
        title: "Jeu intégré à un site web d'entreprise",
        desc: "Mini-jeu ludique et professionnel intégré au site web d'une entreprise du bâtiment",
        tags: ['Jeu vidéo', 'Web', 'Game design'],
      },
      {
        index: '03',
        title: 'The Forgotten',
        desc: "Jeu solo d'horreur développé sur Unreal Engine 5 dans une ville abandonnée mystérieuse",
        tags: ['Jeu vidéo', 'Unreal Engine', 'Horreur'],
      },
    ],
    experiences: [
      {
        id: 'stage-region-reunion',
        title: 'Assistance technique & projets informatiques',
        org: "Région Réunion – Direction de l'Éducation et de la Vie Lycéenne (E-éducation secteur sud et est)",
        type: 'Stage en milieu professionnel',
        period: 'Avril – Juin 2026',
        bullets: [
          'Assistance au référent technique et sur des projets, en collaboration avec les assistants de maintenance informatique',
          "Mise en place d'une solution de ToIP (Asterisk)",
          "Montée en compétences sur l'inventaire GLPI, la configuration de switchs, le câblage réseau et la configuration de bornes Wi-Fi",
        ],
        uses: ['glpi', 'asterisk'],
        // Schema simplifie, publie avec l'accord de Mathis, sans information
        // interne de l'organisation.
        schematic: {
          nodes: [{ label: 'Postes IP', count: 3 }, { label: 'Switch' }, { label: 'Serveur Asterisk' }],
          caption: 'Principe de la solution ToIP mise en place, simplifié et sans information interne.',
        },
      },
      {
        id: 'infra-multisite',
        title: "Conception & déploiement d'une infrastructure réseau multisite sécurisée",
        org: 'IUT de La Réunion, BUT RT2',
        type: 'Projet académique',
        period: 'Déc. 2025 – Mars 2026',
        bullets: [
          "Conception et déploiement d'un réseau virtuel pour une entreprise multisite avec VPN (VirtualBox)",
          'Configuration des services réseau : adressage IP/DHCP, serveurs internes, interconnexion des équipements, proxy Squid, certificats SSL, RDP, Active Directory',
          'Sécurisation du réseau : pare-feux Stormshield et ACL',
        ],
        // Puces du CV + compte rendu de la SAE (AD/DNS, DMZ, GPO, serveurs
        // Debian et Windows Server, Stormshield, VirtualBox). Le pentest
        // releve d'une autre SAE, a ajouter plus tard : pas de lien ici.
        uses: [
          'virtualbox',
          'vpn',
          'dhcp',
          'dns',
          'squid',
          'ssl',
          'rdp',
          'active-directory',
          'gpo',
          'windows-server',
          'linux',
          'apache',
          'dmz',
          'firewall',
          'stormshield',
          'acl',
        ],
      },
    ],
    // Source : compte rendu de la SAE (topologie, role, bilan) et reponses
    // de Mathis. Aucune donnee interne : ni adressage, ni identifiant, ni
    // nom de domaine, ni nom de co-equipier.
    caseStudy: {
      experienceId: 'infra-multisite',
      title: 'Infrastructure multisite',
      intro:
        "SAÉ de BUT RT2, en équipe de trois : l'infrastructure complète d'une banque fictive répartie sur deux sites, entièrement virtualisée sous VirtualBox. Mon rôle : l'Active Directory, le DNS et les serveurs de la DMZ.",
      caption:
        'Topologie simplifiée du projet. Adressage, identifiants et noms internes volontairement omis.',
      labels: {
        hq: 'Siège · Saint-Denis',
        branch: 'Saint-Pierre',
        clients: 'Clients',
        dmz: 'DMZ',
        lan: 'Serveurs',
        dns: 'DNS ×2',
        web: 'Web ×2',
        lb: 'HAProxy',
        ad: 'AD / DNS',
        services1: 'DHCP · Impr.',
        services2: 'Zabbix · RDS',
        proxy: 'Proxy',
        vpn: 'IPsec',
        vpnStatus: 'non finalisé',
        backup: 'secours prévu : 4G/5G · Starlink',
        rodc: 'RODC',
      },
      steps: [
        {
          id: 'cloisonner',
          title: 'Cloisonner',
          body: "Un pare-feu interne Stormshield au centre et quatre zones séparées : postes clients, serveurs, DMZ et lien vers la succursale. Chaque flux est autorisé explicitement, selon le principe du moindre privilège recommandé par l'ANSSI.",
          nodes: ['hq', 'zones', 'fwint'],
        },
        {
          id: 'annuaire',
          title: 'Annuaire et DNS',
          body: "Contrôleur de domaine Active Directory : unités d'organisation, comptes, partages et GPO appliquée à tous les postes. Le DNS interne redirige les requêtes externes vers le DNS public de la DMZ.",
          nodes: ['ad'],
          mine: true,
        },
        {
          id: 'dmz',
          title: 'DMZ haute disponibilité',
          body: 'Deux serveurs web Apache derrière HAProxy : répartition alternée, contrôle de santé toutes les 3 s, HTTPS et en-têtes de sécurité. Bascule validée en coupant un serveur. DNS public maître/esclave sous BIND9, zone signée DNSSEC.',
          nodes: ['dmz'],
          mine: true,
        },
        {
          id: 'services',
          title: 'Services internes',
          body: "DHCP relayé par le pare-feu vers les postes clients, impression centralisée (CUPS), supervision (Zabbix) et bureau à distance (RDS) pour l'application métier.",
          nodes: ['services'],
        },
        {
          id: 'succursale',
          title: 'Relier la succursale',
          body: "Contrôleur de domaine en lecture seule (RODC) installé à Saint-Pierre. Le tunnel IPsec, le pare-feu de bordure et le proxy n'étaient pas finalisés à la fin du projet. Des liaisons de secours 4G/5G et Starlink étaient prévues.",
          nodes: ['edge', 'vpn', 'branch'],
        },
      ],
      outcome: {
        stat: '14 / 17',
        statLabel: 'composants validés en fin de projet',
        lessons: [
          "Sur un pare-feu, une erreur d'objet réseau ou d'ordre des règles suffit à bloquer un flux entier : nous l'avons constaté en déboguant les règles ICMP et DHCP.",
          "L'ordre de mise en place compte : DNS, puis Active Directory, puis postes clients. Un écart provoque des pannes en cascade, difficiles à diagnostiquer.",
          "La virtualisation a ses propres pièges : l'affectation des interfaces réseau aux pare-feux virtuels a demandé plusieurs heures de diagnostic.",
        ],
      },
    },
    education: [
      {
        title: 'BUT Réseaux et Télécommunications, parcours Cybersécurité',
        org: 'IUT de La Réunion – Saint-Pierre',
        period: '2024 – 2027',
      },
      {
        title: 'Baccalauréat STI2D – mention Très Bien',
        org: 'Lycée Roland Garros, Le Tampon',
        period: '2021 – 2024',
      },
    ],
    skills: {
      'Administration réseau & systèmes': [
        { id: 'vlan', label: 'VLAN' },
        { id: 'dhcp', label: 'DHCP' },
        { id: 'dns', label: 'DNS' },
        { id: 'routing', label: 'Routage' },
        { id: 'active-directory', label: 'Active Directory' },
        { id: 'gpo', label: 'GPO' },
        { id: 'acl', label: 'ACL' },
        { id: 'windows-server', label: 'Windows Server' },
      ],
      Sécurité: [
        { id: 'firewall', label: 'Pare-feu' },
        { id: 'pfsense', label: 'pfSense' },
        { id: 'stormshield', label: 'Stormshield' },
        { id: 'pentest', label: 'Pentesting' },
        { id: 'security-testing', label: 'Tests de sécurité' },
        { id: 'dmz', label: 'DMZ' },
        { id: 'wireshark', label: 'Wireshark' },
        { id: 'nmap', label: 'Nmap' },
        { id: 'ssl', label: 'Certificats SSL' },
        { id: 'vpn', label: 'VPN' },
      ],
      'Infrastructure & Web': [
        { id: 'vmware', label: 'VMware' },
        { id: 'virtualbox', label: 'VirtualBox' },
        { id: 'docker', label: 'Docker' },
        { id: 'linux', label: 'Linux' },
        { id: 'squid', label: 'Proxy Squid' },
        { id: 'apache', label: 'Apache' },
        { id: 'nginx', label: 'NGINX' },
        { id: 'mysql', label: 'MySQL' },
        { id: 'rdp', label: 'RDP' },
      ],
      Programmation: [
        { id: 'python', label: 'Python' },
        { id: 'c-cpp', label: 'C/C++' },
        { id: 'js-ts', label: 'JavaScript/TypeScript' },
        { id: 'react', label: 'React' },
        { id: 'nodejs', label: 'Node.js' },
        { id: 'web-dev', label: 'Développement Web' },
      ],
      'Outils & certification': [
        { id: 'glpi', label: 'GLPI' },
        { id: 'asterisk', label: 'Asterisk (ToIP)' },
        { id: 'anssi-mooc', label: 'MOOC ANSSI – SecNumAcadémie' },
      ],
    },
    softSkills: ["Travail d'équipe", 'Communication', 'Gestion de projet', 'Autonomie', 'Rigueur'],
    activities: [
      {
        title: "Les 24h de l'innovation, La Réunion",
        period: '2021 & 2022',
        desc: 'Travail en équipe sur des projets innovants – gestion du temps et prise de parole en public',
      },
      {
        title: 'Concours académique de technologie, La Réunion – 3e place',
        period: '2023',
        desc: "Capacité à fédérer une équipe – expérience en gestion de groupe et en travail d'équipe",
      },
    ],
    languages: [{ name: 'Anglais', level: 'C1 (courant)' }],
    interests: ['Nouvelles technologies', 'Maintenance et optimisation PC', 'Sport automobile'],
  },
  en: {
    name: 'Mathis Payet',
    title: 'Networks & Telecommunications — Cybersecurity',
    location: 'Le Tampon, Réunion Island (97430)',
    phone: '+262 6 92 46 38 59',
    email: 'mathis.payet@rt-iut.re',
    linkedin: 'https://linkedin.com/in/mathis-payet-a45379341',
    availability: 'Available for a work-study program — 2026-2027 academic year',
    tagline: 'Cybersecurity student — I configure and secure network infrastructure',
    profile:
      'Third-year student in the Networks & Telecommunications program (BUT RT), Cybersecurity track, at IUT de La Réunion. Looking for a work-study position in network administration and security for the 2026-2027 academic year. Curious and rigorous, I want to put my configuration, hardening, and network infrastructure management skills into practice within a technical team.',
    projects: [
      {
        index: '01',
        title: 'SAÉ 1.02 — Temperature/Humidity monitoring system with Raspberry Pi',
        desc: 'Monitoring system for the temperature and humidity of a server room',
        tags: ['IoT', 'Raspberry Pi', 'Sensors'],
      },
      {
        index: '02',
        title: 'Game embedded in a company website',
        desc: 'A playful yet professional mini-game embedded in the website of a construction company',
        tags: ['Game', 'Web', 'Game design'],
      },
      {
        index: '03',
        title: 'The Forgotten',
        desc: 'Single-player horror game built in Unreal Engine 5, set in a mysterious abandoned city',
        tags: ['Game', 'Unreal Engine', 'Horror'],
      },
    ],
    experiences: [
      {
        id: 'stage-region-reunion',
        title: 'IT Technical Support & Projects',
        org: 'Réunion Regional Council – Education & School Life Department (South & East e-education sector)',
        type: 'Professional internship',
        period: 'April – June 2026',
        bullets: [
          'Supported the technical lead on IT projects, working alongside IT maintenance technicians',
          'Deployed a VoIP/ToIP solution (Asterisk)',
          'Built skills in GLPI asset inventory, switch configuration, network cabling, and Wi-Fi access point setup',
        ],
        uses: ['glpi', 'asterisk'],
        schematic: {
          nodes: [{ label: 'IP phones', count: 3 }, { label: 'Switch' }, { label: 'Asterisk server' }],
          caption: 'How the VoIP solution was set up, simplified and without any internal information.',
        },
      },
      {
        id: 'infra-multisite',
        title: 'Design & Deployment of a Secure Multi-site Network Infrastructure',
        org: 'IUT de La Réunion, BUT RT2',
        type: 'Academic project',
        period: 'Dec. 2025 – Mar. 2026',
        bullets: [
          'Designed and deployed a virtualized network for a multi-site company, including VPN connectivity (VirtualBox)',
          'Configured core network services: IP addressing/DHCP, internal servers, device interconnection, Squid proxy, SSL certificates, RDP, Active Directory',
          'Hardened the network: Stormshield firewalls and ACLs',
        ],
        // Puces du CV + compte rendu de la SAE (AD/DNS, DMZ, GPO, serveurs
        // Debian et Windows Server, Stormshield, VirtualBox). Le pentest
        // releve d'une autre SAE, a ajouter plus tard : pas de lien ici.
        uses: [
          'virtualbox',
          'vpn',
          'dhcp',
          'dns',
          'squid',
          'ssl',
          'rdp',
          'active-directory',
          'gpo',
          'windows-server',
          'linux',
          'apache',
          'dmz',
          'firewall',
          'stormshield',
          'acl',
        ],
      },
    ],
    caseStudy: {
      experienceId: 'infra-multisite',
      title: 'Multi-site infrastructure',
      intro:
        'BUT RT2 team project (three people): the full infrastructure of a fictional bank spread across two sites, entirely virtualized in VirtualBox. My part: Active Directory, DNS and the DMZ servers.',
      caption:
        'Simplified project topology. Addressing, credentials and internal names deliberately left out.',
      labels: {
        hq: 'HQ · Saint-Denis',
        branch: 'Saint-Pierre',
        clients: 'Clients',
        dmz: 'DMZ',
        lan: 'Servers',
        dns: 'DNS ×2',
        web: 'Web ×2',
        lb: 'HAProxy',
        ad: 'AD / DNS',
        services1: 'DHCP · Print',
        services2: 'Zabbix · RDS',
        proxy: 'Proxy',
        vpn: 'IPsec',
        vpnStatus: 'not finished',
        backup: 'planned backup: 4G/5G · Starlink',
        rodc: 'RODC',
      },
      steps: [
        {
          id: 'cloisonner',
          title: 'Segment',
          body: 'A Stormshield internal firewall at the center and four separate zones: client workstations, servers, DMZ and the link to the branch. Every flow is explicitly allowed, following the least-privilege principle recommended by ANSSI.',
          nodes: ['hq', 'zones', 'fwint'],
        },
        {
          id: 'annuaire',
          title: 'Directory and DNS',
          body: 'Active Directory domain controller: organizational units, accounts, shares and a GPO applied to every workstation. Internal DNS forwards external queries to the public DNS in the DMZ.',
          nodes: ['ad'],
          mine: true,
        },
        {
          id: 'dmz',
          title: 'High-availability DMZ',
          body: 'Two Apache web servers behind HAProxy: round-robin, health check every 3 s, HTTPS and security headers. Failover validated by shutting one server down. Public master/slave DNS on BIND9, zone signed with DNSSEC.',
          nodes: ['dmz'],
          mine: true,
        },
        {
          id: 'services',
          title: 'Internal services',
          body: 'DHCP relayed by the firewall to client workstations, centralized printing (CUPS), monitoring (Zabbix) and remote desktop (RDS) for the business application.',
          nodes: ['services'],
        },
        {
          id: 'succursale',
          title: 'Connect the branch',
          body: 'Read-only domain controller (RODC) installed in Saint-Pierre. The IPsec tunnel, the edge firewall and the proxy were not finished by the end of the project. 4G/5G and Starlink backup links were planned.',
          nodes: ['edge', 'vpn', 'branch'],
        },
      ],
      outcome: {
        stat: '14 / 17',
        statLabel: 'components validated by the end of the project',
        lessons: [
          'On a firewall, one wrong network object or rule order is enough to block an entire flow: we hit this while debugging the ICMP and DHCP rules.',
          'Order matters: DNS, then Active Directory, then client workstations. Any deviation causes cascading failures that are hard to diagnose.',
          'Virtualization has its own traps: mapping network interfaces to the virtual firewalls took hours of troubleshooting.',
        ],
      },
    },
    education: [
      {
        title: "BUT (Bachelor's) in Networks & Telecommunications, Cybersecurity track",
        org: 'IUT de La Réunion – Saint-Pierre',
        period: '2024 – 2027',
      },
      {
        title: 'STI2D Baccalaureate – High Honors',
        org: 'Lycée Roland Garros, Le Tampon',
        period: '2021 – 2024',
      },
    ],
    skills: {
      'Network & Systems Administration': [
        { id: 'vlan', label: 'VLAN' },
        { id: 'dhcp', label: 'DHCP' },
        { id: 'dns', label: 'DNS' },
        { id: 'routing', label: 'Routing' },
        { id: 'active-directory', label: 'Active Directory' },
        { id: 'gpo', label: 'GPO' },
        { id: 'acl', label: 'ACL' },
        { id: 'windows-server', label: 'Windows Server' },
      ],
      Security: [
        { id: 'firewall', label: 'Firewalling' },
        { id: 'pfsense', label: 'pfSense' },
        { id: 'stormshield', label: 'Stormshield' },
        { id: 'pentest', label: 'Penetration Testing' },
        { id: 'security-testing', label: 'Security Testing' },
        { id: 'dmz', label: 'DMZ' },
        { id: 'wireshark', label: 'Wireshark' },
        { id: 'nmap', label: 'Nmap' },
        { id: 'ssl', label: 'SSL Certificates' },
        { id: 'vpn', label: 'VPN' },
      ],
      'Infrastructure & Web': [
        { id: 'vmware', label: 'VMware' },
        { id: 'virtualbox', label: 'VirtualBox' },
        { id: 'docker', label: 'Docker' },
        { id: 'linux', label: 'Linux' },
        { id: 'squid', label: 'Squid Proxy' },
        { id: 'apache', label: 'Apache' },
        { id: 'nginx', label: 'NGINX' },
        { id: 'mysql', label: 'MySQL' },
        { id: 'rdp', label: 'RDP' },
      ],
      Programming: [
        { id: 'python', label: 'Python' },
        { id: 'c-cpp', label: 'C/C++' },
        { id: 'js-ts', label: 'JavaScript/TypeScript' },
        { id: 'react', label: 'React' },
        { id: 'nodejs', label: 'Node.js' },
        { id: 'web-dev', label: 'Web Development' },
      ],
      'Tools & Certifications': [
        { id: 'glpi', label: 'GLPI' },
        { id: 'asterisk', label: 'Asterisk (VoIP)' },
        { id: 'anssi-mooc', label: 'ANSSI MOOC – SecNumAcadémie' },
      ],
    },
    softSkills: ['Teamwork', 'Communication', 'Project Management', 'Autonomy', 'Rigor'],
    activities: [
      {
        title: '24 Hours of Innovation, Réunion Island',
        period: '2021 & 2022',
        desc: 'Team collaboration on innovative projects – time management and public speaking',
      },
      {
        title: 'Regional Technology Competition, Réunion Island – 3rd place',
        period: '2023',
        desc: 'Team leadership – group management and teamwork experience',
      },
    ],
    languages: [{ name: 'English', level: 'C1 (Advanced)' }],
    interests: ['New technologies', 'PC building & optimization', 'Motorsport'],
  },
}

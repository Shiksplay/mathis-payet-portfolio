/**
 * Source de verite unique du contenu du CV (FR / EN).
 *
 * Aucun texte du site ne doit etre ecrit en dur ailleurs : tout passe par ce
 * fichier via le hook `useCv()`. Les deux langues partagent strictement la meme
 * forme (`CvContent`), ce qui garantit qu'aucune cle ne peut manquer d'un cote.
 */

export type Lang = 'fr' | 'en'

export const LANGS: readonly Lang[] = ['fr', 'en'] as const

export interface Experience {
  title: string
  org: string
  type: string
  period: string
  bullets: string[]
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
  education: Education[]
  /** Cle = nom de categorie (traduit), valeur = liste de competences. */
  skills: Record<string, string[]>
  softSkills: string[]
  activities: Activity[]
  languages: LanguageSkill[]
  interests: string[]
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
    tagline: 'Étudiant passionné par la programmation et le développement',
    profile:
      "Étudiant entrant en 3e année de BUT Réseaux et Télécommunications, parcours Cybersécurité, à l'IUT de La Réunion. Je recherche une alternance en administration et sécurité des réseaux pour l'année scolaire 2026-2027. Curieux et rigoureux, je souhaite mettre en pratique mes compétences en configuration, sécurisation et gestion d'infrastructures réseau au sein d'une équipe technique.",
    projects: [
      {
        index: '01',
        title: "Jeu intégré à un site web d'entreprise",
        desc: "Mini-jeu ludique et professionnel intégré au site web d'une entreprise du bâtiment",
        tags: ['Jeu vidéo', 'Web', 'Game design'],
      },
      {
        index: '02',
        title: 'The Forgotten',
        desc: "Jeu solo d'horreur développé sur Unreal Engine 5 dans une ville abandonnée mystérieuse",
        tags: ['Jeu vidéo', 'Unreal Engine', 'Horreur'],
      },
      {
        index: '03',
        title: 'SAÉ 1.02 — Système de mesure Température/Hygrométrie avec Raspberry Pi',
        desc: "Système de supervision de la température et de l'humidité d'une salle serveur",
        tags: ['IoT', 'Raspberry Pi', 'Capteurs'],
      },
    ],
    experiences: [
      {
        title: 'Assistance technique & projets informatiques',
        org: "Région Réunion – Direction de l'Éducation et de la Vie Lycéenne (E-éducation secteur sud et est)",
        type: 'Stage en milieu professionnel',
        period: 'Avril – Juin 2026',
        bullets: [
          'Assistance au référent technique et sur des projets, en collaboration avec les assistants de maintenance informatique',
          "Mise en place d'une solution de ToIP (Asterisk)",
          "Montée en compétences sur l'inventaire GLPI, la configuration de switchs, le câblage réseau et la configuration de bornes Wi-Fi",
        ],
      },
      {
        title: "Conception & déploiement d'une infrastructure réseau multisite sécurisée",
        org: 'IUT de La Réunion, BUT RT2',
        type: 'Projet académique',
        period: 'Déc. 2025 – Mars 2026',
        bullets: [
          "Conception et déploiement d'un réseau virtuel pour une entreprise multisite avec VPN (VMware)",
          'Configuration des services réseau : adressage IP/DHCP, serveurs internes, interconnexion des équipements, proxy Squid, certificats SSL, RDP, Active Directory',
          "Sécurisation du réseau : pare-feu, ACL, tests d'intrusion (pentesting)",
        ],
      },
    ],
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
        'VLAN',
        'DHCP',
        'DNS',
        'Routage',
        'Active Directory',
        'GPO',
        'ACL',
        'Windows Server',
      ],
      Sécurité: [
        'Pare-feu',
        'pfSense',
        'Pentesting',
        'Tests de sécurité',
        'DMZ',
        'Wireshark',
        'Nmap',
        'Certificats SSL',
        'VPN',
      ],
      'Infrastructure & Web': [
        'VMware',
        'Docker',
        'Linux',
        'Proxy Squid',
        'Apache',
        'NGINX',
        'MySQL',
        'RDP',
      ],
      Programmation: [
        'Python',
        'C/C++',
        'JavaScript/TypeScript',
        'React',
        'Node.js',
        'Développement Web',
      ],
      'Outils & certification': ['GLPI', 'Asterisk (ToIP)', 'MOOC ANSSI – SecNumAcadémie'],
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
    tagline: 'Student passionate about programming and software development',
    profile:
      'Third-year student in the Networks & Telecommunications program (BUT RT), Cybersecurity track, at IUT de La Réunion. Looking for a work-study position in network administration and security for the 2026-2027 academic year. Curious and rigorous, I want to put my configuration, hardening, and network infrastructure management skills into practice within a technical team.',
    projects: [
      {
        index: '01',
        title: 'Game embedded in a company website',
        desc: 'A playful yet professional mini-game embedded in the website of a construction company',
        tags: ['Game', 'Web', 'Game design'],
      },
      {
        index: '02',
        title: 'The Forgotten',
        desc: 'Single-player horror game built in Unreal Engine 5, set in a mysterious abandoned city',
        tags: ['Game', 'Unreal Engine', 'Horror'],
      },
      {
        index: '03',
        title: 'SAÉ 1.02 — Temperature/Humidity monitoring system with Raspberry Pi',
        desc: 'Monitoring system for the temperature and humidity of a server room',
        tags: ['IoT', 'Raspberry Pi', 'Sensors'],
      },
    ],
    experiences: [
      {
        title: 'IT Technical Support & Projects',
        org: 'Réunion Regional Council – Education & School Life Department (South & East e-education sector)',
        type: 'Professional internship',
        period: 'April – June 2026',
        bullets: [
          'Supported the technical lead on IT projects, working alongside IT maintenance technicians',
          'Deployed a VoIP/ToIP solution (Asterisk)',
          'Built skills in GLPI asset inventory, switch configuration, network cabling, and Wi-Fi access point setup',
        ],
      },
      {
        title: 'Design & Deployment of a Secure Multi-site Network Infrastructure',
        org: 'IUT de La Réunion, BUT RT2',
        type: 'Academic project',
        period: 'Dec. 2025 – Mar. 2026',
        bullets: [
          'Designed and deployed a virtualized network for a multi-site company, including VPN connectivity (VMware)',
          'Configured core network services: IP addressing/DHCP, internal servers, device interconnection, Squid proxy, SSL certificates, RDP, Active Directory',
          'Hardened the network: firewalling, ACLs, penetration testing',
        ],
      },
    ],
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
        'VLAN',
        'DHCP',
        'DNS',
        'Routing',
        'Active Directory',
        'GPO',
        'ACL',
        'Windows Server',
      ],
      Security: [
        'Firewalling',
        'pfSense',
        'Penetration Testing',
        'Security Testing',
        'DMZ',
        'Wireshark',
        'Nmap',
        'SSL Certificates',
        'VPN',
      ],
      'Infrastructure & Web': [
        'VMware',
        'Docker',
        'Linux',
        'Squid Proxy',
        'Apache',
        'NGINX',
        'MySQL',
        'RDP',
      ],
      Programming: [
        'Python',
        'C/C++',
        'JavaScript/TypeScript',
        'React',
        'Node.js',
        'Web Development',
      ],
      'Tools & Certifications': ['GLPI', 'Asterisk (VoIP)', 'ANSSI MOOC – SecNumAcadémie'],
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

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
 * Contenu tire des documents reels de Mathis (rapport de stage, rapport
 * d'audit, portfolio existant) : rien n'est invente ici non plus. Les rares
 * formulations proposees plutot que citees sont signalees par un commentaire
 * `RESSENTI — proposition a valider` a l'endroit exact ou elles apparaissent.
 *
 * LES CHAMPS DETAILLES SONT OPTIONNELS, ET C'EST VOLONTAIRE : la galerie
 * deplie une carte complete quand ils sont renseignes, et retombe sur la carte
 * compacte quand ils ne le sont pas. Un projet peut donc etre ajoute en trois
 * lignes sans casser la section, et enrichi plus tard.
 */
export interface Project {
  /** Numero de reference du projet dans la galerie ("01", "02"...). */
  index: string
  title: string
  desc: string
  /** Etiquettes courtes affichees sous la carte. */
  tags: string[]
  /** Projet termine ou en cours — pilote le badge d'etat dans la galerie. */
  status?: 'completed' | 'ongoing'
  /** Periode affichee sur la carte (ex. "Avril – Juin 2026"). */
  period?: string
  /** Une phrase qui situe le projet (cadre, commanditaire). */
  context?: string
  /** Competences reellement mises en oeuvre. */
  skills?: string[]
  /** Bilan : resultats concrets et livrables. */
  outcome?: string
  /** Ressenti personnel, a la premiere personne. */
  reflection?: string
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
    // ORDRE DE LA GALERIE : reseau et securite d'abord. La page sert une
    // recherche d'alternance en administration et securite des reseaux — le
    // premier projet lu doit etre celui qui parle a ce recruteur-la.
    projects: [
      {
        index: '01',
        status: 'completed',
        period: 'Avril – Juin 2026',
        title: 'Infrastructure réseau des lycées — Région Réunion',
        context:
          "Stage de BUT2 au service E-éducation de la Direction de l'Éducation et de la Vie Lycéenne (DEVL), sur le parc des lycées publics réunionnais.",
        desc: 'Administration, déploiement et maintenance sur le terrain des réseaux des lycées : commutation, mobilité Wi-Fi, téléphonie sur IP et gestion de parc.',
        tags: ['Réseau', 'Switching', 'Wi-Fi', 'ToIP', 'GLPI'],
        skills: [
          'Commutateurs HPE 2510/2530 & Aruba 6000/6100 (CLI SSH/Console)',
          'Contrôleurs Aruba Instant On & Ubiquiti UniFi',
          'VLANs, trunks, SNMP',
          'Bornes Wi-Fi : adoption contrôleur + installation physique',
          'Brassage cuivre RJ45 & fibre optique',
          'GLPI 9 / FusionInventory',
          'Serveur ToIP Asterisk (PJSIP, Yealink SIP-T33G, Linphone)',
        ],
        outcome:
          "Inventaire GLPI mis à jour sur 43 lycées (IP et modèles), déploiement de bornes Wi-Fi avec couverture de l'internat de Roland Garros, remplacement de switchs défectueux (2530 → Aruba 1830 reconfigurés), et mise en service d'un serveur ToIP de secours au lycée Ambroise Vollard — appels validés entre softphone Linphone et postes physiques.",
        // Tire du bilan de la soutenance de stage : ce sont ses mots.
        reflection:
          "Ce stage a confirmé mon intérêt pour les réseaux : passer de la configuration en ligne de commande au brassage des baies m'a montré concrètement ce que représente l'administration d'un parc à grande échelle.",
      },
      {
        // REGISTRE VOLONTAIRE : methodologie, competences et recommandations.
        // Le pas-a-pas d'exploitation du rapport (commandes, payloads, modules,
        // hashes, identifiants) n'a rien a faire sur une page publique — et ce
        // n'est pas ce qu'un recruteur securite y cherche. On decrit ce qui a
        // ete fait et appris, pas de quoi rejouer l'attaque.
        index: '02',
        status: 'completed',
        period: 'Nov. 2025 – Janv. 2026',
        title: "Audit technique & test d'intrusion (SAÉ cybersécurité)",
        context:
          "SAÉ de découverte du pentesting : audit d'intrusion d'une infrastructure cible en laboratoire isolé, sur des environnements Linux et Windows.",
        desc: "Test d'intrusion mené de bout en bout, de la reconnaissance réseau jusqu'à la compromission du domaine, suivi d'un rapport d'audit et de recommandations.",
        tags: ['Pentest', 'Sécurité offensive', 'Nmap', 'Metasploit'],
        skills: [
          'Reconnaissance réseau (Nmap)',
          'Exploitation de vulnérabilités connues (Metasploit)',
          'Mouvement latéral & pivoting réseau',
          'Élévation de privilèges',
          'Récupération et cassage de hashes (John the Ripper)',
          'Post-exploitation',
          "Rédaction d'un rapport d'audit",
        ],
        outcome:
          "Compromission de trois machines cibles (un serveur Linux, des postes Windows 7 et 10) jusqu'à l'obtention de privilèges administrateur, mettant en évidence une chaîne de vulnérabilités critiques : services obsolètes, mauvaises configurations et secrets exposés. Rédaction de recommandations de remédiation : désactivation des protocoles obsolètes, application des correctifs, durcissement des configurations et surveillance des journaux.",
        // RESSENTI — proposition a valider par Mathis, a remplacer par ses mots.
        reflection:
          "Adopter le point de vue de l'attaquant a changé ma façon de voir la défense : comprendre par quoi une infrastructure cède m'a donné envie d'aller vers le durcissement et la sécurisation des réseaux plutôt que l'offensif pur.",
      },
      {
        index: '03',
        status: 'ongoing',
        period: '2026 – en cours',
        title: 'Streamer audio Hi-Fi sur Raspberry Pi (HiFiBerry)',
        context:
          "Projet personnel : transformer un Raspberry Pi en lecteur audio réseau de qualité audiophile à l'aide d'une carte DAC HiFiBerry.",
        desc: "Montage matériel et configuration logicielle d'un streamer haute-fidélité : carte DAC I²S HiFiBerry, OS dédié et diffusion audio en réseau.",
        tags: ['Raspberry Pi', 'Audio', 'Linux', 'DIY'],
        skills: [
          'Raspberry Pi',
          'Linux (HiFiBerryOS / Volumio)',
          'Carte DAC I²S',
          'Diffusion réseau (AirPlay / Spotify Connect / DLNA)',
          'Configuration système',
          'Montage matériel',
        ],
        // RESSENTI — proposition a valider par Mathis, a remplacer par ses mots.
        outcome:
          "Prototype fonctionnel qui lit en continu depuis le réseau ; travail en cours sur la qualité de restitution et l'intégration dans un système multi-pièces.",
        // RESSENTI — proposition a valider par Mathis, a remplacer par ses mots.
        reflection:
          "Un projet qui relie mes deux terrains favoris, le réseau et le bricolage matériel : voir un petit Raspberry Pi devenir une vraie source audio est très gratifiant.",
      },
      {
        // Carte COMPACTE, volontairement : cv.ts ne contient rien de plus sur ce
        // projet que son titre, sa description et ses etiquettes. Inventer un
        // bilan serait exactement ce que ce fichier interdit. Les champs
        // optionnels sont faits pour ca — la galerie s'adapte.
        index: '04',
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
    // Meme ordre qu'en FR : reseau et securite d'abord.
    projects: [
      {
        index: '01',
        status: 'completed',
        period: 'April – June 2026',
        title: 'School Network Infrastructure — Réunion Regional Council',
        context:
          "Second-year internship with the e-education team of the Education & School Life Department (DEVL), across Réunion's public high schools.",
        desc: 'Hands-on administration, deployment and maintenance of school networks: switching, Wi-Fi mobility, IP telephony and asset management.',
        tags: ['Networking', 'Switching', 'Wi-Fi', 'VoIP', 'GLPI'],
        skills: [
          'HPE 2510/2530 & Aruba 6000/6100 switches (CLI SSH/Console)',
          'Aruba Instant On & Ubiquiti UniFi controllers',
          'VLANs, trunks, SNMP',
          'Wi-Fi access points: controller adoption + physical install',
          'RJ45 copper & fibre patching',
          'GLPI 9 / FusionInventory',
          'Asterisk VoIP server (PJSIP, Yealink SIP-T33G, Linphone)',
        ],
        outcome:
          'GLPI inventory updated across 43 high schools (IPs and models), Wi-Fi access points deployed with full coverage of the Roland Garros boarding school, faulty switches replaced (2530 → reconfigured Aruba 1830), and a backup VoIP server brought online at Ambroise Vollard high school — calls validated between a Linphone softphone and physical handsets.',
        // Tire du bilan de la soutenance de stage : ce sont ses mots.
        reflection:
          'This internship confirmed my interest in networking: going from command-line configuration to physically patching the racks gave me a concrete sense of what administering a large-scale estate really involves.',
      },
      {
        // Voir la version FR : registre methodologie / recommandations, jamais
        // le pas-a-pas d'exploitation.
        index: '02',
        status: 'completed',
        period: 'Nov. 2025 – Jan. 2026',
        title: 'Technical Audit & Penetration Test (cybersecurity project)',
        context:
          'Introductory penetration-testing project: an intrusion audit of a target infrastructure in an isolated lab, across Linux and Windows environments.',
        desc: 'End-to-end penetration test, from network reconnaissance to domain compromise, followed by an audit report and remediation recommendations.',
        tags: ['Pentest', 'Offensive Security', 'Nmap', 'Metasploit'],
        skills: [
          'Network reconnaissance (Nmap)',
          'Exploitation of known vulnerabilities (Metasploit)',
          'Lateral movement & network pivoting',
          'Privilege escalation',
          'Hash recovery and cracking (John the Ripper)',
          'Post-exploitation',
          'Audit reporting',
        ],
        outcome:
          'Compromised three target machines (a Linux server, Windows 7 and 10 workstations) up to administrator privileges, exposing a chain of critical weaknesses: outdated services, misconfigurations and exposed secrets. Produced remediation recommendations: disabling obsolete protocols, applying patches, hardening configurations and monitoring logs.',
        // RESSENTI — proposition a valider par Mathis, a remplacer par ses mots.
        reflection:
          "Taking the attacker's point of view changed how I see defence: understanding exactly where an infrastructure gives way made me want to move toward hardening and securing networks rather than pure offensive work.",
      },
      {
        index: '03',
        status: 'ongoing',
        period: '2026 – ongoing',
        title: 'Hi-Fi audio streamer on Raspberry Pi (HiFiBerry)',
        context:
          'Personal project: turning a Raspberry Pi into an audiophile-grade network audio player using a HiFiBerry DAC board.',
        desc: 'Hardware assembly and software configuration of a hi-fi streamer: HiFiBerry I²S DAC board, dedicated OS and network audio streaming.',
        tags: ['Raspberry Pi', 'Audio', 'Linux', 'DIY'],
        skills: [
          'Raspberry Pi',
          'Linux (HiFiBerryOS / Volumio)',
          'I²S DAC board',
          'Network streaming (AirPlay / Spotify Connect / DLNA)',
          'System configuration',
          'Hardware assembly',
        ],
        // RESSENTI — proposition a valider par Mathis, a remplacer par ses mots.
        outcome:
          'Working prototype that streams continuously over the network; still refining audio quality and integration into a multi-room setup.',
        // RESSENTI — proposition a valider par Mathis, a remplacer par ses mots.
        reflection:
          'A project that ties together my two favourite playgrounds, networking and hands-on hardware: watching a tiny Raspberry Pi turn into a real audio source is very rewarding.',
      },
      {
        // Carte compacte : voir le commentaire de la version FR.
        index: '04',
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

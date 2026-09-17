import type { Lang } from './cv'

/**
 * Libelles de l'interface (navigation, boutons, titres de sections, sequence de
 * boot). Volontairement separe de `cv.ts`, qui ne contient que le contenu factuel
 * du CV et ne doit pas etre pollue par du vocabulaire d'UI.
 */
export interface UiStrings {
  skipToContent: string
  nav: {
    langLabel: string
    switchTo: string
    menu: string
    closeMenu: string
  }
  hero: {
    scrollHint: string
    downloadCv: string
    contactMe: string
  }
  headings: {
    profile: string
    experience: string
    projects: string
    projectsKicker: string
    education: string
    skills: string
    softSkills: string
    activities: string
    languages: string
    interests: string
    contact: string
  }
  contact: {
    intro: string
    emailLabel: string
    phoneLabel: string
    linkedinLabel: string
    locationLabel: string
    copy: string
    copied: string
  }
  boot: {
    lines: string[]
    skip: string
  }
  loader: string
  footer: {
    builtWith: string
    rights: string
  }
  a11y: {
    reducedMotionNotice: string
    webglFallback: string
  }
}

export const ui: Record<Lang, UiStrings> = {
  fr: {
    skipToContent: 'Aller au contenu principal',
    nav: {
      langLabel: 'Langue',
      switchTo: 'Passer en anglais',
      menu: 'Ouvrir le menu',
      closeMenu: 'Fermer le menu',
    },
    hero: {
      scrollHint: 'Défiler pour explorer',
      downloadCv: 'Télécharger mon CV',
      contactMe: 'Me contacter',
    },
    headings: {
      profile: 'Profil',
      experience: 'Expérience & projets',
      projects: 'Projets',
      projectsKicker: 'Faites glisser pour parcourir',
      education: 'Formation',
      skills: 'Compétences',
      softSkills: 'Savoir-être',
      activities: 'Engagements & activités',
      languages: 'Langues',
      interests: "Centres d'intérêt",
      contact: 'Contact',
    },
    contact: {
      intro: 'Une alternance, une question, un échange — je réponds rapidement.',
      emailLabel: 'E-mail',
      phoneLabel: 'Téléphone',
      linkedinLabel: 'LinkedIn',
      locationLabel: 'Localisation',
      copy: 'Copier',
      copied: 'Copié',
    },
    boot: {
      lines: [
        '> Initializing secure connection...',
        '> Handshake TLS 1.3 — OK',
        '> Authenticating: Mathis Payet',
        '> Loading profile: BUT RT — Cybersécurité',
        '> Access granted',
      ],
      skip: 'Cliquez ou appuyez sur une touche pour passer',
    },
    loader: 'Construction du réseau',
    footer: {
      builtWith: 'Conçu et développé par Mathis Payet',
      rights: 'Tous droits réservés',
    },
    a11y: {
      reducedMotionNotice: 'Animations réduites selon vos préférences système.',
      webglFallback: 'Visualisation 3D indisponible sur cet appareil.',
    },
  },
  en: {
    skipToContent: 'Skip to main content',
    nav: {
      langLabel: 'Language',
      switchTo: 'Switch to French',
      menu: 'Open menu',
      closeMenu: 'Close menu',
    },
    hero: {
      scrollHint: 'Scroll to explore',
      downloadCv: 'Download my resume',
      contactMe: 'Get in touch',
    },
    headings: {
      profile: 'Profile',
      experience: 'Experience & projects',
      projects: 'Projects',
      projectsKicker: 'Drag to browse',
      education: 'Education',
      skills: 'Skills',
      softSkills: 'Soft skills',
      activities: 'Activities & involvement',
      languages: 'Languages',
      interests: 'Interests',
      contact: 'Contact',
    },
    contact: {
      intro: 'A work-study offer, a question, a conversation — I reply quickly.',
      emailLabel: 'Email',
      phoneLabel: 'Phone',
      linkedinLabel: 'LinkedIn',
      locationLabel: 'Location',
      copy: 'Copy',
      copied: 'Copied',
    },
    boot: {
      lines: [
        '> Initializing secure connection...',
        '> TLS 1.3 handshake — OK',
        '> Authenticating: Mathis Payet',
        '> Loading profile: BUT RT — Cybersecurity',
        '> Access granted',
      ],
      skip: 'Click or press any key to skip',
    },
    loader: 'Building the network',
    footer: {
      builtWith: 'Designed and built by Mathis Payet',
      rights: 'All rights reserved',
    },
    a11y: {
      reducedMotionNotice: 'Motion reduced according to your system preferences.',
      webglFallback: '3D visualization unavailable on this device.',
    },
  },
}

import type { Lang } from './cv'
import type { ContentSectionId } from './sections'

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
  /**
   * Pont CV <-> site : rubrique du PDF a laquelle chaque section correspond
   * (affichee dans le bandeau de section), et libelles associes.
   */
  cvBridge: {
    rubrics: Record<ContentSectionId, string>
    beyondCv: string
    downloadShort: string
  }
  /** Relation competences <-> experiences ("ou est-ce prouve ?"). */
  proofs: {
    legend: string
    provenBy: string
    usedSkills: string
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
  /** Deux lignes courtes : la console de boot doit tenir sous la seconde. */
  boot: {
    lines: string[]
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
    cvBridge: {
      rubrics: {
        profil: 'CV › Profil',
        experience: 'CV › Expérience professionnelle & projets',
        projets: 'En plus du CV',
        formation: 'CV › Formation',
        competences: 'CV › Compétences',
        engagements: 'CV › Engagements & activités',
        langues: "CV › Langues · Centres d'intérêt",
        contact: 'CV › En-tête',
      },
      beyondCv: 'Ce que le CV ne dit pas',
      downloadShort: 'CV',
    },
    proofs: {
      legend:
        'Pastille lumineuse : compétence mise en œuvre dans une expérience. Survolez-la ou sélectionnez-la pour voir où.',
      provenBy: 'Mise en œuvre dans',
      usedSkills: 'Compétences mobilisées',
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
      lines: ['> Handshake TLS 1.3 — OK', '> Access granted'],
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
    cvBridge: {
      rubrics: {
        profil: 'Resume › Profile',
        experience: 'Resume › Experience & projects',
        projets: 'Not in the resume',
        formation: 'Resume › Education',
        competences: 'Resume › Skills',
        engagements: 'Resume › Activities',
        langues: 'Resume › Languages · Interests',
        contact: 'Resume › Header',
      },
      beyondCv: 'What the resume does not say',
      downloadShort: 'Resume',
    },
    proofs: {
      legend:
        'Glowing dot: a skill put into practice in one of my experiences. Hover or select it to see where.',
      provenBy: 'Applied in',
      usedSkills: 'Skills applied',
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
      lines: ['> TLS 1.3 handshake — OK', '> Access granted'],
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

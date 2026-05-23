import type { Project } from '@/types'
import { Technologies } from '@/types'

export const projects: Project[] = [
  {
    slug: 'planningsup',
    title: 'PlanningSup',
    url: 'https://planningsup.app',
    imgProps: {
      src: '/icons/planningsup.webp',
      width: 20,
      height: 20,
      rounded: true,
    },
    description: 'Planning universitaire personnalisable pour les étudiants, hors connexion et sans publicité.',
    technologies: [Technologies.Bun, Technologies.Vue],
  },
  {
    slug: 'secousse',
    title: 'Secousse',
    url: 'https://github.com/kernoeb/secousse',
    imgProps: {
      src: '/icons/secousse.svg',
      width: 20,
      height: 20,
      rounded: true,
    },
    description: 'Client desktop Twitch open-source, léger et sans publicité.',
    technologies: [Technologies.Tauri, Technologies.React, Technologies.Rust],
  },
  {
    slug: 'squads-app',
    title: 'Squads App',
    url: 'https://github.com/kernoeb/squads-app',
    imgProps: {
      src: '/icons/squads-app.svg',
      width: 20,
      height: 20,
      rounded: true,
    },
    description: 'Client Android alternatif pour Microsoft Teams et Outlook.',
    technologies: [Technologies.Kotlin],
  },
  {
    slug: 'drapeau-du-jour',
    title: 'DrapeauDuJour',
    url: 'https://drapeaudujour.noewen.com',
    imgProps: {
      src: '/icons/drapeau-du-jour.webp',
      width: 20,
      height: 20,
    },
    description: 'Chaque jour, un pays différent à découvrir avec son drapeau.',
    technologies: [Technologies.Vue3, Technologies.NodeJs],
  },
  {
    slug: 'partage',
    title: 'Partage',
    url: 'https://github.com/kernoeb/partage',
    imgProps: {
      src: '/icons/partage.svg',
      width: 20,
      height: 20,
      rounded: true,
    },
    description: 'Partage de texte dans le même réseau local.',
    technologies: [Technologies.Vue3, Technologies.Rust, Technologies.WebSockets],
  },
]

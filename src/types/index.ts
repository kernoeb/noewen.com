type IconName = `$${string}`

export enum Technologies {
  Nuxt2 = 'Nuxt 2',
  Nuxt3 = 'Nuxt 3',
  Vue3 = 'Vue 3',
  NodeJs = 'Node.js',
  Puppeteer = 'Puppeteer',
  Rust = 'Rust',
  WebSockets = 'WebSockets',
}

export interface Project {
  title: string
  description: string
  technologies: Technologies[]
  url: `https://${string}`
  imgProps?: Record<string, unknown>
  iconProps?: {
    name: IconName
    color: string
  }
}

export interface SocialNetwork {
  name: string
  icon: IconName
  url: string
}

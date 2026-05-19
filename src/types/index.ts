type IconName = `$${string}`

export enum Technologies {
  Vue3 = 'Vue 3',
  Vue = 'Vue.js',
  React = 'React',
  Tauri = 'Tauri 2',
  Bun = 'Bun',
  NodeJs = 'Node.js',
  Rust = 'Rust',
  Kotlin = 'Kotlin',
  WebSockets = 'WebSockets',
}

export interface Project {
  title: string
  description: string
  technologies: Technologies[]
  url: `https://${string}`
  imgProps: Record<string, unknown>
}

export interface SocialNetwork {
  name: string
  icon: IconName
  url: string
}

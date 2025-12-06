/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

import { ViteSSG } from 'vite-ssg'
import { routes } from 'vue-router/auto-routes'
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

export const createApp = ViteSSG(
  App,
  { routes },
  ({ app }) => {
    registerPlugins(app)
  },
)

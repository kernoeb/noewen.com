/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

import { setupLayouts } from 'virtual:generated-layouts'

import { ViteSSG } from 'vite-ssg'
import { routes } from 'vue-router/auto-routes'

// Components
import App from './App.vue'

export const createApp = ViteSSG(
  App,
  { routes: setupLayouts(routes) },
  ({ app }) => {
    registerPlugins(app)
  },
)

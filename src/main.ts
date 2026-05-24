/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

import { ViteSSG } from 'vite-ssg/single-page'
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

import 'virtual:google-fonts'

export const createApp = ViteSSG(App, ({ app }) => {
  registerPlugins(app)
})

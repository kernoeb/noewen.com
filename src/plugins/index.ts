/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

import pinia from '../stores'
// Plugins
import vuetify from './vuetify'

// Types
import type { App } from 'vue'

export function registerPlugins(app: App) {
  app
    .use(vuetify)
    .use(pinia)
}

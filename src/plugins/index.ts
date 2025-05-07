/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Types
import type { App } from 'vue'

import { createPlausible } from 'v-plausible/vue'
import vuetify from './vuetify'

const domain = 'noewen.com'

export function registerPlugins(app: App) {
  app.use(vuetify)

  // Load Plausible Analytics on mounted app
  if (!import.meta.env.SSR) {
    const plausible = createPlausible({
      init: {
        domain,
        apiHost: `https://plausible.${domain}`,
        trackLocalhost: false,
      },
      settings: {
        enableAutoOutboundTracking: true,
        enableAutoPageviews: true,
      },
      partytown: false,
    })

    app.use(plausible)
  }
}

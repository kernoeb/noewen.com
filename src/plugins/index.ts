/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

import vuetify from './vuetify'

// Types
import type { App } from 'vue'
import { createPlausible } from 'v-plausible/vue'

const domain = 'noewen.com'

export function registerPlugins(app: App) {
  app
    .use(vuetify)

  if (!import.meta.env.SSR) {
    const plausible = createPlausible({
      init: {
        domain,
        apiHost: `https://plausible.${domain}`,
        trackLocalhost: true,
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

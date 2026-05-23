/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Types
import type { App } from 'vue'

import vuetify from './vuetify'

const domain = 'noewen.com'

export function registerPlugins(app: App) {
  app.use(vuetify)

  // Load Plausible Analytics on mounted app. The official tracker uses
  // fetch + keepalive (no preventDefault + setTimeout location.href race
  // like the archived plausible-tracker), so target="_blank" on outbound
  // links keeps working. Dynamic import because the module touches
  // `location.href` at top-level — would crash vite-ssg's SSR build
  // under Node.
  if (!import.meta.env.SSR) {
    import('@plausible-analytics/tracker').then(({ init }) => {
      init({
        domain,
        endpoint: `https://plausible.${domain}/api/event`,
        autoCapturePageviews: true,
        outboundLinks: true,
        captureOnLocalhost: false,
      })
    })
  }
}

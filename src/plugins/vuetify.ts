/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

import { mdiBriefcaseAccountOutline, mdiCodeTags, mdiFilePdfBox, mdiGithub, mdiLinkedin, mdiMagnifyPlusOutline, mdiShareCircle, mdiTwitter } from '@mdi/js'
// Composables
import { createVuetify } from 'vuetify'
// Styles
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

import 'vuetify/styles'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  icons: {
    defaultSet: 'mdi',
    sets: {
      mdi,
    },
    aliases: {
      ...aliases,
      'linkedin': mdiLinkedin,
      'github': mdiGithub,
      'twitter': mdiTwitter,
      'code-tags': mdiCodeTags,
      'briefcase-account-outline': mdiBriefcaseAccountOutline,
      'magnify-plus-outline': mdiMagnifyPlusOutline,
      'file-pdf-box': mdiFilePdfBox,
      'share-circle': mdiShareCircle,
      'x': 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
    },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          // blue clear
          primary: '#1976D2',
          background: '#5a0034',
        },
      },
    },
  },
})

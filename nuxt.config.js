import colors from 'vuetify/es5/util/colors'
import rules from './purgeUnusedCss.js'

const { NODE_ENV = 'production' } = process.env
const isDev = NODE_ENV === 'development'

const DOMAIN = 'noewen.com'
const PLAUSIBLE_DOMAIN = 'plausible.noewen.com'

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Noéwen BOISNARD',
    htmlAttrs: {
      lang: 'fr'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { hid: 'description', name: 'description', content: 'Développeur web et mobile' },
      { name: 'keywords', content: 'noéwen,boisnard,noéwen boisnard,développeur,nuxtjs,nuxt.js,vue.js,vuejs,javascript,vannes,bretagne' },
      { name: 'google-site-verification', content: '8OsXtvbWNLNLJWH4Qz-ER-nQ2U4qvyJz1LRAakaU3lk' },
      { name: 'robots', content: 'index,follow' },
      { name: 'language', content: 'French' },
      { name: 'author', content: 'Noéwen BOISNARD' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/fullpage', mode: 'client' }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    ['@nuxtjs/google-fonts', {
      families: {
        Roboto: true
      }
    }],
    // https://github.com/moritzsternemann/vue-plausible
    'vue-plausible'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    ['nuxt-font-loader-strategy', {
      fonts: [
        {
          fileExtensions: ['ttf'],
          fontFamily: 'NugoSans-Light',
          fontFaces: [{
            preload: true,
            localSrc: ['NugoSans-Light'],
            src: '@/assets/fonts/NugoSans-Light',
            fontDisplay: 'block'
          }]
        }]
    }]
  ],

  plausible: { // Use as fallback if no runtime config is available at runtime
    domain: DOMAIN,
    enableAutoPageviews: true,
    enableAutoOutboundTracking: true
  },
  publicRuntimeConfig: {
    plausible: {
      domain: DOMAIN,
      apiHost: 'https://' + PLAUSIBLE_DOMAIN,
      enableAutoPageviews: true,
      enableAutoOutboundTracking: true
    }
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    defaultAssets: false,
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extractCSS: true,
    postcss: {
      plugins: isDev
        ? {}
        : {
            'css-byebye': {
              rulesToRemove: [
                /.*\.v-application--is-rtl.*/,
                /.*\.theme--dark.*/,
                ...rules
              ]
            }
          }
    }
  }
}

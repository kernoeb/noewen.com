import { fileURLToPath, URL } from 'node:url'
import { mdiShareCircle } from '@mdi/js'
import Vue from '@vitejs/plugin-vue'
// Plugins
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
// Utilities
import { defineConfig } from 'vite'

import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import googleFonts from './vite-plugins/google-fonts'
import remoteIcons, { androidAdaptiveIcon, mdiAppIcon } from './vite-plugins/remote-icons'

// https://vitejs.dev/config/
export default defineConfig({
  ssr: {
    noExternal: ['vuetify'],
  },
  plugins: [
    remoteIcons({
      rasterize: { format: 'webp', size: 64 },
      icons: [
        {
          name: 'planningsup',
          url: 'https://planningsup.app/favicon.png',
        },
        {
          name: 'secousse',
          url: 'https://raw.githubusercontent.com/kernoeb/secousse/main/app-icon.svg',
          viewBox: '64 64 384 384',
        },
        {
          name: 'squads-app',
          ...androidAdaptiveIcon({
            foregroundUrl: 'https://raw.githubusercontent.com/kernoeb/squads-app/main/app/src/main/res/drawable/ic_launcher_foreground.xml',
            backgroundUrl: 'https://raw.githubusercontent.com/kernoeb/squads-app/main/app/src/main/res/values/ic_launcher_background.xml',
          }),
        },
        {
          name: 'drapeau-du-jour',
          url: 'https://drapeaudujour.noewen.com/favicon.png',
        },
        {
          name: 'partage',
          ...mdiAppIcon({ mdiPath: mdiShareCircle, bg: '#334155' }),
        },
      ],
    }),
    AutoImport({
      imports: [
        'vue',
      ],
      dts: 'src/auto-imports.d.ts',
      eslintrc: {
        enabled: true,
      },
      vueTemplate: true,
    }),
    Components({
      dts: 'src/components.d.ts',
      // unplugin-vue-components auto-augments globals with RouterLink/
      // RouterView whenever vue-router is present in node_modules (still
      // the case here via vite-ssg's peerDep). Opt out — we don't use
      // either component.
      types: [],
    }),
    Vue({
      template: { transformAssetUrls },
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
    Vuetify({
      autoImport: true,
      styles: {
        configFile: 'src/styles/settings.scss',
      },
    }),
    googleFonts({
      families: [
        {
          name: 'Inter',
          weights: '300..700',
          fallback: { font: 'Arial', sizeAdjust: '109.38%', ascentOverride: '88.57%', descentOverride: '22.05%' },
        },
        {
          name: 'JetBrains Mono',
          weights: '400..600',
          fallback: { font: 'Courier New', sizeAdjust: '99.98%', ascentOverride: '102.02%', descentOverride: '30.01%' },
        },
      ],
    }),
  ],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  server: {
    port: 3000,
  },
})

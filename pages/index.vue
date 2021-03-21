<template>
  <div>
    <client-only>
      <full-page ref="fullpage" :options="options">
        <div class="section">
          <div
            class="white--text d-flex justify-center align-center text-center noselect flex-column"
            style="font-family: NugoSans-Light,sans-serif;"
          >
            <div class="floatAnimate containerName">
              <div>Noéwen</div>
              <div>
                <strong>BOISNARD</strong>
              </div>
            </div>
            <div
              class="white--text noselect font-weight-bold"
              style="font-family: NugoSans-Light, sans-serif; font-size: 17px"
            >
              Développeur web & mobile
              <v-icon class="mx-auto" color="white">
                mdi-code-tags
              </v-icon>
            </div>
            <div class="mt-1" style="display: flex">
              <v-hover
                v-for="icon in icons"
                :key="`icon_${icon.text}`"
                v-slot="{ hover }"
              >
                <div>
                  <v-icon :small="!hover" color="white">
                    {{ icon.icon }}
                  </v-icon>
                  <div v-show="hover" class="ml-n3 mt-2" style="position: absolute">
                    <div><strong>{{ icon.text }}</strong></div>
                    <div>
                      <v-icon v-for="index in icon.heart" :key="`icon_${icon}_heart_${index}`" color="white" small>
                        mdi-heart
                      </v-icon>
                    </div>
                  </div>
                </div>
              </v-hover>
            </div>
            <customfooter color="#5a0034" @scroll-down="$refs.fullpage.api.moveSectionDown()" />
          </div>
        </div>
        <div class="section">
          <v-row align-content="center" justify="center">
            <v-col cols="10" lg="9">
              <span :class="$vuetify.breakpoint.mobile ? 'text-h4' : 'text-h2'" class="black--text mb-4 d-flex justify-center align-center text-center">Formations</span>
              <timeline :timeline="timelineFormation" />
            </v-col>
          </v-row>
          <customfooter dark color="#dedede" @scroll-down="$refs.fullpage.api.moveSectionDown()" />
        </div>
        <div class="section">
          <v-row align-content="center" justify="center">
            <v-col cols="10">
              <span :class="$vuetify.breakpoint.mobile ? 'text-h4' : 'text-h2'" class="black--text mb-4 d-flex justify-center align-center text-center">Expérience</span>
              <timeline :timeline="timelineExperience" />
            </v-col>
          </v-row>
          <customfooter dark color="#dedede" @scroll-down="$refs.fullpage.api.moveSectionDown()" />
        </div>
        <div class="section">
          <v-row align-content="center" justify="center">
            <v-col cols="10">
              <span v-if="!$vuetify.breakpoint.mobile" class="black--text mb-4 text-h2 d-flex justify-center align-center text-center">Projets personnels</span>
              <div v-else class="black--text mb-4 d-flex justify-center align-center text-center flex-column">
                <div class="text-h3">
                  Projets
                </div>
                <div class="text-h6">
                  personnels
                </div>
              </div>
              <v-container>
                <v-row class="d-flex justify-center align-center">
                  <v-col cols="12" lg="8">
                    <v-card class="pa-4 rounded-lg" elevation="4" rounded color="#f5f5f5">
                      <v-card-title>PlanningIUT</v-card-title>
                      <v-card-subtitle>Planning universitaire réalisé en Nuxt.js</v-card-subtitle>
                      <v-card-text>
                        <div>
                          <v-icon class="mr-1" small>
                            mdi-github
                          </v-icon>
                          <a href="https://github.com/kernoeb/planningiut" target="_blank">github.com/kernoeb/planningiut</a>
                        </div>
                        <div>
                          <v-icon class="mr-1" small>
                            mdi-open-in-new
                          </v-icon>
                          <a href="https://planning.noewen.com" target="_blank">planning.noewen.com</a>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="12" lg="8">
                    <v-card class="pa-4 rounded-lg" elevation="4" rounded color="#f5f5f5">
                      <v-card-title>Géobtenu</v-card-title>
                      <v-card-subtitle>Ressource de géographie pour GeoGuessr réalisée en Nuxt.js</v-card-subtitle>
                      <v-card-text>
                        <div>
                          <v-icon class="mr-1" small>
                            mdi-github
                          </v-icon>
                          <a href="https://github.com/kernoeb/geobtenu" target="_blank">github.com/kernoeb/geobtenu</a>
                        </div>
                        <div>
                          <v-icon class="mr-1" small>
                            mdi-open-in-new
                          </v-icon>
                          <a href="https://geobtenu.netlify.app" target="_blank">geobtenu.netlify.app</a>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
          </v-row>
        </div>
      </full-page>
    </client-only>
  </div>
</template>
<script>
import timeline from '~/components/timeline'
import customfooter from '~/components/customfooter'

export default {
  components: { timeline, customfooter },
  data () {
    return {
      icons: [
        { icon: 'mdi-vuejs', text: 'VueJS', heart: 3 },
        { icon: 'mdi-nuxt', text: 'NuxtJS', heart: 3 },
        { icon: 'mdi-react', text: 'ReactJS', heart: 2 },
        { icon: 'mdi-language-python', text: 'Python3', heart: 2 },
        { icon: 'mdi-language-java', text: 'Java', heart: 1 }
      ],
      timelineFormation: [
        {
          colorText: '#262626',
          colorDate: 'black',
          year: '2015 - 2018',
          text: 'STI2D SIN',
          description: 'Baccalauréat Technologique (Lycée A.R. Lesage)',
          link: 'https://www.lycee-lesage.fr/',
          icon: 'mdi-book-open-variant'
        },
        {
          colorText: '#262626',
          colorDate: 'black',
          year: '2018 - 2020',
          text: 'DUT INFO',
          description: 'Diplôme Universitaire Technologique (IUT de Vannes)',
          link: 'https://www.iutvannes.fr/',
          icon: 'mdi-code-braces-box'
        },
        {
          colorText: '#262626',
          colorDate: 'black',
          year: '2020 - 2021',
          text: 'Licence Pro DLIS',
          description: 'Développement de Logiciels Innovants et Sécurisés (IUT de Vannes)',
          link: 'https://www.iutvannes.fr/',
          icon: 'mdi-school',
          ongoing: true
        }
      ],
      timelineExperience: [
        {
          colorText: '#262626',
          colorDate: 'black',
          year: '2020',
          text: 'Stage - Dawizz',
          description: '- Internationalisation d\'une plate-forme conteneurisée (Docker)\n- Développement d\'une application Electron',
          icon: 'mdi-electron-framework'
        },
        {
          colorText: '#262626',
          colorDate: 'black',
          year: '2020',
          text: 'CDD - Dawizz',
          description: '- Développement d\'un service web (Nuxt.js) d\'une plateforme conteneurisée',
          icon: 'mdi-code-tags'
        },
        {
          colorText: '#262626',
          colorDate: 'black',
          year: '2020 - 2021',
          text: 'Alternance - Dawizz',
          description: '- Mise en place d\'un nouveau service conteneurisé\n- Développements côté client et côté serveur',
          link: 'https://www.dawizz.fr/',
          icon: 'mdi-school',
          ongoing: true
        }
      ],
      options: {
        licenseKey: 'YOUR_KEY_HERE',
        anchors: ['accueil', 'formations', 'experience', 'projets'],
        sectionsColor: ['#5a0034', '#dedede', '#dedede', '#dedede'],
        navigation: true
      }
    }
  },
  watch: {
    '$vuetify.breakpoint.xs' () {
      this.$set(this.options, 'navigation', !this.$vuetify.breakpoint.xs)
    }
  },
  mounted () {
    this.$set(this.options, 'navigation', !this.$vuetify.breakpoint.xs)
  }
}
</script>

<style>
.fp-right span {
  background: #535353 !important;
}
</style>

<style lang="css" scoped>
@font-face {
  font-family: "NugoSans-Light";
  src: local("NugoSans-Light"), url(/fonts/NugoSans-Light.ttf) format("truetype");
}

.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
}

@media all and (min-width: 0) and (max-width: 429px) {
  .containerName {
    font-size: 50px;
  }
}

@media not all and (min-width: 0) and (max-width: 429px) {
  .containerName {
    font-size: 70px;
  }
}

.floatAnimate {
  animation: float 2s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translatey(0px);
  }
  50% {
    transform: translatey(-20px);
  }
  100% {
    transform: translatey(0px);
  }
}
</style>

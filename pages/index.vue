<template>
  <div>
    <div v-if="!loaded" class="justify-center align-center d-flex" style="height: 100%; position: fixed; width: 100%;">
      <div class="section">
        <div
          class="white--text d-flex justify-center align-center text-center noselect flex-column"
          style="font-family: NugoSans-Light,sans-serif;"
        >
          <div class="containerName">
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
              {{ mdiCodeTags }}
            </v-icon>
          </div>
          <div class="mt-1" style="display: flex">
            <v-hover
              v-for="icon in icons"
              :key="`icon_${icon.text}`"
              v-slot="{ hover }"
            >
              <div>
                <v-icon size="35" color="white">
                  {{ icon.icon }}
                </v-icon>
                <transition name="zoomIcon" mode="in-out">
                  <div v-show="hover" class="ml-n3 mt-2" style="position: absolute">
                    <div><strong>{{ icon.text }}</strong></div>
                    <div>
                      <v-icon v-for="index in icon.heart" :key="`icon_${icon}_heart_${index}`" color="white" small>
                        {{ mdiHeart }}
                      </v-icon>
                    </div>
                  </div>
                </transition>
              </div>
            </v-hover>
          </div>
        </div>
      </div>
      <customfooter first :loaded="false" color="#5a0034" />
    </div>
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
                {{ mdiCodeTags }}
              </v-icon>
            </div>
            <div class="mt-1" style="display: flex">
              <v-hover
                v-for="icon in icons"
                :key="`icon_${icon.text}`"
                v-slot="{ hover }"
              >
                <div>
                  <v-icon size="35" color="white">
                    {{ icon.icon }}
                  </v-icon>
                  <transition name="zoomIcon" mode="in-out">
                    <div v-show="hover" class="ml-n3 mt-2" style="position: absolute">
                      <div><strong>{{ icon.text }}</strong></div>
                      <div>
                        <v-icon v-for="index in icon.heart" :key="`icon_${icon}_heart_${index}`" color="white" small>
                          {{ mdiHeart }}
                        </v-icon>
                      </div>
                    </div>
                  </transition>
                </div>
              </v-hover>
            </div>
          </div>
          <customfooter first color="#5a0034" @scroll-down="$refs.fullpage.api.moveSectionDown()" />
        </div>
        <div class="section">
          <v-row align-content="center" justify="center">
            <v-col cols="10">
              <span :class="$vuetify.breakpoint.mobile ? 'text-h4' : 'text-h2'" class="black--text mb-4 d-flex justify-center align-center text-center">Expériences</span>
              <timeline :timeline="timelineExperience" />
            </v-col>
          </v-row>
          <customfooter dark color="#dedede" @scroll-down="$refs.fullpage.api.moveSectionDown()" />
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
                  <v-col v-for="project in projects" :key="`project_${project.title}`" cols="12" lg="8">
                    <v-hover>
                      <template #default="{ hover }">
                        <v-card class="rounded-lg transition-swing" :elevation="hover ? 6 : 4" rounded color="#f5f5f5" :class="!$vuetify.breakpoint.xs ? 'pa-4' : 'pa-0'">
                          <v-card-title>
                            <img style="height: 24px; width: 24px;" :alt="project.title" class="mr-2" :src="project.favicon">{{ project.title }}
                          </v-card-title>
                          <v-card-subtitle :class="$vuetify.breakpoint.xs ? 'pb-0' : null">
                            {{ project.subtitle }}
                          </v-card-subtitle>
                          <v-card-text>
                            <div v-for="(item, i) in project.items" :key="`project_${project.title}_item_${i}`">
                              <v-icon class="mr-1" small @click="openLink(item.link)">
                                {{ item.icon }}
                              </v-icon>
                              <a :href="item.link" target="_blank">{{ item.formatted }}</a>
                            </div>
                          </v-card-text>
                        </v-card>
                      </template>
                    </v-hover>
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
          </v-row>
          <customfooter dark color="#dedede" :arrow-down="false" @back-to-top="$refs.fullpage.api.moveTo(1)" />
        </div>
      </full-page>
    </client-only>
  </div>
</template>
<script>
import {
  mdiCodeTags,
  mdiHeart,
  mdiVuejs,
  mdiLanguageJavascript,
  mdiLanguagePython,
  mdiLanguageGo,
  mdiGithub,
  mdiOpenInNew,
  mdiBookOpenVariant,
  mdiCodeBracesBox,
  mdiSchool,
  mdiElectronFramework,
  mdiApplicationBrackets,
  mdiLanguageRust
} from '@mdi/js'
import timeline from '~/components/timeline'
import customfooter from '~/components/customfooter'

export default {
  components: { timeline, customfooter },
  data () {
    return {
      // Icons
      mdiCodeTags,
      mdiHeart,

      // Data
      loaded: false,
      icons: [
        { icon: mdiLanguageJavascript, text: 'JavaScript', heart: 3 },
        { icon: mdiVuejs, text: 'Vue.js', heart: 3 },
        { icon: mdiLanguageRust, text: 'Rust', heart: 3 },
        { icon: mdiLanguagePython, text: 'Python3', heart: 3 },
        { icon: mdiLanguageGo, text: 'Go', heart: 2 }
      ],
      projects: [
        {
          title: 'PlanningSup',
          subtitle: 'Planning universitaire',
          favicon: 'https://planningsup.app/favicon.ico',
          items: [
            { icon: mdiGithub, link: 'https://github.com/kernoeb/planningsup', formatted: 'Github' },
            { icon: mdiOpenInNew, link: 'https://planningsup.app', formatted: 'PlanningSup.app' }
          ]
        },
        {
          title: 'Drapeau du Jour',
          subtitle: 'Chaque jour, trouvez le pays et la capitale associés au drapeau',
          favicon: 'https://drapeaudujour.noewen.com/favicon.ico',
          items: [
            { icon: mdiGithub, link: 'https://github.com/kernoeb/drapeau-du-jour', formatted: 'Github' },
            { icon: mdiOpenInNew, link: 'https://drapeaudujour.noewen.com', formatted: 'DrapeauDuJour' }
          ]
        }
      ],
      timelineFormation: [
        {
          colorText: '#262626',
          colorDate: 'black',
          year: '2015 - 2018',
          text: 'STI2D SIN',
          description: 'Baccalauréat Technologique (Lycée A.R. Lesage)',
          link: 'https://www.lycee-lesage.fr/',
          icon: mdiBookOpenVariant,
          iconColor: 'green'
        },
        {
          colorText: '#262626',
          colorDate: 'black',
          year: '2018 - 2020',
          text: 'DUT INFO',
          description: 'Diplôme Universitaire Technologique (IUT de Vannes)',
          link: 'https://www.iutvannes.fr/',
          icon: mdiCodeBracesBox,
          iconColor: 'orange'
        },
        {
          colorText: '#262626',
          colorDate: 'black',
          year: '2020 - 2021',
          text: 'Licence Pro DLIS',
          description: 'Développement de Logiciels Innovants et Sécurisés (IUT de Vannes)',
          link: 'https://www.iutvannes.fr/',
          icon: mdiSchool,
          iconColor: 'pink'
        }
      ].reverse(),
      timelineExperience: [
        {
          colorText: '#262626',
          colorDate: 'black',
          year: '2020',
          text: 'Stage - Dawizz',
          description: '- Internationalisation d\'une plate-forme conteneurisée (Docker)<br>- Développement d\'une application Electron',
          icon: mdiElectronFramework,
          iconColor: 'green'
        },
        {
          colorText: '#262626',
          colorDate: 'black',
          year: '2020 - 2021',
          text: 'Alternance - Dawizz',
          description: '- Mise en place d\'un nouveau service conteneurisé<br>- Développements côté client et côté serveur',
          icon: mdiSchool,
          iconColor: 'pink'
        },
        {
          colorText: '#262626',
          colorDate: 'black',
          year: '2021 - 2024',
          text: 'CDI - Dawizz (a Blueway company)',
          description: 'Développeur Full-Stack<br>Développement, maintenance, et amélioration de la plateforme MyDataCatalogue',
          link: 'https://dawizz.fr',
          icon: mdiApplicationBrackets,
          ongoing: true,
          iconColor: '#00b0b9'
        }
      ].reverse(),
      options: {
        licenseKey: 'YOUR_KEY_HERE',
        anchors: ['accueil', 'experience', 'formations', 'projets'],
        sectionsColor: ['#5a0034', '#dedede', '#dedede', '#dedede'],
        navigation: true,
        afterLoad: this.afterLoad
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
  },
  methods: {
    afterLoad () {
      this.loaded = true
      console.clear()
    },
    openLink (link) {
      window.open(link)
    }
  }
}
</script>

<style>
.fp-right span {
  background: #535353 !important;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>

<style lang="css" scoped>
.zoomIcon-enter-active, .zoomIcon-leave-active {
  transition: transform 0.6s, opacity 0.3s;
}
.zoomIcon-enter, .zoomIcon-leave-to {
  transform: scale(0.85);
  opacity: 0;
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

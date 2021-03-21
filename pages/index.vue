<template>
  <div>
    <client-only>
      <full-page :options="options">
        <div class="section">
          <div
            class="white--text d-flex justify-center align-center text-center noselect flex-column"
            style="font-family: NugoSans-Light;"
          >
            <div class="floatAnimate containerName">
              <div>Noéwen</div>
              <div>
                <strong>BOISNARD</strong>
              </div>
            </div>
            <div style="font-family: NugoSans-Light, sans-serif; font-size: 17px" class="white--text noselect font-weight-bold">
              Développeur web & mobile
            </div>
          </div>
        </div>
        <div class="section">
          <v-row align-content="center" justify="center">
            <v-col cols="10" lg="6">
              <span class="white--text mb-4 text-h2 d-flex justify-center align-center text-center">Formations</span>
              <timeline :timeline="timelineFormation" />
            </v-col>
          </v-row>
        </div>
        <div class="section">
          <v-row align-content="center" justify="center">
            <v-col cols="10" lg="6">
              <span class="white--text mb-4 text-h2 d-flex justify-center align-center text-center">Expérience</span>
              <timeline :timeline="timelineExperience" />
            </v-col>
          </v-row>
        </div>
      </full-page>
    </client-only>
  </div>
</template>
<script>
import timeline from '~/components/timeline'

export default {
  components: { timeline },
  data () {
    return {
      timelineFormation: [
        {
          colorText: '#262626',
          colorDate: '#e2e2e2',
          year: '2015 - 2018',
          text: 'STI2D SIN',
          description: 'Baccalauréat Technologique (Lycée Alain René Lesage)',
          link: 'https://www.lycee-lesage.fr/',
          icon: 'mdi-book-open-variant'
        },
        {
          colorText: '#262626',
          colorDate: '#e2e2e2',
          year: '2018 - 2020',
          text: 'DUT INFORMATIQUE',
          description: 'Diplôme Universitaire Technologique (IUT de Vannes)',
          link: 'https://www.iutvannes.fr/',
          icon: 'mdi-code-braces-box'
        },
        {
          colorText: '#262626',
          colorDate: '#e2e2e2',
          year: '2020 - 2021',
          text: 'Licence Professionnelle DLIS',
          description: 'Développement de Logiciels Innovants et Sécurisés (IUT de Vannes)',
          link: 'https://www.iutvannes.fr/',
          icon: 'mdi-school',
          ongoing: true
        }
      ],
      timelineExperience: [
        {
          colorText: '#262626',
          colorDate: '#e2e2e2',
          year: '2020',
          text: 'Stage Dawizz (3 mois)',
          description: '- Internationalisation d\'une plate-forme conteneurisée (Docker) côté serveur (Node.js) et côté client (Vue.js, Nuxt.js)\n- Mise en place et développement d\'une application Electron multi-plateforme',
          icon: 'mdi-electron-framework'
        },
        {
          colorText: '#262626',
          colorDate: '#e2e2e2',
          year: '2020',
          text: 'Poste Développeur CDD (1 mois)',
          description: '- Mise à niveau d\'une plateforme conteneurisée (Node.js)\n- Développement d\'un service web (Nuxt.js)\n- Autres développements',
          icon: 'mdi-code-tags'
        },
        {
          colorText: '#262626',
          colorDate: '#e2e2e2',
          year: '2020 - 2021',
          text: 'Alternance Dawizz',
          description: '- Développement de différents services, application web, desktop\n- Mise en place d\'un nouveau service conteneurisé\n- Développement (autre) côté client et côté serveur',
          link: 'https://www.dawizz.fr/',
          icon: 'mdi-school',
          ongoing: true
        }
      ],
      options: {
        licenseKey: 'YOUR_KEY_HERE',
        anchors: ['accueil', 'formations', '#experience'],
        sectionsColor: ['#5a0034', '#6d1b4a', '#72204f'],
        navigation: true
      }
    }
  }
}
</script>

<style>
.fp-right span {
  background: #adadad !important;
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

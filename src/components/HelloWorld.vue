<script setup lang="ts">
import type { Project, SocialNetwork } from '@/types'
import { Technologies } from '@/types'

const socialNetworks = ref<SocialNetwork[]>([
  {
    name: 'LinkedIn',
    icon: '$linkedin',
    url: 'https://www.linkedin.com/in/noéwen-boisnard',
  },
  {
    name: 'GitHub',
    icon: '$github',
    url: 'https://github.com/kernoeb',
  },
  {
    name: 'Twitter/X',
    icon: '$x',
    url: 'https://x.com/kernoeb',
  },
])

const projects = ref<Project[]>([
  {
    title: 'PlanningSup',
    url: 'https://planningsup.app',
    imgProps: {
      src: 'https://planningsup.app/favicon.ico',
      width: 24,
      height: 24,
    },
    description: 'Planning universitaire personnalisable pour les étudiants, hors connexion et sans publicité.',
    technologies: [Technologies.Nuxt2, Technologies.NodeJs],
  },
  {
    title: 'DrapeauDuJour',
    url: 'https://drapeaudujour.noewen.com',
    imgProps: {
      src: 'https://drapeaudujour.noewen.com/favicon.ico',
      width: 20,
      height: 20,
    },
    description: 'Chaque jour, un pays différent à découvrir avec son drapeau.',
    technologies: [Technologies.Vue3, Technologies.NodeJs],
  },
  {
    title: 'Docker Docsify PDF',
    url: 'https://github.com/kernoeb/docker-docsify-pdf',
    iconProps: {
      name: '$file-pdf-box',
      color: 'red',
    },
    description: 'Générateur de PDF à partir d\'une documentation Docsify.',
    technologies: [Technologies.NodeJs, Technologies.Puppeteer],
  },
  {
    title: 'Infinito',
    url: 'https://infinito.noewen.com',
    imgProps: {
      src: 'https://infinito.noewen.com/favicon.ico',
      width: 20,
      height: 20,
    },
    description: 'Ressources infinies pour tout le monde.',
    technologies: [Technologies.Nuxt3],
  },
  {
    title: 'Partage',
    url: 'https://github.com/kernoeb/partage',
    iconProps: {
      name: '$share-circle',
      color: 'white',
    },
    description: 'Partage de texte dans le même réseau local.',
    technologies: [Technologies.Vue3, Technologies.Rust, Technologies.WebSockets],
  },
])

const floatAnimate = ref(false)
onMounted(() => {
  const root = document.documentElement

  document.addEventListener('mousemove', (evt) => {
    root.style.setProperty('--mouse-x', String(evt.clientX / window.innerWidth))
    root.style.setProperty('--mouse-y', String(evt.clientY / window.innerHeight))
  })

  setTimeout(() => {
    floatAnimate.value = true
  }, 100)
})
</script>

<template>
  <v-container>
    <div class="d-flex flex-column align-center justify-center mt-14">
      <div class="text-h2 mb-2" :class="{ floatAnimate }">
        <div>Noéwen</div>
        <div class="font-weight-bold">
          BOISNARD
        </div>
      </div>

      <div class="text-h6 mb-4">
        Développeur fullstack
        <v-icon icon="$code-tags" size="22" />
      </div>

      <div class="d-flex mb-10">
        <div class="d-flex align-center justify-center">
          <v-btn
            v-for="social in socialNetworks"
            :key="social.name"
            variant="outlined"
            size="small"
            :icon="social.icon"
            :href="social.url"
            target="_blank"
            class="mr-2"
            :title="social.name"
          />
        </div>
      </div>

      <MyTerminal />

      <div class="mb-2">
        <div class="text-h5 text-center mb-3">
          <v-icon icon="$briefcase-account-outline" class="mr-2 mt-n1" size="30" />
          Mes projets
        </div>
        <v-container>
          <v-row justify="center">
            <v-col v-for="project in projects" :key="project.title" cols="12" md="4" lg="4" xl="2">
              <ProjectCard :project />
            </v-col>
          </v-row>
        </v-container>
      </div>
    </div>
  </v-container>
</template>

<style>
.floatAnimate {
  animation: float 2s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translatey(0px);
  }
  50% {
    transform: translatey(-10px);
  }
  100% {
    transform: translatey(0px);
  }
}
</style>

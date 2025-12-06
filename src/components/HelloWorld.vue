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
  // Only enable mouse effect on non-touch devices
  const isTouchDevice = window.matchMedia('(hover: none)').matches

  if (!isTouchDevice) {
    const root = document.documentElement
    document.addEventListener('mousemove', (evt) => {
      root.style.setProperty('--mouse-x', String(evt.clientX / window.innerWidth))
      root.style.setProperty('--mouse-y', String(evt.clientY / window.innerHeight))
    })
  }

  setTimeout(() => {
    floatAnimate.value = true
  }, 100)
})
</script>

<template>
  <v-container>
    <div class="d-flex flex-column align-center justify-center mt-14">
      <div class="hero-name mb-3" :class="{ floatAnimate }">
        <div class="first-name">Noéwen</div>
        <div class="last-name">BOISNARD</div>
      </div>

      <div class="subtitle mb-5">
        Développeur fullstack
        <v-icon icon="$code-tags" size="20" class="ml-1" />
      </div>

      <div class="d-flex mb-12 ga-3">
        <v-btn
          v-for="social in socialNetworks"
          :key="social.name"
          class="glass-btn social-btn"
          size="small"
          :icon="social.icon"
          :href="social.url"
          target="_blank"
          :title="social.name"
        />
      </div>

      <MyTerminal />

      <div class="projects-section">
        <div class="section-title mb-5">
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
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translatey(0px);
  }
  50% {
    transform: translatey(-8px);
  }
  100% {
    transform: translatey(0px);
  }
}
</style>

<style scoped>
.hero-name {
  text-align: left;
  line-height: 1.1;
}

.first-name {
  font-size: 3.5rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: -0.03em;
}

.last-name {
  font-size: 3.5rem;
  font-weight: 700;
  color: white;
  letter-spacing: -0.02em;
}

.subtitle {
  font-size: 1.15rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.75);
  letter-spacing: 0.02em;
}

.social-btn {
  width: 42px !important;
  height: 42px !important;
  border-radius: 12px !important;
  color: white !important;
}

.projects-section {
  width: 100%;
}

.section-title {
  font-size: 0.85rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

@media (max-width: 600px) {
  .first-name,
  .last-name {
    font-size: 3rem;
  }
}
</style>

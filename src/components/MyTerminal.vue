<script setup lang="ts">
const dialogCV = ref(false)
const dialogCVFullscreen = ref(false)

const asciiLoaderParts = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
const currentAsciiLoaderPart = ref(asciiLoaderParts[0])
let asciiLoaderInterval: number | null = null
const duration = ref<number>(0)

const formattedDuration = computed(() => {
  if (!duration.value) return ''
  // e.g: 0.8s
  const seconds = (duration.value / 1000).toFixed(2)
  return `${seconds}s`
})

function getRandomDurationMinMax(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function startAsciiLoader() {
  if (typeof window === 'undefined') return // Make sure we're in the browser
  duration.value = getRandomDurationMinMax(400, 600)

  let i = 0
  asciiLoaderInterval = window.setInterval(() => {
    currentAsciiLoaderPart.value = asciiLoaderParts[i]
    i = (i + 1) % asciiLoaderParts.length
  }, 80)

  setTimeout(() => {
    if (asciiLoaderInterval) window.clearInterval(asciiLoaderInterval)
    currentAsciiLoaderPart.value = ''
  }, duration.value)
}

onMounted(() => {
  startAsciiLoader()
})
</script>

<template>
  <v-hover>
    <template #default="{ isHovering, props }">
      <v-card
        v-bind="props"
        variant="tonal"
        rounded="lg"
        class="mb-10 terminal-card"
        :elevation="isHovering ? 4 : 0"
      >
        <div>
          <MacOSHeader header-title="Terminal" :title-class="{ 'text-grey-lighten-2': !!isHovering, 'text-grey-lighten-1': !isHovering }" />
          <v-card-text style="font-family: 'Roboto Mono', monospace;">
            <div class="mb-3">
              <b>Salut ! Je suis Noéwen <span :class="{ 'hello-hand': !currentAsciiLoaderPart }">👋</span></b>
            </div>

            <div>
              <span class="text-blue-lighten-3 font-weight-bold">~/Projects</span>
              <br>
              <span><span class="text-error font-weight-bold">❯</span> <span class="text-blue-lighten-3"><b>kernpm</b> create cv</span></span>
              <br>
              <span class="text-success">✔</span> Project name: <span class="text-grey-darken-1">…</span> <i>noewen_cv</i>
              <br>
              <span class="text-success">✔</span> Use TypeScript? <span class="text-grey-darken-1">…</span> No / <span class="text-blue-lighten-3 text-decoration-underline">Yes</span>
              <br>
              <span class="text-success">✔</span> Use Rust? <span class="text-grey-darken-1">…</span> No / <span class="text-blue-lighten-3 text-decoration-underline">Yes</span>
              <br>
              ◌ Preparing the CV...
              <br>
              ◌ Generating the CV...
              <br>
              <br>
              <b>kernpm</b> generate <span class="text-blue-lighten-3">v1.0</span>
              <br>
              <span class="text-success">+</span> @kernoeb/skills<span class="text-grey-darken-1">@0.1.0</span>
              <br>
              <span class="text-success">+</span> @kernoeb/projects<span class="text-grey-darken-1">@1.6.1</span>
              <br><br>
              <template v-if="currentAsciiLoaderPart">
                <span>{{ currentAsciiLoaderPart }}</span>
              </template>
              <template v-else>
                <div>
                  <span class="text-success">✔</span> CV generated successfully!
                  <v-dialog v-model="dialogCV" :fullscreen="dialogCVFullscreen" width="800" height="90vh">
                    <template #activator="{ props: dialogProps }">
                      <v-btn variant="text" size="sm" v-bind="dialogProps" class="mr-1">
                        <span class="text-none" style="text-decoration: underline;">
                          Display the CV <v-icon icon="$magnify-plus-outline" />
                        </span>
                      </v-btn>
                    </template>
                    <CVObject
                      cv-title="CV - BOISNARD Noéwen.pdf" cv="/CV_BOISNARD_Noewen.pdf"
                      @close="dialogCV = false"
                      @minimize="dialogCV = false"
                      @maximize="dialogCVFullscreen = !dialogCVFullscreen"
                    />
                  </v-dialog>
                  <span v-if="formattedDuration" class="text-grey-darken-1">[{{ formattedDuration }}]</span>
                </div>
              </template>
            </div>
          </v-card-text>
        </div>
      </v-card>
    </template>
  </v-hover>
</template>

<style>
.terminal-card {
  width: 600px;
}

@media (max-width: 600px) {
  .terminal-card {
    width: 100%;
  }
}

.hello-hand {
  display: inline-block; /* Ensures the rotation works correctly */
  animation: hello-hand 0.8s ease-in-out;
}

.hello-hand:hover {
  animation: hello-hand 0.8s ease-in-out infinite;
  cursor: default
}

@keyframes hello-hand {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(15deg);
  }
  50% {
    transform: rotate(-15deg);
  }
  75% {
    transform: rotate(15deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
</style>

<script setup lang="ts">
const dialogCV = ref(false)
const dialogCVFullscreen = ref(false)
const supportsPdfViewer = ref(true)

onMounted(() => {
  // Check if browser supports inline PDF viewing
  const hasPlugin = navigator.pdfViewerEnabled ?? (navigator.mimeTypes?.['application/pdf'] !== undefined)
  supportsPdfViewer.value = hasPlugin
})

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
  <v-card
    class="mb-10 terminal-card"
    rounded="lg"
  >
    <div>
      <MacOSHeader header-title="Terminal" title-class="header-title-dim" />
      <v-card-text class="terminal-content">
        <div class="mb-3">
          <b class="greeting">Salut ! Je suis Noéwen <span :class="{ 'hello-hand': !currentAsciiLoaderPart }">👋</span></b>
        </div>

        <div class="terminal-lines">
          <span class="path">~/Projects</span>
          <br>
          <span><span class="prompt">❯</span> <span class="command">kernpm</span> create cv</span>
          <br>
          <span class="success">✔</span> Project name: <span class="dim">…</span> <i class="value">noewen_cv</i>
          <br>
          <span class="success">✔</span> Use TypeScript? <span class="dim">…</span> No / <span class="selected">Yes</span>
          <br>
          <span class="success">✔</span> Use Rust? <span class="dim">…</span> No / <span class="selected">Yes</span>
          <br>
          ◌ Preparing the CV...
          <br>
          ◌ Generating the CV...
          <br>
          <br>
          <b>kernpm</b> generate <span class="version">v1.0</span>
          <br>
          <span class="success">+</span> @kernoeb/skills<span class="dim">@0.1.0</span>
          <br>
          <span class="success">+</span> @kernoeb/projects<span class="dim">@1.6.1</span>
          <br><br>
          <template v-if="currentAsciiLoaderPart">
            <span class="loader">{{ currentAsciiLoaderPart }}</span>
          </template>
          <template v-else>
            <div>
              <span class="success">✔</span> CV generated successfully!
              <template v-if="supportsPdfViewer">
                <v-dialog
                  v-model="dialogCV"
                  :fullscreen="dialogCVFullscreen"
                  width="800"
                  height="90vh"
                  transition="dialog-transition"
                >
                  <template #activator="{ props: dialogProps }">
                    <v-btn variant="text" size="sm" v-bind="dialogProps" class="ml-1 cv-link">
                      <span class="text-none">
                        Display the CV <v-icon icon="$magnify-plus-outline" size="16" />
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
              </template>
              <v-btn
                v-else
                variant="text"
                size="sm"
                href="/CV_BOISNARD_Noewen.pdf"
                target="_blank"
                class="ml-1 cv-link"
              >
                <span class="text-none">
                  Download the CV <v-icon icon="$magnify-plus-outline" size="16" />
                </span>
              </v-btn>
              <span v-if="formattedDuration" class="dim ml-1">[{{ formattedDuration }}]</span>
            </div>
          </template>
        </div>
      </v-card-text>
    </div>
  </v-card>
</template>

<style scoped>
.terminal-card {
  width: 600px;
  max-width: 100%;
  background: rgba(30, 15, 35, 0.75) !important;
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset !important;
}

.terminal-card :deep(.header-title-dim) {
  color: #565f89 !important;
}

@media (max-width: 600px) {
  .terminal-card {
    width: 100%;
  }
}

.terminal-content {
  font-family: 'JetBrains Mono', monospace !important;
  font-size: 0.85rem;
  line-height: 1.5 !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

.greeting {
  font-size: 0.95rem;
  color: #fff;
}

.terminal-lines {
  color: rgba(255, 255, 255, 0.85);
}

.path {
  color: #93c5fd;
  font-weight: 500;
}

.prompt {
  color: #fca5a5;
  font-weight: 600;
}

.command {
  color: #93c5fd;
  font-weight: 500;
}

.success {
  color: #86efac;
}

.dim {
  color: rgba(255, 255, 255, 0.4);
}

.value {
  color: #fff;
}

.selected {
  color: #93c5fd;
  text-decoration: underline;
}

.version {
  color: #c4b5fd;
}

.loader {
  color: #fcd34d;
}

.cv-link {
  text-decoration: underline;
  color: #93c5fd !important;
  padding: 0 4px !important;
  min-width: auto !important;
  height: auto !important;
}

.cv-link:hover {
  color: #bfdbfe !important;
}

.hello-hand {
  display: inline-block;
  animation: hello-hand 0.8s ease-in-out;
}

.hello-hand:hover {
  animation: hello-hand 0.8s ease-in-out infinite;
  cursor: default;
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

<style>
/* macOS-like fast dialog transition */
.dialog-transition-enter-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.dialog-transition-leave-active {
  transition: all 0.15s cubic-bezier(0.4, 0, 1, 1);
}

.dialog-transition-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.dialog-transition-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
</style>

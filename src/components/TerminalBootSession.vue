<script setup lang="ts">
const emit = defineEmits<{
  'update:booting': [value: boolean]
  'openCv': []
}>()

const asciiLoaderParts = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
const currentAsciiLoaderPart = ref(asciiLoaderParts[0])
const duration = ref<number>(0)

const formattedDuration = computed(() => {
  if (!duration.value) return ''
  return `${(duration.value / 1000).toFixed(2)}s`
})

let loaderInterval: number | null = null
let loaderTimeout: number | null = null

onMounted(() => {
  if (typeof window === 'undefined') return
  duration.value = Math.floor(Math.random() * 201) + 400 // 400-600ms

  let i = 0
  loaderInterval = window.setInterval(() => {
    currentAsciiLoaderPart.value = asciiLoaderParts[i]
    i = (i + 1) % asciiLoaderParts.length
  }, 80)

  loaderTimeout = window.setTimeout(() => {
    if (loaderInterval !== null) {
      window.clearInterval(loaderInterval)
      loaderInterval = null
    }
    loaderTimeout = null
    currentAsciiLoaderPart.value = ''
    emit('update:booting', false)
  }, duration.value)
})

onBeforeUnmount(() => {
  // Cancel pending timers so they don't fire on a disposed component
  // (HMR or `clear` while the boot animation is still running).
  if (loaderInterval !== null) {
    window.clearInterval(loaderInterval)
    loaderInterval = null
  }
  if (loaderTimeout !== null) {
    window.clearTimeout(loaderTimeout)
    loaderTimeout = null
  }
})
</script>

<template>
  <div>
    <div class="mb-3">
      <b class="greeting">Salut ! Je suis Noéwen <span :class="{ 'hello-hand': !currentAsciiLoaderPart }">👋</span></b>
    </div>

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
    <div class="result-line">
      <template v-if="currentAsciiLoaderPart">
        <span class="loader">{{ currentAsciiLoaderPart }}</span>
      </template>
      <template v-else>
        <span class="success">✔</span> CV generated successfully!
        <v-btn
          variant="text"
          class="ml-1 cv-link"
          aria-haspopup="dialog"
          @click="emit('openCv')"
        >
          <span class="text-none">
            Display the CV <v-icon icon="$magnify-plus-outline" size="16" />
          </span>
        </v-btn>
        <span v-if="formattedDuration" class="dim ml-1">[{{ formattedDuration }}]</span>
      </template>
    </div>
  </div>
</template>

<style scoped>
.greeting {
  font-size: 0.95rem;
  color: #fff;
}

.cv-link {
  text-decoration: underline;
  color: #93c5fd !important;
  padding: 0 4px !important;
  min-width: auto !important;
  height: auto !important;
  font-size: inherit;
  line-height: inherit !important;
  vertical-align: baseline !important;
  /* VBtn dropped its uppercase-tuned letter-spacing in v4; keep the wider
     tracking so the inline link still reads as terminal/console text. */
  letter-spacing: 0.09em;
}

.cv-link :deep(.v-btn__content) {
  line-height: inherit;
}

.cv-link :deep(.v-icon) {
  vertical-align: middle;
  margin-top: -2px;
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
  0% { transform: rotate(0deg); }
  25% { transform: rotate(15deg); }
  50% { transform: rotate(-15deg); }
  75% { transform: rotate(15deg); }
  100% { transform: rotate(0deg); }
}
</style>

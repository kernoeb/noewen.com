<script setup lang="ts">
defineProps({
  headerTitle: {
    type: String,
    default: '',
  },
  titleClass: {
    type: String,
    default: '',
  },
  fullscreen: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'minimize', 'maximize'])
</script>

<template>
  <div class="macos-header">
    <div class="d-flex align-center traffic-lights">
      <button aria-label="Close" class="traffic-light red" @click="emit('close')">
        <svg viewBox="0 0 12 12" aria-hidden="true">
          <path d="M3.25 3.25L8.75 8.75M8.75 3.25L3.25 8.75" />
        </svg>
      </button>
      <button aria-label="Minimize" class="traffic-light yellow" @click="emit('minimize')">
        <svg viewBox="0 0 12 12" aria-hidden="true">
          <path d="M2.5 6L9.5 6" />
        </svg>
      </button>
      <button :aria-label="fullscreen ? 'Exit fullscreen' : 'Maximize'" class="traffic-light green" @click="emit('maximize')">
        <svg v-if="!fullscreen" viewBox="0 0 12 12" aria-hidden="true">
          <path d="M3.25 7.5L3.25 3.25L7.5 3.25ZM4.5 8.75L8.75 8.75L8.75 4.5Z" />
        </svg>
        <svg v-else viewBox="0 0 12 12" aria-hidden="true">
          <path d="M2 5.75L5.75 5.75L5.75 2ZM10 6.25L6.25 6.25L6.25 10Z" />
        </svg>
      </button>
    </div>
    <div class="header-title" :class="titleClass">
      {{ headerTitle }}
    </div>
    <div class="spacer" />
  </div>
</template>

<style scoped>
.macos-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px 8px;
}

.traffic-light {
  position: relative;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  margin-right: 8px;
  padding: 0;
  cursor: pointer;
  transition: opacity 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  /* macOS only reveals the glyph on hover of the whole 3-dot group, not
     just the individual dot — matches the OS behavior. */
}

.traffic-light svg {
  width: 12px;
  height: 12px;
  opacity: 0;
  transition: opacity 0.12s ease;
}

.traffic-light.red path,
.traffic-light.yellow path {
  fill: none;
  stroke: rgba(0, 0, 0, 0.55);
  stroke-linecap: round;
}

.traffic-light.red path {
  stroke-width: 1.1;
}

.traffic-light.yellow path {
  stroke-width: 1.8;
}

.traffic-light.green path {
  fill: rgba(0, 0, 0, 0.55);
}

/* Reveal all three glyphs when the user hovers anywhere in the cluster,
   so they appear/disappear together — same as the real macOS chrome. */
.traffic-lights:hover .traffic-light svg {
  opacity: 1;
}

.traffic-light.red {
  background: #ff5f57;
}

.traffic-light.yellow {
  background: #febc2e;
}

.traffic-light.green {
  background: #28c840;
}

.header-title {
  font-size: 0.85rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.01em;
}

.spacer {
  width: 60px;
}
</style>

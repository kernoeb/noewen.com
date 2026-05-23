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
      <!-- SVG glyphs sourced from agmmnn/tauri-controls (MIT) —
           https://github.com/agmmnn/tauri-controls -->
      <button aria-label="Close" class="traffic-light red" @click="emit('close')">
        <svg viewBox="0 0 16 18" aria-hidden="true">
          <path d="M15.7522 4.44381L11.1543 9.04165L15.7494 13.6368C16.0898 13.9771 16.078 14.5407 15.724 14.8947L13.8907 16.728C13.5358 17.0829 12.9731 17.0938 12.6328 16.7534L8.03766 12.1583L3.44437 16.7507C3.10402 17.091 2.54132 17.0801 2.18645 16.7253L0.273257 14.8121C-0.0807018 14.4572 -0.0925004 13.8945 0.247845 13.5542L4.84024 8.96087L0.32499 4.44653C-0.0153555 4.10619 -0.00355681 3.54258 0.350402 3.18862L2.18373 1.35529C2.53859 1.00042 3.1013 0.989533 3.44164 1.32988L7.95689 5.84422L12.5556 1.24638C12.8951 0.906035 13.4587 0.917833 13.8126 1.27179L15.7267 3.18589C16.0807 3.53985 16.0925 4.10346 15.7522 4.44381Z" />
        </svg>
      </button>
      <button aria-label="Minimize" class="traffic-light yellow" @click="emit('minimize')">
        <svg viewBox="0 0 17 6" aria-hidden="true">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M1.47211 1.18042H15.4197C15.8052 1.18042 16.1179 1.50551 16.1179 1.90769V3.73242C16.1179 4.13387 15.8052 4.80006 15.4197 4.80006H1.47211C1.08665 4.80006 0.773926 4.47497 0.773926 4.07278V1.90769C0.773926 1.50551 1.08665 1.18042 1.47211 1.18042Z" />
        </svg>
      </button>
      <button :aria-label="fullscreen ? 'Exit fullscreen' : 'Maximize'" class="traffic-light green" @click="emit('maximize')">
        <!-- Enter-fullscreen: tauri-controls path (MIT), mirrored to TL+BR -->
        <svg v-if="!fullscreen" viewBox="0 0 15 15" aria-hidden="true" class="zoom-glyph enter-fs">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M3.53068 0.433838L15.0933 12.0409C15.0933 12.0409 15.0658 5.35028 15.0658 4.01784C15.0658 1.32095 14.1813 0.433838 11.5378 0.433838C10.6462 0.433838 3.53068 0.433838 3.53068 0.433838ZM12.4409 15.5378L0.87735 3.93073C0.87735 3.93073 0.905794 10.6214 0.905794 11.9538C0.905794 14.6507 1.79024 15.5378 4.43291 15.5378C5.32535 15.5378 12.4409 15.5378 12.4409 15.5378Z" />
        </svg>
        <!-- Exit-fullscreen: same tauri-controls path, vertically flipped
             so the triangles land on the TL+BR diagonal but oriented
             "inward" — visually the same shape as enter-FS, just in the
             other direction. -->
        <svg v-else viewBox="0 0 15 15" aria-hidden="true" class="zoom-glyph exit-fs">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M3.53068 0.433838L15.0933 12.0409C15.0933 12.0409 15.0658 5.35028 15.0658 4.01784C15.0658 1.32095 14.1813 0.433838 11.5378 0.433838C10.6462 0.433838 3.53068 0.433838 3.53068 0.433838ZM12.4409 15.5378L0.87735 3.93073C0.87735 3.93073 0.905794 10.6214 0.905794 11.9538C0.905794 14.6507 1.79024 15.5378 4.43291 15.5378C5.32535 15.5378 12.4409 15.5378 12.4409 15.5378Z" />
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
  width: 7px;
  height: 7px;
  /* macOS glyphs are a darker shade of the dot color, not pure black. */
  fill: rgba(0, 0, 0, 0.55);
  opacity: 0;
  transition: opacity 0.12s ease;
}

/* tauri-controls ships the zoom glyph as TR+BL triangles. We flip
   horizontally for enter-fullscreen (→ TL+BR, arrows pointing outward
   to the corners) and vertically for exit-fullscreen (→ TL+BR with each
   triangle re-oriented so the arrows visually point inward — same shape
   as enter, just rotated). */
.traffic-light .zoom-glyph.enter-fs {
  transform: scaleX(-1);
}

.traffic-light .zoom-glyph.exit-fs {
  transform: scaleY(-1);
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

<script setup lang="ts">
const props = defineProps({
  cv: {
    type: String,
    required: true,
  },
  cvTitle: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['close', 'minimize', 'maximize'])

const isLoading = ref(true)

const urlWithoutNavbar = computed(() => {
  return `${props.cv}#navpanes=0`
})

function onPdfLoad() {
  isLoading.value = false
}
</script>

<template>
  <v-card class="cv-card glass-card" rounded="xl">
    <MacOSHeader :header-title="cvTitle" @close="emit('close')" @minimize="emit('minimize')" @maximize="emit('maximize')" />

    <div v-if="isLoading" class="loading-container">
      <v-progress-circular indeterminate color="white" size="32" width="3" />
    </div>

    <object
      :data="urlWithoutNavbar"
      type="application/pdf"
      width="100%"
      height="100%"
      :class="{ 'pdf-loaded': !isLoading }"
      @load="onPdfLoad"
    >
      <div class="d-flex justify-center align-center h-100 pa-7 flex-column">
        <div class="cv-title mb-5">
          Mon CV
        </div>
        <div class="cv-description">
          Il semble que votre <b>navigateur</b> ne puisse pas afficher de fichiers <b>PDF</b>.
          Vous pouvez le télécharger en cliquant sur le bouton ci-dessous.
        </div>
        <v-btn size="large" class="mt-5 glass-btn" :href="cv">
          Voir le CV
        </v-btn>
      </div>
    </object>
  </v-card>
</template>

<style scoped>
.cv-card {
  overflow: hidden;
}

.loading-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}

object {
  opacity: 0;
  transition: opacity 0.3s ease;
}

object.pdf-loaded {
  opacity: 1;
}

.cv-title {
  font-size: 2.5rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  letter-spacing: -0.02em;
}

.cv-description {
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.75);
  text-align: center;
  max-width: 400px;
}
</style>

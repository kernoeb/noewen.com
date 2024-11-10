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

const urlWithoutNavbar = computed(() => {
  return `${props.cv}#navpanes=0`
})
</script>

<template>
  <v-card>
    <MacOSHeader style="margin-bottom: 6px; padding-top: 6px;" :header-title="cvTitle" @close="emit('close')" @minimize="emit('minimize')" @maximize="emit('maximize')" />
    <object :data="urlWithoutNavbar" type="application/pdf" width="100%" height="100%">
      <div class="d-flex justify-center align-center h-100 pa-7 flex-column">
        <div class="text-h2 mb-5">
          Mon CV
        </div>
        <div class="text-body-1 text-justify">Il semble que votre <b>navigateur</b> ne puisse pas afficher de fichiers <b>PDF</b>. Vous pouvez le télécharger en cliquant sur le bouton ci-dessous.</div>
        <div><v-btn size="large" class="mt-4" variant="tonal" color="primary" :href="cv">Voir le CV</v-btn></div>
      </div>
    </object>
  </v-card>
</template>

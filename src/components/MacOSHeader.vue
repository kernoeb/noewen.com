<script setup lang="ts">
defineProps({
  headerTitle: {
    type: String,
    default: '',
  },
  titleClass: {
    type: Object as PropType<Record<string, boolean>>,
    default: () => ({
      'text-grey-darken-3': true,
    }),
  },
})

const emit = defineEmits(['close', 'minimize', 'maximize'])
</script>

<template>
  <div class="d-flex pl-3 pt-2 pb-0 align-center justify-space-between">
    <div>
      <v-btn
        aria-label="Close"
        elevation="0"
        size="12"
        icon
        class="mr-2"
        color="#F45D5B"
        @click="emit('close')"
      />
      <v-btn
        aria-label="Minimize"
        elevation="0"
        size="12"
        icon
        class="mr-2"
        color="#F7BE3B"
        @click="emit('minimize')"
      />
      <v-btn
        aria-label="Maximize"
        elevation="0"
        size="12"
        icon
        class="mr-2"
        color="#45CC46"
        @click="emit('maximize')"
      />
    </div>
    <div class="text-body-1 font-weight-bold" :class="titleClass">
      {{ headerTitle }}
    </div>
    <div style="width: 60px" />
  </div>
</template>

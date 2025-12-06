<script setup lang="ts">
import type { Project } from '@/types'

defineProps({
  project: {
    type: Object as PropType<Project>,
    required: true,
  },
})
</script>

<template>
  <v-card
    class="h-100 d-flex flex-column glass-card project-card"
    :ripple="false"
    rounded="xl"
    :href="project.url" target="_blank"
  >
    <v-card-title class="pt-5 pb-2">
      <div class="d-flex align-center">
        <div class="icon-wrapper mr-3">
          <v-img v-if="project.imgProps" :alt="project.title" inline v-bind="project.imgProps" />
          <v-icon v-else-if="project.iconProps" :icon="project.iconProps.name" :color="project.iconProps.color" size="22" />
        </div>
        <span class="project-title">{{ project.title }}</span>
      </div>
    </v-card-title>
    <v-card-text class="pb-2 flex-grow-1">
      {{ project.description }}
    </v-card-text>
    <v-card-actions class="px-4 pb-4 pt-2">
      <div class="d-flex flex-wrap ga-2">
        <v-chip v-for="tech in project.technologies" :key="tech" class="glass-chip" size="small">
          {{ tech }}
        </v-chip>
      </div>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.project-card {
  overflow: hidden;
}

.icon-wrapper {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 6px;
}

.project-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  letter-spacing: -0.02em;
}
</style>

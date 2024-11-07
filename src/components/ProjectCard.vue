<script setup lang="ts">
defineProps({
  project: {
    type: Object as PropType<{
      title: string
      description: string
      technologies: string[]
      url: string
      imgProps?: Record<string, unknown>
      iconProps?: {
        name: string
        color: string
      }
    }>,
    required: true,
  },
})
</script>

<template>
  <v-card
    class="h-100 d-flex flex-column"
    variant="tonal"
    rounded="md"
    :href="project.url" target="_blank"
  >
    <v-card-title>
      <div class="d-flex align-center">
        <v-img v-if="project.imgProps" :alt="project.title" inline v-bind="project.imgProps" class="mr-2" />
        <v-icon v-else-if="project.iconProps" :icon="project.iconProps.name" :color="project.iconProps.color" class="mr-2" size="24" />
        {{ project.title }}
      </div>
    </v-card-title>
    <v-card-text class="pb-0">
      {{ project.description }}
    </v-card-text>
    <v-card-actions class="px-4">
      <v-chip v-for="tech in project.technologies" :key="tech" variant="tonal" label size="small">
        {{ tech }}
      </v-chip>
    </v-card-actions>
  </v-card>
</template>

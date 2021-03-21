<template>
  <v-timeline v-if="timeline" :dense="$vuetify.breakpoint.smAndDown">
    <v-timeline-item
      v-for="(item, i) in timeline"
      :key="i"
      fill-dot
      color="white"
      icon-color="black"
      :icon="item.icon"
    >
      <template #opposite>
        <span
          class="headline font-weight-bold"
          :style="`color: ${item.colorDate};`"
          v-text="item.year"
        />
      </template>
      <v-card rounded class="rounded-lg" color="#ededed">
        <v-card-title class="headline font-weight-bold mb-4" :style="`color: ${item.colorText}`" style="word-break: break-word">
          <div class="d-flex flex-column">
            <div>{{ item.text }}</div>
            <div v-if="item.ongoing" class="green--text font-weight-bold" style="font-size: 12px">
              En cours
            </div>
            <div v-if="$vuetify.breakpoint.smAndDown" class="font-weight-bold" style="font-size: 14px">
              {{ item.year }}
            </div>
          </div>
        </v-card-title>
        <v-card-subtitle v-if="!$vuetify.breakpoint.mobile" style="color: #2f2f2f">
          <pre style="white-space: pre-wrap;">{{ item.description }}</pre>
        </v-card-subtitle>
        <v-card-text v-if="item.link && !$vuetify.breakpoint.mobile">
          <v-icon class="mr-1" color="blue" @click="open(item.link)">
            mdi-open-in-new
          </v-icon><a :href="item.link" target="_blank">{{ hostname(item.link) }}</a>
        </v-card-text>
      </v-card>
    </v-timeline-item>
  </v-timeline>
</template>

<script>
export default {
  props: {
    timeline: {
      type: Array,
      default: null
    }
  },
  methods: {
    open (t) {
      window.open(t)
    },
    hostname (t) {
      return new URL(t).hostname
    }
  }
}
</script>

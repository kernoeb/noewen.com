<template>
  <v-timeline v-if="timeline" :dense="$vuetify.breakpoint.smAndDown">
    <v-timeline-item
      v-for="(item, i) in timeline"
      :key="i"
      :icon="item.icon"
      color="white"
      fill-dot
      :icon-color="item.ongoing ? 'green' : 'black'"
    >
      <template #opposite>
        <span
          :style="`color: ${item.colorDate};`"
          class="headline font-weight-bold"
          v-text="item.year"
        />
      </template>
      <v-card class="rounded-lg" color="#ededed" rounded>
        <v-card-title
          :style="`color: ${item.colorText}`"
          class="headline font-weight-bold"
          :class="$vuetify.breakpoint.xs ? 'pa-2' : 'mb-2'"
          style="word-break: break-word"
        >
          <div class="d-flex flex-column">
            <div :style="`${$vuetify.breakpoint.smAndDown ? 'font-size: 17px' : null}`" style="line-height: 20px">
              {{ item.text }}
            </div>
            <div v-if="$vuetify.breakpoint.smAndDown" class="font-weight-bold" style="font-size: 10px">
              {{ item.year }}
            </div>
          </div>
        </v-card-title>
        <v-card-subtitle v-if="!$vuetify.breakpoint.mobile" class="pb-2" style="color: #2f2f2f; font-size: 12px;">
          <pre style="white-space: pre-wrap;">{{ item.description }}</pre>
        </v-card-subtitle>
        <v-card-text v-if="item.link && !$vuetify.breakpoint.mobile" class="pb-2">
          <v-icon class="mt-1 mr-1" color="blue" size="12" @click="open(item.link)">
            mdi-open-in-new
          </v-icon>
          <small><a :href="item.link" target="_blank">{{ hostname(item.link) }}</a></small>
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

<template>
  <v-timeline v-if="timeline" :dense="$vuetify.breakpoint.smAndDown">
    <v-timeline-item
      v-for="(item, i) in timeline"
      :key="i"
      :icon="item.icon"
      color="white"
      fill-dot
      :icon-color="item.iconColor || (item.ongoing ? 'green' : 'black')"
    >
      <template #opposite>
        <span
          :style="`color: ${item.colorDate};`"
          class="headline font-weight-bold"
          v-text="item.year"
        />
      </template>
      <v-hover>
        <template #default="{ hover }">
          <v-card class="rounded-lg pa-1 transition-swing" :elevation="hover ? 4 : 2" color="#ededed" rounded>
            <v-card-title
              :style="`color: ${item.colorText}`"
              class="headline font-weight-bold"
              :class="$vuetify.breakpoint.xs ? 'pa-2 pt-3 ml-1' : 'mb-2'"
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
            <v-card-subtitle v-if="$vuetify.breakpoint.mdAndUp" class="pb-2" v-html="item.description" />
            <v-card-text v-if="item.link && !$vuetify.breakpoint.mobile" class="pb-2">
              <v-icon class="mt-1 mr-1" color="blue" size="12" @click="open(item.link)">
                {{ mdiOpenInNew }}
              </v-icon>
              <small><a :href="item.link" target="_blank">{{ hostname(item.link) }}</a></small>
            </v-card-text>
          </v-card>
        </template>
      </v-hover>
    </v-timeline-item>
  </v-timeline>
</template>

<script>
import { mdiOpenInNew } from '@mdi/js'

export default {
  props: {
    timeline: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
      mdiOpenInNew
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

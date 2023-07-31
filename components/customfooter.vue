<template>
  <v-footer absolute class="d-flex justify-center align-content" :color="color" elevation="0">
    <v-spacer />
    <transition name="fade">
      <v-icon v-if="arrowDown && showArrow" :color="dark ? '#393939' : 'white'" style="position: absolute" @click="$emit('scroll-down')">
        {{ mdiArrowDownBold }}
      </v-icon>
      <v-icon v-else-if="!arrowDown && showArrow" :color="dark ? '#393939' : 'white'" style="position: absolute" @click="$emit('back-to-top')">
        {{ mdiArrowUpBold }}
      </v-icon>
    </transition>
    <v-spacer />
    <v-hover
      v-slot="{ hover }"
    >
      <v-btn icon class="mr-1" href="https://www.linkedin.com/in/no%C3%A9wen-boisnard/" target="_blank" title="LinkedIn">
        <v-icon :color="hover ? 'grey' : dark ? '#393939' : 'white'">
          {{ mdiLinkedin }}
        </v-icon>
      </v-btn>
    </v-hover>
    <v-hover
      v-slot="{ hover }"
    >
      <v-btn icon class="mr-1" href="https://github.com/kernoeb" target="_blank" title="GitHub">
        <v-icon :color="hover ? 'grey' : dark ? '#393939' : 'white'">
          {{ mdiGithub }}
        </v-icon>
      </v-btn>
    </v-hover>
    <v-hover
      v-slot="{ hover }"
    >
      <v-btn icon href="https://mamot.fr/@kernoeb" target="_blank" title="Mastodon" rel="me">
        <v-icon :color="hover ? 'grey' : dark ? '#393939' : 'white'">
          {{ mdiMastodon }}
        </v-icon>
      </v-btn>
    </v-hover>
  </v-footer>
</template>

<script>
import { mdiArrowDownBold, mdiArrowUpBold, mdiGithub, mdiLinkedin, mdiMastodon } from '@mdi/js'

export default {
  props: {
    color: {
      type: String,
      default: 'white'
    },
    dark: {
      type: Boolean,
      default: false
    },
    arrowDown: {
      type: Boolean,
      default: true
    },
    loaded: {
      type: Boolean,
      default: true
    },
    first: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      mdiGithub,
      mdiArrowDownBold,
      mdiArrowUpBold,
      mdiLinkedin,
      mdiMastodon,
      showArrow: !this.first
    }
  },
  created () {
    if (this.first && this.loaded && !this.showArrow) {
      setTimeout(() => {
        this.showArrow = true
      }, 1)
    }
  }
}
</script>

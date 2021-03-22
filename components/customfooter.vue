<template>
  <v-footer absolute class="d-flex justify-center align-content" :color="color" elevation="0">
    <v-spacer />
    <v-icon :color="dark ? '#393939' : 'white'" style="position: absolute" @click="$emit('scroll-down')">
      {{ mdiArrowDownBold }}
    </v-icon>
    <v-spacer />
    <v-hover
      v-slot="{ hover }"
    >
      <v-icon :color="hover ? 'grey' : dark ? '#393939' : 'white'" class="mr-1" @click="openLinkedin()">
        {{ mdiLinkedin }}
      </v-icon>
    </v-hover>
    <v-hover
      v-slot="{ hover }"
    >
      <v-icon :color="hover ? 'grey' : dark ? '#393939' : 'white'" @click="openGithub()">
        {{ mdiGithub }}
      </v-icon>
    </v-hover>
  </v-footer>
</template>

<script>
import { mdiArrowDownBold, mdiGithub, mdiLinkedin } from '@mdi/js'

export default {
  props: {
    color: {
      type: String,
      default: 'white'
    },
    dark: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      mdiGithub, mdiArrowDownBold, mdiLinkedin
    }
  },
  methods: {
    openLinkedin () {
      window.open('https://www.linkedin.com/in/no%C3%A9wen-boisnard/')
    },
    openGithub () {
      window.open('https://github.com/kernoeb')
    }
  }
}
</script>

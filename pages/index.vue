<template>
  <v-carousel
    v-model="model"
    vertical
    hide-delimiter-background
    hide-delimiters
    :show-arrows="false"
    height="100vh"
    progress-color="white"
    :continuous="false"
  >
    <v-carousel-item
      v-for="(color, i) in colors"
      :key="color"
    >
      <v-sheet
        :color="color"
        height="100%"
        tile
      >
        <div
          class="fill-height justify-center align-center d-flex text-center noselect"
        >
          <div class="display-3">
            {{ values[i] }}
          </div>
        </div>
      </v-sheet>
    </v-carousel-item>
  </v-carousel>
</template>

<script>

export default {
  data () {
    return {
      model: 0,
      values: [
        'Salut ! Je suis Noéwen BOISNARD.',
        'Je suis développeur web et mobile',
        'Scrollez ci-dessous pour voir mon CV !'
      ],
      colors: [
        'primary',
        'secondary',
        'orange'
      ]
    }
  },
  mounted () {
    setInterval(() => {
      this.model++
    }, 6000)
  }
}
</script>

<style scoped lang="css">

.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
}

</style>

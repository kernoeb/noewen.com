<template>
  <div>
    <client-only>
      <full-page :options="options" @after-load="afterLoad">
        <div class="section">
          <div
            class="white--text d-flex justify-center align-center text-center noselect flex-column"
            style="font-family: NugoSans-Light;"
          >
            <div class="floatAnimate containerName">
              <div>Noéwen</div>
              <div>
                <strong>BOISNARD</strong>
              </div>
            </div>
            <div style="font-family: NugoSans-Light, sans-serif; font-size: 17px" class="white--text noselect font-weight-bold">
              Développeur web & mobile
            </div>
          </div>
        </div>
        <div class="section">
          Second section ...
        </div>
      </full-page>
    </client-only>
  </div>
</template>
<script>

export default {
  data () {
    return {
      options: {
        licenseKey: 'YOUR_KEY_HERE',
        menu: '#menu',
        anchors: ['page1', 'page2', 'page3'],
        sectionsColor: ['#5a0034', '#ff5f45', '#0798ec'],
        navigation: true
      }
    }
  },
  methods: {
    afterLoad () {
      console.log('test')
    }
  }
}
</script>

<style>
.fp-right span {
  background: #adadad !important;
}
</style>

<style lang="css" scoped>
@font-face {
  font-family: "NugoSans-Light";
  src: local("NugoSans-Light"), url(/fonts/NugoSans-Light.ttf) format("truetype");
}

.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
}

@media all and (min-width: 0) and (max-width: 429px) {
  .containerName {
    font-size: 50px;
  }
}

@media not all and (min-width: 0) and (max-width: 429px) {
  .containerName {
    font-size: 70px;
  }
}

.floatAnimate {
  animation: float 2s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translatey(0px);
  }
  50% {
    transform: translatey(-20px);
  }
  100% {
    transform: translatey(0px);
  }
}
</style>

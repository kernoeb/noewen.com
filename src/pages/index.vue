<script lang="ts" setup>
import { useHead } from '@unhead/vue'

useHead({
  title: 'Noéwen BOISNARD',
  meta: [
    {
      name: 'description',
      content: 'Développeur Fullstack',
    },
  ],
})
</script>

<template>
  <HelloWorld />
</template>

<style>
main {
  background: #6d1045 !important;
}

@media (hover: hover) {
  main {
    background: transparent radial-gradient(at calc(var(--mouse-x, 0.5) * 100%) calc(var(--mouse-y, 0.5) * 100%), #7a2050, #6d1045) no-repeat 0 0 !important;
  }
}
</style>

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
  background: transparent radial-gradient(at calc(var(--mouse-x, 0) * 100%) calc(var(--mouse-y, 0) * 100%), #610a3c, #5a0034) no-repeat 0 0!important;
}
</style>

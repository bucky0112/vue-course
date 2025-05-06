<script setup>
import { inject } from 'vue'

const locale = inject('locale')

console.log(locale)
</script>

<template>
  <nav>
    <a href="#">{{ locale.nav.home }}</a>
    <a href="#">{{ locale.nav.about }}</a>
    <a href="#">{{ locale.nav.contact }}</a>
  </nav>
</template>

<style scoped>
nav {
  padding: 1rem;
}
nav a {
  margin: 0 0.5rem;
}
</style>
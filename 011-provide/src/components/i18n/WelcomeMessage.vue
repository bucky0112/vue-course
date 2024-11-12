<script setup>
import { inject } from 'vue'

const locale = inject('locale')
</script>

<template>
  <div class="welcome">
    <h1>{{ locale.welcome.title }}</h1>
    <h2>{{ locale.welcome.subtitle }}</h2>
    <p>{{ locale.welcome.description }}</p>
  </div>
</template>

<style scoped>
.welcome {
  padding: 2rem;
  text-align: center;
}
</style>
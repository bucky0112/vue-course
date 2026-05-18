<script setup>
import { inject } from 'vue'

const theme = inject('theme')
const toggleTheme = inject('toggleTheme')
</script>

<template>
  <button @click="toggleTheme">
    切換主題 (目前: {{ theme }})
  </button>
</template>
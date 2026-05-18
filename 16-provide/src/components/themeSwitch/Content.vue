<script setup>
import { inject } from 'vue'

const theme = inject('theme')
</script>

<template>
  <div class="content">
    <h1>目前主題：{{ theme }}</h1>
    <p>這是一些內容...</p>
  </div>
</template>
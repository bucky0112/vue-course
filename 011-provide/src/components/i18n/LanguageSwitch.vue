<script setup>
import { inject } from 'vue'

const toggleLanguage = inject("toggleLanguage")
const locale = inject("locale")
const currentLang = inject("currentLang")

console.log(locale.language)
</script>

<template>
  <div class="language-switch">
    <button @click="toggleLanguage">
      {{ locale.language[currentLang.value === 'zh' ? 'en' : 'zh'] }}
    </button>
  </div>
</template>
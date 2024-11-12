<script setup>
import { inject } from 'vue'

const locale = inject('locale')
const currentLang = inject('currentLang')
const toggleLanguage = inject('toggleLanguage')
</script>

<template>
  <div class="language-switch">
    <button @click="toggleLanguage">
      {{ locale.language[currentLang === 'zh' ? 'en' : 'zh'] }}
    </button>
  </div>
</template>
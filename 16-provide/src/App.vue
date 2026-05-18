<script setup>
import { provide, ref, computed } from 'vue'
import AComponent from './components/simple/AComponent.vue'
import ThemeSwitch from './components/themeSwitch/ThemeSwitch.vue'
import Content from './components/themeSwitch/Content.vue'
import LanguageSwitch from './components/i18n/LanguageSwitch.vue'
import Navigation from './components/i18n/Navigation.vue'
import WelcomeMessage from './components/i18n/WelcomeMessage.vue'
import zhLocale from './components/locales/zh.js'
import enLocale from './components/locales/en.js'

// 提供靜態值
provide('message', 'Hello from parent!')

// 提供響應式資料
const count = ref(0)
provide('counter', count)

// 提供方法
provide('increment', () => {
  count.value++
})

// === 主題切換 ===
const theme = ref('light')

provide('theme', theme)
provide('toggleTheme', () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
})

// === 語言切換 ===
// 目前語言
const currentLang = ref('zh')

// 語系資料
const locales = {
  zh: zhLocale,
  en: enLocale
}

// 提供目前語系資料
provide('locale', computed(() => locales[currentLang.value]))

// 提供切換語言方法
provide('toggleLanguage', () => {
  currentLang.value = currentLang.value === 'zh' ? 'en' : 'zh'
})

// 提供目前語言
provide('currentLang', currentLang)
</script>

<template>
  <!-- <AComponent /> -->
  <div :class="theme">
    <ThemeSwitch />
    <Content />
    <LanguageSwitch />
    <Navigation />
    <WelcomeMessage />
  </div>
</template>

<style scoped>
.light {
  width: 100vw;
  height: 100vh;
  background-color: white;
  color: black;
}

.dark {
  width: 100vw;
  height: 100vh;
  background-color: #333;
  color: white;
}
</style>
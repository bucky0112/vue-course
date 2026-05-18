import { defineStore } from 'pinia'
import { ref } from 'vue'

// 用 pinia-plugin-persistedstate 把整個 store 的 state 自動同步到 localStorage
// （main.js 註冊了 plugin，這裡只要加 { persist: true } 即可）
export const usePreferencesStore = defineStore(
  'preferences',
  () => {
    const theme = ref('light') // 'light' | 'dark'
    const locale = ref('zh-TW') // 'zh-TW' | 'en'

    function toggleTheme() {
      theme.value = theme.value === 'light' ? 'dark' : 'light'
    }

    function setLocale(next) {
      locale.value = next
    }

    return { theme, locale, toggleTheme, setLocale }
  },
  {
    persist: true,
  },
)

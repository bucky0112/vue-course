<script setup>
import { storeToRefs } from 'pinia'
import { usePreferencesStore } from '@/stores/preferences'

const store = usePreferencesStore()
const { theme, locale } = storeToRefs(store)
</script>

<template>
  <div class="card" :class="{ dark: theme === 'dark' }">
    <h3>UI 偏好（自動存 localStorage）</h3>
    <p>主題：<strong>{{ theme }}</strong></p>
    <p>語言：<strong>{{ locale }}</strong></p>
    <div class="actions">
      <button @click="store.toggleTheme()">
        切換到 {{ theme === 'light' ? 'dark' : 'light' }}
      </button>
      <button @click="store.setLocale('zh-TW')" :disabled="locale === 'zh-TW'">繁中</button>
      <button @click="store.setLocale('en')" :disabled="locale === 'en'">EN</button>
    </div>
    <p class="hint">
      重整頁面後設定不會消失 — store 加了 <code>{ persist: true }</code>。
      <br>
      開瀏覽器 DevTools → Application → Local Storage → <code>preferences</code> 可以直接看到。
    </p>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid #ccc;
  padding: 16px;
  border-radius: 4px;
  transition: background 0.2s, color 0.2s;
}
.card.dark {
  background: #2d333b;
  color: #e6edf3;
  border-color: #444c56;
}
.actions {
  display: flex;
  gap: 8px;
  margin: 12px 0;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.hint {
  color: #6e7681;
  font-size: 0.875rem;
  line-height: 1.5;
}
.dark .hint {
  color: #909dab;
}
code {
  background: #f6f8fa;
  padding: 1px 4px;
  border-radius: 3px;
  color: #d1242f;
  font-size: 0.875em;
}
.dark code {
  background: #1f2428;
  color: #ff7b72;
}
</style>

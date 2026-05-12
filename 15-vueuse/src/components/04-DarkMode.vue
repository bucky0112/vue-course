<script setup>
import { useDark, useToggle, usePreferredDark } from '@vueuse/core'

// useDark 做三件事：
// 1. 讀取 localStorage 上次的選擇
// 2. 沒選過就讀作業系統的 prefers-color-scheme
// 3. 給 <html> 加上 / 拿掉 'dark' class
const isDark = useDark()

// useToggle 把 ref<boolean> 包成「呼叫一次就翻轉」的函式
const toggleDark = useToggle(isDark)

// 額外資訊：作業系統偏好（不一定等於目前狀態）
const systemPrefersDark = usePreferredDark()
</script>

<template>
  <section>
    <h2>4. <code>useDark</code> — 主題切換</h2>
    <p class="hint">
      <code>useDark</code> 一次解決：偵測系統偏好、儲存使用者選擇、套用 class。
      你只要寫好 light / dark 兩套 CSS variables 即可。
      <strong>整個頁面背景會跟著切換</strong>——這個專案的 main.css 已經處理好深色配色。
    </p>

    <div class="card">
      <p>
        目前主題：
        <strong>{{ isDark ? '🌙 Dark mode' : '☀️ Light mode' }}</strong>
      </p>
      <p>
        作業系統偏好：
        <strong>{{ systemPrefersDark ? 'Dark' : 'Light' }}</strong>
      </p>
      <button @click="toggleDark()">切換主題</button>
      <p class="hint">
        切換後打開 DevTools 看 <code>&lt;html&gt;</code>，會發現多了
        <code>class="dark"</code>。也試試重新整理頁面——選擇會被記住。
      </p>
    </div>
  </section>
</template>

<script setup>
import { useLocalStorage } from '@vueuse/core'

// VueUse 版的 useLocalStorage 自動處理 JSON 序列化、預設值合併、
// 多分頁同步（透過 storage event）、ref 解構等
const name = useLocalStorage('vueuse-demo:name', '')
const settings = useLocalStorage('vueuse-demo:settings', {
  fontSize: 16,
  theme: 'auto',
})

const clearAll = () => {
  name.value = ''
  settings.value = { fontSize: 16, theme: 'auto' }
}
</script>

<template>
  <section>
    <h2>2. <code>useLocalStorage</code></h2>
    <p class="hint">
      跟你在第 14 章寫的概念一樣，但 VueUse 版本還幫你處理：
      JSON 自動序列化、預設值合併、跨 tab 同步、SSR 安全。
    </p>

    <div class="card">
      <label>姓名：<input v-model="name" /></label>
      <hr />
      <label>字級：<input type="number" v-model.number="settings.fontSize" /></label>
      <label>主題：<input v-model="settings.theme" /></label>
      <p>儲存的設定：</p>
      <pre>{{ settings }}</pre>
      <button @click="clearAll">清空</button>
      <p class="hint">重新整理頁面後資料仍會保留；開兩個分頁同個網址，改其中一個會同步另一個。</p>
    </div>
  </section>
</template>

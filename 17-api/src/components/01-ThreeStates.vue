<script setup>
import { ref } from 'vue'

const data = ref(null)
const error = ref(null)
const isLoading = ref(false)

const load = async () => {
  isLoading.value = true
  error.value = null
  data.value = null
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/todos/1')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    data.value = await res.json()
  } catch (e) {
    error.value = e
  } finally {
    isLoading.value = false
  }
}

const loadError = async () => {
  isLoading.value = true
  error.value = null
  data.value = null
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/not-exist')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    data.value = await res.json()
  } catch (e) {
    error.value = e
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <section>
    <h2>1. <code>loading / error / data</code> — 三態 pattern 回顧</h2>
    <p class="hint">
      第 14、15 章已多次用過這個 pattern。這裡再次強調：
      <strong>每個 API 請求都有三種畫面狀態</strong>，缺一不可。
    </p>

    <div class="card">
      <button @click="load">抓資料（成功）</button>
      <button @click="loadError">抓不存在的網址（失敗）</button>

      <hr />
      <p v-if="isLoading">⏳ 載入中</p>
      <p v-else-if="error" class="error">❌ {{ error.message }}</p>
      <pre v-else-if="data">{{ data }}</pre>
      <p v-else class="hint">尚未發送請求</p>
    </div>

    <p class="hint">
      ⚠️ <strong>常見錯誤</strong>：很多人忘了在 finally 把 <code>isLoading</code> 設回 false，
      導致請求失敗後畫面永遠卡在「載入中」。<code>try / catch / finally</code> 三段都要寫。
    </p>
  </section>
</template>

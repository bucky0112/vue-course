<script setup>
import { ref } from 'vue'
import axios from 'axios'

// 建立 axios instance：所有設定（baseURL、timeout、headers）一次定義
const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 5000,
})

const log = ref([])
const data = ref(null)
const isLoading = ref(false)
const error = ref(null)

// Request interceptor：每個出去的請求都會經過
api.interceptors.request.use((config) => {
  log.value.push(`→ ${config.method.toUpperCase()} ${config.url}`)
  // 真實場景：在這裡加 auth token
  // config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response interceptor：每個回應都會經過（成功+失敗）
api.interceptors.response.use(
  (response) => {
    log.value.push(`← ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    log.value.push(`✗ ${error.message}`)
    // 真實場景：在這裡統一處理 401（自動登出）、403、5xx 等
    return Promise.reject(error)
  }
)

const fetchSuccess = async () => {
  isLoading.value = true
  error.value = null
  data.value = null
  try {
    // axios 自動解析 JSON，回傳 { data, status, headers, config, ... }
    const response = await api.get('/todos/1')
    data.value = response.data
  } catch (e) {
    error.value = e
  } finally {
    isLoading.value = false
  }
}

const fetchFail = async () => {
  isLoading.value = true
  error.value = null
  data.value = null
  try {
    const response = await api.get('/not-exist')
    data.value = response.data
  } catch (e) {
    error.value = e
  } finally {
    isLoading.value = false
  }
}

const clearLog = () => {
  log.value = []
}
</script>

<template>
  <section>
    <h2>4. axios + Interceptors</h2>
    <p class="hint">
      axios 跟 fetch 比，多了幾個重要功能：<strong>interceptors（全域攔截器）</strong>、
      自動 JSON 解析、可設定 baseURL 跟 timeout。
      最大價值在 interceptors——讓「加 auth token」、「全域 log」、
      「401 自動登出」這類橫切邏輯一次寫好。
    </p>

    <div class="card">
      <button @click="fetchSuccess">GET /todos/1（成功）</button>
      <button @click="fetchFail">GET /not-exist（失敗）</button>
      <button @click="clearLog">清空 log</button>

      <hr />
      <h4>Interceptor log</h4>
      <ul class="log">
        <li v-for="(line, i) in log" :key="i">{{ line }}</li>
      </ul>

      <h4>結果</h4>
      <p v-if="isLoading">⏳ 載入中</p>
      <p v-else-if="error" class="error">❌ {{ error.message }}</p>
      <pre v-else-if="data">{{ data }}</pre>
      <p v-else class="hint">尚未發送請求</p>
    </div>
  </section>
</template>

<style scoped>
.log {
  font-family: monospace;
  font-size: 13px;
}
.log li {
  padding: 2px 0;
}
</style>

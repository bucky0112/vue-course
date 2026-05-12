<script setup>
import { ref } from 'vue'
import { fakeFetch } from '@/api/fakeApi'

const log = ref([])
const result = ref(null)
const running = ref(false)

const fetchWithRetry = async (key, maxAttempts = 4) => {
  log.value = []
  result.value = null
  running.value = true

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    log.value.push(`#${attempt} 嘗試送出請求...`)
    try {
      // 假 API：60% 機率失敗
      const data = await fakeFetch(key, { delay: 400, failRate: 0.6 })
      log.value.push(`#${attempt} ✅ 成功`)
      result.value = data
      running.value = false
      return
    } catch (e) {
      log.value.push(`#${attempt} ❌ ${e.message}`)

      if (attempt === maxAttempts) {
        log.value.push(`達到最大重試次數 (${maxAttempts})，放棄。`)
        running.value = false
        return
      }

      // Exponential backoff：500ms → 1000ms → 2000ms → 4000ms...
      const backoff = 500 * 2 ** (attempt - 1)
      log.value.push(`⏳ 等 ${backoff}ms 後重試...`)
      await new Promise((r) => setTimeout(r, backoff))
    }
  }
}
</script>

<template>
  <section>
    <h2>3. 重試 (Retry) + 指數退避 (Exponential Backoff)</h2>
    <p class="hint">
      網路不穩或伺服器暫時錯誤時，自動重試比一次失敗就放棄更友善。
      「指數退避」每次失敗都加倍等待時間，避免雪崩式 retry 把後端打爆。
    </p>

    <div class="card">
      <p>
        假 API 設定：<strong>60% 機率失敗</strong>，最多重試 4 次，
        等待時間 500ms → 1s → 2s → 4s
      </p>
      <button @click="fetchWithRetry('test')" :disabled="running">
        {{ running ? '執行中...' : '執行' }}
      </button>

      <hr />
      <h4>請求日誌</h4>
      <ul class="log">
        <li v-for="(line, i) in log" :key="i">{{ line }}</li>
      </ul>

      <h4 v-if="result">最終結果</h4>
      <pre v-if="result">{{ result }}</pre>
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

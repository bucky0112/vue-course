<script setup>
import { useFetch } from '@/composables/useFetch'

const { data, error, isLoading, refetch } = useFetch(
  'https://jsonplaceholder.typicode.com/todos/1'
)
</script>

<template>
  <section>
    <h2>4. useFetch — 非同步資料的三態管理</h2>
    <p class="hint">
      <code>loading / error / data</code> 三態 pattern 是業界標準。
      把這個邏輯包進 composable，任何元件都能用一行 <code>useFetch(url)</code> 取得整套狀態。
    </p>

    <div class="card">
      <button @click="refetch">重新請求</button>

      <p v-if="isLoading">⏳ 載入中…</p>
      <p v-else-if="error" class="error">❌ 錯誤：{{ error.message }}</p>
      <pre v-else>{{ data }}</pre>

      <p class="hint">
        這只是「composable 的非同步寫法」示範。
        更完整的 API 串接（取消、重試、競態處理）在第 17 章。
      </p>
    </div>
  </section>
</template>

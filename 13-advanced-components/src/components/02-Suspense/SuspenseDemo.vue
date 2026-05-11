<script setup>
import { defineAsyncComponent, ref } from 'vue'
import AsyncProfile from './AsyncProfile.vue'

// defineAsyncComponent：把元件包裝成「需要時才下載」
// 加 setTimeout 模擬網路延遲，真實場景不用——import() 本身就是非同步
const HeavyChart = defineAsyncComponent(
  () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(import('./HeavyChart.vue'))
      }, 1200)
    })
)

const showChart = ref(false)
</script>

<template>
  <section>
    <h2>2. Suspense — 處理非同步元件的載入態</h2>
    <p class="hint">
      <code>&lt;Suspense&gt;</code> 提供 <code>#default</code> 跟 <code>#fallback</code> 兩個插槽：
      子元件還在載入時顯示 fallback，載入完成顯示 default。
    </p>

    <h3 style="margin-top: 16px">情境 A：<code>top-level await</code>（重新整理頁面看效果）</h3>
    <p class="hint">
      AsyncProfile 內部用 await 假裝抓 API。畫面會先顯示「載入中」，1.5 秒後切換成資料。
    </p>
    <Suspense>
      <AsyncProfile />
      <template #fallback>
        <div class="card">⏳ 正在載入使用者資料...</div>
      </template>
    </Suspense>

    <h3 style="margin-top: 24px">情境 B：<code>defineAsyncComponent</code>（code splitting）</h3>
    <p class="hint">
      HeavyChart 的 JS 是被切出的 chunk。第一次點「展開」才會下載這個元件的程式碼。
    </p>
    <button @click="showChart = !showChart">
      {{ showChart ? '收起' : '展開' }} Heavy Chart
    </button>
    <Suspense v-if="showChart">
      <HeavyChart />
      <template #fallback>
        <div class="card">⏳ 正在下載 Heavy Chart 元件...</div>
      </template>
    </Suspense>
  </section>
</template>

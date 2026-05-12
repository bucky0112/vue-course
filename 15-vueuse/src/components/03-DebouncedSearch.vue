<script setup>
import { ref, computed } from 'vue'
import { refDebounced } from '@vueuse/core'

const keyword = ref('')

// refDebounced(source, ms)：包裝一個 ref，
// 只在 source 停止變動 ms 毫秒後才更新自己
const debouncedKeyword = refDebounced(keyword, 500)

const fruits = [
  'Apple',
  'Banana',
  'Cherry',
  'Date',
  'Elderberry',
  'Fig',
  'Grape',
  'Honeydew',
  'Kiwi',
  'Lemon',
  'Mango',
  'Nectarine',
  'Orange',
  'Papaya',
  'Quince',
  'Raspberry',
  'Strawberry',
]

const results = computed(() => {
  const q = debouncedKeyword.value.trim().toLowerCase()
  if (!q) return []
  return fruits.filter((item) => item.toLowerCase().includes(q))
})
</script>

<template>
  <section>
    <h2>3. <code>refDebounced</code> — 延後更新的 ref</h2>
    <p class="hint">
      搜尋即時建議的經典場景：使用者每打一個字就 fetch API 會炸後端。
      <code>refDebounced</code> 讓 ref 在「停止變動 N 毫秒」後才更新——
      即時值跟搜尋條件解耦，使用者打字流暢、API 請求次數降到最低。
    </p>

    <div class="card">
      <label>關鍵字：<input v-model="keyword" placeholder="輸入水果名稱..." /></label>
      <p>
        即時值：「<strong>{{ keyword }}</strong>」<br />
        Debounced（停打 500ms）：「<strong>{{ debouncedKeyword }}</strong>」
      </p>
      <hr />
      <p>搜尋結果（用 debounced 版本去 filter，<strong>連續打字不會閃</strong>）：</p>
      <ul v-if="results.length">
        <li v-for="r in results" :key="r">🍓 {{ r }}</li>
      </ul>
      <p v-else class="hint">無結果（試試 "ber"、"on" 等關鍵字）</p>
    </div>
  </section>
</template>

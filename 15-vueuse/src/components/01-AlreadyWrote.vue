<script setup>
import { useMouse, useFetch } from '@vueuse/core'

// useMouse — 跟第 14 章你寫的一模一樣（只是更完整）
const { x, y } = useMouse()

// useFetch — VueUse 的版本支援 chainable，立刻 .json() 解析
// refetch: false 讓它不要 mount 就自動發請求，等使用者按按鈕
const { data, error, isFetching, execute } = useFetch(
  'https://jsonplaceholder.typicode.com/todos/1',
  { immediate: false }
).json()
</script>

<template>
  <section>
    <h2>1. 你在第 14 章寫過的，VueUse 都有現成的</h2>
    <p class="hint">
      第 14 章你親手實作了 <code>useMouse</code> 跟 <code>useFetch</code>，
      就是為了理解 composable 的內部運作。
      實務上：<strong>VueUse 已經幫你寫好了，而且處理了更多 edge case</strong>。
    </p>

    <div class="row">
      <div class="card">
        <h3><code>useMouse()</code></h3>
        <p>滑鼠座標：x = <strong>{{ x }}</strong>, y = <strong>{{ y }}</strong></p>
        <pre>import { useMouse } from '@vueuse/core'

const { x, y } = useMouse()</pre>
      </div>

      <div class="card">
        <h3><code>useFetch()</code></h3>
        <button @click="execute">送出請求</button>
        <p v-if="isFetching">⏳ 載入中...</p>
        <p v-else-if="error" class="error">❌ {{ error.message }}</p>
        <pre v-else>{{ data }}</pre>
      </div>
    </div>
  </section>
</template>

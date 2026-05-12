<script setup>
import { ref, watchEffect } from 'vue'

const a = ref(1)
const b = ref(2)
const logs = ref([])

// watchEffect(callback)
// 1. 掛載時立即執行一次
// 2. 自動追蹤 callback 內用到的 reactive 來源
// 3. 任何來源變動都重新執行
// 4. 沒有 newVal / oldVal
watchEffect(() => {
  // 這裡用到了 a 跟 b，所以兩個都會被追蹤
  logs.value.unshift(`a + b = ${a.value + b.value}`)
  if (logs.value.length > 6) logs.value.pop()
})

const c = ref(0)
const cLogs = ref([])

// 換種寫法示範條件追蹤——條件外的 ref 不會被追蹤
watchEffect(() => {
  if (c.value > 0) {
    cLogs.value.unshift(`c 是正數：${c.value}`)
  } else {
    cLogs.value.unshift(`c 不是正數：${c.value}`)
  }
  if (cLogs.value.length > 5) cLogs.value.pop()
})
</script>

<template>
  <section>
    <h2>4. <code>watchEffect</code> — 自動追蹤依賴</h2>
    <p class="hint">
      <code>watchEffect(callback)</code> 跟 <code>watch</code> 的差別：
      <strong>不用宣告 source</strong>——它會自動追蹤 callback 內用到的所有 reactive 來源。
      還有兩個重要差異：<strong>掛載時立即執行</strong>、<strong>沒有 newVal/oldVal</strong>。
    </p>

    <div class="row">
      <div class="card">
        <h3>自動追蹤多個 ref</h3>
        <label>a: <input type="number" v-model.number="a" /></label>
        <label>b: <input type="number" v-model.number="b" /></label>
        <p>a + b = <strong>{{ a + b }}</strong></p>
        <h4>執行紀錄</h4>
        <ul>
          <li v-for="(line, i) in logs" :key="i">{{ line }}</li>
        </ul>
        <p class="hint">
          沒寫 <code>watch([a, b], ...)</code>，但改 a 或 b 都會觸發。
          頁面剛載入就有一筆——這是「立即執行」的效果。
        </p>
      </div>

      <div class="card">
        <h3>條件追蹤</h3>
        <label>c: <input type="number" v-model.number="c" /></label>
        <h4>執行紀錄</h4>
        <ul>
          <li v-for="(line, i) in cLogs" :key="i">{{ line }}</li>
        </ul>
        <p class="hint">
          每次重跑時都重新追蹤——只追蹤這次「真的被讀到」的 ref。
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch } from 'vue'

const firstName = ref('Alice')
const lastName = ref('Chen')
const logs = ref([])

// 監聽多個 source：第一個參數傳陣列，callback 也會拿到陣列
watch([firstName, lastName], ([newFirst, newLast], [oldFirst, oldLast]) => {
  const changed = []
  if (newFirst !== oldFirst) changed.push(`first: "${oldFirst}" → "${newFirst}"`)
  if (newLast !== oldLast) changed.push(`last: "${oldLast}" → "${newLast}"`)
  logs.value.unshift(changed.join(', '))
  if (logs.value.length > 5) logs.value.pop()
})
</script>

<template>
  <section>
    <h2>3. <code>watch</code> — 監聽多個來源</h2>
    <p class="hint">
      把 source 改成陣列就能同時監聽多個。
      callback 的 <code>newVal</code> / <code>oldVal</code> 也會變成陣列，順序對應。
    </p>

    <div class="card">
      <label>First name: <input v-model="firstName" /></label>
      <br />
      <label>Last name: <input v-model="lastName" /></label>
      <h4>變動紀錄</h4>
      <ul>
        <li v-for="(line, i) in logs" :key="i">{{ line }}</li>
      </ul>
      <p class="hint">
        改任一個欄位都會觸發一次 callback；可以從 newVal / oldVal 比對出是哪個變了。
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref, watch } from 'vue'

const message = ref('')
const logs = ref([])

// watch(source, callback)
// source 變動時觸發 callback，可拿到 newVal 跟 oldVal
watch(message, (newVal, oldVal) => {
  logs.value.unshift(`"${oldVal}" → "${newVal}"`)
  if (logs.value.length > 5) logs.value.pop()
})

// 加 { immediate: true } 讓 watch 在掛載時就先跑一次
const count = ref(0)
const countLogs = ref([])

watch(
  count,
  (newVal, oldVal) => {
    countLogs.value.unshift(`oldVal=${oldVal}, newVal=${newVal}`)
    if (countLogs.value.length > 5) countLogs.value.pop()
  },
  { immediate: true } // 不加的話畫面初始是空的；加了會看到一筆 oldVal=undefined
)
</script>

<template>
  <section>
    <h2>1. <code>watch</code> — 基本用法</h2>
    <p class="hint">
      <code>watch(source, callback)</code>：source 變動時，callback 被呼叫，
      可同時拿到 <code>newVal</code> 跟 <code>oldVal</code>。
      <strong>預設是 lazy</strong>——掛載時不執行，要等 source 真的變了才跑。
    </p>

    <div class="row">
      <div class="card">
        <h3>基本 watch</h3>
        <input v-model="message" placeholder="輸入點什麼..." />
        <h4>變動紀錄</h4>
        <ul>
          <li v-for="(line, i) in logs" :key="i">{{ line }}</li>
        </ul>
        <p class="hint">每打一個字就會 log 一筆 (oldVal, newVal)。</p>
      </div>

      <div class="card">
        <h3><code>{ immediate: true }</code></h3>
        <button @click="count++">count++</button>
        <p>count = {{ count }}</p>
        <h4>變動紀錄</h4>
        <ul>
          <li v-for="(line, i) in countLogs" :key="i">{{ line }}</li>
        </ul>
        <p class="hint">
          初始載入就跑了一次（oldVal 是 undefined）。
          沒加 immediate 的話清單一開始會是空的。
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useCounter } from '@/composables/useCounter'

// 同一個 composable，呼叫兩次 → 得到兩份完全獨立的狀態
const a = useCounter(0, 1)
const b = useCounter(100, 10)
</script>

<template>
  <section>
    <h2>1. useCounter — 同一份邏輯、兩份獨立狀態</h2>
    <p class="hint">
      A 跟 B 都呼叫 <code>useCounter()</code>，但點 A 的按鈕不會影響 B。
      這是 composable 跟「全域 store」最大的差別。
    </p>

    <div class="row">
      <div class="card">
        <h3>Counter A（初始 0、step 1）</h3>
        <p class="value">{{ a.count }}</p>
        <button @click="a.increment">+1</button>
        <button @click="a.decrement">-1</button>
        <button @click="a.reset">reset</button>
      </div>

      <div class="card">
        <h3>Counter B（初始 100、step 10）</h3>
        <p class="value">{{ b.count }}</p>
        <button @click="b.increment">+10</button>
        <button @click="b.decrement">-10</button>
        <button @click="b.reset">reset</button>
      </div>
    </div>
  </section>
</template>

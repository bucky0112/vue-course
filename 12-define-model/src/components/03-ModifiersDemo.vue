<script setup>
import { ref } from 'vue'
import CapitalizeInput from './03-CapitalizeInput.vue'

const nameRaw = ref('')
const nameCapitalized = ref('')
</script>

<template>
  <section>
    <h2>3. 自訂 v-model 修飾子（<code>.capitalize</code>）</h2>
    <p class="hint">
      <code>defineModel</code> 解構出來的第二個值是 <code>modifiers</code>，
      可以判斷父元件 v-model 上加了哪些 <code>.xxx</code> 修飾子。
      範例：輸入 "alice" → 自動變成 "Alice"。
    </p>

    <div class="row">
      <div class="card">
        <h3>不加修飾子</h3>
        <pre>&lt;CapitalizeInput v-model="name" /&gt;</pre>
        <CapitalizeInput v-model="nameRaw" />
        <p>結果：「<strong>{{ nameRaw }}</strong>」</p>
        <p class="hint">原樣傳回父元件。</p>
      </div>

      <div class="card">
        <h3>加上 <code>.capitalize</code></h3>
        <pre>&lt;CapitalizeInput v-model.capitalize="name" /&gt;</pre>
        <CapitalizeInput v-model.capitalize="nameCapitalized" />
        <p>結果：「<strong>{{ nameCapitalized }}</strong>」</p>
        <p class="hint">首字母自動大寫。</p>
      </div>
    </div>
  </section>
</template>

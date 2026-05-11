<script setup>
import { ref, useTemplateRef } from 'vue'

// 舊寫法（Vue 3.0 – 3.4）：先宣告一個 ref(null)，template 用 ref="變數名"
const oldInput = ref(null)

// 新寫法（Vue 3.5+）：useTemplateRef('id')，template 用 ref="id"
const newInput = useTemplateRef('new-style-id')

const focusOld = () => oldInput.value?.focus()
const focusNew = () => newInput.value?.focus()
</script>

<template>
  <section>
    <h2>4. 舊寫法 vs <code>useTemplateRef</code>（Vue 3.5+）</h2>
    <p class="hint">
      兩種寫法都可以用、功能完全一樣，但 <code>useTemplateRef</code> 是 Vue 3.5 引入的建議寫法。
      新專案優先用新寫法；維護舊專案時要看得懂舊寫法。
    </p>

    <div class="row">
      <div class="card">
        <h3>舊寫法</h3>
        <pre>const input = ref(null)

&lt;input ref="input" /&gt;</pre>
        <input ref="oldInput" type="text" placeholder="舊式 ref" />
        <button @click="focusOld">focus</button>
      </div>

      <div class="card">
        <h3>新寫法（Vue 3.5+）</h3>
        <pre>const input = useTemplateRef('my-id')

&lt;input ref="my-id" /&gt;</pre>
        <input ref="new-style-id" type="text" placeholder="useTemplateRef" />
        <button @click="focusNew">focus</button>
      </div>
    </div>

    <p class="hint">
      新寫法的優點：(1) 變數名跟 template ref 名稱解耦、
      (2) 一眼看出「這個變數是 template ref，不是一般狀態 ref」、
      (3) TypeScript 推導更精確（可指定元素類型）。
    </p>
  </section>
</template>

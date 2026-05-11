<script setup>
import { ref } from 'vue'

const count = ref(0)

const increment = () => {
  count.value++
}

const decrement = () => {
  count.value--
}

const reset = () => {
  count.value = 0
}

// 用 defineExpose 主動公開要被外部存取的方法跟狀態。
// 如果沒寫 defineExpose，父元件透過 ref 拿到的會是空物件——
// 這是 <script setup> 預設「封閉」的設計（為了避免意外洩露內部實作）。
//
// defineExpose 在第 11 章「元件基礎」會更完整介紹，本章只示範它跟 useTemplateRef 的搭配。
defineExpose({
  count,
  increment,
  decrement,
  reset,
})
</script>

<template>
  <div class="card">
    <h3>子元件：ChildCounter</h3>
    <p class="value">{{ count }}</p>
    <p class="hint">
      此元件已用 <code>defineExpose</code> 公開：<br />
      <code>count</code> / <code>increment</code> / <code>decrement</code> / <code>reset</code>
    </p>
  </div>
</template>

<script setup>
import CounterLongHand from './CounterLongHand.vue'
import CounterShortHand from './CounterShortHand.vue'
</script>

<template>
  <section>
    <h2>1. <code>&lt;script setup&gt;</code> 與傳統寫法對照</h2>
    <p class="hint">
      兩個元件做完全一樣的事，但右邊的程式碼少了三層樣板碼：
      <code>export default</code>、<code>setup()</code>、<code>return</code>。
      <strong>本課程後續所有範例都用 <code>&lt;script setup&gt;</code>。</strong>
    </p>

    <div class="row">
      <CounterLongHand />
      <CounterShortHand />
    </div>
  </section>
</template>

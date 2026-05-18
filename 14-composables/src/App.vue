<script setup>
import CounterDemo from '@/components/01-CounterDemo.vue'
import MouseDemo from '@/components/02-MouseDemo.vue'
import LocalStorageDemo from '@/components/03-LocalStorageDemo.vue'
import FetchDemo from '@/components/04-FetchDemo.vue'
import BeforeRefactor from '@/components/05-Refactor/BeforeRefactor.vue'
import AfterRefactorA from '@/components/05-Refactor/AfterRefactorA.vue'
import AfterRefactorB from '@/components/05-Refactor/AfterRefactorB.vue'
</script>

<template>
  <h1>14 — Composables（組合式函式）</h1>
  <p class="hint">
    請對照 <code>README.md</code> 一起閱讀。每個範例都是獨立的、可以單獨理解。
  </p>

  <CounterDemo />
  <MouseDemo />
  <LocalStorageDemo />
  <FetchDemo />

  <section>
    <h2>5. 重構實戰：useTodoList 跨元件重用</h2>
    <p class="hint">
      左：邏輯寫在元件內。右：抽成 composable 後，被兩個樣式不同的元件共用。
      在右邊兩個元件分別新增項目，可以看到它們各自維護獨立狀態。
    </p>
    <div class="row">
      <BeforeRefactor />
      <AfterRefactorA />
      <AfterRefactorB />
    </div>
  </section>
</template>

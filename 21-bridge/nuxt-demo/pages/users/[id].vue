<script setup>
// useRoute 是 Nuxt 自動 import 的（不用 import { useRoute } from 'vue-router'）
const route = useRoute()
</script>

<template>
  <main>
    <h2>User {{ route.params.id }}</h2>
    <p>動態路由：檔名 <code>pages/users/[id].vue</code> → URL <code>/users/:id</code>。</p>
    <p>方括號內就是參數名，<code>route.params.id</code> 取值。</p>
    <p class="hint">
      💡 注意上面的 <code>useRoute()</code> — 沒寫 import 也能用。Nuxt 預設會 auto-import
      composables、components、utils；學完前 20 章習慣 <code>import { useRoute } from 'vue-router'</code>
      之後，這裡會少一行讓你不太習慣，但這就是 Nuxt 的「魔法」之一。
    </p>
  </main>
</template>

<style scoped>
main {
  padding: 1rem 0;
}
code {
  background: #f6f8fa;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 0.9em;
}
.hint {
  margin-top: 2rem;
  padding: 1rem;
  background: #fff8e6;
  border-left: 3px solid #f0b400;
  border-radius: 4px;
  font-size: 0.95em;
  line-height: 1.6;
}
</style>

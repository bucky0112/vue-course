<script setup>
import Counter from './components/Counter.vue'
import CounterOptions from './components/CounterOptions.vue'
import ProductList from './components/ProductList.vue'
import ShoppingCart from './components/ShoppingCart.vue'
import PostList from './components/PostList.vue'
import PreferencesPanel from './components/PreferencesPanel.vue'
</script>

<template>
  <main>
    <h1>18 — Pinia</h1>

    <section>
      <h2>1. Setup store vs Options store</h2>
      <p class="hint">同一個 counter 兩種寫法。對外行為一樣，內部結構不同。</p>
      <div class="row">
        <Counter />
        <CounterOptions />
      </div>
    </section>

    <section>
      <h2>2. 跨 store 引用（cart 引用 products）</h2>
      <p class="hint">cart store 在 action 中呼叫 products store，示範 store 之間如何依賴。</p>
      <div class="row">
        <ProductList />
        <ShoppingCart />
      </div>
    </section>

    <section>
      <h2>3. Action 中呼叫 API（呼應第 17 章）</h2>
      <p class="hint">把 fetch 邏輯 + loading/error/data 三態都收進 store，多元件共用。</p>
      <PostList />
    </section>

    <section>
      <h2>4. Persistedstate plugin</h2>
      <p class="hint">設定 <code>persist: true</code>，整個 store 自動同步到 localStorage。</p>
      <PreferencesPanel />
    </section>
  </main>
</template>

<style scoped>
main {
  max-width: 960px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: system-ui, -apple-system, sans-serif;
}
h1 {
  border-bottom: 2px solid #42b883;
  padding-bottom: 0.5rem;
}
section {
  margin: 2rem 0;
}
h2 {
  margin-bottom: 0.25rem;
}
.hint {
  margin: 0 0 1rem;
  color: #6e7681;
  font-size: 0.9rem;
}
.row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
.row > * {
  flex: 1 1 280px;
}
code {
  background: #f6f8fa;
  padding: 1px 4px;
  border-radius: 3px;
  color: #d1242f;
  font-size: 0.9em;
}
</style>

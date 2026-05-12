<script setup>
import { ref, watch, watchEffect } from 'vue'

// 同一個任務，兩種寫法
const keyword = ref('')

// 寫法 A：watch
const watchHits = ref(0)
watch(keyword, (newVal, oldVal) => {
  watchHits.value++
  console.log(`[watch] "${oldVal}" → "${newVal}"`)
})

// 寫法 B：watchEffect
const effectHits = ref(0)
watchEffect(() => {
  // 一進來就會跑一次
  effectHits.value++
  console.log(`[watchEffect] current="${keyword.value}"`)
})
</script>

<template>
  <section>
    <h2>5. <code>watch</code> vs <code>watchEffect</code> 對照</h2>
    <p class="hint">
      同一個目標：「<code>keyword</code> 變動時做點事」。兩種寫法都可以，
      但<strong>觸發時機</strong>跟<strong>能拿到的資訊</strong>不同。
    </p>

    <div class="card">
      <label>keyword: <input v-model="keyword" placeholder="打點什麼..." /></label>
      <p>
        watch 觸發次數：<strong>{{ watchHits }}</strong>
        watchEffect 觸發次數：<strong>{{ effectHits }}</strong>
      </p>
      <p class="hint">
        頁面剛載入時：watch = 0，watchEffect = 1（已立即執行一次）。
        每打一個字：兩個都 +1。
      </p>
    </div>

    <h3>該用哪個？</h3>
    <div class="row">
      <div class="card">
        <h4>用 <code>watch</code> 當...</h4>
        <ul>
          <li>需要拿 <code>oldVal</code> 跟 <code>newVal</code></li>
          <li>只想在 source 真的變動時才執行</li>
          <li>來源很明確、不會多變</li>
          <li>不希望初始掛載時就跑</li>
        </ul>
        <p class="hint">例如：表單變動後送出 API、watch route 變動。</p>
      </div>

      <div class="card">
        <h4>用 <code>watchEffect</code> 當...</h4>
        <ul>
          <li>callback 用到一堆 ref，懶得一個個列在 source</li>
          <li>「副作用」性質的：同步 DOM、Log、寫入 localStorage</li>
          <li>希望掛載時就執行一次</li>
          <li>條件式依賴（不同 if 分支用不同 ref）</li>
        </ul>
        <p class="hint">例如：同步狀態到 document.title、把資料寫進 localStorage。</p>
      </div>
    </div>
  </section>
</template>

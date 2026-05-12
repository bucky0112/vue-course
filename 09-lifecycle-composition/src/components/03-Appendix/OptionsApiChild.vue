<script>
// 這是 Options API 寫法，僅用於對照——本課程主軸是 Composition API
export default {
  data() {
    return {
      counter: 0,
      events: [],
    }
  },

  // 1️⃣ beforeCreate / created：Composition API 沒有對應 hook
  //    setup() / <script setup> 本身已經取代它們
  beforeCreate() {
    // ⚠️ 此時 data / methods 還沒準備好
    console.log('[Options] beforeCreate (Composition API 無對應 hook)')
  },
  created() {
    // ✅ data / methods 已可用，但 DOM 還沒掛載
    console.log('[Options] created (Composition API 無對應 hook)')
    this.events.push('created (Composition API 無對應)')
  },

  // 2️⃣ 以下六個跟 Composition API 一對一對應
  beforeMount() {
    console.log('[Options] beforeMount → onBeforeMount')
    this.events.push('beforeMount → onBeforeMount')
  },
  mounted() {
    console.log('[Options] mounted → onMounted')
    this.events.push('mounted → onMounted')
  },
  beforeUpdate() {
    console.log('[Options] beforeUpdate → onBeforeUpdate')
  },
  updated() {
    console.log('[Options] updated → onUpdated')
  },
  beforeUnmount() {
    console.log('[Options] beforeUnmount → onBeforeUnmount')
  },
  unmounted() {
    console.log('[Options] unmounted → onUnmounted')
  },

  methods: {
    increment() {
      this.counter++
    },
  },
}
</script>

<template>
  <div class="card">
    <h3>子元件（Options API）</h3>
    <p class="value">counter = {{ counter }}</p>
    <button @click="increment">+1</button>

    <h4>Lifecycle 事件紀錄</h4>
    <ul>
      <li v-for="(e, i) in events" :key="i">{{ e }}</li>
    </ul>
    <p class="hint">
      Options API 有 8 個 hook；Composition API 對應 6 個——
      <code>beforeCreate</code> / <code>created</code> 被 <code>&lt;script setup&gt;</code> 本身吸收掉了。
    </p>
  </div>
</template>

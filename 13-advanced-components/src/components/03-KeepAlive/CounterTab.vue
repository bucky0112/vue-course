<script setup>
import { ref, onMounted, onActivated, onDeactivated } from 'vue'

const count = ref(0)
const mountCount = ref(0)
const activatedCount = ref(0)

// onMounted：元件第一次掛載時觸發
onMounted(() => {
  mountCount.value++
  console.log('[CounterTab] mounted')
})

// onActivated / onDeactivated：只有在 <KeepAlive> 內才會觸發
// 用來偵測「被切回 / 被切走」
onActivated(() => {
  activatedCount.value++
  console.log('[CounterTab] activated')
})

onDeactivated(() => {
  console.log('[CounterTab] deactivated')
})
</script>

<template>
  <div class="tab-content">
    <h4>📊 Counter Tab</h4>
    <p class="value">{{ count }}</p>
    <button @click="count++">+1</button>
    <p class="hint">
      mount 次數：<strong>{{ mountCount }}</strong>
      activated 次數：<strong>{{ activatedCount }}</strong>
    </p>
    <p class="hint">
      點 +1 後切到另一個 tab、再切回來，看 <code>count</code> 跟 <code>mount</code> 次數有沒有變。
    </p>
  </div>
</template>

<style scoped>
.tab-content {
  padding: 12px;
  background: #f9f9f9;
  border-radius: 4px;
  margin-top: 8px;
}
</style>

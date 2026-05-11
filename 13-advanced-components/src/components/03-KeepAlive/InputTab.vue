<script setup>
import { ref, onMounted } from 'vue'

const text = ref('')
const mountCount = ref(0)

onMounted(() => {
  mountCount.value++
  console.log('[InputTab] mounted')
})
</script>

<template>
  <div class="tab-content">
    <h4>✏️ Input Tab</h4>
    <input v-model="text" placeholder="輸入點什麼..." />
    <p>你輸入的：「<strong>{{ text }}</strong>」</p>
    <p class="hint">mount 次數：<strong>{{ mountCount }}</strong></p>
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

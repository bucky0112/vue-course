<script setup>
import { ref, onMounted } from 'vue'

// 假裝這是個很重的圖表元件，初始化時做了一些計算
const datapoints = ref([])

onMounted(() => {
  for (let i = 0; i < 50; i++) {
    datapoints.value.push(Math.sin(i / 4) * 30 + 50)
  }
})
</script>

<template>
  <div class="card">
    <h4>📊 Heavy Chart 元件（用 defineAsyncComponent 載入）</h4>
    <div class="chart">
      <div
        v-for="(v, i) in datapoints"
        :key="i"
        class="bar"
        :style="{ height: v + 'px' }"
      ></div>
    </div>
    <p class="hint">這個元件的 JS 是另外切出的 chunk，第一次顯示時才下載。</p>
  </div>
</template>

<style scoped>
.chart {
  display: flex;
  gap: 2px;
  align-items: flex-end;
  height: 100px;
  background: #f0f8ff;
  padding: 8px;
  border-radius: 4px;
}
.bar {
  flex: 1;
  background: #42b983;
  border-radius: 2px 2px 0 0;
}
</style>

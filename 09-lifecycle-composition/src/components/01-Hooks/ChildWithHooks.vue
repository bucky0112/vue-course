<script setup>
import {
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
} from 'vue'

const counter = ref(0)

// 把 log 訊息收集起來顯示在畫面上（同時也 console.log）
const events = ref([])

const log = (stage, note = '') => {
  const line = `${stage}${note ? ' — ' + note : ''}`
  console.log(`[Lifecycle] ${line}`)
  events.value.push(line)
}

onBeforeMount(() => log('onBeforeMount', 'DOM 即將掛載；template 還未渲染'))
onMounted(() => log('onMounted', 'DOM 已掛載；可安全取 DOM 元素'))
onBeforeUpdate(() => log('onBeforeUpdate', `counter 即將從 ${counter.value} 變為 ${counter.value + 1}`))
onUpdated(() => log('onUpdated', `counter 已更新為 ${counter.value}`))
onBeforeUnmount(() => log('onBeforeUnmount', '元件即將卸載；最後機會清理'))
onUnmounted(() => log('onUnmounted', '元件已卸載；只能在 console 看（畫面已消失）'))
</script>

<template>
  <div class="card">
    <h3>子元件（Composition API）</h3>
    <p class="value">counter = {{ counter }}</p>
    <button @click="counter++">+1（觸發 update）</button>

    <h4>Lifecycle 事件紀錄</h4>
    <ul>
      <li v-for="(e, i) in events" :key="i">{{ e }}</li>
    </ul>
    <p class="hint">
      也請打開 DevTools console 對照。
      <strong>onUnmounted</strong> 觸發時畫面已不見，只能從 console 看。
    </p>
  </div>
</template>

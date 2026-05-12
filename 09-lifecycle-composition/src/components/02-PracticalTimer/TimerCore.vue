<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const seconds = ref(0)
let intervalId = null

onMounted(() => {
  console.log('[Timer] mounted — 啟動 setInterval')
  intervalId = setInterval(() => {
    seconds.value++
  }, 1000)
})

onUnmounted(() => {
  console.log('[Timer] unmounted — 清掉 setInterval（很重要！）')
  clearInterval(intervalId)
})

const reset = () => {
  seconds.value = 0
}
</script>

<template>
  <div class="card">
    <h3>計時器子元件</h3>
    <p class="value">{{ seconds }} 秒</p>
    <button @click="reset">reset</button>
    <p class="hint">
      <code>setInterval</code> 在 <code>onMounted</code> 啟動、在 <code>onUnmounted</code> 清掉。
      <strong>沒清的話：</strong>元件卸載後 timer 還在跑，
      持續修改已 unmount 元件的 ref → 記憶體洩漏 + 「Cannot read properties of null」錯誤。
    </p>
  </div>
</template>

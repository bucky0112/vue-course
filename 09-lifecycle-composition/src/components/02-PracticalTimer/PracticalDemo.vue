<script setup>
import { ref } from 'vue'
import TimerCore from './TimerCore.vue'

const isRunning = ref(true)
</script>

<template>
  <section>
    <h2>2. 實戰：為什麼一定要在 unmount 清理</h2>
    <p class="hint">
      99% 的 <code>onUnmounted</code> 用途都是「清掉 mount 時建立的資源」：
      <code>setInterval</code> / <code>setTimeout</code>、<code>addEventListener</code>、
      WebSocket 連線、第三方函式庫的 destroy 方法等。
    </p>

    <div class="card">
      <button @click="isRunning = !isRunning">
        {{ isRunning ? '卸載計時器' : '掛載計時器' }}
      </button>
      <p class="hint">
        卸載計時器後打開 console 看 log。<strong>沒看到 "清掉 setInterval"
        但秒數還在跑</strong>，就是 bug。
      </p>
    </div>

    <TimerCore v-if="isRunning" />
  </section>
</template>

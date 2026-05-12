<script setup>
import ThreeStates from '@/components/01-ThreeStates.vue'
import RaceCondition from '@/components/02-RaceCondition.vue'
import Retry from '@/components/03-Retry.vue'
import Axios from '@/components/04-Axios.vue'
</script>

<template>
  <h1>17 — API 串接</h1>
  <p class="hint">
    請對照 <code>README.md</code> 一起閱讀。本章處理「生產等級」的 API 議題：
    競態、取消、重試、interceptors。
  </p>

  <ThreeStates />
  <RaceCondition />
  <Retry />
  <Axios />
</template>

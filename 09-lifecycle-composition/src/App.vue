<script setup>
import HooksDemo from '@/components/01-Hooks/HooksDemo.vue'
import PracticalDemo from '@/components/02-PracticalTimer/PracticalDemo.vue'
import AppendixDemo from '@/components/03-Appendix/AppendixDemo.vue'
</script>

<template>
  <h1>09 — 生命週期</h1>
  <p class="hint">
    請對照 <code>README.md</code> 一起閱讀。
    <strong>記得打開 DevTools console</strong>，多數 lifecycle 訊息只在 console 看得到。
  </p>

  <HooksDemo />
  <PracticalDemo />
  <AppendixDemo />
</template>

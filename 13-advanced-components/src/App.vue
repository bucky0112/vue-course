<script setup>
import ModalDemo from '@/components/01-Teleport/ModalDemo.vue'
import SuspenseDemo from '@/components/02-Suspense/SuspenseDemo.vue'
import KeepAliveDemo from '@/components/03-KeepAlive/KeepAliveDemo.vue'
</script>

<template>
  <h1>13 — 元件進階</h1>
  <p class="hint">請對照 <code>README.md</code> 一起閱讀。三大主題：Teleport、Suspense、KeepAlive。</p>

  <ModalDemo />
  <SuspenseDemo />
  <KeepAliveDemo />
</template>

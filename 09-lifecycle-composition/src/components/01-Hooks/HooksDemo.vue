<script setup>
import { ref } from 'vue'
import ChildWithHooks from './ChildWithHooks.vue'

const isShow = ref(true)
</script>

<template>
  <section>
    <h2>1. Composition API 生命週期 hooks</h2>
    <p class="hint">
      六個常用 hook：
      <code>onBeforeMount</code> / <code>onMounted</code> /
      <code>onBeforeUpdate</code> / <code>onUpdated</code> /
      <code>onBeforeUnmount</code> / <code>onUnmounted</code>。
    </p>

    <div class="card">
      <button @click="isShow = !isShow">
        {{ isShow ? '卸載子元件' : '掛載子元件' }}
      </button>
      <p class="hint">點按鈕觀察 mount / unmount cycle。打開 DevTools console 看完整 log。</p>
    </div>

    <ChildWithHooks v-if="isShow" />
  </section>
</template>

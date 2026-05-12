<script setup>
import AlreadyWrote from '@/components/01-AlreadyWrote.vue'
import LocalStorageDemo from '@/components/02-LocalStorageDemo.vue'
import DebouncedSearch from '@/components/03-DebouncedSearch.vue'
import DarkMode from '@/components/04-DarkMode.vue'
import Clipboard from '@/components/05-Clipboard.vue'
</script>

<template>
  <h1>15 — VueUse 實戰</h1>
  <p class="hint">
    請對照 <code>README.md</code> 一起閱讀。
    第 4 個範例 (<code>useDark</code>) 會切換整個頁面的配色。
  </p>

  <AlreadyWrote />
  <LocalStorageDemo />
  <DebouncedSearch />
  <DarkMode />
  <Clipboard />
</template>

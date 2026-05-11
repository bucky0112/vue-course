<script setup>
import ScriptSetupCompare from '@/components/01-ScriptSetup/ScriptSetupCompare.vue'
import RefBasics from '@/components/02-RefBasics.vue'
import ReactiveBasics from '@/components/03-ReactiveBasics.vue'
import ReactiveTraps from '@/components/04-ReactiveTraps.vue'
import RefactoredCounter from '@/components/05-RefactoredCounter.vue'
</script>

<template>
  <h1>06 — Composition API 基礎</h1>
  <p class="hint">請對照 <code>README.md</code> 一起閱讀。每個範例都可獨立理解。</p>

  <ScriptSetupCompare />
  <RefBasics />
  <ReactiveBasics />
  <ReactiveTraps />
  <RefactoredCounter />
</template>

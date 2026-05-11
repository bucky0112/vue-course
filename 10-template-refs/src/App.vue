<script setup>
import FocusInputDemo from '@/components/01-FocusInputDemo.vue'
import ScrollToDemo from '@/components/02-ScrollToDemo.vue'
import ParentControl from '@/components/03-ChildAccess/ParentControl.vue'
import OldVsNew from '@/components/04-OldVsNew.vue'
</script>

<template>
  <h1>10 — Template Refs</h1>
  <p class="hint">請對照 <code>README.md</code> 一起閱讀。</p>

  <FocusInputDemo />
  <ScrollToDemo />
  <ParentControl />
  <OldVsNew />
</template>

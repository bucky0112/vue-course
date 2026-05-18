<script setup>
import { useMouse } from '@/composables/useMouse'

const { x, y } = useMouse()
</script>

<template>
  <section>
    <h2>2. useMouse — 把副作用包進 composable</h2>
    <p class="hint">
      <code>onMounted</code> / <code>onUnmounted</code> 直接寫在 composable 內，
      使用端不需要自己處理 <code>addEventListener</code> / <code>removeEventListener</code>。
      這就是 Composition API 的「邏輯內聚」優勢——相關的程式碼寫在一起。
    </p>

    <div class="card">
      <p>滑鼠位置：x = <strong>{{ x }}</strong>, y = <strong>{{ y }}</strong></p>
      <p class="hint">移動滑鼠看數字變化。</p>
    </div>
  </section>
</template>

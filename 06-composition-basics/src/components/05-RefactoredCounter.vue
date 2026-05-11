<script setup>
import { ref, computed } from 'vue'

// 把第 02 章的 CDN 計數器，改寫成 SFC + Composition API。
// 對照 README 的「CDN 起點 vs SFC 終點」。
const count = ref(0)
const step = ref(1)

const increment = () => {
  count.value += step.value
}

const decrement = () => {
  count.value -= step.value
}

const reset = () => {
  count.value = 0
}

const doubled = computed(() => count.value * 2)
const status = computed(() => {
  if (count.value > 0) return '正'
  if (count.value < 0) return '負'
  return '零'
})
</script>

<template>
  <section>
    <h2>5. 實戰：把 CDN 計數器改寫成 SFC + Composition API</h2>
    <p class="hint">
      原本 CDN 版本要寫 <code>createApp({ data() {...}, methods: {...} })</code>，
      改成 SFC + <code>&lt;script setup&gt;</code> 後變得更直覺。
      請對照 README 中的兩種寫法。
    </p>

    <div class="card">
      <p class="value">{{ count }}</p>
      <p>
        doubled = <strong>{{ doubled }}</strong>
        狀態 = <strong>{{ status }}</strong>
      </p>
      <label>
        步進值：
        <input type="number" v-model.number="step" />
      </label>
      <div>
        <button @click="increment">+{{ step }}</button>
        <button @click="decrement">-{{ step }}</button>
        <button @click="reset">reset</button>
      </div>
    </div>
  </section>
</template>

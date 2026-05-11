<script setup>
// Vue 3.2+ 的 <script setup> 語法糖：
// 1. 直接寫 script，不用 export default
// 2. 不用包 setup() function
// 3. 不用 return——所有 top-level 變數自動暴露給 template
import { ref } from 'vue'

const count = ref(0)
const increment = () => {
  count.value++
}
</script>

<template>
  <div class="card">
    <h3>Short Hand：<code>&lt;script setup&gt;</code> 寫法</h3>
    <p class="value">{{ count }}</p>
    <button @click="increment">+1</button>
    <pre>&lt;script setup&gt;
import { ref } from 'vue'

const count = ref(0)
const increment = () =&gt; { count.value++ }
&lt;/script&gt;</pre>
  </div>
</template>

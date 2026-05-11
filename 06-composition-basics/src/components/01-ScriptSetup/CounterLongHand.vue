<template>
  <div class="card">
    <h3>Long Hand：傳統 setup() 寫法</h3>
    <p class="value">{{ count }}</p>
    <button @click="increment">+1</button>
    <pre>&lt;script&gt;
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const increment = () =&gt; { count.value++ }
    return { count, increment }
  }
}
&lt;/script&gt;</pre>
  </div>
</template>

<script>
import { ref } from 'vue'

// 這是 Vue 3.0 / 3.1 的傳統 Composition API 寫法：
// 1. 用 export default
// 2. 寫一個 setup() function
// 3. 把要給 template 用的東西手動 return 出來
export default {
  setup() {
    const count = ref(0)
    const increment = () => {
      count.value++
    }
    return { count, increment }
  },
}
</script>

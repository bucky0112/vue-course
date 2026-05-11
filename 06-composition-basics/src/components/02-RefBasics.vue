<script setup>
import { ref } from 'vue'

const count = ref(0)
const message = ref('hello')
const isActive = ref(false)

const increment = () => {
  count.value++ // 在 script 內：要寫 .value
}

const appendBang = () => {
  message.value = message.value + '!'
}

const toggle = () => {
  isActive.value = !isActive.value
}
</script>

<template>
  <section>
    <h2>2. <code>ref</code> — 基本型別的響應式包裝</h2>
    <p class="hint">
      <code>ref()</code> 把任何值包成「響應式參考」。在 <strong>script 內</strong> 取值或改值要寫
      <code>.value</code>，但 <strong>template 內</strong> Vue 會自動展開、不用寫。
    </p>

    <div class="card">
      <h3>數字</h3>
      <p>count = <strong>{{ count }}</strong>（template 內：直接寫 <code>count</code>）</p>
      <button @click="increment">increment（script 內：<code>count.value++</code>）</button>
    </div>

    <div class="card">
      <h3>字串</h3>
      <p>message = <strong>{{ message }}</strong></p>
      <button @click="appendBang">append !</button>
    </div>

    <div class="card">
      <h3>布林值</h3>
      <p>isActive = <strong>{{ isActive }}</strong></p>
      <button @click="toggle">toggle</button>
    </div>
  </section>
</template>

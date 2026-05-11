<script setup>
import { ref, computed } from 'vue'
import NameForm from './02-NameForm.vue'

const first = ref('Alice')
const last = ref('Wang')

const fullName = computed(() => `${first.value} ${last.value}`.trim())

const swap = () => {
  ;[first.value, last.value] = [last.value, first.value]
}

const setDefault = () => {
  first.value = 'Default'
  last.value = 'Name'
}
</script>

<template>
  <section>
    <h2>2. 多個 v-model 同時綁定</h2>
    <p class="hint">
      同一個元件可以有多個 v-model，用 <code>v-model:propName</code> 區分。
      注意是<strong>冒號</strong>，不是點。
    </p>

    <NameForm v-model:firstName="first" v-model:lastName="last" />

    <div class="card">
      <h3>父元件即時狀態</h3>
      <p>First: <strong>{{ first }}</strong></p>
      <p>Last: <strong>{{ last }}</strong></p>
      <p>Full name: <strong>{{ fullName }}</strong></p>
      <button @click="swap">交換 first / last</button>
      <button @click="setDefault">重設為 Default Name</button>
      <p class="hint">點按鈕從父元件改值，會即時反映到子元件 input。</p>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import ManualInput from './ManualInput.vue'
import ModelInput from './ModelInput.vue'

const oldValue = ref('')
const newValue = ref('')
</script>

<template>
  <section>
    <h2>1. 舊式 <code>props + emit</code> vs <code>defineModel</code></h2>
    <p class="hint">
      兩個元件對<strong>外部</strong>行為一致——父元件都是 <code>v-model="x"</code> 用法。
      但內部實作差很多：左邊樣板碼一大坨，右邊一行。
    </p>

    <div class="row">
      <div class="card">
        <h3>舊式：手動 props + emit</h3>
        <ManualInput v-model="oldValue" />
        <p>父元件接到的值：「<strong>{{ oldValue }}</strong>」</p>
        <pre>// ManualInput.vue
defineProps({ modelValue: String })
defineEmits(['update:modelValue'])

&lt;input
  :value="modelValue"
  @input="$emit(
    'update:modelValue',
    $event.target.value
  )"
/&gt;</pre>
      </div>

      <div class="card">
        <h3>新式：<code>defineModel()</code> (Vue 3.4+)</h3>
        <ModelInput v-model="newValue" />
        <p>父元件接到的值：「<strong>{{ newValue }}</strong>」</p>
        <pre>// ModelInput.vue
const model = defineModel()

&lt;input v-model="model" /&gt;</pre>
      </div>
    </div>
  </section>
</template>

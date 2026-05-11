<script setup>
import { useTemplateRef } from 'vue'
import ChildCounter from './ChildCounter.vue'

// 對「子元件」用 useTemplateRef，拿到的 .value 是子元件實例
// 上面能讀到的東西，就是子元件 defineExpose 公開出來的內容
const childRef = useTemplateRef('child-counter')

const callIncrement = () => childRef.value?.increment()
const callDecrement = () => childRef.value?.decrement()
const callReset = () => childRef.value?.reset()
const readCount = () => {
  // count 是 ref，所以要 .value
  alert(`子元件目前的 count = ${childRef.value?.count}`)
}
</script>

<template>
  <section>
    <h2>3. 取得子元件實例</h2>
    <p class="hint">
      <code>useTemplateRef</code> 也能掛在子元件上。
      但子元件必須用 <code>defineExpose</code> 主動公開要被存取的內容
      （沒寫的話 <code>.value</code> 會是空物件）。
    </p>

    <p class="hint">
      ⚠️ <strong>實務建議</strong>：父子溝通優先用 <code>props</code> / <code>emit</code>
      （第 11 章）。Template ref 只在「必須命令式呼叫」時用，例如：<br />
      呼叫 <code>&lt;video&gt;</code> 元件的 <code>play()</code>、
      清空 modal 內表單、重新驗證表單等。
    </p>

    <ChildCounter ref="child-counter" />

    <div class="card">
      <h3>父元件控制按鈕</h3>
      <button @click="callIncrement">叫子元件 +1</button>
      <button @click="callDecrement">叫子元件 -1</button>
      <button @click="callReset">叫子元件 reset</button>
      <button @click="readCount">讀子元件 count</button>
    </div>
  </section>
</template>

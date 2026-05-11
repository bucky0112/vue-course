<script setup>
import { useTemplateRef, onMounted } from 'vue'

// useTemplateRef('id') 透過字串 ID 對應 template 上的 ref="id"
// 元件 mount 完成後，.value 會指向對應的 DOM 元素
const inputRef = useTemplateRef('username-input')

onMounted(() => {
  inputRef.value?.focus()
})

const refocus = () => {
  inputRef.value?.focus()
  inputRef.value?.select()
}
</script>

<template>
  <section>
    <h2>1. Focus Input — Template Ref 最基本的用法</h2>
    <p class="hint">
      頁面打開時，這個輸入框會自動取得焦點。
      取得 DOM 後，可以呼叫任何原生 API（<code>focus()</code>、<code>select()</code>、
      <code>scrollIntoView()</code> 等）。
    </p>

    <div class="card">
      <label>
        使用者名稱：
        <input ref="username-input" type="text" placeholder="頁面載入時自動 focus..." />
      </label>
      <p class="hint">點別處讓焦點消失後，按這個按鈕重新 focus 並選取所有文字：</p>
      <button @click="refocus">重新 focus + 全選</button>
    </div>
  </section>
</template>

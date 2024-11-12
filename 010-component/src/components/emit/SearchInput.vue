<script setup>
// 1. 定義 props: 
// - placeholder (可選，預設值為 "請輸入搜尋關鍵字")
// const props = defineProps({
//   placeholder: {
//     type: String,
//     default: "請輸入搜尋關鍵字"
//   }
// })

// console.log(props.placeholder)

// 2. 定義 emit 事件:
// - search: 當輸入內容改變時發送
// - clear: 當清空輸入時發送
const emit = defineEmits(['search', 'clear'])

// 3. 實作處理輸入的函式
const handleInputChange = (event) => {
  const value = event.target.value.trim()
  console.log(value)
  // 發送 search 事件並傳遞輸入值
  emit('search', value)
}

// 4. 實作清空輸入的函式
const handleClear = () => {
  // 清空輸入框
  // 注意：這裡我們需要手動清空輸入框的值，因為我們沒有使用 v-model
  const inputElement = document.querySelector('input')
  if (inputElement) {
    inputElement.value = ''
  }
  // 發送 clear 事件
  emit('clear')
}

</script>

<template>
  <div class="search-input">
    <!-- 5. 加入帶有清空按鈕的輸入框 -->
    <input type="text" placeholder="請輸入搜尋關鍵字" @input="handleInputChange" />
    <button @click="handleClear">清空</button>
  </div>
</template>

<style scoped>
.search-input {
  position: relative;
  width: 100%;
  max-width: 300px;
}

input {
  width: 100%;
  padding: 8px 32px 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.clear-button {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
}

.clear-button:hover {
  color: #333;
}
</style>
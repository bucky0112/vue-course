<script setup>
import { ref } from 'vue'
import SearchInput from './SearchInput.vue'

// 模擬的建議列表
const suggestions = [
  '蘋果手機',
  '蘋果筆電',
  '蘋果平板',
  '安卓手機',
  '安卓平板',
  '筆記型電腦',
  '桌上型電腦',
  '無線耳機',
  '藍牙耳機',
  '智慧手錶'
]

// 儲存搜尋結果
const searchResults = ref([])
// 是否顯示建議列表
const showSuggestions = ref(false)

// 6. 實作搜尋處理函式
const handleSearch = (keyword) => {
  console.log(keyword)
  // searchResults.value = suggestions.filter(suggestion => suggestion.includes(keyword))
  if (!keyword) {
    searchResults.value = []
    showSuggestions.value = false
    return
  }

  // 過濾符合關鍵字的建議
  // searchResults.value = suggestions.filter(item =>
  //   item.toLowerCase().includes(keyword.toLowerCase())
  // )
  searchResults.value = suggestions.filter(item =>
    item.includes(keyword)
  )
  showSuggestions.value = true
}

// 7. 實作清空處理函式
const handleClear = () => {
  // searchResults.value = []
  searchResults.value = []
  showSuggestions.value = false
}

const handleSelect = (item) => {
  console.log(item)
}

</script>

<template>
  <div class="container">
    <h2>商品搜尋</h2>
    <!-- 8. 加入 SearchInput 元件 -->
    <SearchInput @search="handleSearch" @clear="handleClear" />
    <!-- 9. 顯示搜尋建議 -->
    <!-- <ul class="suggestions">
      <li v-for="suggestion in searchResults" :key="suggestion" class="suggestion-item">{{ suggestion }}</li>
    </ul> -->

    <div v-if="showSuggestions && searchResults.length > 0" class="suggestions">
      <div v-for="(item, index) in searchResults" :key="index" class="suggestion-item" @click="handleSelect(item)">
        {{ item }}
      </div>
    </div>

    <!-- 無結果提示 -->
    <div v-else-if="showSuggestions && searchResults.length === 0" class="no-results">
      找不到相關建議
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.suggestions {
  margin-top: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
}

.suggestion-item {
  padding: 8px 12px;
  cursor: pointer;
}

.suggestion-item:hover {
  background-color: #f0f0f0;
}
</style>
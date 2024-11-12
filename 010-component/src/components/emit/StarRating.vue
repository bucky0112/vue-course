<script setup>
import { ref } from 'vue'

// 1. 定義 props:
// - initialRating (預設值為 0)
// - maxRating (預設值為 5)
// - allowHalf (預設值為 true)

// 2. 定義 emit 事件:
// - update-rating：評分變更時發送
// - hover：hover 預覽時發送

const hoverRating = ref(0)

// 3. 實作計算星星顯示狀態的函式
// 提示：需要判斷是完整星星、半星還是空星

// 4. 實作滑鼠 hover 處理函式
// 提示：需要支援半星判斷

// 5. 實作滑鼠離開處理函式

// 6. 實作點擊處理函式
// 提示：需要支援半星判斷

</script>

<template>
  <div 
    class="star-rating"
    @mouseleave="handleMouseLeave"
  >
    <!-- 7. 加入星星顯示邏輯 -->
    <!-- 提示：使用 v-for 渲染星星數量 -->
    
  </div>
</template>

<style scoped>
.star-rating {
  display: inline-flex;
  gap: 4px;
}

.star {
  font-size: 24px;
  cursor: pointer;
  color: #ffd700;
  position: relative;
}

.star-empty {
  color: #ccc;
}

.star-half {
  position: relative;
}

.star-half:before {
  content: '★';
  position: absolute;
  left: 0;
  width: 50%;
  overflow: hidden;
  color: #ffd700;
}

.star-half:after {
  content: '★';
  color: #ccc;
}
</style>
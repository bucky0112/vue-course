<script setup>
import { ref } from 'vue'
import StarRating from './StarRating.vue'

const currentRating = ref(0)
const hoverRating = ref(0)

// 8. 實作評分更新處理函式

// 9. 實作 hover 預覽處理函式

const items = [
  { id: 1, name: '商品 A', rating: 0 },
  { id: 2, name: '商品 B', rating: 0 },
  { id: 3, name: '商品 C', rating: 0 }
]

</script>

<template>
  <div class="container">
    <h2>商品評分</h2>
    <div 
      v-for="item in items" 
      :key="item.id"
      class="item"
    >
      <h3>{{ item.name }}</h3>
      <!-- 10. 加入 StarRating 元件 -->
      
      <p>當前評分：{{ item.rating }} 星</p>
      <p v-if="hoverRating">預覽評分：{{ hoverRating }} 星</p>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.item {
  margin-bottom: 20px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

h3 {
  margin: 0 0 12px 0;
}

p {
  margin: 8px 0;
}
</style>
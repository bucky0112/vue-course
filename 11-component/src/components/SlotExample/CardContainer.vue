<script setup>
import BaseCard from './BaseCard.vue'
</script>

<template>
  <BaseCard>
    <!-- 使用具名 slot -->
    <template #header>
      <h2 class="card-title">自訂標題</h2>
    </template>

    <!-- 預設 slot 內容 -->
    <p class="card-content">這是卡片的主要內容</p>
    
    <template v-slot:footer>
      <button class="btn">點擊按鈕</button>
    </template>
  </BaseCard>
</template>

<style scoped>
.card-title {
  color: blue;
}
.card-content {
  color: red;
}
.btn {
  background-color: green;
}
</style>

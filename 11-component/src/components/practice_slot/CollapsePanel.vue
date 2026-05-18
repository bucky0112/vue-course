<script setup>
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<template>
  <div class="panel">
    <div class="panel-header" @click="isOpen = !isOpen">
      <!-- 練習重點 1：使用具名 slot 來自訂標題 -->
      <slot name="title">
        <!-- 預設標題 -->
        預設標題
      </slot>
      <span class="arrow" :class="{ 'arrow-down': isOpen }">▼</span>
    </div>

    <!-- 練習重點 2：使用預設 slot 來放置內容 -->
    <div v-show="isOpen" class="panel-content">
      <slot>
        <!-- 預設內容 -->
        <p>預設內容</p>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.panel {
  border: 1px solid #ddd;
  border-radius: 4px;
  margin: 10px 0;
}

.panel-header {
  padding: 10px;
  background-color: #f5f5f5;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-content {
  padding: 15px;
}

.arrow {
  transition: transform 0.3s;
}

.arrow-down {
  transform: rotate(180deg);
}
</style>
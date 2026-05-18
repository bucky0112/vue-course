<script setup>
import ItemList from './ItemList.vue'

const items = [
  { id: 1, name: 'Item 1', description: 'Description 1' },
  { id: 2, name: 'Item 2', description: 'Description 2' },
  { id: 3, name: 'Item 3', description: 'Description 3' }
]
</script>
<!-- 使用作用域 Slot -->
<template>
  <ItemList :items="items">
    <!-- 自訂每個項目的顯示方式 -->
    <template #default="{ item, index }">
      <div class="item">
        <span>{{ index + 1 }}.</span>
        <strong>{{ item.name }}</strong>
        <p>{{ item.description }}</p>
      </div>
    </template>
  </ItemList>
</template>
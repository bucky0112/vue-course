<script setup>
defineProps({
  items: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <ul class="item-list">
    <li v-for="(item, index) in items" :key="item.id">
      <!-- 將資料傳遞給 slot -->
      <slot :item="item" :index="index">
        <!-- 預設顯示 -->
        {{ item.name }}
      </slot>
    </li>
  </ul>
</template>

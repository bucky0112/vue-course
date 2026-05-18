<script setup>
// 定義要發送的事件
const emit = defineEmits(['numberFromChild'])

// 點擊按鈕時觸發事件
const handleClick = () => {
  emit('numberFromChild', 1)  // 發送事件，並傳遞數值 1
}
</script>

<template>
  <button @click="handleClick">
    <slot></slot>
  </button>
</template>
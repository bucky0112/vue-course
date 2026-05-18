<script setup>
import { ref } from 'vue'
import CounterButton from './CounterButton.vue'

const count = ref(0)

// 處理子元件發送的事件
const handlePlus = (value) => {
  count.value += value
}
</script>

<template>
  <div>
    <p>目前計數：{{ count }}</p>
    <CounterButton @numberFromChild="handlePlus">增加</CounterButton>
  </div>
</template>
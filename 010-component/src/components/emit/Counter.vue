<script setup>
import { ref } from 'vue'
import CounterButton from './CounterButton.vue'

const count = ref(0)

const textFromChild = ref("")

// 處理子元件發送的事件
const handlePlus = (num) => {
  console.log(num)
  count.value += num
}

const handleToText = (string) => {
  console.log(string)
  textFromChild.value = string
}
</script>

<template>
  <div>
    <p>目前計數：{{ count }}</p>
    <CounterButton
      @number-from-child="handlePlus"
      @text-from-child="handleToText"
    >
      <p>增加</p>
    </CounterButton>
  </div>
</template>
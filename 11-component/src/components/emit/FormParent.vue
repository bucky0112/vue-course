<script setup>
import FormChild from './FormChild.vue'

const handleUserSubmit = (userData, emitData) => {
  console.log('收到的使用者資料：', userData)
  console.log('收到的 emitData：', emitData)
  // 這裡可以處理表單提交邏輯
}
</script>

<template>
  <div>
    <h2>使用者註冊</h2>
    <FormChild @submit="handleUserSubmit" />
  </div>
</template>
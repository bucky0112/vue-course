<script setup>
// 練習重點：定義 props
// 1. 定義 type prop，限制只能是 'success', 'warning', 'error' 這三種類型
// 2. 定義 title prop，設為必填
// 3. 定義 content prop，給予預設值
</script>

<template>
  <div class="message" :class="{
    'message-success': type === 'success',
    'message-warning': type === 'warning',
    'message-error': type === 'error'
  }">
    <h3>{{ title }}</h3>
    <p>{{ content }}</p>
  </div>
</template>

<style scoped>
.message {
  padding: 15px;
  border-radius: 8px;
  margin: 10px 0;
}

.message-success {
  background-color: #dff0d8;
  border: 1px solid #d6e9c6;
  color: #3c763d;
}

.message-warning {
  background-color: #fcf8e3;
  border: 1px solid #faebcc;
  color: #8a6d3b;
}

.message-error {
  background-color: #f2dede;
  border: 1px solid #ebccd1;
  color: #a94442;
}
</style>

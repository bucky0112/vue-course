<script setup>
import { inject } from 'vue'

// 注入資料
const message = inject('message')
const counter = inject('counter')
const increment = inject('increment')
</script>

<template>
  <div class="b-component">
    <h2>第二層</h2>
    <div>
      <p>Message: {{ message }}</p>
      <p>Count: {{ counter }}</p>
      <button @click="increment">+1</button>
    </div>
  </div>
</template>

<style scoped>
.b-component {
  border: 1px solid #000;
  padding: 10px;
  background-color: #19c739;
}
</style>
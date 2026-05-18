<script setup>
import { inject } from 'vue'
import BComponent from './BComponent.vue'

const counter = inject('counter')
</script>

<template>
  <div class="a-component">
    <h1>第一層</h1>
    <p>第二層點了: {{ counter }}</p>
    <BComponent />
  </div>
</template>

<style scoped>
.a-component {
  border: 1px solid #000;
  padding: 10px;
  background-color: #f0f0f0;
}
</style>
<script setup>
import { storeToRefs } from 'pinia'
import { useCounterOptionsStore } from '@/stores/counterOptions'

const store = useCounterOptionsStore()
const { count, doubleCount } = storeToRefs(store)
</script>

<template>
  <div class="card">
    <h3>Options Store</h3>
    <p>Count: {{ count }}</p>
    <p>Double: {{ doubleCount }}</p>
    <button @click="store.increment()">+1</button>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid #ccc;
  padding: 16px;
  border-radius: 4px;
  min-width: 200px;
}
</style>

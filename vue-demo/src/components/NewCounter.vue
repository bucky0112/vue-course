<script setup>
import { reactive, toRefs } from 'vue'

const count = reactive({
  num: 0,
  add: () => {
    count.num++ 
  },
  minus: () => {
    count.num--
  },
  reset: () => {
    count.num = 0
  }
})

// const { num, add, minus, reset } = count xx
const { num, add, minus, reset } = toRefs(count)

</script>

<template>
  <div>
    <h2>{{ num }}</h2>
    <button @click="add">+1</button>
    <button @click="minus">-1</button>
    <button @click="reset">Reset</button>
  </div>
</template>
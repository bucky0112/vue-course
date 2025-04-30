<script>
import { ref } from 'vue'

export default {
  setup () {
    const count = ref(0)

    const add = () => {
      count.value++
    }

    const minus = () => {
      count.value--
    }

    const reset = () => {
      count.value = 0
    }

    return {
      count,
      add,
      minus,
      reset
    }
  }
}
</script>

<template>
  <div>
    <h2>{{ count }}</h2>
    <button @click="add">+1</button>
    <button @click="minus">-1</button>
    <button @click="reset">Reset</button>
  </div>
</template>
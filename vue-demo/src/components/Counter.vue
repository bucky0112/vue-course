<script>
export default {
  data () {
    return {
      count: 0
    }
  },
  methods: {
    add () {
      this.count++
    },
    minus () {
      this.count--
    },
    reset () {
      this.count = 0
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
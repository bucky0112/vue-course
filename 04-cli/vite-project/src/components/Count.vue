<template>
  <div>
    <span class="count">{{ count }}</span>
    <button @click="add">點我加一</button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      count: 2,
    }
  },
  methods: {
    add () {
      this.count++
    },
  }
}
</script>

<style>
.count {
  font-size: 2rem;
  color: #42b883;
}
</style>
<!-- <script setup>
import LifecycleDemo from './components/LifecycleDemo.vue'
import SimpleLifecycle from './components/SimpleLifecycle.vue'
</script>

<template>
  <LifecycleDemo />
  <SimpleLifecycle />
</template>

<style scoped>
.test-container {
  border: 1px solid red;
  padding: 10px;
}
</style> -->

<script>
import LifecycleDemo from './components/LifecycleDemo.vue'
import SimpleLifecycle from './components/SimpleLifecycle.vue'
import Demo from './components/Demo.vue'

export default {
  components: {
    LifecycleDemo,
    SimpleLifecycle,
    Demo
  },
  data () {
    return {
      showComponent: true
    }
  }
}
</script>

<template>
  <div>
    <button @click="showComponent = !showComponent">
      {{ showComponent ? '隱藏' : '顯示' }}
    </button>
    <!-- <SimpleLifecycle /> -->
    <LifecycleDemo v-if="showComponent" />
  </div>
</template>
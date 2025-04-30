<script setup>
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  ref
} from 'vue'

const message = ref('Hello')

const users = ref([]);
onMounted(async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  users.value = await res.json();
  console.log(users.value);
});

onBeforeMount(async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  users.value = await res.json();
  console.log(users.value);
})

onBeforeMount(() => {
  console.log(message.value, 'onBeforeMount')
  console.log('1. onBeforeMount: 子元件準備掛載')
})

onMounted(() => {
  console.log(message.value, 'onMounted')
  console.log('2. onMounted: 子元件已掛載')
})

onBeforeUpdate(() => {
  console.log(message.value, 'onBeforeUpdate')
  console.log('3. onBeforeUpdate: 子元件準備更新')
})

onUpdated(() => {
  console.log(message.value, 'onUpdated')
  console.log('4. onUpdated: 子元件已更新')
})

onBeforeUnmount(() => {
  console.log(message.value, 'onBeforeUnmount')
  console.log('5. onBeforeUnmount: 子元件準備卸載')
})

onUnmounted(() => {
  console.log(message.value, 'onUnmounted')
  console.log('6. onUnmounted: 子元件已卸載')
})

const updateMessage = () => {
  message.value = message.value === 'Hello' ? 'Hi' : 'Hello'
}
</script>

<template>
  <div class="child">
    <h3>子元件</h3>
    <p>{{ message }}</p>
    <button @click="updateMessage">更新文字</button>
    <ul>
      <li v-for="user in users" :key="user.id">{{ user.name }}</li>
    </ul>
  </div>
</template>

<style scoped>
.child {
  border: 2px solid #42b883;
  padding: 20px;
  margin: 20px 0;
}
</style>
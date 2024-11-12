<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const goToInfo = () => {
  // router.push('/info')
  // 或使用命名路由
  router.push({ name: 'info' })
}

console.log(route)
</script>

<template>
  <div class="about">
    <h1>This is an about page</h1>
    <h2>目前頁面：{{ route.name }}</h2>
    <button @click="goToInfo" type="button">前往關於頁面</button>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>

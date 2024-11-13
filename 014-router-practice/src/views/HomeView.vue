<script setup>
import { ref, onMounted } from 'vue'

const isAuthenticated = ref(false)

onMounted(() => {
  isAuthenticated.value = !!localStorage.getItem('token')
})
</script>

<template>
  <div class="home">
    <h1 class="text-3xl text-green-600">首頁</h1>
    <div v-if="isAuthenticated">
      <RouterLink to="/member">前往會員中心</RouterLink>
    </div>
    <div v-else>
      <RouterLink to="/login">登入</RouterLink> |
      <RouterLink to="/register">註冊</RouterLink>
    </div>
  </div>
</template>

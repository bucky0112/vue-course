<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref, onMounted, provide } from 'vue'
import HelloWorld from './components/HelloWorld.vue'

const isAuthenticated = ref(false)

onMounted(() => {
  isAuthenticated.value = !!localStorage.getItem('token')
})

const updateAuth = (status) => {
  isAuthenticated.value = status
}

provide("auth", {
  isAuthenticated,
  updateAuth
})

</script>

<template>
  <nav>
    <RouterLink to="/">首頁</RouterLink> |
    <template v-if="isAuthenticated">
      <RouterLink to="/member">會員中心</RouterLink> |
      <RouterLink to="/profile">個人資料</RouterLink> |
      <RouterLink to="/settings">設定</RouterLink>
    </template>
    <template v-else>
      <RouterLink to="/login">登入</RouterLink> |
      <RouterLink to="/register">註冊</RouterLink>
    </template>
  </nav>

  <RouterView />
</template>

<style scoped>
nav {
  padding: 20px;
  background: #f4f4f4;
}

nav a {
  margin: 0 10px;
}

nav a.router-link-active {
  font-weight: bold;
}
</style>

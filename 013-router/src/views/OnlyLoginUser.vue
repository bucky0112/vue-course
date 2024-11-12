<script setup>
import { useRouter, onBeforeRouteLeave } from 'vue-router'

const router = useRouter()

const logoutUser = () => {
  localStorage.removeItem('loginUser')
  router.push({ name: 'login' })
}

onBeforeRouteLeave((to, from) => {
  const answer = window.confirm('確定要離開嗎？')
  if (!answer) return false
})
</script>
<template>
  <div>
    <h1>Only Login User</h1>
    <button @click="logoutUser">登出</button>
  </div>
</template>

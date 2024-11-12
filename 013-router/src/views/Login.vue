<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const loginUser = () => {
  localStorage.setItem('loginUser', '123456')
  router.push({ name: 'only-login-user' })
}

</script>

<template>
  <div>
    <h1>User Login</h1>
    <button @click="loginUser">登入</button>
  </div>
</template>

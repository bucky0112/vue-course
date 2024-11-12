<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const userId = ref(route.params.id)
const router = useRouter()

const goToOnlyLoginUser = () => {
  router.push({ name: 'only-login-user' })
}
</script>

<template>
  <div>
    <h1>User Profile</h1>
    <p>用戶 ID: {{ userId }}</p>
    <p>User {{ $route.params.id }}</p>
    <button @click="goToOnlyLoginUser">前往 Only Login User</button>
  </div>
</template>

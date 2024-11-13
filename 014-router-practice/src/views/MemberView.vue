<script setup>
import { inject } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { updateAuth } = inject('auth')

const handleLogout = () => {
  localStorage.removeItem('token')
  updateAuth(false)
  router.push('/login')
}
</script>

<template>
  <div class="member">
    <h2>會員中心</h2>
    <nav>
      <RouterLink to="/profile">個人資料</RouterLink> |
      <RouterLink to="/settings">設定</RouterLink>
    </nav>
    <button @click="handleLogout">登出</button>
  </div>
</template>
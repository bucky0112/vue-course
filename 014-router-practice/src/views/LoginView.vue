<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
// import { Button } from "../components/ui/button.jsx"

const router = useRouter()
const username = ref('')
const password = ref('')

const { updateAuth } = inject('auth')

const handleLogin = () => {
  // 這是模擬登入成功的情況
  localStorage.setItem('token', 'demo-token')
  updateAuth(true)
  router.push('/member')
}
</script>

<template>
  <div class="login-container">
    <h2>登入</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label>帳號：</label>
        <input type="text" v-model="username" required>
      </div>
      <div class="form-group">
        <label>密碼：</label>
        <input type="password" v-model="password" required>
      </div>
      <button type="submit">登入</button>
      <!-- <Button>登入</Button> -->
    </form>
    <RouterLink to="/register">還沒有帳號？點此註冊</RouterLink>
  </div>
</template>
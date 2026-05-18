<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const username = ref('')
const password = ref('')

const login = () => {
  // ❗ 注意：這是 demo 用的「假」登入——把任意值寫進 localStorage 就算登入成功
  //    真實場景要打 API、驗證帳密、收到 JWT token 才寫進來
  if (!username.value || !password.value) {
    alert('請輸入帳號密碼（任意值都可以，這是 demo）')
    return
  }

  localStorage.setItem('demo-token', `fake-token-for-${username.value}`)

  // 如果是被 beforeEach 導過來的，redirect 會帶在 query 裡——導回原本的目標
  const redirectTo = route.query.redirect || '/dashboard'
  router.push(redirectTo)
}
</script>

<template>
  <section>
    <h2>🔑 登入</h2>

    <div v-if="route.query.redirect" class="hint" style="color: orange">
      ⚠️ 你嘗試進入需要登入的頁面（{{ route.query.redirect }}）。
      登入後會自動導回該頁。
    </div>

    <div class="card">
      <label>帳號：<input v-model="username" placeholder="任意值..." /></label>
      <br />
      <label>密碼：<input v-model="password" type="password" placeholder="任意值..." /></label>
      <br />
      <button @click="login">登入</button>
    </div>

    <p class="hint">
      這是 demo 用的 fake 登入：填了任意帳密就把 token 寫進 localStorage，
      router 的 beforeEach guard 看 token 存在與否決定要不要放行。
    </p>
  </section>
</template>

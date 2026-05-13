<script setup>
import { ref, watchEffect } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 用 ref 追蹤登入狀態，這樣 nav 上的「登入/登出」會即時切換
// （直接讀 localStorage 不是 reactive，畫面不會自動更新）
const token = ref(localStorage.getItem('demo-token'))

// 每次路由切換時重新檢查 token（涵蓋登入/登出後的更新）
watchEffect(() => {
  void route.fullPath // 讓 watchEffect 追蹤路由變動
  token.value = localStorage.getItem('demo-token')
})

const logout = () => {
  localStorage.removeItem('demo-token')
  token.value = null
  router.push('/')
}
</script>

<template>
  <h1>19 — Vue Router</h1>

  <nav class="main-nav">
    <RouterLink to="/">首頁</RouterLink>
    <RouterLink to="/about">關於</RouterLink>
    <RouterLink to="/posts">文章列表</RouterLink>
    <RouterLink to="/user/123">User 123</RouterLink>
    <RouterLink to="/dashboard">個人面板 🔒</RouterLink>

    <span class="nav-spacer"></span>

    <RouterLink v-if="!token" to="/login" class="auth">登入</RouterLink>
    <button v-else @click="logout" class="auth">登出</button>
  </nav>

  <main>
    <RouterView />
  </main>

  <footer class="hint">
    當前網址：<code>{{ route.fullPath }}</code>　|
    matched route name：<code>{{ String(route.name) }}</code>
  </footer>
</template>

<style scoped>
.main-nav {
  display: flex;
  gap: 4px;
  align-items: center;
  margin-bottom: 24px;
  padding: 12px 16px;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 8px;
}

.main-nav a {
  padding: 6px 12px;
  text-decoration: none;
  color: var(--fg);
  border-radius: 4px;
}

.main-nav a:hover {
  background: rgba(66, 185, 131, 0.1);
}

.main-nav a.router-link-active {
  background: #42b983;
  color: white;
}

.main-nav .nav-spacer {
  flex: 1;
}

.main-nav .auth {
  padding: 6px 12px;
  font-size: 14px;
}

footer {
  margin-top: 32px;
  padding: 12px;
  text-align: center;
  border-top: 1px solid var(--border);
}
</style>

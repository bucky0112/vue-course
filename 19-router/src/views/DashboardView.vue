<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const token = localStorage.getItem('demo-token')

const logout = () => {
  localStorage.removeItem('demo-token')
  router.push('/')
}
</script>

<template>
  <section>
    <h2>📊 個人面板（受保護頁面）</h2>
    <p>恭喜，你已登入！這頁只有有 token 的人能看到。</p>

    <div class="card">
      <h3>目前的 token</h3>
      <pre>{{ token }}</pre>
      <button @click="logout">登出</button>
    </div>

    <p class="hint">
      <strong>權限守衛的運作流程</strong>：
      <br />
      1. router/index.js 在這個 route 上加了 <code>meta: { requiresAuth: true }</code>
      <br />
      2. 全域 <code>beforeEach</code> 在每次路由切換時檢查 <code>to.meta.requiresAuth</code>
      <br />
      3. 沒登入 (localStorage 沒 token) → return <code>{ name: 'login' }</code> 重導
      <br />
      4. 登入後 → 不 return → 放行
    </p>

    <p class="hint">
      試試看：登出後在網址列直接輸入 <code>/dashboard</code>——會被 guard 攔下、導去 login。
    </p>
  </section>
</template>

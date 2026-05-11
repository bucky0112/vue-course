<script setup>
// 模擬從遠端 API 抓資料
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// <script setup> 內可以直接寫 top-level await（不用包在函式裡）
// 但是用了 await 的元件，外部必須用 <Suspense> 包起來才能渲染
await delay(1500)

const user = {
  name: 'Alice Chen',
  email: 'alice@example.com',
  bio: '前端工程師，喜歡寫 Vue',
}
</script>

<template>
  <div class="card">
    <h4>👤 使用者資料（top-level await 載入）</h4>
    <p><strong>姓名：</strong>{{ user.name }}</p>
    <p><strong>Email：</strong>{{ user.email }}</p>
    <p><strong>自介：</strong>{{ user.bio }}</p>
    <p class="hint">這份資料是 await 1.5 秒後才回傳的。</p>
  </div>
</template>

<script setup>
const buildTime = new Date().toLocaleString('zh-TW')
</script>

<template>
  <section>
    <h2>Home</h2>
    <p>這是首頁。試著切換到 About、再按瀏覽器重整 — 部署到 Vercel 後沒設 rewrites，會跳 404。</p>
    <p class="meta">頁面載入時間：{{ buildTime }}</p>
  </section>
</template>

<style scoped>
.meta {
  color: #6e7681;
  font-size: 0.875rem;
}
</style>

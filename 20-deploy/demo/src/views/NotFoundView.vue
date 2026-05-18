<script setup>
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <section>
    <h2>404 — 找不到頁面</h2>
    <p>找不到路徑：<code>{{ route.fullPath }}</code></p>
    <p>
      <RouterLink to="/">回首頁</RouterLink>
    </p>
    <p class="note">
      💡 你看到這頁，代表 vue-router 的 catch-all 路由正在運作。<br>
      如果是部署到 Vercel 但沒設 rewrites，會看到的是 Vercel 平台預設的 404 頁，不是這頁。
    </p>
  </section>
</template>

<style scoped>
code {
  background: #f6f8fa;
  padding: 1px 5px;
  border-radius: 3px;
  color: #d1242f;
}
.note {
  margin-top: 2rem;
  padding: 1rem;
  background: #fff8e6;
  border-left: 3px solid #f0b400;
  border-radius: 4px;
}
</style>

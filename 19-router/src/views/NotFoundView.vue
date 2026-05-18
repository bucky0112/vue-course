<script setup>
import { useRoute, RouterLink } from 'vue-router'

const route = useRoute()
</script>

<template>
  <section>
    <h2>🔍 404 — 找不到頁面</h2>
    <p>你嘗試訪問的路徑：<code>{{ route.fullPath }}</code> 不存在。</p>
    <p>
      <RouterLink to="/">回首頁</RouterLink>
    </p>

    <p class="hint">
      這個頁面用 <code>catch-all</code> 路由實作：
      <code>{ path: '/:pathMatch(.*)*', component: NotFoundView }</code>。
      任何沒匹配到的網址都會落到這。
    </p>
  </section>
</template>

<script setup>
import { useRoute, RouterLink, RouterView } from 'vue-router'

const route = useRoute()
</script>

<template>
  <section>
    <h2>👤 User {{ route.params.id }}</h2>
    <p class="hint">
      這是巢狀路由的父元件。下面的 <code>&lt;RouterView /&gt;</code> 會根據網址
      渲染對應的子路由（profile / settings）。
    </p>

    <nav class="sub-nav">
      <RouterLink :to="{ name: 'user-profile', params: route.params }">Profile</RouterLink>
      <RouterLink :to="{ name: 'user-settings', params: route.params }">Settings</RouterLink>
    </nav>

    <!-- 子路由會渲染在這 -->
    <RouterView />
  </section>
</template>

<style scoped>
.sub-nav {
  display: flex;
  gap: 12px;
  margin: 16px 0;
  border-bottom: 1px solid var(--border);
  padding-bottom: 8px;
}
.sub-nav a {
  padding: 4px 12px;
  text-decoration: none;
  color: var(--fg);
  border-radius: 4px;
}
.sub-nav a.router-link-active {
  background: var(--accent);
  color: white;
}
</style>

<script setup>
import { posts } from '@/data/posts'
</script>

<template>
  <section>
    <h2>📝 文章列表</h2>
    <p class="hint">
      點任一篇文章標題進入詳情頁——網址會變成 <code>/posts/1</code>、<code>/posts/2</code>...
      這就是「動態路由」：同一個元件範本搭配不同參數渲染不同內容。
    </p>

    <ul>
      <li v-for="post in posts" :key="post.id" class="post-row">
        <RouterLink :to="{ name: 'post-detail', params: { id: post.id } }">
          <strong>{{ post.title }}</strong>
        </RouterLink>
        <p class="hint">{{ post.summary }}</p>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.post-row {
  display: block;
  padding: 12px;
  border-bottom: 1px solid var(--border);
}
.post-row:last-child {
  border-bottom: none;
}
</style>

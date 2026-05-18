<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { getPostById } from '@/data/posts'

const route = useRoute()

// 用 computed 包起來——這樣切換 /posts/1 → /posts/2 時，
// 同一個元件實例會自動拿到新 id 對應的資料（元件不會 unmount/remount）
const post = computed(() => getPostById(route.params.id))
</script>

<template>
  <section>
    <RouterLink :to="{ name: 'posts' }">← 回到列表</RouterLink>

    <div v-if="post">
      <h2>{{ post.title }}</h2>
      <p class="hint">{{ post.summary }}</p>
      <hr />
      <p>{{ post.body }}</p>

      <p class="hint">
        當前路由參數：id = <code>{{ route.params.id }}</code>
      </p>
    </div>
    <div v-else>
      <h2>❓ 找不到這篇文章</h2>
      <p>id <code>{{ route.params.id }}</code> 不存在。</p>
    </div>
  </section>
</template>

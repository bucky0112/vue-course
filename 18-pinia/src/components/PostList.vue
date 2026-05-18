<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { usePostsStore } from '@/stores/posts'

const store = usePostsStore()
const { posts, status, error } = storeToRefs(store)

onMounted(() => {
  store.fetchPosts()
})
</script>

<template>
  <div class="card">
    <header>
      <h3>Posts（從 JSONPlaceholder 抓）</h3>
      <div class="actions">
        <button @click="store.fetchPosts()" :disabled="status === 'loading'">
          重抓
        </button>
        <button @click="store.reset()">reset</button>
      </div>
    </header>

    <p v-if="status === 'idle'" class="state">尚未載入</p>
    <p v-else-if="status === 'loading'" class="state">載入中…</p>
    <p v-else-if="status === 'error'" class="state err">失敗：{{ error }}</p>
    <template v-else-if="status === 'success'">
      <ul>
        <li v-for="p in posts.slice(0, 5)" :key="p.id">{{ p.title }}</li>
      </ul>
      <p class="meta">共 {{ posts.length }} 篇，僅顯示前 5 篇</p>
    </template>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid #ccc;
  padding: 16px;
  border-radius: 4px;
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.actions {
  display: flex;
  gap: 8px;
}
.state {
  margin: 12px 0;
}
.err {
  color: #d1242f;
}
.meta {
  color: #6e7681;
  font-size: 0.875rem;
}
ul {
  padding-left: 20px;
  margin: 8px 0;
}
li {
  padding: 4px 0;
}
</style>

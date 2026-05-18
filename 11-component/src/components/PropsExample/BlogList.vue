<script setup>
import { ref, onMounted } from 'vue'
import BlogPost from './BlogPost.vue' // 子元件

// 模擬的部落格文章資料
const fakePosts = new Promise((resolve) => {
  setTimeout(() => {
    resolve([
      {
        id: 1,
        title: '為什麼要使用 Vue 元件？',
        preview: '在現代前端開發中，元件化開發已經成為主流。使用元件可以讓我們的代碼更容易維護、重用，也更容易進行團隊協作...',
        date: '2024-03-15',
        author: '小明'
      },
      {
        id: 2,
        title: 'Vue 3 新特性介紹',
        preview: 'Vue 3 帶來了許多令人興奮的新特性，包括 Composition API、更好的 TypeScript 支持、更小的打包體積...',
        date: '2024-03-14',
        author: '小華'
      },
      {
        id: 3,
        title: '前端效能優化技巧',
        preview: '網站效能對用戶體驗至關重要。本文將介紹幾個實用的前端效能優化技巧，包括圖片 lazy load、code splitting...',
        date: '2024-03-13',
        author: '小陳'
      },
    ])
  }, 1000)
})

const fetchPosts = async () => {
  const res = await fakePosts
  posts.value = res
}

const posts = ref()

onMounted(fetchPosts)
</script>

<template>
  <div class="blog-list">
    <BlogPost
      v-for="post in posts"
      :key="post.id"
      :title="post.title"
      :preview="post.preview"
      :date="post.date"
      :author="post.author"
     />
  </div>
</template>
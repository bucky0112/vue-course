import { defineStore } from 'pinia'
import { ref } from 'vue'

// 呼應第 17 章 API 串接的「loading / error / data」三態 pattern，
// 但這次把狀態放到 store，讓多個元件可以共享同一份資料與狀態。
export const usePostsStore = defineStore('posts', () => {
  const posts = ref([])
  const status = ref('idle') // 'idle' | 'loading' | 'success' | 'error'
  const error = ref(null)

  async function fetchPosts() {
    status.value = 'loading'
    error.value = null
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      posts.value = await res.json()
      status.value = 'success'
    } catch (e) {
      status.value = 'error'
      error.value = e.message
    }
  }

  function reset() {
    posts.value = []
    status.value = 'idle'
    error.value = null
  }

  return { posts, status, error, fetchPosts, reset }
})

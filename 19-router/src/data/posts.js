// 假資料：示範動態路由用
export const posts = [
  {
    id: 1,
    title: 'Vue Router 入門',
    summary: '從零開始理解 SPA 路由',
    body: 'Vue Router 是 Vue 官方提供的路由方案。在 SPA（單頁式應用）裡，所有頁面切換都不會重新整理整個瀏覽器頁面——這就是路由要解決的事。',
  },
  {
    id: 2,
    title: 'Composition API 的好處',
    summary: '為什麼新專案都改用 <script setup>',
    body: 'Composition API 讓「相關邏輯」寫在一起，不像 Options API 散落在 data / methods / computed / watch 等不同位置。',
  },
  {
    id: 3,
    title: 'Pinia vs Vuex',
    summary: 'Vue 3 為什麼換掉 Vuex',
    body: 'Pinia 簡化了 store 的設計：沒有 mutations、TypeScript 整合好、API 更接近 Vue 的響應式哲學。',
  },
]

export const getPostById = (id) => {
  return posts.find((p) => p.id === Number(id))
}

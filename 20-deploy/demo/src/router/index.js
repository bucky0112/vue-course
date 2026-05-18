import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
    },
    {
      // SPA fallback 真實案例：deep link 直接打 /xyz 時，
      // Vercel 沒設 rewrite → 回 Vercel 404
      // Vercel 設了 rewrite → 回 index.html → vue-router 才會用這條 route 顯示自訂 404
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

export default router

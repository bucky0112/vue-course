import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 1. 基本靜態路由
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      // 2. Lazy loading：用 () => import() 包起來，這個元件的 JS 變成獨立 chunk
      //    第一次進這頁時才下載，加快首次載入速度
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
    },

    // 3. 登入頁（給 guard demo 用）
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },

    // 4. 需要登入才能看的頁面
    //    用 meta.requiresAuth 標記，給下面的 beforeEach 判斷
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true, title: '個人面板' },
    },

    // 5. 列表 + 動態路由
    {
      path: '/posts',
      name: 'posts',
      component: () => import('@/views/PostsListView.vue'),
    },
    {
      // :id 是動態參數，元件內用 useRoute().params.id 取
      path: '/posts/:id',
      name: 'post-detail',
      component: () => import('@/views/PostDetailView.vue'),
    },

    // 6. 巢狀路由：父元件 UserLayout 提供共用的 <RouterView />
    {
      path: '/user/:id',
      component: () => import('@/views/UserLayout.vue'),
      children: [
        // 預設子路由：/user/123 自動 redirect 到 /user/123/profile
        { path: '', redirect: (to) => ({ name: 'user-profile', params: to.params }) },
        {
          path: 'profile',
          name: 'user-profile',
          component: () => import('@/views/UserProfileView.vue'),
        },
        {
          path: 'settings',
          name: 'user-settings',
          component: () => import('@/views/UserSettingsView.vue'),
        },
      ],
    },

    // 7. 404 catch-all：任何沒匹配到的路徑都會落到這
    //    `(.*)` 是 Vue Router 4 的正規式語法，捕捉所有路徑
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

// 全域 beforeEach：每次路由切換前都會跑
// 用來實作「需要登入才能進」這類權限檢查
router.beforeEach((to) => {
  // 切換時同步更新瀏覽器分頁標題（如果有設 meta.title）
  if (to.meta.title) {
    document.title = `${to.meta.title} | Vue Router Demo`
  }

  const requiresAuth = to.meta.requiresAuth
  const isLoggedIn = !!localStorage.getItem('demo-token')

  if (requiresAuth && !isLoggedIn) {
    // 回傳一個新的 location 物件，Vue Router 會自動 redirect
    // 把原本的目標放進 query.redirect，登入後可以導回
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    }
  }

  // 不 return 就放行
})

export default router

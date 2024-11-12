import { createRouter, createWebHistory, createWebHashHistory, createMemoryHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import InfoView from '@/views/InfoView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
  },
  {
    path: '/info',
    name: 'info',
    component: InfoView,
  },
  {
    path: '/user/:id',
    name: 'user-profile',
    component: () => import('../views/UserProfile.vue'),
  },
  {
    path: '/only-login-user',
    name: 'only-login-user',
    component: () => import('../views/OnlyLoginUser.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  // history: createWebHistory(import.meta.env.BASE_URL),
  // history: createWebHashHistory(),
  // history: createMemoryHistory(),
  routes,
})

// router.beforeEach((to, from) => {
//   const isLogin = localStorage.getItem('loginUser')
//   if (to.name !== 'login' && !isLogin) {
//     return { name: 'login' }
//   }
// })

export default router

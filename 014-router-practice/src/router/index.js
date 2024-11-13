import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ProfileView from '../views/ProfileView.vue'
import MemberView from '../views/MemberView.vue'
import SettingsView from '../views/SettingsView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/member',
    name: 'member',
    component: MemberView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView,
    meta: {
      requiresAuth: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from) => {
  const isAuthenticated = localStorage.getItem('token')

  // 如果是已登入的使用者想進入登入頁，導向首頁
  if (isAuthenticated && to.name === 'login') {
    return { name: 'home' }
  }

  // 如果是未登入的使用者想進入需驗證頁面，導向登入頁
  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'login' }
  }
})

export default router

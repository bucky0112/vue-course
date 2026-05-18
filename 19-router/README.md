# 19 — Vue Router

> SPA（單頁式應用）的路由系統。讓網址切換、瀏覽器返回鍵、頁面內容三者保持同步，但不重新整理整個瀏覽器。

## 章節目標

1. 設定基本路由 + 用 `<RouterLink>` / `<RouterView>` 寫導覽列
2. 用 lazy loading 切割 JS 程式碼
3. 寫動態路由（`/posts/:id`）跟巢狀路由
4. 用 Navigation Guards + `meta` 實作權限守衛
5. 處理 404 catch-all

---

## 目錄
- [1. 為什麼需要路由](#1-為什麼需要路由)
- [2. 安裝與設定](#2-安裝與設定)
- [3. 基本路由 + RouterLink / RouterView](#3-基本路由--routerlink--routerview)
- [4. Lazy Loading](#4-lazy-loading)
- [5. 動態路由](#5-動態路由)
- [6. 巢狀路由](#6-巢狀路由)
- [7. 程式化導航 (`router.push`)](#7-程式化導航-routerpush)
- [8. Navigation Guards + meta](#8-navigation-guards--meta)
- [9. 404 catch-all](#9-404-catch-all)
- [10. 整體架構](#10-整體架構)
- [練習題](#練習題)

---

## 1. 為什麼需要路由

傳統網站：點不同連結 → 瀏覽器整個重新載入新的 HTML。

SPA（單頁式應用）：JS 一次載完，**之後切頁面都不重新載入**，只是換 DOM 內容。但問題是：
- 怎麼讓網址列同步變？
- 怎麼讓瀏覽器的上一頁/下一頁鍵能用？
- 怎麼讓使用者複製網址貼回去能進到同一頁？

**Vue Router 就是處理這些事的**。

---

## 2. 安裝與設定

```sh
npm install vue-router
```

`src/router/index.js`：

```js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    // ... 其他路由
  ],
})

export default router
```

`src/main.js`：

```js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')
```

---

## 3. 基本路由 + RouterLink / RouterView

`App.vue`：

```vue
<template>
  <nav>
    <RouterLink to="/">首頁</RouterLink>
    <RouterLink to="/about">關於</RouterLink>
  </nav>

  <RouterView />
</template>
```

- `<RouterLink to="...">`：取代 `<a href>`，點下去**不會重新整理頁面**，只切 RouterView 內容
- `<RouterView />`：當前路由對應的元件渲染在這
- `router-link-active` class：當前正在這個路由時自動加上，可以拿來標亮

`router/index.js`：

```js
{ path: '/', name: 'home', component: HomeView }
```

`path` 是網址、`name` 是路由名（用 name 跳轉比 path 安全）、`component` 是要渲染的元件。

---

## 4. Lazy Loading

**檔案**：[`src/router/index.js`](./src/router/index.js)

```js
// 直接 import：跟 app 主程式打包在一起
import HomeView from '@/views/HomeView.vue'

// Lazy load：包進函式，Vite 把這個元件切成獨立 chunk
const routes = [
  { path: '/', component: HomeView },                       // 主 chunk
  { path: '/about', component: () => import('@/views/AboutView.vue') },  // 獨立 chunk
]
```

第一次訪問 `/about` 時才下載對應 JS——首次載入快、後續切換也只下載當下需要的元件。

### 取捨

| 該 lazy load | 該直接 import |
|--------------|---------------|
| 偶爾才用到的頁面（設定、後台、404） | 首頁 |
| 大型元件（含圖表、編輯器） | 訪問頻率高的頁面 |
| 路由樹的葉節點 | 共用元件 |

---

## 5. 動態路由

**檔案**：[`src/views/PostsListView.vue`](./src/views/PostsListView.vue) / [`src/views/PostDetailView.vue`](./src/views/PostDetailView.vue)

```js
{
  path: '/posts/:id',
  name: 'post-detail',
  component: PostDetailView,
}
```

`:id` 是動態參數。`/posts/1`、`/posts/42`、`/posts/abc` 都會 match 這個 route。

### 取參數

```vue
<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
console.log(route.params.id)  // '1' / '42' / 'abc'
</script>
```

### 用 RouterLink 帶參數

```vue
<RouterLink :to="{ name: 'post-detail', params: { id: 5 } }">看文章</RouterLink>
```

或字串路徑：`<RouterLink to="/posts/5">看文章</RouterLink>` 也可以，但用 `name` 比較安全（path 改了不會壞）。

### 切換同路由不同參數時

`/posts/1` → `/posts/2`：**元件不會 unmount/remount**，只是 `route.params.id` 變了。
所以要把依賴 params 的東西放進 `computed`，而非 `onMounted`：

```js
// ❌ 錯：只在 mount 時跑一次
onMounted(() => {
  post.value = getPostById(route.params.id)
})

// ✅ 對：每次 params 變動都自動更新
const post = computed(() => getPostById(route.params.id))
```

---

## 6. 巢狀路由

**檔案**：[`src/views/UserLayout.vue`](./src/views/UserLayout.vue) / [`UserProfileView.vue`](./src/views/UserProfileView.vue)

```js
{
  path: '/user/:id',
  component: UserLayout,
  children: [
    { path: '', redirect: { name: 'user-profile' } },
    { path: 'profile', name: 'user-profile', component: UserProfileView },
    { path: 'settings', name: 'user-settings', component: UserSettingsView },
  ],
}
```

`UserLayout.vue` 內部要有一個 `<RouterView />`，子路由就會渲染在那：

```vue
<template>
  <h2>User {{ route.params.id }}</h2>
  <nav>
    <RouterLink :to="{ name: 'user-profile' }">Profile</RouterLink>
    <RouterLink :to="{ name: 'user-settings' }">Settings</RouterLink>
  </nav>
  <RouterView />  <!-- 子路由渲染在這 -->
</template>
```

實務常見場景：後台分頁、設定頁、商品詳情含多 tab。

---

## 7. 程式化導航 (`router.push`)

不是所有跳轉都用 `<RouterLink>`——有時候要在 JS 邏輯後跳轉（例如登入成功後）：

```js
import { useRouter } from 'vue-router'

const router = useRouter()

// 跳到指定路徑
router.push('/dashboard')
router.push({ name: 'post-detail', params: { id: 5 } })
router.push({ path: '/posts', query: { sort: 'date' } })

// 上一頁 / 下一頁
router.back()
router.forward()

// 替換（不留在歷史紀錄裡）
router.replace('/login')
```

`useRoute()` 跟 `useRouter()` 的差別：

| | `useRoute()` | `useRouter()` |
|---|--------------|---------------|
| 取目前路由資訊 | ✅ (`.params`、`.query`、`.path`) | ❌ |
| 跳轉 | ❌ | ✅ (`.push`、`.replace`、`.back`) |

---

## 8. Navigation Guards + meta

**檔案**：[`src/router/index.js`](./src/router/index.js) / [`src/views/LoginView.vue`](./src/views/LoginView.vue) / [`src/views/DashboardView.vue`](./src/views/DashboardView.vue)

### meta：給路由貼標籤

```js
{
  path: '/dashboard',
  component: DashboardView,
  meta: { requiresAuth: true, title: '個人面板' },
}
```

`meta` 是你自訂的物件，guard 跟元件都可以讀。

### beforeEach：全域守衛

每次路由切換**前**都會跑。回傳值決定要放行還是 redirect：

```js
router.beforeEach((to) => {
  const requiresAuth = to.meta.requiresAuth
  const isLoggedIn = !!localStorage.getItem('demo-token')

  if (requiresAuth && !isLoggedIn) {
    // 回傳 location 物件 → Vue Router 改去這個目標
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  // 不 return（或 return true） → 放行
})
```

> ℹ️ **Vue Router 4 的新寫法**：直接 `return { ... }` 而非 callback `next({...})`。
> 舊式 `next()` 仍然支援，但容易忘記呼叫導致路由卡住——新寫法更安全。

### 把原本目標放進 query

```js
return { name: 'login', query: { redirect: to.fullPath } }
```

登入成功後：

```js
const route = useRoute()
const router = useRouter()

const onLoginSuccess = () => {
  localStorage.setItem('demo-token', 'xxx')
  router.push(route.query.redirect || '/dashboard')
}
```

這樣使用者點「個人面板」被導去登入、登入完直接回到原本想去的頁面，體驗順暢。

### 其他 guard

| Guard | 何時跑 |
|-------|-------|
| `router.beforeEach` | 全域、每次切換前 |
| `router.beforeResolve` | 全域、navigation 確認前 |
| `router.afterEach` | 全域、切換完成後（沒法擋路由） |
| `beforeEnter` | 單一路由（寫在 route 物件內） |
| `beforeRouteEnter` / `beforeRouteUpdate` / `beforeRouteLeave` | 元件內 |

九成情境用 `beforeEach` 就夠了。

---

## 9. 404 catch-all

**檔案**：[`src/views/NotFoundView.vue`](./src/views/NotFoundView.vue)

```js
{
  path: '/:pathMatch(.*)*',
  name: 'not-found',
  component: NotFoundView,
}
```

`:pathMatch(.*)*` 是 Vue Router 4 的正規式語法，捕捉任何沒匹配到的路徑。

> 注意：**這個 route 一定要放在 routes 陣列的最後**——Vue Router 從上往下匹配，放最前面會吃掉所有其他路由。

---

## 10. 整體架構

```
src/
├── main.js                # createApp().use(router).mount()
├── App.vue                # <RouterView />、登出/登入 nav
├── router/
│   └── index.js           # routes + beforeEach guards
├── views/                 # 路由對應的「頁面」元件
│   ├── HomeView.vue
│   ├── AboutView.vue
│   ├── LoginView.vue
│   ├── DashboardView.vue
│   ├── PostsListView.vue
│   ├── PostDetailView.vue
│   ├── UserLayout.vue     # 巢狀路由的「父」
│   ├── UserProfileView.vue
│   ├── UserSettingsView.vue
│   └── NotFoundView.vue
└── data/
    └── posts.js           # 假資料
```

### 慣例：views/ vs components/

| 資料夾 | 內容 |
|--------|------|
| **`views/`** | 跟路由對應的「頁面」元件（一個 view ↔ 一個 route） |
| **`components/`** | 可重用的小元件（按鈕、卡片、表單欄位等） |

views 通常會 import 多個 components 組合。

---

## 練習題

1. **基礎**：加一個 `/contact` 路由，顯示一個假的聯絡表單。

2. **動態路由**：仿照 `/posts/:id`，加一個 `/categories/:name`，根據 name 顯示對應分類。

3. **巢狀路由進階**：在 `/user/:id` 底下再加一個 `/user/:id/posts`，顯示該使用者的文章列表。

4. **guard 進階**：實作「管理員專屬」頁面 `/admin`，要 meta.requiresRole === 'admin'。在 fake login 時讓使用者選身分（admin / user）。

5. **滾動行為**：用 `createRouter` 的 `scrollBehavior` 選項，讓每次切換路由自動捲回頁面頂端。

6. **進階**：寫一個 `<NavLink>` wrapper 元件，包裝 RouterLink 加上你自己的樣式跟 icon 支援。

---

## 延伸閱讀
- 官方文件：[Vue Router 4](https://router.vuejs.org/)
- [Navigation Guards](https://router.vuejs.org/guide/advanced/navigation-guards.html)
- [Dynamic Route Matching](https://router.vuejs.org/guide/essentials/dynamic-matching.html)
- [Nested Routes](https://router.vuejs.org/guide/essentials/nested-routes.html)

---

## 啟動專案

```sh
npm install
npm run dev
```

# 18 — Pinia

> 跨元件、跨頁面共享狀態。當 props 跟 provide/inject 不夠用、或邏輯需要在多個地方被 mutate 時，就是 Pinia 上場的時候。本章覆蓋基礎 store + 跨 store 引用 + API 整合 + 持久化四個層面。

## 章節目標

1. 用 setup store 寫法定義 store（state / getters / actions）
2. 在元件中正確取用 store（`storeToRefs` 解構陷阱）
3. 看懂 Options store 寫法，能在閱讀舊專案時不卡住
4. 在 action 中呼叫 API，把 loading / error / data 三態收進 store
5. 用 `pinia-plugin-persistedstate` 把 state 自動同步到 localStorage

---

## 目錄
- [1. 為什麼需要 Pinia](#1-為什麼需要-pinia)
- [2. 安裝與註冊](#2-安裝與註冊)
- [3. 第一個 store：counter](#3-第一個-storecounter)
- [4. 元件中取用 store — `storeToRefs` 解構陷阱](#4-元件中取用-store--storetorefs-解構陷阱)
- [5. Setup store vs Options store](#5-setup-store-vs-options-store)
- [6. 跨 store 引用（cart 引用 products）](#6-跨-store-引用cart-引用-products)
- [7. Action 中呼叫 API（呼應第 17 章）](#7-action-中呼叫-api呼應第-17-章)
- [8. Persistedstate plugin](#8-persistedstate-plugin)
- [9. Pinia vs Composable（呼應第 14 章）](#9-pinia-vs-composable呼應第-14-章)
- [常見錯誤](#常見錯誤)
- [練習題](#練習題)

---

## 1. 為什麼需要 Pinia

當 App 變大，會出現以下三種需求：

- **多個元件要看到同一份資料**（購物車品項要在 Header badge、Cart 頁、Checkout 頁都同步）
- **資料的修改邏輯要集中**（避免 5 個元件各自寫 `cart.push(item)` 然後一個漏改）
- **資料要在路由切換間保留**（從商品頁跳到結帳頁，購物車不能不見）

過去的選項：
- **Props drilling**：能用但深層元件痛苦，重構維護惡夢
- **provide / inject**（第 16 章）：適合「樹狀依賴注入」，但缺乏修改邏輯的封裝
- **Vuex**：Vue 2 時代主流，但 API 繁重、TS 支援差

**Pinia** 是 Vue 3 官方推薦的狀態管理方案：API 簡潔、TS-friendly、跟 DevTools 整合好、可拆成多個獨立 store。

---

## 2. 安裝與註冊

```sh
npm install pinia
npm install pinia-plugin-persistedstate  # 第 8 節會用到
```

`src/main.js`：

```js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

createApp(App).use(pinia).mount('#app')
```

> 本範本用 **Pinia 3**（搭配 persistedstate 4）。Pinia 3 拿掉 Vue 2 支援，對 Composition API setup store 寫法沒有破壞性變更。

---

## 3. 第一個 store：counter

**檔案**：[`src/stores/counter.js`](./src/stores/counter.js)

```js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
```

### Setup store 的三件套

| 在 setup store 裡 | 對應 Pinia 概念 | Composition API 寫法 |
|---|---|---|
| `ref()` / `reactive()` | **state** | 直接宣告 |
| `computed()` | **getter** | 從 state 衍生的響應式值 |
| 一般 function | **action** | 同步 / 非同步皆可 |

最後 **`return` 的物件就是 store 的公開介面**，沒回傳的視為私有。

### 命名慣例

- store 用 `useXxxStore` 開頭（像 composable，但結尾加 `Store`）
- `defineStore('id', ...)` 的第一個參數是**唯一 ID**，DevTools 跟 persistedstate 都靠它

---

## 4. 元件中取用 store — `storeToRefs` 解構陷阱

**檔案**：[`src/components/Counter.vue`](./src/components/Counter.vue)

```vue
<script setup>
import { storeToRefs } from 'pinia'
import { useCounterStore } from '@/stores/counter'

const store = useCounterStore()

// ✅ state / getter 要用 storeToRefs 解構（保留響應性）
const { count, doubleCount } = storeToRefs(store)

// ✅ action 可以直接從 store 解構（function 不需要響應性）
const { increment } = store
</script>

<template>
  <p>Count: {{ count }}</p>
  <p>Double: {{ doubleCount }}</p>
  <button @click="increment">+1</button>
</template>
```

### ❌ 常見錯誤：直接解構 state

```js
const { count, doubleCount } = useCounterStore()
// count 變成普通 number，不再響應，template 不會更新
```

> 這跟第 6 章「解構 `reactive` 物件失去響應性」是**同一個陷阱**：解構會拿到當下的 primitive 值，斷掉跟 reactive proxy 的連線。`storeToRefs` 會把每個 state / getter 都包成 `ref`，解構出來仍然響應。

### ✅ 不解構也行（但元件多了會囉嗦）

```vue
<template>
  <p>{{ store.count }}</p>
  <p>{{ store.doubleCount }}</p>
  <button @click="store.increment()">+1</button>
</template>
```

---

## 5. Setup store vs Options store

兩種寫法都合法，行為一樣。**新專案推薦用 setup store**，老專案常見 options store。

**檔案對照**：
- Setup → [`src/stores/counter.js`](./src/stores/counter.js)
- Options → [`src/stores/counterOptions.js`](./src/stores/counterOptions.js)

### 並排對照

**Setup store**：

```js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }
  return { count, doubleCount, increment }
})
```

**Options store**：

```js
import { defineStore } from 'pinia'

export const useCounterOptionsStore = defineStore('counterOptions', {
  state: () => ({ count: 0 }),
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++
    },
  },
})
```

### 差別

| 比較點 | Setup store | Options store |
|---|---|---|
| state 宣告 | `ref()` / `reactive()` | `state: () => ({...})` |
| getter | `computed()` | `getters: { name: (state) => ... }` |
| action 取 state | 直接 `count.value` | 用 `this.count` |
| 跨 store 引用 | function 內呼叫 `useXxxStore()` | 同左，但 action 內也可用 `this` 拿到其他 |
| 心智模型 | 跟 `<script setup>` 一致 | 跟 Vue 2 / Options API 一致 |
| 私有 state | `return` 不包含即可 | 較難（必須是 state 才有響應性，且 `this` 全暴露） |

### 何時用哪個

- **新專案** → 全用 setup store（心智模型統一、容易抽 composable）
- **接手舊專案** → 跟著現有寫法，不要混
- **要在 action 解構多個 stores** → setup 寫起來比較自然

> 本課程其他範例（counter / products / cart / posts / preferences）**都是 setup store**，counterOptions 是唯一純為對照存在的範例。

---

## 6. 跨 store 引用（cart 引用 products）

**檔案**：[`src/stores/cart.js`](./src/stores/cart.js)

```js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useProductStore } from './products'

export const useCartStore = defineStore('cart', () => {
  // 在 setup function 內直接呼叫另一個 store
  const productStore = useProductStore()
  const items = ref([])

  function addToCart(product) {
    // ... 加入 cart 後扣 product 庫存
    productStore.decreaseInventory(product.id)
  }

  return { items, addToCart }
})
```

### 重點

- store 之間的相依性是**合法且常見的**
- 唯一限制：別寫成「A 引用 B、B 引用 A」的循環引用
- 元件層也能同時取用兩個 store（見 `ProductList.vue`）

---

## 7. Action 中呼叫 API（呼應第 17 章）

第 17 章教過 `loading / error / data` 三態 pattern；第 14 章教過抽成 `useFetch()` composable。**這節展示第三種收納地點：把它放進 store**。

**檔案**：[`src/stores/posts.js`](./src/stores/posts.js)

```js
import { defineStore } from 'pinia'
import { ref } from 'vue'

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

  return { posts, status, error, fetchPosts }
})
```

### 何時用 store 而不是 composable？

| 需求 | 用什麼 |
|---|---|
| 一個元件抓資料，其他元件不關心 | **composable**（每個元件呼叫 `useFetch()` 拿到自己的 instance） |
| 多個元件要看到**同一份**資料 | **store**（全 app 只有一份 `posts.value`） |
| 要在路由切換間 cache 結果 | **store**（composable 隨元件 destroy 會消失） |
| 要在 DevTools 看到 state 變動 | **store**（composable 沒有 panel） |

> 簡單原則：**個別元件用 composable、跨元件用 store**。本範本的 `PostList.vue` 只有一個 component 在用 posts store，純粹是為了示範；實際專案如果只有一個 user，用 composable 即可。

---

## 8. Persistedstate plugin

**痛點**：使用者調好的主題、語言、表格欄位寬度、最近搜尋條件…重新整理頁面全部消失。

**手動解法**：在 store 內手寫 `watch(state, (v) => localStorage.setItem(...))` 跟 `onMounted(() => state.value = JSON.parse(localStorage.getItem(...)))`。可行但每個 store 都要重抄。

**Plugin 解法**：[`pinia-plugin-persistedstate`](https://prazdevs.github.io/pinia-plugin-persistedstate/) 只要在 store 加一行 `persist: true`。

### 安裝與註冊

```sh
npm install pinia-plugin-persistedstate
```

```js
// main.js
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
```

### 啟用

**檔案**：[`src/stores/preferences.js`](./src/stores/preferences.js)

```js
export const usePreferencesStore = defineStore(
  'preferences',
  () => {
    const theme = ref('light')
    const locale = ref('zh-TW')
    function toggleTheme() {
      theme.value = theme.value === 'light' ? 'dark' : 'light'
    }
    return { theme, locale, toggleTheme }
  },
  {
    persist: true, // ← 整個 store 自動同步到 localStorage
  },
)
```

### 驗證

1. 打開 demo，切換 theme 或 locale
2. F12 → Application → Local Storage → `http://localhost:5173`
3. 看到 key 為 `preferences`、value 為 `{"theme":"dark","locale":"en"}` 的紀錄
4. 重新整理頁面，主題與語言保留

### 進階設定

預設行為：用 `localStorage`、key 為 store id、所有 state 都存。需要客製時 `persist` 可以給物件：

```js
{
  persist: {
    storage: sessionStorage,             // 改用 sessionStorage
    key: 'app:preferences',              // 自訂 key
    pick: ['theme'],                     // 只持久化 theme，不存 locale
  },
}
```

### ⚠️ 不要持久化的東西

- API 抓回來的資料（`posts`）— 應該每次重新抓最新
- 暫時性 UI 狀態（modal 開關、selected tab）
- 機密資訊（access token 通常該放 httpOnly cookie，不該放 localStorage）

---

## 9. Pinia vs Composable（呼應第 14 章）

第 14 章建議：「**個別元件用 composable、跨元件用 store**」。這節更具體：

| 你想做的事 | Composable | Store |
|---|---|---|
| 把元件邏輯抽出來重用 | ✅ 適合 | ❌ 殺雞用牛刀 |
| 跨元件共享同一份 state | ⚠️ 全域變數陷阱 | ✅ 設計來做這個 |
| 抓 API 後 cache 結果給多頁用 | ❌ 元件 destroy 就丟 | ✅ 自然保留 |
| 需要 DevTools 看 state 變動 | ❌ | ✅ |
| 需要 hot module replacement 友善 | ⚠️ | ✅ |
| 需要持久化到 localStorage | 自己寫 watch | ✅ plugin 一行解決 |

> 它們不是二選一。**很多 store 內部會用 composable 抽邏輯**（例如 store 內部用 `useEventListener` 監聽 window event）。

---

## 常見錯誤

### 1. 直接解構 store 失去響應性

```js
const { count } = useCounterStore() // ❌
```

用 `storeToRefs(store)` 解構 state / getter，action 直接解構 OK。

### 2. 在 setup function **外部**呼叫 `useStore()`

```js
// stores/cart.js — 模組頂層呼叫 ❌
const productStore = useProductStore()

export const useCartStore = defineStore('cart', () => { ... })
```

要放在 `defineStore` 的 setup function **內部**，否則執行時 Pinia 還沒裝好。

### 3. 改 state 不透過 action

技術上 `store.count++` 是可以的（Pinia 允許直接 mutate state），但這樣 DevTools 的「操作來源」會變成元件名而不是 action 名，debug 困難。**寫 action 集中修改邏輯，是 Pinia 的核心好處**。

### 4. 多個 store 互相 import 變循環依賴

```js
// stores/a.js 引用 stores/b
// stores/b.js 引用 stores/a   ← 循環
```

解法是把共用 state 拉到第三個 store，或重新設計依賴方向。

### 5. Persistedstate 持久化了不該持久的東西

預設 `persist: true` 會把 store 內所有 state 都存到 localStorage。如果 store 內有 API 抓的資料、暫時 UI 狀態、機密資訊，要用 `persist.pick` 指定哪些欄位才存。

---

## 練習題

1. **基礎**：在 counter store 加一個 `decrement` action 跟 `tripleCount` getter，並在 `Counter.vue` 加按鈕觸發。
2. **跨 store**：在 cart store 加一個 `availableTotal` getter，回傳「目前 cart 內所有商品 × 商品在 products store 的庫存」乘積總和。注意要從 productStore 取最新庫存。
3. **API store**：仿照 `posts.js`，寫一個 `useUsersStore`，從 `/users` endpoint 抓資料。要求：增加一個 `cachedAt` 欄位記錄抓取時間，當 `cachedAt` 距現在小於 60 秒時 `fetchUsers()` 直接 short-circuit 不重抓。
4. **Persistedstate**：在 preferences store 多加一個 `recentSearch: ref([])`，但只持久化 `theme` 跟 `locale`（用 `persist.pick`）。確認重整後 `recentSearch` 被重置為空陣列。
5. **進階**：把 `posts.js` 拆成 `usePostsStore`（state + actions）跟 `usePostsApi` composable（純 fetch 邏輯），兩者搭配使用。觀察 store 變得多薄、composable 多容易單獨測試。

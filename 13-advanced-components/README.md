# 13 — 元件進階

> Vue 三個內建的進階元件：`<Teleport>`、`<Suspense>`、`<KeepAlive>`。
> 在做實務專案時幾乎一定會碰到。

## 章節目標

1. 用 `<Teleport>` 解決 modal / toast / tooltip 的「跑出父容器」需求
2. 用 `<Suspense>` 配合 `defineAsyncComponent` 做非同步元件 + 載入畫面
3. 用 `<KeepAlive>` 保留動態元件在切換時的狀態

---

## 目錄
- [1. Teleport](#1-teleport)
- [2. Suspense + defineAsyncComponent](#2-suspense--defineasynccomponent)
- [3. KeepAlive](#3-keepalive)
- [何時用、何時不用](#何時用何時不用)
- [練習題](#練習題)

---

## 1. Teleport

**檔案**：[`src/components/01-Teleport/ModalDemo.vue`](./src/components/01-Teleport/ModalDemo.vue)

### 它在解決什麼問題？

寫 modal 時你會發現：
- 父元素加了 `overflow: hidden` → modal 被裁切
- 父元素加了 `transform` → `position: fixed` 變成相對於父元素，不再對著 viewport
- 父元素的 `z-index` 太低 → modal 被別的元素蓋住

這些不是 modal 的錯，是 modal 在 DOM 樹的「位置」不對。Modal 在邏輯上屬於某個元件，但**在渲染上**應該是 `<body>` 的直接子節點。

`<Teleport>` 讓你維持「邏輯上寫在子元件裡」，但「實際渲染到指定位置」。

### 基本語法

```vue
<template>
  <button @click="open = true">Open</button>

  <Teleport to="body">
    <div v-if="open" class="modal-overlay">
      <div class="modal">...</div>
    </div>
  </Teleport>
</template>
```

`to` 可以是：
- CSS 選擇器字串：`"body"`、`"#modal-root"`、`".my-portal"`
- 真實 DOM 元素

被 Teleport 包住的內容，會被 Vue **搬到**目標位置，但邏輯上仍綁定原本的元件（props、events、reactivity 都正常）。

### 補充屬性

| 屬性 | 用途 |
|------|------|
| `to` | 目標位置 |
| `disabled` | 動態關閉 Teleport（內容回到原位） |
| `defer` | 等待 mount 完成後才執行 Teleport（target 是動態渲染的元素時使用） |

### 常見用例

- **Modal**：覆蓋整個 viewport 的對話框
- **Toast / Notification**：彈出訊息固定在角落
- **Tooltip / Popover**：避開父容器 `overflow: hidden` 裁切
- **Dropdown menu**：下拉選單延伸出容器邊界

---

## 2. Suspense + defineAsyncComponent

**檔案**：
- [`src/components/02-Suspense/AsyncProfile.vue`](./src/components/02-Suspense/AsyncProfile.vue)
- [`src/components/02-Suspense/HeavyChart.vue`](./src/components/02-Suspense/HeavyChart.vue)
- [`src/components/02-Suspense/SuspenseDemo.vue`](./src/components/02-Suspense/SuspenseDemo.vue)

### 兩種非同步情境

| 情境 | 工具 | 用例 |
|------|------|------|
| 子元件要等資料 | `<script setup>` 內 top-level `await` | API 載入後才能渲染 |
| 子元件 JS 本身要等下載 | `defineAsyncComponent` | code splitting（路由懶載、巨大圖表元件） |

兩種情境都靠 `<Suspense>` 提供載入畫面。

### 情境 A：top-level await

```vue
<!-- AsyncProfile.vue -->
<script setup>
const res = await fetch('/api/user')
const user = await res.json()
</script>

<template>
  <div>{{ user.name }}</div>
</template>
```

```vue
<!-- 父元件 -->
<Suspense>
  <AsyncProfile />
  <template #fallback>
    <div>載入中...</div>
  </template>
</Suspense>
```

> ⚠️ **重要**：用了 top-level await 的元件，**外部一定要包 `<Suspense>`**，否則會跳警告而且渲染不出來。

### 情境 B：defineAsyncComponent（code splitting）

```vue
<script setup>
import { defineAsyncComponent } from 'vue'

// 把 import() 包進 defineAsyncComponent
// 這個元件的 JS 變成獨立 chunk，第一次顯示時才下載
const HeavyChart = defineAsyncComponent(() => import('./HeavyChart.vue'))
</script>

<template>
  <Suspense>
    <HeavyChart />
    <template #fallback>
      <div>下載中...</div>
    </template>
  </Suspense>
</template>
```

打開 Network 面板會看到，第一次出現 `HeavyChart` 時才下載對應的 JS chunk。

### 進階：自訂 loading / error / timeout

```js
const HeavyChart = defineAsyncComponent({
  loader: () => import('./HeavyChart.vue'),
  loadingComponent: LoadingSpinner,    // 載入中顯示
  errorComponent: ErrorPage,            // 載入失敗顯示
  delay: 200,                            // 等 200ms 再顯示 loading（避免閃爍）
  timeout: 3000,                         // 3 秒超時當失敗
})
```

> Suspense 在 Vue 3.5 仍標記為「實驗性」（Experimental），API 可能會調整。
> 多數情況穩定可用，但留意官方公告。

---

## 3. KeepAlive

**檔案**：
- [`src/components/03-KeepAlive/CounterTab.vue`](./src/components/03-KeepAlive/CounterTab.vue)
- [`src/components/03-KeepAlive/InputTab.vue`](./src/components/03-KeepAlive/InputTab.vue)
- [`src/components/03-KeepAlive/KeepAliveDemo.vue`](./src/components/03-KeepAlive/KeepAliveDemo.vue)

### 它在解決什麼問題？

```vue
<component :is="currentTab" />
```

切換 `currentTab` 時，Vue **預設行為**：
1. 把舊元件 unmount（destroy 狀態）
2. 把新元件 mount（新狀態歸零）

對 tab 切換來說這通常**不是**你要的。你希望切回原 tab 時看到之前打到一半的字、累積的 count。

### 用 KeepAlive 包起來

```vue
<KeepAlive>
  <component :is="currentTab" />
</KeepAlive>
```

被切走的元件不會被 destroy，只是暫存——所以切回來時狀態還在。

### 兩個新的生命週期 hook

被 KeepAlive 管理的元件，多了兩個專屬 hook：

| Hook | 何時觸發 |
|------|----------|
| `onActivated` | 被切回來、重新顯示時 |
| `onDeactivated` | 被切走、隱藏時 |

```js
import { onActivated, onDeactivated } from 'vue'

onActivated(() => {
  // 例如：重新整理快過期的資料
})

onDeactivated(() => {
  // 例如：暫停 timer
})
```

> `onMounted` 只在第一次掛載時觸發；後續切換用 `onActivated` / `onDeactivated`。

### `<KeepAlive>` 屬性

| 屬性 | 用途 |
|------|------|
| `include` | 只快取符合的元件名稱（字串、正規式或陣列） |
| `exclude` | 排除符合的元件 |
| `max` | 最多快取幾個（LRU 快取，超過會丟舊的） |

```vue
<KeepAlive :include="['CounterTab', 'InputTab']" :max="5">
  <component :is="currentTab" />
</KeepAlive>
```

---

## 何時用、何時不用

| 元件 | 該用 | 不該用 |
|------|------|--------|
| **Teleport** | modal、toast、tooltip、需要覆蓋 viewport 的元素 | 一般元件、不需要跨越父容器邊界的東西 |
| **Suspense** | async setup、code splitting 的大型元件 | 一般同步元件、簡單的 loading 狀態（直接用 `v-if isLoading` 更簡單） |
| **KeepAlive** | tab 切換、表單分步、想保留狀態的動態元件 | 元件狀態必須每次重置的場景（如：訂單編輯結束後切到下一張） |

---

## 練習題

1. **Teleport**：寫一個 Toast 通知元件，呼叫後出現在右上角、3 秒後自動消失。用 `<Teleport to="body">` 確保它不被任何父容器影響。

2. **Suspense**：寫一個 `<UserCard userId="1">` 元件，內部用 top-level await 抓 `https://jsonplaceholder.typicode.com/users/{userId}`。外部用 Suspense 顯示載入狀態。

3. **KeepAlive 進階**：寫一個三 tab 的設定頁（基本資料、安全性、通知偏好）。每個 tab 都有未存檔的表單狀態。用 KeepAlive 確保切換不會遺失。

4. **綜合**：把第 1 題的 Toast 改成「Toast 觸發後自動載入一個 `<AsyncIcon>` 元件」（用 `defineAsyncComponent` + Suspense）。這樣 toast 即使有複雜內容也不會卡住主畫面。

---

## 延伸閱讀
- [Teleport](https://vuejs.org/guide/built-ins/teleport.html)
- [Suspense](https://vuejs.org/guide/built-ins/suspense.html)
- [KeepAlive](https://vuejs.org/guide/built-ins/keep-alive.html)
- [defineAsyncComponent](https://vuejs.org/api/general.html#defineasynccomponent)

---

## 啟動專案

```sh
npm install
npm run dev
```

# 09 — 生命週期（Composition API + Options API 附錄）

> 元件從建立到銷毀的各個時間點，Vue 都提供 hook 讓你插入程式碼。
> 本章主軸是 Composition API；最後附上 Options API 對照表供讀懂舊程式碼。

## 章節目標

1. 掌握 6 個常用的 Composition API 生命週期 hook
2. 理解什麼時候必須在 `onUnmounted` 清理資源（防止記憶體洩漏）
3. 讀得懂 Options API 的 8 個生命週期 hook（讀舊程式碼用）

---

## 目錄
- [1. 元件的生命週期是什麼](#1-元件的生命週期是什麼)
- [2. 六個常用 hook](#2-六個常用-hook)
- [3. 實戰：在 `onUnmounted` 清理資源](#3-實戰在-onunmounted-清理資源)
- [4. 還有哪些不常用的 hook](#4-還有哪些不常用的-hook)
- [5. 📎 附錄：Options API 對照](#5--附錄options-api-對照)
- [練習題](#練習題)

---

## 1. 元件的生命週期是什麼

一個 Vue 元件從「**被父元件 mount 進來**」到「**被 unmount 移除**」中間會經過多個階段：

```
父元件決定渲染子元件
        ↓
   onBeforeMount    ← script 已執行、DOM 即將寫入
        ↓
   [Vue 渲染 DOM 到頁面上]
        ↓
   onMounted        ← DOM 已存在、可以操作 DOM 或啟動副作用
        ↓
   [使用者互動，狀態改變]
        ↓
   onBeforeUpdate   ← 資料變了、DOM 即將重新渲染
        ↓
   onUpdated        ← DOM 已更新完
        ↓
   [父元件決定移除子元件 / 路由切換 / v-if 變 false]
        ↓
   onBeforeUnmount  ← 元件即將從 DOM 移除（最後機會清理）
        ↓
   onUnmounted      ← 元件已消失
```

Vue 在每個階段「敲門」一次，你可以在對應 hook 內塞程式碼進去執行。

---

## 2. 六個常用 hook

**檔案**：
- [`src/components/01-Hooks/ChildWithHooks.vue`](./src/components/01-Hooks/ChildWithHooks.vue)
- [`src/components/01-Hooks/HooksDemo.vue`](./src/components/01-Hooks/HooksDemo.vue)

```js
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
} from 'vue'

onBeforeMount(() => { /* DOM 還沒寫入 */ })
onMounted(() => { /* DOM 已寫入；最常用 */ })
onBeforeUpdate(() => { /* 資料變了，DOM 即將重渲 */ })
onUpdated(() => { /* DOM 已更新完 */ })
onBeforeUnmount(() => { /* 元件即將消失；最後機會清理 */ })
onUnmounted(() => { /* 元件已消失 */ })
```

### 各 hook 的典型用途

| Hook | 何時用 |
|------|--------|
| `onBeforeMount` | 極少用。多數狀態初始化在 `<script setup>` top-level 寫就好 |
| **`onMounted`** | **最常用**。需要 DOM 元素才能跑的程式碼（focus、第三方 lib 初始化、fetch API） |
| `onBeforeUpdate` | 偶爾用。在 DOM 更新前抓 DOM 舊狀態（例如滾動位置） |
| `onUpdated` | 偶爾用。需要在新 DOM 上做事；多數情況用 watch 更精準 |
| `onBeforeUnmount` | 元件還能存取 DOM、subscriptions 的最後機會 |
| **`onUnmounted`** | **第二常用**。清理 `setInterval`、`addEventListener`、WebSocket 等 |

### 為什麼 `<script setup>` 沒有 `onCreated` / `onBeforeCreate`？

因為 `<script setup>` 的 **script 本身**就在 Options API 的 `beforeCreate` 到 `created` 之間執行。
你想做的初始化直接寫 top-level 程式碼就好：

```vue
<!-- Options API -->
<script>
export default {
  data() { return { count: 0 } },
  created() {
    console.log('已初始化', this.count)
  }
}
</script>

<!-- Composition API：跟上面等價 -->
<script setup>
import { ref } from 'vue'
const count = ref(0)
console.log('已初始化', count.value)  // 直接寫就是 created 階段
</script>
```

---

## 3. 實戰：在 `onUnmounted` 清理資源

**檔案**：
- [`src/components/02-PracticalTimer/TimerCore.vue`](./src/components/02-PracticalTimer/TimerCore.vue)
- [`src/components/02-PracticalTimer/PracticalDemo.vue`](./src/components/02-PracticalTimer/PracticalDemo.vue)

99% 的 `onUnmounted` 用途都是「**清掉在 `onMounted` 建立的資源**」。

```js
import { onMounted, onUnmounted } from 'vue'

let intervalId = null

onMounted(() => {
  intervalId = setInterval(() => {
    // 做事
  }, 1000)
})

onUnmounted(() => {
  clearInterval(intervalId)  // 不清掉就會記憶體洩漏
})
```

### 為什麼非清不可？

元件被 unmount 後，**JavaScript 物件不會立刻被 GC**——任何持續引用它的 callback（例如 setInterval）都會把它「拉」在記憶體裡。
更糟糕的是 callback 還會繼續執行，可能會：
- 嘗試修改已不存在的 ref，造成錯誤
- 持續發 API 請求
- 累積大量 listener 把記憶體吃光

### 需要清理的常見資源

| 資源 | 設定 | 清理 |
|------|------|------|
| 計時器 | `setInterval` / `setTimeout` | `clearInterval` / `clearTimeout` |
| 事件監聽 | `addEventListener` | `removeEventListener` |
| WebSocket | `new WebSocket()` | `socket.close()` |
| 第三方 lib | `init()` | 對應的 `destroy()` |
| Pinia subscribe / watch 手動建立 | `store.$subscribe(...)` | `unsubscribe()` |

> 💡 **更好的做法**：把資源 + 清理邏輯包進 **composable**（第 14 章）。
> 例如 `useEventListener(el, 'scroll', fn)` 內部自己處理 add/remove。

---

## 4. 還有哪些不常用的 hook

| Hook | 用途 |
|------|------|
| `onActivated` | 被 `<KeepAlive>` 切回顯示（第 13 章已介紹） |
| `onDeactivated` | 被 `<KeepAlive>` 切走（第 13 章已介紹） |
| `onErrorCaptured` | 捕捉子孫元件拋出的錯誤（錯誤邊界） |
| `onRenderTracked` | （DEV only）追蹤渲染依賴；除錯用 |
| `onRenderTriggered` | （DEV only）追蹤觸發重渲；除錯用 |
| `onServerPrefetch` | SSR 時使用（Nuxt 內部會用到） |

九成的時間你只會用到 6 個常用 hook + `onActivated` / `onDeactivated`。

---

## 5. 📎 附錄：Options API 對照

**檔案**：
- [`src/components/03-Appendix/OptionsApiChild.vue`](./src/components/03-Appendix/OptionsApiChild.vue)
- [`src/components/03-Appendix/AppendixDemo.vue`](./src/components/03-Appendix/AppendixDemo.vue)

> 新專案一律用 Composition API。Options API 在這裡只列出來給你**讀懂舊程式碼**。

### 對照表

| Options API | Composition API | 說明 |
|-------------|-----------------|------|
| `beforeCreate` | — | 被 `<script setup>` 取代 |
| `created` | — | 被 `<script setup>` 取代 |
| `beforeMount` | `onBeforeMount` | DOM 即將掛載 |
| `mounted` | `onMounted` | DOM 已掛載（最常用） |
| `beforeUpdate` | `onBeforeUpdate` | DOM 即將更新 |
| `updated` | `onUpdated` | DOM 已更新 |
| `beforeUnmount` | `onBeforeUnmount` | 元件即將卸載 |
| `unmounted` | `onUnmounted` | 元件已卸載 |

### 寫法對照

```vue
<!-- Options API -->
<script>
export default {
  data() { return { count: 0 } },
  mounted() {
    console.log('已掛載', this.count)
  },
  unmounted() {
    console.log('已卸載')
  }
}
</script>

<!-- Composition API（建議寫法） -->
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const count = ref(0)

onMounted(() => {
  console.log('已掛載', count.value)
})

onUnmounted(() => {
  console.log('已卸載')
})
</script>
```

差別：
- Options API 把 hook 散落在 `mounted`、`unmounted` 等 key 下；資料在 `data()`、方法在 `methods` 內
- Composition API 用 import 進來的函式，**相關邏輯可以寫在一起**——例如 timer 的 `onMounted` + `onUnmounted` 緊鄰

---

## 練習題

1. **基礎**：寫一個元件，在 `onMounted` 把 `<h1>` 標題改成「Hello」、`onBeforeUnmount` 改成「Bye」（用 template ref，第 10 章）。

2. **資源清理**：寫一個 `useWindowSize()` composable，在 `onMounted` 監聽 `window.resize`、`onUnmounted` 移除。記得回傳 `{ width, height }` 兩個 ref。

3. **抽進 composable**：把第 3 章的計時器邏輯抽成 `useTimer()` composable。回傳 `{ seconds, reset }`。

4. **路由切換**：建立一個有兩個分頁的 demo（用 `v-if` 或 `<component :is>`），其中一個包含計時器子元件。切到另一個分頁觀察計時器子元件是否被 unmount，timer 是否被清掉。

5. **進階**：寫一個 `onErrorCaptured` 範例——父元件捕捉子元件拋出的錯誤，顯示「發生錯誤，請重試」UI 而非整個 app 崩潰。

---

## 延伸閱讀
- 官方文件：[Lifecycle Hooks](https://vuejs.org/guide/essentials/lifecycle.html)
- 官方文件：[Lifecycle API](https://vuejs.org/api/composition-api-lifecycle.html)

---

## 啟動專案

```sh
npm install
npm run dev
```

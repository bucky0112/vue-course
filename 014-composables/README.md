# 14 — Composables（組合式函式）

> 這是整個 Composition API 的價值所在。學完前面 13 章只是會用 Vue，學完這一章才開始能「設計」Vue。

## 目錄
- [為什麼需要 Composable？](#為什麼需要-composable)
- [命名與基本結構](#命名與基本結構)
- [範例 1：useCounter — 最簡單的入門](#範例-1usecounter--最簡單的入門)
- [範例 2：useMouse — 加入生命週期](#範例-2usemouse--加入生命週期)
- [範例 3：useLocalStorage — 加入 watch](#範例-3uselocalstorage--加入-watch)
- [範例 4：useFetch — 非同步三態](#範例-4usefetch--非同步三態)
- [重構實戰：useTodoList 跨元件重用](#重構實戰usetodolist-跨元件重用)
- [設計指引](#設計指引)
- [常見錯誤](#常見錯誤)
- [Composable vs Pinia store](#composable-vs-pinia-store)
- [練習題](#練習題)

---

## 為什麼需要 Composable？

當你寫到第 5、6 個元件時，會發現幾段邏輯不斷重複出現：
- 監聽滑鼠座標
- 把狀態存到 localStorage
- 抓 API（loading / error / data）
- 表單驗證
- 控制 modal 開關

**Composable 就是「把這些重複邏輯抽成可以重用的 function」。**

> 在 Vue 2 時代這件事是用 `Mixin` 處理的，但 Mixin 有命名衝突、來源不清等問題。Composable 完全沒有這些缺點，因為它就是普通的 JavaScript function。

---

## 命名與基本結構

```js
// src/composables/useXxx.js
import { ref } from 'vue'

export function useXxx() {
  // 1. 宣告響應式狀態
  const state = ref(0)

  // 2. 定義操作狀態的函式
  const doSomething = () => { state.value++ }

  // 3. 回傳給呼叫者
  return { state, doSomething }
}
```

| 慣例 | 內容 |
|------|------|
| **檔名 / 函式名** | `useXxx`（小駝峰 + `use` 前綴） |
| **位置** | `src/composables/` 資料夾 |
| **單獨匯出** | 用 `export function useXxx()`，不要 default export |
| **回傳值** | 物件 `{ state, methods }`，方便解構 |

---

## 範例 1：useCounter — 最簡單的入門

**檔案**：[`src/composables/useCounter.js`](./src/composables/useCounter.js)

```js
import { ref } from 'vue'

export function useCounter(initial = 0, step = 1) {
  const count = ref(initial)
  const increment = () => { count.value += step }
  const decrement = () => { count.value -= step }
  const reset = () => { count.value = initial }
  return { count, increment, decrement, reset }
}
```

### 使用方式

```vue
<script setup>
import { useCounter } from '@/composables/useCounter'

const a = useCounter(0, 1)    // a.count 從 0 開始，每次 +1
const b = useCounter(100, 10) // b.count 從 100 開始，每次 +10
</script>
```

### 重點觀察

每呼叫一次 `useCounter()` 就會建立一份**全新的 `count`**。a 跟 b 互不干擾——這是 composable 跟全域 store 最大的差別：

| | Composable | Pinia store |
|---|------------|-------------|
| 每次呼叫 | 新建一份狀態 | 取得同一份共享狀態 |
| 適合場景 | 邏輯重用 | 跨元件共享資料 |

---

## 範例 2：useMouse — 加入生命週期

**檔案**：[`src/composables/useMouse.js`](./src/composables/useMouse.js)

```js
import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  const update = (e) => {
    x.value = e.pageX
    y.value = e.pageY
  }

  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  return { x, y }
}
```

### 重點觀察

`onMounted` / `onUnmounted` **可以寫在 composable 裡**——它們會綁定到呼叫這個 composable 的元件上。這就是 Composition API 「邏輯內聚」的核心優勢：相關的程式碼寫在一起。

> 對照 Options API：你需要在元件的 `mounted`、`unmounted`、`methods` 三個地方分別寫一段，每段都跟同一個功能有關，卻散落在不同位置。

---

## 範例 3：useLocalStorage — 加入 watch

**檔案**：[`src/composables/useLocalStorage.js`](./src/composables/useLocalStorage.js)

```js
import { ref, watch } from 'vue'

export function useLocalStorage(key, defaultValue) {
  const stored = localStorage.getItem(key)
  const data = ref(stored !== null ? JSON.parse(stored) : defaultValue)

  watch(data, (value) => {
    localStorage.setItem(key, JSON.stringify(value))
  }, { deep: true })

  return data
}
```

### 重點觀察
- **回傳單一 ref 而不是物件**：這個 composable 只有一個值要回傳，直接回 ref 比 `{ data }` 簡潔。使用端寫 `const name = useLocalStorage('name', '')`，搭配 `v-model="name"` 就能用。
- **`deep: true`**：物件 / 陣列內部欄位變動也要寫回。沒加 deep，改 `settings.theme` 不會觸發 watch。
- **初始化讀一次 localStorage**：composable 內部處理掉「讀取現有值」這件事，使用端完全不用碰 localStorage API。

---

## 範例 4：useFetch — 非同步三態

**檔案**：[`src/composables/useFetch.js`](./src/composables/useFetch.js)

```js
import { ref } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)
  const isLoading = ref(false)

  const execute = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      data.value = await response.json()
    } catch (e) {
      error.value = e
    } finally {
      isLoading.value = false
    }
  }

  execute()

  return { data, error, isLoading, refetch: execute }
}
```

### 重點觀察
- **三個獨立的 ref**：模板上常常各自判斷顯示什麼（loading 顯示 spinner、error 顯示錯誤訊息、data 顯示資料）。
- **`refetch` 是 `execute` 的別名**：回傳給呼叫者一個可以「重新觸發」的方法。
- **構造時就執行一次**：使用端 `const { data } = useFetch(url)` 後就會自動發請求，符合 90% 場景的預期。

> 注意：這只是 composable 模式的示範。完整的 API 串接需要處理「取消請求、競態、重試、認證」等，會在 **第 17 章 API 串接** 完整講解。

---

## 重構實戰：useTodoList 跨元件重用

這是這章的高潮。我們把同一份待辦清單邏輯給兩個樣式完全不同的元件共用。

**抽出的 composable**：[`src/composables/useTodoList.js`](./src/composables/useTodoList.js)

### 對照三個檔案

| 檔案 | 角色 |
|------|------|
| [`BeforeRefactor.vue`](./src/components/05-Refactor/BeforeRefactor.vue) | ❌ 邏輯寫在元件內 |
| [`AfterRefactorA.vue`](./src/components/05-Refactor/AfterRefactorA.vue) | ✅ 用 `useTodoList`，普通列表呈現 |
| [`AfterRefactorB.vue`](./src/components/05-Refactor/AfterRefactorB.vue) | ✅ 用 `useTodoList`，分成「進行中 / 已完成」 |

### 觀察重點

在頁面上分別操作 After A 跟 After B，會發現：
1. 兩個元件用的是**同一個 `useTodoList`** function。
2. 但 A 的待辦不會出現在 B 裡——**每次呼叫產生獨立狀態**。
3. 同樣的 `items`、`add`、`remove`、`toggle`、`remaining`，A 用列表渲染、B 用分組渲染——**呈現由元件決定，邏輯由 composable 提供**。

這就是 composable 的核心價值：**邏輯與呈現分離**。

---

## 設計指引

### 回傳值該用什麼型態？

| 情況 | 回傳什麼 | 範例 |
|------|----------|------|
| 只有一個值 | 直接回 ref | `useLocalStorage` → `ref` |
| 多個值 + 多個方法 | 回物件 | `useCounter` → `{ count, increment, ... }` |
| 想要強制呼叫端解構命名 | 回物件 | 同上 |
| 想要回傳「函式為主」（執行後得結果）| 回函式 | `const fetch = useLazyFetch(url); fetch()` |

### 副作用一定要清理

只要在 composable 內用了 `addEventListener`、`setInterval`、`subscribe` 之類的東西，**一定要在 `onUnmounted` 對應清理**。否則元件 unmount 後事件繼續觸發，導致記憶體洩漏或錯誤。

### 命名要說明「做什麼」

| ❌ 不好 | ✅ 好 |
|---------|------|
| `useData()` | `useUserProfile()` |
| `useUtil()` | `useDebouncedSearch()` |
| `useStuff()` | `useScrollPosition()` |

---

## 常見錯誤

### 1. 解構回傳值卻失去響應性

```js
// ❌ 錯：count 變成普通數字，畫面不會更新
const { count } = useCounter()
console.log(count) // 是 ref，但...

// 把 count 傳出去後失去 ref 包裝？
// 不會。ref 解構出來還是 ref。
// 但若 composable 回 reactive(...)，解構就會壞。
```

正確的設計：**composable 回傳的應該是 ref 構成的物件**，這樣解構不會失去響應性。

### 2. 把 composable 當 store 用

```js
// ❌ 想要兩個元件共享同一份待辦
// 但每個元件各自呼叫 useTodoList()，會得到兩份獨立狀態
```

需要跨元件共享狀態？用 **Pinia**（第 18 章），不是 composable。

### 3. 在條件式裡呼叫 composable

```js
// ❌ Vue 不允許這樣
if (isLoggedIn.value) {
  const { user } = useUser()
}
```

Composable（跟 ref/reactive/watch 一樣）**必須在 `<script setup>` 頂層或另一個 composable 內呼叫**——不能放進 if/for/callback。

---

## Composable vs Pinia store

很多人初學會搞混兩者。一句話區分：

> **Composable 是「邏輯模板」，每個元件拿到一份拷貝。**
> **Pinia store 是「共享資料」，所有元件指向同一份。**

| 場景 | 工具 |
|------|------|
| 滑鼠座標、視窗大小、捲動位置 | Composable（每個元件獨立） |
| 表單驗證、計數器、開關 | Composable |
| 登入使用者、購物車、全域設定 | Pinia store |
| 同份待辦清單要顯示在兩個元件 | Pinia store |

---

## 練習題

1. **改造 useCounter**：加上 `isPositive`（computed）和 `max` 上限參數，超過上限就不能 increment。
2. **寫 useToggle**：給定初始值（boolean），回傳 `{ value, toggle, setTrue, setFalse }`。
3. **寫 useWindowSize**：回傳 `{ width, height }`，視窗 resize 時自動更新（記得清理事件）。
4. **改造 useLocalStorage**：增加 `removeItem()` 方法。
5. **進階**：寫 `useDebounce(value, delay)`，傳入一個 ref 跟延遲毫秒數，回傳一個「延後 N 毫秒才更新」的新 ref。

---

## 延伸閱讀
- 官方文件：[Composables](https://vuejs.org/guide/reusability/composables.html)
- 業界標配 composable 集合：[VueUse](https://vueuse.org/) — 下一章會介紹

---

## 啟動專案

```sh
npm install
npm run dev
```

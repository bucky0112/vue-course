# 15 — VueUse 實戰

> 「不要重造輪子」的章節。Vue 生態系標配的 composable 集合庫。

## 章節目標

1. 認識 VueUse 是什麼、為什麼業界都在用
2. 比對第 14 章的 hand-rolled composable 跟 VueUse 的差異
3. 用 5 個常用 composable 解決實際問題
4. 學會自己探索 VueUse 文件，找到需要的工具

---

## 目錄
- [1. VueUse 是什麼](#1-vueuse-是什麼)
- [2. 安裝](#2-安裝)
- [3. 你在第 14 章寫過的 useMouse / useFetch](#3-你在第-14-章寫過的-usemouse--usefetch)
- [4. useLocalStorage](#4-uselocalstorage)
- [5. refDebounced](#5-refdebounced)
- [6. useDark](#6-usedark)
- [7. useClipboard](#7-useclipboard)
- [8. 如何探索 VueUse 文件](#8-如何探索-vueuse-文件)
- [9. 何時用 VueUse、何時自己寫](#9-何時用-vueuse何時自己寫)
- [練習題](#練習題)

---

## 1. VueUse 是什麼

> **[VueUse](https://vueuse.org/)** 是一個 Vue 3 的 composable 集合庫，超過 200 個 utility，
> 涵蓋瀏覽器 API、響應式工具、動畫、時間、感應器等。

它是 Vue 生態系**事實上的標配**——幾乎每個 Vue 專案都會用。
官方推薦、社群活躍、TypeScript 支援完整。

### 為什麼要用？

| 不用 VueUse | 用 VueUse |
|-------------|-----------|
| 每個專案重寫 useMouse、useLocalStorage、useFetch | 一行 import 解決 |
| 自己處理 edge case（卸載清理、SSR、TypeScript） | 已經幫你處理好 |
| 程式碼分散在各專案 | 大家用同一套 API |

---

## 2. 安裝

```sh
npm install @vueuse/core
```

> 只裝 `@vueuse/core` 就夠了，這是最常用的核心套件。
> 還有其他選用套件如 `@vueuse/integrations`（整合 axios、cookie 等）、`@vueuse/math` 等，視需求安裝。

用法跟你自己寫的 composable 完全一樣：

```js
import { useMouse, useLocalStorage } from '@vueuse/core'

const { x, y } = useMouse()
const name = useLocalStorage('user-name', '')
```

---

## 3. 你在第 14 章寫過的 useMouse / useFetch

**檔案**：[`src/components/01-AlreadyWrote.vue`](./src/components/01-AlreadyWrote.vue)

```js
import { useMouse, useFetch } from '@vueuse/core'

const { x, y } = useMouse()
const { data, error, isFetching } = useFetch(url).json()
```

### 為什麼第 14 章還要自己寫一遍？

> 因為你必須**先理解 composable 的內部運作**，才能：
> 1. 看懂 VueUse 在做什麼
> 2. 知道哪些是 VueUse 不在做、需要自己寫的
> 3. 在 VueUse 的工具不符合需求時，能客製化

如果第 14 章直接教 VueUse，學生會把 composable 當成黑盒子，遇到問題不知道從哪裡查起。

### VueUse 的版本多做了什麼？

| | 第 14 章你寫的 | VueUse 版本 |
|---|----------------|-------------|
| useMouse | 監聽 mousemove | 還支援 touch、page/client/screen 三種座標、可指定 target |
| useFetch | 基本三態 | chainable API（`.json()`、`.text()`、`.blob()`）、aborting、refetch on URL change、攔截器 |

---

## 4. useLocalStorage

**檔案**：[`src/components/02-LocalStorageDemo.vue`](./src/components/02-LocalStorageDemo.vue)

```js
import { useLocalStorage } from '@vueuse/core'

// 跟你寫的一樣，傳 key 跟 defaultValue
const name = useLocalStorage('user-name', '')

// 也支援物件、陣列，自動處理 JSON
const settings = useLocalStorage('settings', {
  fontSize: 16,
  theme: 'auto',
})

// 修改即時寫回
name.value = 'Alice'
settings.value.fontSize = 18
```

### VueUse 多做的事

- **自動 JSON 序列化**（你寫的也有，但這是基本款）
- **跨分頁同步**：多個分頁開同個網址，改 A 分頁的值會即時反映到 B 分頁
- **SSR 安全**：在 server 端不會炸（Nuxt 用得到）
- **自訂 serializer**：可以塞自訂的序列化邏輯（例如 Date、Map）

---

## 5. refDebounced

**檔案**：[`src/components/03-DebouncedSearch.vue`](./src/components/03-DebouncedSearch.vue)

```js
import { ref } from 'vue'
import { refDebounced } from '@vueuse/core'

const keyword = ref('')
const debouncedKeyword = refDebounced(keyword, 500)
// debouncedKeyword 在 keyword 停止變動 500ms 後才更新
```

### 經典用途

**Search-as-you-type**：使用者每打一個字就 fetch API 會炸後端。

```js
const keyword = ref('')
const debouncedKeyword = refDebounced(keyword, 500)

// 用 debounced 版本去 fetch，每停打 500ms 才送請求
const { data } = useFetch(
  computed(() => `/api/search?q=${debouncedKeyword.value}`),
).json()
```

### 相關工具

| Composable | 行為 |
|------------|------|
| `refDebounced(ref, ms)` | 延後更新 |
| `refThrottled(ref, ms)` | 節流（每 ms 最多更新一次） |
| `useDebounceFn(fn, ms)` | 把任意 function 加上 debounce |
| `useThrottleFn(fn, ms)` | 把任意 function 加上 throttle |

---

## 6. useDark

**檔案**：[`src/components/04-DarkMode.vue`](./src/components/04-DarkMode.vue)

```js
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
```

### useDark 做了什麼？

1. 偵測 `prefers-color-scheme: dark`（系統偏好）
2. 從 localStorage 讀取使用者的選擇（若有）
3. 在 `<html>` 元素加上 / 拿掉 `class="dark"`

**你只要寫好對應的 CSS** 即可：

```css
:root {
  --bg: white;
  --fg: black;
}

html.dark {
  --bg: #181818;
  --fg: #eaeaea;
}

body {
  background: var(--bg);
  color: var(--fg);
}
```

> 本章的 `src/assets/main.css` 就是這樣寫的，所以切換時整個頁面會跟著換配色。

### 進階：useColorMode

如果想支援三段切換（light / dark / auto），用 `useColorMode`：

```js
import { useColorMode } from '@vueuse/core'

const mode = useColorMode()
// mode.value 可以是 'light' / 'dark' / 'auto'
```

---

## 7. useClipboard

**檔案**：[`src/components/05-Clipboard.vue`](./src/components/05-Clipboard.vue)

```js
import { useClipboard } from '@vueuse/core'

const sourceText = ref('Hello!')
const { copy, copied, isSupported } = useClipboard({ source: sourceText })

// 在 template 裡：
// <button @click="copy()">{{ copied ? '✅' : '複製' }}</button>
```

### 回傳值

| 屬性 | 用途 |
|------|------|
| `copy(value?)` | 複製。傳值就複製這個值，不傳就複製 source |
| `copied` | ref<boolean>，剛剛複製過嗎？1.5 秒後自動 false |
| `text` | ref<string>，目前剪貼簿內容（需要瀏覽器授權） |
| `isSupported` | 瀏覽器支不支援 Clipboard API |

---

## 8. 如何探索 VueUse 文件

VueUse 有 200+ composable，背不下來。**重點是學會搜尋。**

### 文件首頁分類

開啟 [vueuse.org/functions](https://vueuse.org/functions.html)，左側 sidebar 有分類：

| 分類 | 範例 |
|------|------|
| **Animation** | `useTransition`、`useTimeline` |
| **Browser** | `useClipboard`、`useFullscreen`、`useNotification` |
| **Component** | `useTemplateRefsList`、`useVirtualList` |
| **Element** | `useElementSize`、`useElementVisibility`、`useDraggable` |
| **Network** | `useFetch`、`useOnline`、`useWebSocket` |
| **Sensors** | `useMouse`、`useScroll`、`useDeviceOrientation` |
| **State** | `useStorage`、`useToggle`、`useCounter` |
| **Utilities** | `useDebounceFn`、`useEventBus`、`useAsyncQueue` |

### 養成查找習慣

寫到任何「重複出現」的邏輯，先問：
> 「這個 VueUse 有沒有？」

例如：
- 想做 modal 開關 → `useToggle`
- 想偵測網路狀態 → `useOnline`
- 想做 IntersectionObserver → `useIntersectionObserver`
- 想攔截鍵盤事件 → `onKeyStroke`
- 想做拖曳 → `useDraggable`

---

## 9. 何時用 VueUse、何時自己寫

| 該用 VueUse | 該自己寫 |
|-------------|----------|
| 已是 VueUse 提供的工具 | 業務邏輯（你的 useCart、useUserProfile） |
| 通用 utility（debounce、storage、API 等） | 跟你公司 API 規格高度耦合的邏輯 |
| 跟瀏覽器 API 互動 | VueUse 的設計不符合需求 |

> **原則：能用 VueUse 解決的，不要自己寫。**
> 寫業務邏輯時把 VueUse composable 當成「組件」用，組合出你的 `useXxx`。

---

## 練習題

1. **存購物車**：用 `useLocalStorage` 寫一個購物車狀態，支援新增、移除、計算總價，重新整理後資料保留。

2. **debounce 搜尋 + fetch 串接**：結合 `refDebounced` 跟 `useFetch`，做一個查 GitHub 使用者的 demo（API：`https://api.github.com/users/{username}`）。

3. **網路狀態提示**：用 `useOnline` 在頁面右上角顯示「離線中」紅色 banner。

4. **元素可見偵測**：用 `useIntersectionObserver` 寫一個 lazy-load 圖片元件，圖片滑入畫面才載入。

5. **進階**：自己讀文件，找一個你覺得實用的 composable，寫個 demo 在這個專案內加一個 section。例如：`useEventListener`、`useVibrate`、`useFullscreen`、`useGeolocation`...

---

## 延伸閱讀
- [VueUse 官方文件](https://vueuse.org/)
- [VueUse 全部 functions 列表](https://vueuse.org/functions.html)
- [VueUse GitHub](https://github.com/vueuse/vueuse)

---

## 啟動專案

```sh
npm install
npm run dev
```

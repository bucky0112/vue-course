# 17 — API 串接

> 把第 14 章的 `useFetch` 加上「生產等級」必備的處理：競態、取消、重試、攔截器。

## 章節目標

1. 用 `loading / error / data` 三態 pattern 寫請求
2. 用 `AbortController` 解決競態（race condition）
3. 加上重試（retry）+ 指數退避（exponential backoff）
4. 用 `axios` 跟 interceptors 處理橫切關注點（auth、log、全域錯誤）

---

## 目錄
- [1. 三態 pattern 回顧](#1-三態-pattern-回顧)
- [2. 競態與 AbortController](#2-競態與-abortcontroller)
- [3. 重試 + 指數退避](#3-重試--指數退避)
- [4. axios + Interceptors](#4-axios--interceptors)
- [5. fetch vs axios 怎麼選](#5-fetch-vs-axios-怎麼選)
- [練習題](#練習題)

---

## 1. 三態 pattern 回顧

**檔案**：[`src/components/01-ThreeStates.vue`](./src/components/01-ThreeStates.vue)

```js
const data = ref(null)
const error = ref(null)
const isLoading = ref(false)

const load = async () => {
  isLoading.value = true
  error.value = null
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    data.value = await res.json()
  } catch (e) {
    error.value = e
  } finally {
    isLoading.value = false
  }
}
```

### 三個必須的細節

1. **`res.ok` 檢查**：`fetch` 預設不會把 HTTP 4xx/5xx 當錯誤！必須手動檢查 `res.ok` 並 throw。
2. **`try / catch / finally`**：忘記 `finally` 會讓畫面卡在「載入中」。
3. **錯誤前先清空舊資料**：否則使用者會看到舊資料疊著錯誤訊息。

---

## 2. 競態與 AbortController

**檔案**：[`src/components/02-RaceCondition.vue`](./src/components/02-RaceCondition.vue)

### 問題情境

使用者在搜尋框打字：

```
打 "a"  → fetch("a"), 假設 1500ms 回來
打 "ab" → fetch("ab"), 300ms 回來
```

時序：
```
t=0    : fetch("a") 開始
t=100  : fetch("ab") 開始
t=400  : fetch("ab") 回來 → 畫面顯示 "ab" 的結果
t=1500 : fetch("a") 回來 → ❌ 覆寫了 "ab"，畫面顯示舊結果
```

**畫面顯示的結果跟使用者輸入的內容不一致——這就是 race condition。**

### AbortController 解法

每次發新請求前，**取消**上一個還在路上的請求：

```js
let abortController = null

watch(keyword, async (newKey) => {
  abortController?.abort()        // 取消上一個
  abortController = new AbortController()

  try {
    const res = await fetch(url, { signal: abortController.signal })
    data.value = await res.json()
  } catch (e) {
    if (e.name === 'AbortError') return  // 被取消的，靜默忽略
    throw e
  }
})
```

### 不只是 fetch

任何「同一個變數會觸發多個並行請求」的場景都要處理：
- 搜尋輸入框（最經典）
- 篩選器切換（快速點不同 filter）
- 分頁切換（快速點不同頁碼）
- 路由切換（route 變化觸發 API）

### `AbortError` 不要當錯誤顯示

被取消的請求會拋 `DOMException` with name `AbortError`。**不要**把它放進 `error.value` 顯示給使用者看——它不是錯誤，是你主動取消的。

---

## 3. 重試 + 指數退避

**檔案**：[`src/components/03-Retry.vue`](./src/components/03-Retry.vue)

### 何時需要重試

- **網路暫時抖動**：使用者地鐵中網路忽斷忽連
- **後端短暫過載**（5xx）
- **限流**（429 too many requests）

### 不該重試

- **401 / 403**：權限問題，重試 100 次也沒用
- **404 / 422**：請求本身錯誤
- **post 等改變狀態的操作**：可能造成重複下單

### Exponential Backoff（指數退避）

每次失敗後等待時間加倍：500ms → 1s → 2s → 4s → ...

**為什麼？** 避免雪崩——如果所有 client 都在 1 秒後同時重試，會把剛恢復的伺服器再次打爆。指數退避讓重試請求自然散開。

```js
for (let attempt = 1; attempt <= maxAttempts; attempt++) {
  try {
    return await fetch(url)
  } catch (e) {
    if (attempt === maxAttempts) throw e
    const backoff = 500 * 2 ** (attempt - 1)
    await new Promise(r => setTimeout(r, backoff))
  }
}
```

### 加上 jitter（抖動）

進階做法：在 backoff 上加隨機 ±20%，讓重試時間更分散：

```js
const backoff = 500 * 2 ** (attempt - 1)
const jittered = backoff * (0.8 + Math.random() * 0.4)  // 80%~120%
await new Promise(r => setTimeout(r, jittered))
```

---

## 4. axios + Interceptors

**檔案**：[`src/components/04-Axios.vue`](./src/components/04-Axios.vue)

### 為什麼還要 axios？

| 功能 | fetch | axios |
|------|-------|-------|
| JSON 解析 | 手動 `await res.json()` | 自動 |
| 錯誤 throw 4xx/5xx | ❌（要手動檢查 `res.ok`） | ✅ |
| timeout | 要自己用 AbortController + setTimeout | 內建 |
| **request / response 攔截器** | ❌ | ✅ |
| baseURL | 要自己包裝 | 內建 |
| 預設 headers | 要自己包裝 | 內建 |
| 取消 | AbortController | AbortController 或 axios 自有 API |
| 體積 | 0 (內建) | ~14KB gzipped |

**單就 fetch + 一點點包裝，可以涵蓋 90% 場景。axios 的價值主要在 interceptors。**

### Interceptors 的威力

```js
const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 5000,
})

// Request interceptor：每個請求都會經過
api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${getToken()}`
  return config
})

// Response interceptor：每個回應都會經過
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 全域處理：token 過期 → 導去登入頁
      router.push('/login')
    }
    return Promise.reject(error)
  }
)
```

這些「橫切關注點」（cross-cutting concerns）：auth、logging、錯誤統一處理——
寫一次，所有用 `api` 發的請求都會跑到。沒 interceptors 的話，每個 API 呼叫都要重複處理一遍。

### 用 axios 後的 `loading / error / data`

```js
const load = async () => {
  isLoading.value = true
  error.value = null
  try {
    const response = await api.get('/todos/1')
    data.value = response.data  // axios 自動解析 JSON，放在 .data
  } catch (e) {
    error.value = e
  } finally {
    isLoading.value = false
  }
}
```

axios 把 4xx/5xx 自動 throw，所以不用寫 `res.ok` 檢查。

---

## 5. fetch vs axios 怎麼選

| 你的專案 | 建議 |
|----------|------|
| 小型 / Prototype | `fetch`（內建，零依賴） |
| 需要全域 auth header / 401 處理 | `axios`（interceptors 省太多事） |
| 對 bundle size 敏感 | `fetch` |
| Server-Side Rendering (Nuxt) | `fetch`（Nuxt 提供 `$fetch` 包裝，內建大部分需求） |
| 需要上傳檔案進度 | `axios`（有 `onUploadProgress`） |
| 團隊已熟悉某一邊 | 維持原本選擇 |

> **沒有絕對答案**。我的個人建議：中大型專案直接 axios + interceptors，省事；小專案或 Nuxt fetch 已夠用。

---

## 練習題

1. **基礎**：用 `fetch` 寫一個 `useFetch(url)` composable，回傳 `{ data, error, isLoading, refetch }`。加上 `AbortController` 處理競態。

2. **競態實戰**：寫一個搜尋使用者元件，輸入時用 `refDebounced`（VueUse）延後 300ms，搭配 `AbortController` 取消舊請求。API 用 `https://api.github.com/search/users?q={keyword}`。

3. **retry composable**：把第 3 章的 retry 邏輯抽成 `useFetchWithRetry(url, { maxAttempts, baseDelay })` composable。記得不要 retry 4xx 錯誤。

4. **axios interceptor**：建立 axios instance，在 request interceptor 加假的 auth token，在 response interceptor 處理「401 時顯示 alert」。

5. **進階**：寫一個 `useApiClient()` composable，整合 axios + auth + retry + 取消，回傳 `{ get, post, put, del }` 四個方法。

---

## 延伸閱讀
- [MDN: AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- [MDN: Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [Axios 官方文件](https://axios-http.com/)
- [VueUse useFetch](https://vueuse.org/core/useFetch/)（已內建 abort、refetch、chain API）

---

## 啟動專案

```sh
npm install
npm run dev
```

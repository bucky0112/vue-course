# 08 — Watch & WatchEffect

> 在 Vue 的響應系統內「監聽資料變動、執行副作用」。
> 跟 computed 不一樣：computed 是「衍生資料」，watch 是「執行副作用」。

## 章節目標

1. 用 `watch(source, callback)` 在資料變動時執行副作用
2. 處理深層物件監聽（deep / getter）跟監聽多個來源
3. 用 `watchEffect` 自動追蹤依賴
4. 判斷何時用 `watch`、何時用 `watchEffect`
5. 知道如何停止 watcher 與清理副作用

---

## 目錄
- [1. `watch` 基本用法](#1-watch-基本用法)
- [2. 監聽物件：deep vs getter](#2-監聽物件deep-vs-getter)
- [3. 監聽多個來源](#3-監聽多個來源)
- [4. `watchEffect` 自動追蹤](#4-watcheffect-自動追蹤)
- [5. `watch` vs `watchEffect`](#5-watch-vs-watcheffect)
- [6. 停止 watcher 與清理副作用](#6-停止-watcher-與清理副作用)
- [7. watch / watchEffect / computed 三者差別](#7-watch--watcheffect--computed-三者差別)
- [練習題](#練習題)

---

## 1. `watch` 基本用法

**檔案**：[`src/components/01-WatchBasics.vue`](./src/components/01-WatchBasics.vue)

```js
import { ref, watch } from 'vue'

const message = ref('')

watch(message, (newVal, oldVal) => {
  console.log(`"${oldVal}" → "${newVal}"`)
})
```

### 重點觀察

- `watch` **預設是 lazy**：掛載時不執行，source 真的變動才跑
- callback 可以拿到 `newVal` 跟 `oldVal`，方便比較
- 加 `{ immediate: true }` 可以讓掛載時就跑一次（此時 `oldVal` 是 `undefined`）

```js
watch(count, callback, { immediate: true })
```

---

## 2. 監聽物件：deep vs getter

**檔案**：[`src/components/02-WatchDeep.vue`](./src/components/02-WatchDeep.vue)

### 預設不會 deep（陷阱）

```js
const user = reactive({ name: 'Alice', age: 30 })

watch(user, (newVal) => {
  // 改 user.name 或 user.age 都不會觸發！
  // 只有「整個 user 被取代」才會
})
```

對 reactive 物件而言，**內部欄位變動預設不會觸發 watch**。

### 解法 1：`deep: true`

```js
watch(user, callback, { deep: true })
```

任何內部欄位變動都會觸發。但有兩個缺點：
- **效能差**：每次都要遞迴比對整個物件
- **`newVal === oldVal`**：兩個都是同一個 proxy 參考，無法分辨「之前是什麼樣子」

### 解法 2：用 Getter 函式（推薦）

```js
watch(
  () => user.name,        // 只看 name，改 age 不會觸發
  (newName, oldName) => { ... }
)
```

更精準、效能好，而且 `newVal` / `oldVal` 都是真實的原始值，能正常比較。

### 監聽多層欄位

```js
watch(() => user.settings.theme, callback)
```

---

## 3. 監聽多個來源

**檔案**：[`src/components/03-WatchMultipleSources.vue`](./src/components/03-WatchMultipleSources.vue)

```js
watch(
  [firstName, lastName],
  ([newFirst, newLast], [oldFirst, oldLast]) => {
    if (newFirst !== oldFirst) console.log('first changed')
    if (newLast !== oldLast) console.log('last changed')
  }
)
```

source 跟 newVal / oldVal 都會變成陣列，順序對應。

> ⚠️ **不能寫成兩個獨立的 `watch`** 嗎？可以，但合併成一個的好處是：
> 同 tick 內多個 source 一起變動時，callback **只會跑一次**，避免重複執行。

---

## 4. `watchEffect` 自動追蹤

**檔案**：[`src/components/04-WatchEffect.vue`](./src/components/04-WatchEffect.vue)

```js
import { ref, watchEffect } from 'vue'

const a = ref(1)
const b = ref(2)

watchEffect(() => {
  console.log(`a + b = ${a.value + b.value}`)
  // a 跟 b 自動被加入追蹤
})
```

### 跟 `watch` 三個關鍵差別

| | `watch` | `watchEffect` |
|---|---------|---------------|
| 來源宣告 | 第一個參數明確指定 | 自動追蹤 callback 內讀到的 ref |
| 掛載時 | 不執行（lazy） | 立即執行一次 |
| `newVal` / `oldVal` | 有 | **沒有** |
| 條件追蹤 | 來源是固定的 | 每次重跑時重新追蹤（if 分支也行） |

### `watchEffect` 適合做的事

- 把狀態同步到 `document.title`
- 把狀態寫到 localStorage / sessionStorage
- 觸發副作用（log、analytics）
- 多個 reactive 來源串在一起的計算或顯示

---

## 5. `watch` vs `watchEffect`

**檔案**：[`src/components/05-WatchVsEffect.vue`](./src/components/05-WatchVsEffect.vue)

| 用 `watch` 當... | 用 `watchEffect` 當... |
|------------------|-----------------------|
| 需要 `oldVal` / `newVal` | 不需要比較前後值 |
| 只要 source 真的變才執行 | 希望掛載時就跑一次 |
| 來源固定且少 | 來源多、寫 source 陣列很煩 |
| 想要明確「哪個變化觸發我」 | 「callback 內讀到啥就追蹤啥」 |

### 業界經驗

新手常 watchEffect 一把梭，但**過度使用 watchEffect 會踩坑**：
- 它什麼都追蹤——容易意外把不該追蹤的東西也追了
- 沒有明確 source，事後維護時很難一眼看出「為什麼會跑」

**推薦預設用 `watch`，明確不要追蹤多餘東西。** 確定要寫副作用 + 希望立即執行 + 多個來源時，才用 `watchEffect`。

---

## 6. 停止 watcher 與清理副作用

### 停止 watcher

`watch` / `watchEffect` 都會回傳一個「停止函式」：

```js
const stop = watch(count, callback)
// 不想再監聽了
stop()
```

> 元件 unmount 時 Vue 會自動停掉所有在 setup 內建立的 watcher，**通常不需要手動 stop**。
> 只在「動態建立 watcher、想要提早停掉」時才需要。

### 清理上一次的副作用

watcher callback 可以拿到一個 `onCleanup` 函式，在「下次重跑前」或「watcher 停止時」執行：

```js
watch(searchKeyword, async (newKeyword, oldKeyword, onCleanup) => {
  const controller = new AbortController()
  onCleanup(() => controller.abort())  // 下次 keyword 變了，先取消上次的 fetch

  const data = await fetch(`/api/search?q=${newKeyword}`, {
    signal: controller.signal,
  })
})
```

> 這正是第 17 章「競態處理」的另一種寫法——
> 第 17 章用 `let abortController` 變數，這裡用 `onCleanup` 把清理邏輯內聚在 watcher 內。

### `onWatcherCleanup` (Vue 3.5+)

Vue 3.5 引入了一個獨立 API，可以從 watcher 內任意地方呼叫：

```js
import { watch, onWatcherCleanup } from 'vue'

watch(keyword, async (newVal) => {
  const controller = new AbortController()
  onWatcherCleanup(() => controller.abort())
  await fetch(url, { signal: controller.signal })
})
```

跟 callback 的第三個參數 `onCleanup` 一樣，只是寫法更現代。

---

## 7. watch / watchEffect / computed 三者差別

很多人會搞混這三個，記住一句話：

| 用途 | 工具 |
|------|------|
| **算出衍生值**（依賴變了重新算） | `computed` |
| **資料變了執行副作用**（明確 source） | `watch` |
| **資料變了執行副作用**（自動追蹤） | `watchEffect` |

```js
// ✅ 算「全名」用 computed
const fullName = computed(() => firstName.value + ' ' + lastName.value)

// ✅ 名字改了送出 API 用 watch
watch(fullName, async (newVal) => {
  await api.save(newVal)
})

// ✅ 名字改了同步到 document.title 用 watchEffect
watchEffect(() => {
  document.title = `${firstName.value} ${lastName.value}`
})
```

---

## 練習題

1. **基礎**：寫一個 `<TitleSync>` 元件，把 ref 的內容即時同步到 `document.title`。用 `watchEffect`。

2. **deep 陷阱**：建立一個 `reactive({ todos: [] })` 結構，用 `watch` 監聽 todos 的長度變化。試 `{ deep: true }` 跟 `() => state.todos.length` 兩種寫法，哪個比較好？

3. **多 source**：寫一個搜尋元件，輸入 `keyword` 跟切換 `category` 都要重新觸發搜尋。用 `watch` 監聽 `[keyword, category]`。

4. **競態 + onCleanup**：把第 17 章競態 demo 的 `AbortController` 改用 `onWatcherCleanup` 寫一次。

5. **進階**：寫一個 `useDocumentTitle(getter)` composable，傳入 getter function，自動把回傳值同步到 `document.title`。記得 unmount 時要把 title 還原。

---

## 延伸閱讀
- 官方文件：[Watchers](https://vuejs.org/guide/essentials/watchers.html)
- 官方文件：[`watch`](https://vuejs.org/api/reactivity-core.html#watch) / [`watchEffect`](https://vuejs.org/api/reactivity-core.html#watcheffect)
- [`onWatcherCleanup` (Vue 3.5)](https://vuejs.org/api/reactivity-core.html#onwatchercleanup)

---

## 啟動專案

```sh
npm install
npm run dev
```

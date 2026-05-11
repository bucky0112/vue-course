# 10 — Template Refs

> 當 Vue 的響應式系統不夠用，需要直接操作 DOM 或子元件實例時。

## 章節目標

1. 理解什麼時候**真正需要** template ref（多數情境不需要）
2. 用 Vue 3.5 的 `useTemplateRef()` 取得 DOM 元素
3. 取得子元件實例 + `defineExpose` 的搭配
4. 認識舊式 `ref(null)` 寫法（為了讀懂舊程式碼）

---

## 目錄
- [1. 為什麼需要 Template Refs](#1-為什麼需要-template-refs)
- [2. `useTemplateRef` 基本用法](#2-usetemplateref-基本用法)
- [3. 範例：Focus Input](#3-範例focus-input)
- [4. 範例：捲動到指定區塊](#4-範例捲動到指定區塊)
- [5. 取得子元件實例 + `defineExpose`](#5-取得子元件實例--defineexpose)
- [6. 舊寫法：`ref(null)`](#6-舊寫法refnull)
- [7. 何時用、何時不用](#7-何時用何時不用)
- [練習題](#練習題)

---

## 1. 為什麼需要 Template Refs

Vue 的響應式系統大部分情況下「夠用」——改資料、畫面就更新，不需要直接碰 DOM。

但有些事 Vue 無法宣告式做到：
- 讓某個 input **取得焦點**
- 把畫面**捲動**到某個位置
- 讀取 DOM 元素的**實際尺寸 / 位置**
- 跟**第三方 JS 函式庫**（圖表、編輯器、地圖）整合
- 命令式呼叫子元件方法（例如：`videoRef.play()`）

這些操作需要拿到「真正的 DOM 元素」或「子元件實例」——這就是 **Template Refs** 的用途。

---

## 2. `useTemplateRef` 基本用法

Vue 3.5 引入 `useTemplateRef()`，是現在的標準寫法：

```vue
<script setup>
import { useTemplateRef, onMounted } from 'vue'

const myEl = useTemplateRef('my-id')

onMounted(() => {
  // mount 之後才能讀到 DOM
  myEl.value?.focus()
})
</script>

<template>
  <input ref="my-id" />
</template>
```

### 三個關鍵點

| 重點 | 說明 |
|------|------|
| **字串 ID 對應** | `useTemplateRef('my-id')` 的字串要跟 template 的 `ref="my-id"` 一致 |
| **`.value` 才是元素本身** | 跟一般 ref 一樣，要透過 `.value` 取值 |
| **mount 之後才能讀** | mount 前 `.value` 是 `null`，所以一定要在 `onMounted` 或事件處理函式內讀 |

> 為什麼要 `?.`（optional chaining）？因為 mount 前 `.value` 可能是 null，加 `?.` 比較安全。

---

## 3. 範例：Focus Input

**檔案**：[`src/components/01-FocusInputDemo.vue`](./src/components/01-FocusInputDemo.vue)

```vue
<script setup>
import { useTemplateRef, onMounted } from 'vue'

const inputRef = useTemplateRef('username-input')

onMounted(() => {
  inputRef.value?.focus()
})
</script>

<template>
  <input ref="username-input" type="text" />
</template>
```

最常見的 template ref 用途：**頁面打開時讓某個欄位自動取得焦點**。例如登入頁的「帳號」欄位、搜尋頁的「關鍵字」欄位。

---

## 4. 範例：捲動到指定區塊

**檔案**：[`src/components/02-ScrollToDemo.vue`](./src/components/02-ScrollToDemo.vue)

```vue
<script setup>
import { useTemplateRef } from 'vue'

const topRef = useTemplateRef('section-top')

const scrollTo = (el) => {
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <button @click="scrollTo(topRef)">回到頂部</button>
  <div ref="section-top">...</div>
</template>
```

實務場景：
- **表單驗證失敗** → 自動捲到第一個錯誤欄位
- **目錄連結** → 點章節跳到對應段落
- **單頁式網站** → 點導覽列跳到不同 section

---

## 5. 取得子元件實例 + `defineExpose`

**檔案**：
- 子：[`src/components/03-ChildAccess/ChildCounter.vue`](./src/components/03-ChildAccess/ChildCounter.vue)
- 父：[`src/components/03-ChildAccess/ParentControl.vue`](./src/components/03-ChildAccess/ParentControl.vue)

### 子元件：用 `defineExpose` 公開要被存取的方法

```vue
<!-- ChildCounter.vue -->
<script setup>
import { ref } from 'vue'

const count = ref(0)
const increment = () => { count.value++ }
const reset = () => { count.value = 0 }

// 主動公開——沒寫 defineExpose，外部什麼都讀不到
defineExpose({ count, increment, reset })
</script>
```

### 父元件：用 `useTemplateRef` 拿子元件實例

```vue
<!-- ParentControl.vue -->
<script setup>
import { useTemplateRef } from 'vue'
import ChildCounter from './ChildCounter.vue'

const childRef = useTemplateRef('child-counter')

const callIncrement = () => childRef.value?.increment()
</script>

<template>
  <ChildCounter ref="child-counter" />
  <button @click="callIncrement">叫子元件 +1</button>
</template>
```

### 為什麼 `<script setup>` 預設要 `defineExpose` 才能公開？

`<script setup>` 預設是**封閉**的——top-level 變數對外部隱藏。這個設計避免：
- 父元件意外讀到子元件內部實作細節
- 重構子元件內部時不小心破壞父元件

**`defineExpose` 強迫子元件明確列出「公開 API」**，這是好設計。

> `defineExpose` 在第 11 章「元件基礎」會跟 `defineProps` / `defineEmits` 一起完整介紹。

---

## 6. 舊寫法：`ref(null)`

**檔案**：[`src/components/04-OldVsNew.vue`](./src/components/04-OldVsNew.vue)

Vue 3.5 之前要這樣寫：

```vue
<script setup>
import { ref } from 'vue'

const input = ref(null)  // 必須初始化為 null
</script>

<template>
  <input ref="input" />  <!-- 字串對應變數名 -->
</template>
```

### 跟新寫法的差別

| | 舊：`ref(null)` | 新：`useTemplateRef('id')` |
|---|------------------|-----------------------------|
| 引入版本 | 一直可用 | Vue 3.5+ |
| 變數名 vs template 字串 | **必須同名** | 解耦，分開命名 |
| 表達意圖 | 跟一般 ref 長一樣 | 明確說「這是 template ref」 |
| TypeScript 推導 | 預設 `any`，要手動標註 | 可指定元素類型 |

**新專案一律用 `useTemplateRef`**，舊專案維持原樣即可（兩種寫法可共存）。

---

## 7. 何時用、何時不用

### ✅ 該用 template ref 的情境

- **元件 mount 後自動 focus**：登入頁、modal 開啟、搜尋框
- **程式化捲動**：表單驗證失敗、目錄跳轉、虛擬列表
- **讀 DOM 尺寸**：響應式佈局計算、虛擬捲動
- **整合第三方非 Vue 函式庫**：Chart.js、CodeMirror、Mapbox
- **命令式呼叫子元件方法**：`videoRef.play()`、`modalRef.open()`、`formRef.validate()`

### ❌ 不該用的情境

- **元件間資料傳遞** → 用 `props` + `emit`（第 11 章）或 Pinia（第 18 章）
- **修改 DOM 內容** → 用 `v-text` / `{{ }}` / `v-html`
- **加 class / style** → 用 `:class` / `:style`
- **判斷顯示** → 用 `v-if` / `v-show`

> **原則**：能用 Vue 宣告式做到的事，**永遠**不要用 template ref。Template ref 是「逃生艙」，不是常用工具。

---

## 練習題

1. **自動 focus 第一個錯誤**：寫一個有 email、password 兩個欄位的表單。submit 時若 email 為空，自動 focus 到 email 並顯示「請輸入 email」。

2. **回到頂部按鈕**：頁面內容很長，做一個浮動按鈕，點下去用 `scrollIntoView` 捲到頁面頂部。

3. **Modal 元件**：寫一個 `<MyModal>` 元件，內部有 `open()` 跟 `close()` 方法（用 `defineExpose` 公開）。父元件用 template ref 控制它。

4. **進階**：用 `useTemplateRef` 取得一個 `<div>` 的尺寸（`offsetWidth`、`offsetHeight`），顯示在畫面上。當視窗 resize 時自動更新。
（提示：用 `onMounted` + `onUnmounted` 監聽 `window.resize`，或直接抽成 composable。）

---

## 延伸閱讀
- 官方文件：[Template Refs](https://vuejs.org/guide/essentials/template-refs.html)
- 官方文件：[`defineExpose`](https://vuejs.org/api/sfc-script-setup.html#defineexpose)
- VueUse `useElementSize`：練習題 4 的現成版本

---

## 啟動專案

```sh
npm install
npm run dev
```

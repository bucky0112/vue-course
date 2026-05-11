# 06 — Composition API 基礎

> 整門課的心智模型基礎。學完這章，後面所有章節都建立在這個基礎上。

## 章節目標

1. 理解 `<script setup>` 為什麼是現代 Vue 的標準寫法
2. 區分 `ref` 與 `reactive` 的使用情境
3. 避開「解構 reactive」這個最常見的響應性陷阱
4. 把 CDN 寫法的計數器，改寫成 SFC + Composition API

---

## 目錄
- [1. `<script setup>` — 為什麼是現代標準](#1-script-setup--為什麼是現代標準)
- [2. `ref` — 把基本型別變成響應式](#2-ref--把基本型別變成響應式)
- [3. `reactive` — 把物件變成響應式](#3-reactive--把物件變成響應式)
- [4. 兩者該怎麼選](#4-兩者該怎麼選)
- [5. reactive 的解構陷阱](#5-reactive-的解構陷阱)
- [6. 從 CDN 到 SFC：完整重寫](#6-從-cdn-到-sfc完整重寫)
- [7. 業界 convention](#7-業界-convention)
- [練習題](#練習題)

---

## 1. `<script setup>` — 為什麼是現代標準

Vue 3 一開始 (3.0/3.1) 的 Composition API 必須這樣寫：

```vue
<template>
  <button @click="increment">{{ count }}</button>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const increment = () => { count.value++ }
    return { count, increment }  // 一定要 return 給 template 用
  }
}
</script>
```

Vue 3.2 推出 `<script setup>` 後變成：

```vue
<template>
  <button @click="increment">{{ count }}</button>
</template>

<script setup>
import { ref } from 'vue'

const count = ref(0)
const increment = () => { count.value++ }
</script>
```

### 三個少掉的樣板碼

| 少掉的 | 原本要做的事 |
|--------|-------------|
| `export default {}` | 包裝整個元件 |
| `setup() {}` | 包裝邏輯函式 |
| `return { ... }` | 手動暴露變數給 template |

**`<script setup>` 內所有 top-level 變數會自動暴露給 template。**

對照範例：[`src/components/01-ScriptSetup/`](./src/components/01-ScriptSetup/)
- [`CounterLongHand.vue`](./src/components/01-ScriptSetup/CounterLongHand.vue) — 傳統 setup() 寫法
- [`CounterShortHand.vue`](./src/components/01-ScriptSetup/CounterShortHand.vue) — `<script setup>` 寫法

> **本課程從這章起，所有 SFC 一律用 `<script setup>`。**

---

## 2. `ref` — 把基本型別變成響應式

```js
import { ref } from 'vue'

const count = ref(0)            // number
const message = ref('hello')    // string
const isActive = ref(false)     // boolean
const user = ref(null)          // null / undefined / 任何型別都可以
```

`ref()` 回傳的不是原值，而是一個「響應式參考物件」，真正的值放在 `.value` 屬性裡。

### 兩個取值規則

| 位置 | 寫法 | 例子 |
|------|------|------|
| **`<script>` 內** | 要寫 `.value` | `count.value++` |
| **`<template>` 內** | 不用寫，Vue 自動展開 | `{{ count }}` |

```vue
<script setup>
const count = ref(0)

const increment = () => {
  count.value++       // ✅ script 內：必須寫 .value
  // count++          // ❌ 錯誤：count 是 ref 物件不是數字
}
</script>

<template>
  {{ count }}          <!-- ✅ template 內：自動展開 -->
  <!-- {{ count.value }} 也可以但沒必要 -->
</template>
```

對照範例：[`src/components/02-RefBasics.vue`](./src/components/02-RefBasics.vue)

### 為什麼設計成 `.value`？

JavaScript 的基本型別（number、string）是「值傳遞」，無法被偵測修改。Vue 用一個物件包裝起來，內部對 `.value` 的存取做攔截——這樣才能在你改變數值時通知畫面更新。

```js
// JavaScript 無法做到這件事：
let count = 0
count = 1              // 數字不知道自己被改了

// 但物件可以：
const ref = { value: 0 }
ref.value = 1          // Vue 可以攔截這個 setter
```

---

## 3. `reactive` — 把物件變成響應式

```js
import { reactive } from 'vue'

const user = reactive({
  name: 'Alice',
  age: 30,
})

const tasks = reactive([
  { id: 1, text: '寫程式' },
])
```

### 與 ref 的差別

| | `ref` | `reactive` |
|---|-------|------------|
| 可接受的型別 | 任何 | 只能是物件 / 陣列 |
| 取值要 `.value` | 是 | 否 |
| 內部實作 | 物件 + getter/setter | Proxy |

`reactive` 直接回傳一個 Proxy 物件，所以取值改值都跟普通物件一樣自然：

```vue
<script setup>
const user = reactive({ name: 'Alice', age: 30 })

const birthday = () => {
  user.age++           // ✅ 直接改，不用 .value
}
</script>

<template>
  {{ user.name }} / {{ user.age }}
</template>
```

對照範例：[`src/components/03-ReactiveBasics.vue`](./src/components/03-ReactiveBasics.vue)

### reactive 的限制

`reactive` 只能接受物件或陣列，把基本型別丟進去會直接出錯：

```js
const x = reactive(0)        // ❌ 警告：value cannot be made reactive
const y = reactive('hello')  // ❌ 同上
const z = reactive(true)     // ❌ 同上
```

基本型別只能用 `ref`。

---

## 4. 兩者該怎麼選？

理論上：

| 情境 | 建議 |
|------|------|
| 單一基本型別（number/string/boolean） | `ref` |
| 結構複雜的物件 / 陣列 | `reactive` 或 `ref(物件)` 都可以 |

**但業界主流是「能用 `ref` 就用 `ref`」**，理由有三：

1. **避開解構陷阱**（下一節詳述）
2. **API 一致**：所有狀態都是 `.value`，不需要記憶「這個要不要加 `.value`」
3. **跟 composable 慣例一致**：composable 通常回傳 `ref`，這樣解構不會出事

```js
// ✅ 主流寫法
const count = ref(0)
const user = ref({ name: 'Alice', age: 30 })

// 取值
count.value
user.value.name

// 修改整個物件（reactive 做不到，ref 可以）
user.value = { name: 'Bob', age: 40 }
```

---

## 5. reactive 的解構陷阱

**這是學 Vue 3 最常踩的坑，必看。**

```js
const state = reactive({ count: 0, name: 'Alice' })

const { count, name } = state    // ❌ 失去響應性
```

解構出來的 `count` 跟 `name` 變成「普通數字」跟「普通字串」——當下值是多少就是多少，原物件之後怎麼改，這兩個變數永遠不會跟著變。

### 為什麼？

`reactive` 的響應性依賴 Proxy 攔截屬性存取。解構等同於：

```js
const count = state.count    // 這一刻就把值取出來、複製一份
const name = state.name
```

複製出來的值跟原 Proxy 完全脫鉤，自然不會響應。

### 解法 1：`toRefs()` — 整個物件每個欄位轉成 ref

```js
import { reactive, toRefs } from 'vue'

const state = reactive({ count: 0, name: 'Alice' })
const { count, name } = toRefs(state)
// 現在 count 跟 name 都是 ref（指向原 state 對應欄位）

count.value++              // ✅ 會更新 state.count
console.log(state.count)   // 1
```

### 解法 2：`toRef()` — 只挑一個欄位

```js
import { reactive, toRef } from 'vue'

const state = reactive({ count: 0 })
const count = toRef(state, 'count')

count.value++              // ✅ 同步更新 state.count
```

### 解法 3：直接用 `ref`，從一開始就不用 `reactive`

```js
const count = ref(0)
const name = ref('Alice')
// 解構也沒問題（因為根本沒解構過 reactive）
```

對照範例：[`src/components/04-ReactiveTraps.vue`](./src/components/04-ReactiveTraps.vue)

---

## 6. 從 CDN 到 SFC：完整重寫

第 02 章用 CDN 方式跑 Vue：

```html
<!-- CDN 版本 -->
<div id="app">
  <p>{{ count }}</p>
  <button @click="increment">+{{ step }}</button>
</div>

<script src="https://unpkg.com/vue@3"></script>
<script>
  const { createApp } = Vue

  createApp({
    data() {
      return { count: 0, step: 1 }
    },
    methods: {
      increment() {
        this.count += this.step
      }
    }
  }).mount('#app')
</script>
```

改寫成 SFC + Composition API 後：

```vue
<!-- SFC 版本 -->
<script setup>
import { ref } from 'vue'

const count = ref(0)
const step = ref(1)

const increment = () => {
  count.value += step.value
}
</script>

<template>
  <p>{{ count }}</p>
  <button @click="increment">+{{ step }}</button>
</template>
```

### 差異摘要

| | CDN（Options API） | SFC（Composition API） |
|---|--------------------|------------------------|
| 狀態宣告 | `data() { return {...} }` | `const x = ref(...)` |
| 方法宣告 | `methods: { ... }` | 普通 function |
| 取值（script 內） | `this.count` | `count.value` |
| 取值（template 內） | `{{ count }}` | `{{ count }}`（一樣） |
| 邏輯重用 | Mixin（有命名衝突） | Composable（乾淨） |

對照範例：[`src/components/05-RefactoredCounter.vue`](./src/components/05-RefactoredCounter.vue)

---

## 7. 業界 convention

| 規則 | 為什麼 |
|------|--------|
| 一律用 `<script setup>` | 少樣板碼，TypeScript 推導更好 |
| 基本型別用 `ref` | 沒得選 |
| 物件**也**優先用 `ref` | 解構安全、API 一致 |
| 寫 form 表單時可考慮 `reactive` | 整包物件不解構，直接 v-model |
| Composable 內部用 `ref` 居多、回傳 ref | 呼叫端解構不會踩雷 |

---

## 練習題

1. **基礎**：把一個包含 `name` / `email` / `age` 的表單，分別用 (a) 全部 `ref`、(b) 全部 `reactive`、(c) 一個 `reactive({...})` 三種方式實作，比較程式碼差異。

2. **陷阱題**：以下程式碼為什麼畫面不會更新？怎麼修？

   ```vue
   <script setup>
   import { reactive } from 'vue'
   const state = reactive({ count: 0 })
   const { count } = state
   const add = () => count++
   </script>

   <template>{{ count }}</template>
   ```

3. **轉換練習**：找一個你以前用 Options API 寫過的元件（或第 06 章舊版的 `LifecycleDemo.vue`），把它改寫成 `<script setup>` + Composition API。

4. **進階**：什麼時候 `reactive` 比 `ref` 更好用？想出兩個情境。

---

## 啟動專案

```sh
npm install
npm run dev
```

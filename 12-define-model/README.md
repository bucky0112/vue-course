# 12 — defineModel

> Vue 3.4 (2024) 推出的 v-model 標準寫法。一行取代過去整段 props + emit 的樣板碼。

## 章節目標

1. 理解為什麼自訂元件需要 v-model
2. 看懂舊式 `defineProps` + `defineEmits` 寫法（為了維護舊專案）
3. 用 `defineModel()` 寫現代 v-model 元件
4. 一個元件支援多個 v-model 綁定
5. 自訂 v-model 修飾子

---

## 目錄
- [1. v-model 是什麼](#1-v-model-是什麼)
- [2. v-model 在原生元素上 vs 自訂元件上](#2-v-model-在原生元素上-vs-自訂元件上)
- [3. 舊式寫法（Vue 3.0–3.3）](#3-舊式寫法vue-3033)
- [4. `defineModel()` — Vue 3.4 標準寫法](#4-definemodel--vue-34-標準寫法)
- [5. 多個 v-model](#5-多個-v-model)
- [6. 自訂修飾子](#6-自訂修飾子)
- [7. 建議：何時抽成 v-model 元件](#7-建議何時抽成-v-model-元件)
- [練習題](#練習題)

---

## 1. v-model 是什麼

`v-model` 是 Vue 的「雙向綁定」語法糖：

```vue
<input v-model="message" />
```

等同於：

```vue
<input :value="message" @input="message = $event.target.value" />
```

也就是「把資料綁進去 + 把使用者輸入綁回來」這兩件事的縮寫。

---

## 2. v-model 在原生元素上 vs 自訂元件上

### 原生元素：Vue 內建處理好了

```vue
<input v-model="name" />
<textarea v-model="bio" />
<select v-model="country">...</select>
```

這些情況 v-model 直接能用，不用做任何事。

### 自訂元件：要自己接線

```vue
<MyInput v-model="name" />
```

`<MyInput>` 是你寫的元件，Vue 不知道它的內部結構，**你必須告訴 Vue 怎麼接線**。這就是這章要解決的問題。

---

## 3. 舊式寫法（Vue 3.0–3.3）

**檔案**：[`src/components/01-Comparison/ManualInput.vue`](./src/components/01-Comparison/ManualInput.vue)

```vue
<script setup>
defineProps({
  modelValue: String,
})
defineEmits(['update:modelValue'])
</script>

<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>
```

### Vue 怎麼知道接線？

當父元件寫 `<MyInput v-model="name" />`，Vue 在編譯時會展開成：

```vue
<MyInput
  :modelValue="name"
  @update:modelValue="newValue => name = newValue"
/>
```

所以子元件只要：
1. 接收 `modelValue` prop
2. 在使用者輸入時 emit `update:modelValue` 事件

就能完成雙向綁定。

### 缺點

- **三段樣板碼**：props 宣告、emit 宣告、`:value="x" @input="emit(...)"` 接線
- **看不到「這個元件支援 v-model」**：必須讀程式碼才知道
- **改 prop 名很麻煩**：要動 props、emit、template 三處

---

## 4. `defineModel()` — Vue 3.4 標準寫法

**檔案**：[`src/components/01-Comparison/ModelInput.vue`](./src/components/01-Comparison/ModelInput.vue)

```vue
<script setup>
const model = defineModel()
</script>

<template>
  <input v-model="model" />
</template>
```

**就這樣。一行取代上面的三段樣板碼。**

### `defineModel()` 做了什麼？

它在背後自動：
1. 宣告 `modelValue` prop
2. 宣告 `update:modelValue` emit
3. 回傳一個「雙向同步」的 ref——
   - 讀 `model.value` 等於讀 `modelValue` prop
   - 寫 `model.value = x` 自動 emit `update:modelValue`

所以你可以把 `model` 當成「跟父元件共享的 ref」來用。

### 加 default 值 / 驗證

```js
const model = defineModel({
  default: '',
  required: true,
  type: String,
})
```

跟 `defineProps` 的選項一樣。

---

## 5. 多個 v-model

**檔案**：
- 子：[`src/components/02-NameForm.vue`](./src/components/02-NameForm.vue)
- 父：[`src/components/02-MultipleModelsDemo.vue`](./src/components/02-MultipleModelsDemo.vue)

### 子元件：給每個 model 一個名字

```vue
<!-- NameForm.vue -->
<script setup>
const firstName = defineModel('firstName')
const lastName = defineModel('lastName')
</script>

<template>
  <input v-model="firstName" />
  <input v-model="lastName" />
</template>
```

### 父元件：用 `v-model:名字` 對應

```vue
<NameForm
  v-model:firstName="first"
  v-model:lastName="last"
/>
```

> ⚠️ **常見錯誤**：寫成 `v-model.firstName`（點）而不是 `v-model:firstName`（冒號）。
> 點是「修飾子」、冒號是「參數名」，完全不同。

### 為什麼可以有多個 v-model？

`defineModel('xxx')` 在背後宣告：
- `xxx` 這個 prop
- `update:xxx` 這個 emit

只要不撞名，可以同時有任意多組。

實務場景：
- 表單元件：`v-model:name` / `v-model:email` / `v-model:phone`
- 日期區間：`v-model:startDate` / `v-model:endDate`
- 顏色挑選：`v-model:hex` / `v-model:opacity`

---

## 6. 自訂修飾子

**檔案**：
- 子：[`src/components/03-CapitalizeInput.vue`](./src/components/03-CapitalizeInput.vue)
- 父：[`src/components/03-ModifiersDemo.vue`](./src/components/03-ModifiersDemo.vue)

Vue 內建一些修飾子：`v-model.trim`、`v-model.number`、`v-model.lazy`。但你也可以自訂。

### 子元件：解構出 `modifiers`

```vue
<script setup>
const [model, modifiers] = defineModel({
  set(value) {
    if (modifiers.capitalize && value) {
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
    return value
  },
})
</script>

<template>
  <input v-model="model" />
</template>
```

### 父元件：直接加修飾子

```vue
<!-- 不加修飾子 -->
<CapitalizeInput v-model="name1" />

<!-- 加 .capitalize -->
<CapitalizeInput v-model.capitalize="name2" />
```

輸入「alice」→ 不加修飾子：「alice」；加 `.capitalize`：「Alice」。

### `set` 跟 `get` 的時機

| Hook | 何時呼叫 |
|------|----------|
| `set(value)` | 子元件**寫值給父元件前**（攔截 emit 出去的內容） |
| `get(value)` | 子元件**讀父元件的值前**（攔截從 prop 進來的內容） |

兩者的回傳值才是真正生效的值，可以做轉換。

---

## 7. 建議：何時抽成 v-model 元件

| 該抽 | 不該抽 |
|------|--------|
| 跨多處使用的表單元件（DatePicker、ColorPicker、自訂下拉選單） | 只在一個地方用的 input |
| 內部包了複雜邏輯（驗證、格式化、自動完成） | 只是樣式包裝 |
| 對外想保持「跟原生 input 一樣的 API」 | 純展示用元件 |

### 抽出來之後的好處

呼叫端非常乾淨：

```vue
<MyDatePicker v-model="selectedDate" />
<MyColorPicker v-model="theme.primaryColor" />
<MySearchBox v-model.trim="keyword" />
```

不用每次寫一堆 `:value` + `@input` + 轉換函式。

---

## 練習題

1. **基礎**：寫一個 `<NumberInput>` 元件，內部用 input，但只接受數字。用 `defineModel` 加 set transformer 過濾非數字字元。

2. **多 model**：寫一個 `<DateRange>` 元件，包含起始日跟結束日兩個 input，分別用 `v-model:start` / `v-model:end`。父元件結合 computed 顯示「總共幾天」。

3. **修飾子**：擴充第 3 章的 `CapitalizeInput`，多加一個 `.uppercase` 修飾子（整串都變大寫）。同時支援 `.capitalize` 跟 `.uppercase`，當兩個都加時以 `.uppercase` 為準。

4. **進階**：寫一個 `<Counter>` 元件，內部有 `+` / `-` 按鈕。對外只用一個 `v-model="count"` 就能控制數值。如果父元件加 `v-model.even`，則 +/- 一次跳 2。

---

## 跟舊版的相容性

| 想做的事 | Vue 3.0–3.3 | Vue 3.4+ |
|----------|-------------|----------|
| 單一 v-model | `defineProps` + `defineEmits` 手動接線 | `defineModel()` |
| 多 v-model | 多組 `defineProps` + `defineEmits` | `defineModel('name')` |
| 自訂修飾子 | 接收 `modelModifiers` prop | `[model, modifiers] = defineModel({ set })` |

維護舊專案時保留原寫法即可，**新元件一律用 `defineModel`**。

---

## 延伸閱讀
- 官方文件：[Component v-model](https://vuejs.org/guide/components/v-model.html)
- 官方文件：[`defineModel`](https://vuejs.org/api/sfc-script-setup.html#definemodel)

---

## 啟動專案

```sh
npm install
npm run dev
```

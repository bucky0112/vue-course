# Vue 3 教學大綱（Syllabus）

> 對應 Vue 3.5+ / Vite 6+ / Vue Router 4 / Pinia 2
> 主軸：Composition API + `<script setup>`；Options API 僅作為「讀懂舊程式碼」的對照附錄。

---

## 設計原則

1. **單一心智模型**：全程使用 Composition API + `<script setup>`，避免在 `this.xxx` 與 `ref().value` 之間切換造成混亂。
2. **漸進式深入**：每章只引入一個新概念，後續章節僅在前章基礎上疊加。
3. **業界對齊**：補上 Vue 3.4 / 3.5 的新標準（`defineModel`、`useTemplateRef`）與生態系（VueUse、Pinia 進階、Router 進階、部署）。
4. **橋接而非全包**：TypeScript、Nuxt、單元測試另有獨立課程，本課程僅以「橋接章」介紹概念與最小設定，引導學生下一步。

---

## 課程地圖

> ✅ = 已完成　⏳ = 待做　— = 既有章節未動

| # | 章節 | 主題 | 來源 | 狀態 |
|---|------|------|------|------|
| 00 | JS 基礎 | JavaScript 基本概念 | 既有 | — |
| 01 | 關注點分離 (SoC) | HTML / CSS / JS 拆分 | 既有 | — |
| 02 | CDN 建立 Vue App | 用 CDN 快速體驗 Vue | 既有 | — |
| 03 | 從 JS 到 Vue | 同一段邏輯的兩種寫法對照 | 既有 | — |
| 04 | CLI / Vite 專案 | `create-vue` + Vite 主要設定（alias / env / proxy） | **擴充** | ✅ |
| 05 | Directives | `v-text` / `v-html` / `v-if` / `v-show` / `v-for` / `v-on` / `v-model` / `v-bind` | 既有 | — |
| 06 | Composition API 基礎 | `<script setup>` / `ref` vs `reactive` / 解構陷阱 / `toRefs` | **新增（取代原 Options 生命週期章）** | ✅ |
| 07 | Computed | 計算屬性、getter/setter | 既有 | — |
| 08 | Watch & WatchEffect | `watch` vs `watchEffect` 差異與選用 | **擴充** | ✅ |
| 09 | 生命週期 | `onMounted` 等 Composition 生命週期 + Options API 對照附錄 | **整併** | ✅ |
| 10 | Template Refs | `useTemplateRef`（Vue 3.5）取 DOM / 子元件 | **新增** | ✅ |
| 11 | 元件基礎 | Props / Emit / Slots / Scoped Slots | 既有 | — |
| 12 | defineModel | Vue 3.4 標準 v-model 寫法 | **新增** | ✅ |
| 13 | 元件進階 | `<Teleport>` / `<Suspense>` + 異步元件 / `<KeepAlive>` | **新增** | ✅ |
| 14 | Composables（重點章） | 自訂 `useXxx` 組合式函式 | **新增** | ✅ |
| 15 | VueUse 實戰 | 業界常用 utility 庫 | **新增** | ✅ |
| 16 | Provide / Inject | 跨層級依賴注入、i18n 範例 | 既有 | — |
| 17 | API 串接 | fetch / axios + loading / error / data 三態 | **新增** | ✅ |
| 18 | Pinia | state / getters / actions + setup vs options + action 呼叫 API + 持久化 plugin | **擴充** | ✅ |
| 19 | Vue Router | 基本路由 + Navigation Guards + Lazy Loading + meta + 動態路由 | **擴充** | ✅ |
| 20 | 部署 | Vercel 部署示範 + 環境變數 + SPA fallback | **新增** | ✅ |
| 21 | 進階主題橋接 | TypeScript with Vue 簡介 + Nuxt 3 簡介 | **新增** | ⏳ |

**目前進度**：13 / 14 個需動章節已完成（93%）。

---

## 各章節詳細目標與內容

### 00 — JS 基礎
- **目標**：確認學生有 ES6+ 語法基礎。
- **內容**：let/const、箭頭函式、解構、模組、Promise/async。

### 01 — 關注點分離 (SoC)
- **目標**：理解為何要把 HTML / CSS / JS 拆開，鋪陳 Vue SFC 的合理性。

### 02 — CDN 建立 Vue App
- **目標**：用最小成本看見 Vue 響應性的魔力。
- **內容**：`<script src="vue.global.js">` + `createApp({})`。

### 03 — 從 JS 到 Vue
- **目標**：對照同一個 DOM 操作的純 JS 寫法 vs Vue 寫法。
- **內容**：點數計數器、清單渲染兩種寫法對照。

### 04 — CLI / Vite 專案 ⭐擴充
- **目標**：建立可長期維護的工程化基礎，看懂 `vite.config.js`。
- **內容**：
  - `npm create vue@latest` 互動式 wizard，逐題說明
  - `vite.config.js` 結構與啟動流程
  - `@` alias（`vite.config.js` + `jsconfig.json` 雙設定）
  - `.env` 系列檔案層級（dev / prod / local）與 `import.meta.env`
  - `server.proxy` 開發時繞 CORS（含 `^` anchor、`changeOrigin` 等細節）
- **不在範圍**：ESLint + Prettier 跟 Vue DevTools 由 wizard 預設加入，課堂上各提一句即可，不展開細節。

### 05 — Directives
- **目標**：模板語法完整掌握。
- **內容**：原有內容不動。

### 06 — Composition API 基礎 ⭐新增
- **目標**：建立 Composition API 心智模型。
- **內容**：
  - `<script setup>` 的角色與優勢
  - `ref()` vs `reactive()` 的選擇
  - 為什麼 `ref` 要 `.value`、模板中為何不用
  - 解構 `reactive` 物件會失去響應性的陷阱
  - `toRef` / `toRefs` 的用途
- **練習**：把 02 章的 CDN 計數器改寫成 SFC + Composition API。

### 07 — Computed
- **目標**：理解計算屬性的快取機制。
- **內容**：基本用法 + getter/setter。

### 08 — Watch & WatchEffect ⭐擴充
- **目標**：能正確選用 `watch` 或 `watchEffect`。
- **內容**：
  - `watch(source, cb)` 明確依賴、惰性
  - `watchEffect(cb)` 自動依賴、立即執行
  - 何時用哪個 + 常見錯誤

### 09 — 生命週期 ⭐整併
- **目標**：掌握 Composition API 生命週期 hook + 看得懂 Options API。
- **內容**：
  - `onBeforeMount` / `onMounted` / `onBeforeUpdate` / `onUpdated` / `onBeforeUnmount` / `onUnmounted`
  - **附錄**：Options API ↔ Composition API 生命週期對照表 + 一個 mini 範例（10–15 分鐘帶過）

### 10 — Template Refs ⭐新增
- **目標**：用現代寫法取 DOM 與子元件實例。
- **內容**：
  - `useTemplateRef()`（Vue 3.5 引入）
  - 與舊式字串 ref 的差異
  - 範例：focus input、滾動到指定元素

### 11 — 元件基礎
- **目標**：父子元件溝通的三大機制。
- **內容**：Props（含驗證）、Emit、Slots、Scoped Slots。原有內容用 `<script setup>` 寫法統一。

### 12 — defineModel ⭐新增
- **目標**：用 Vue 3.4 的新標準寫雙向綁定。
- **內容**：
  - `defineModel()` 取代 props + `update:xxx` emit
  - 多個 v-model 同時綁定
  - modifiers (`.trim`、`.lazy` 自訂)

### 13 — 元件進階 ⭐新增
- **目標**：實務必備的三個內建元件。
- **內容**：
  - `<Teleport>`：Modal / Tooltip / Toast
  - `<Suspense>` + `defineAsyncComponent`：載入態與 code splitting
  - `<KeepAlive>`：Tab 切換保留狀態

### 14 — Composables（重點章）⭐新增
- **目標**：學會抽取可重用邏輯，理解 Composition API 真正的價值。
- **內容**：
  - 命名慣例 `useXxx`
  - 從元件邏輯抽取成 `useMouse()`、`useCounter()` 等
  - 回傳值的設計（ref vs 物件 vs 函式）
  - 與生命週期、watch 結合
- **練習**：把第 11 章某個元件的邏輯抽成 composable，跨兩個元件重用。

### 15 — VueUse 實戰 ⭐新增
- **目標**：認識業界標配的 composable 集合庫。
- **內容**：
  - 安裝與使用
  - 常用：`useLocalStorage` / `useMouse` / `useFetch` / `useDebounce` / `useDark`
  - 帶學生看官方文件結構，培養自學能力

### 16 — Provide / Inject
- **目標**：跨多層元件共享資料。
- **內容**：i18n（多語系）範例。原有內容不動。

### 17 — API 串接 ⭐新增
- **目標**：寫出生產等級的 API 呼叫程式碼。
- **內容**：
  - `fetch` 基本用法 + 為何不夠
  - `loading / error / data` 三態 pattern
  - 抽成 composable `useFetch()`（自製版，呼應第 14 章）
  - axios 簡介與選用時機

### 18 — Pinia ⭐擴充
- **目標**：跨元件狀態管理。
- **內容**：
  - state / getters / actions（既有）
  - **新增**：在 action 中呼叫 API（呼應第 17 章）
  - **新增**：`pinia-plugin-persistedstate` 持久化
  - setup store vs options store 寫法比較

### 19 — Vue Router ⭐擴充
- **目標**：完整 SPA 路由能力。
- **內容**：
  - 基本路由、`<router-link>`、`<router-view>`（既有）
  - **新增**：動態路由 `/user/:id`
  - **新增**：巢狀路由
  - **新增**：Navigation Guards (`beforeEach` / 路由級守衛)
  - **新增**：Lazy Loading (`() => import('./Xxx.vue')`)
  - **新增**：`meta` 欄位與權限守衛範例

### 20 — 部署 ⭐新增
- **目標**：學完能把作品上線。
- **內容**：
  - Vite `npm run build` 輸出說明
  - Vercel 部署示範（從 GitHub 連結到自動部署）
  - 環境變數在部署平台的設定
  - SPA 路由的 fallback 設定

### 21 — 進階主題橋接 ⭐新增
- **目標**：學完之後的下一步方向指引。
- **內容**：
  - **TypeScript with Vue**：為什麼需要、`<script setup lang="ts">`、`defineProps<{...}>()` 對照、最小設定
  - **Nuxt 3**：為什麼需要 SSR/SSG、`npx nuxi init`、`pages/` 自動路由 demo、與原生 Vue 的差異

---

## 不在本課程範圍

| 主題 | 原因 |
|------|------|
| Vitest / 單元測試 | 另有獨立課程 |
| TypeScript 深入（泛型、Utility Types 等） | 另有獨立課程，本課程僅作橋接介紹 |
| Nuxt 3 深入（Server Routes、Nitro、SEO 進階） | 另有獨立課程，本課程僅作橋接介紹 |
| `v-memo` / `shallowRef` / `shallowReactive` | 一般專案用不到 |
| Vapor Mode（Vue 3.6） | 2026 仍非主流，可在第 21 章一句話帶過 |

---

## 與舊大綱的差異摘要

- **Options API 章節 (原 06)** → 降級為第 9 章附錄的對照表。
- **新增 9 個獨立章節**：Composition API 基礎、Template Refs、defineModel、元件進階、Composables、VueUse、API 串接、部署、進階主題橋接。
- **擴充 4 個既有章節**：04 CLI、08 Watch、18 Pinia、19 Vue Router。
- **章節順序重整**：把所有 Composition API 基礎（06–10）排在元件章節（11–14）之前，建立統一心智模型。

---

## Progress Log

每個章節對應的 commit；想找某章的程式碼時可直接查這個 commit。

| 章節 | 動作 | Commit | 資料夾 |
|------|------|--------|--------|
| 大綱 | 建立 SYLLABUS.md、README 改指向 | `c6c3802` | `SYLLABUS.md` |
| #14 | 新增 Composables（重點章） | `266979d` | `14-composables/` |
| #06 | 新增 Composition API 基礎 | `61d6345` | `06-composition-basics/` |
| #10 | 新增 Template Refs | `bc81e2a` | `10-template-refs/` |
| #12 | 新增 defineModel | `c8725ea` | `12-define-model/` |
| #13 | 新增 元件進階 | `556b9e3` | `13-advanced-components/` |
| #15 | 新增 VueUse 實戰 | `25827f4` | `15-vueuse/` |
| #17 | 新增 API 串接 | `82162f5` | `17-api/` |
| #08 | 重寫 Watch + WatchEffect | `12653d9` | `08-watch/` |
| #09 | 整併生命週期 + Options 附錄、退役 `06-lifecycle-options/` | `e25dd40` | `09-lifecycle-composition/` |
| #19 | 擴充 Vue Router（guards / meta / 404） | `bbc8876` | `19-router/` |
| #04 | 擴充 CLI（Vite 設定 + alias / env / proxy 對照範本） | _本次_ | `04-cli/` |
| #18 | 擴充 Pinia（README 補完 + options 對照 + API store + persistedstate） | _本次_ | `18-pinia/` |
| #20 | 新增 部署（Vercel demo + vercel.json rewrites + env vars） | _本次_ | `20-deploy/` |

### 待完成

| 章節 | 動作 | 預計優先序 |
|------|------|-----------|
| #21 | 新增 TS / Nuxt 橋接 | 中 |

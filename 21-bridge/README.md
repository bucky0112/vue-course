# 21 — 進階主題橋接（TypeScript / Nuxt）

> 學完前 20 章你能用 Vue 3 寫 SPA + 上線。這章不深入教 TS 跟 Nuxt — 它是「指南針」：告訴你它們是什麼、什麼時候會用到、怎麼開始自學。讀完這章你應該能判斷下一步該往哪走。

## 章節目標

1. 知道為什麼 Vue 專案會升級到 TypeScript
2. 看懂 `<script setup lang="ts">` 與 `defineProps<T>()` 的寫法
3. 知道為什麼會需要 Nuxt（SSR / SSG / SEO / auto routing）
4. 用 `pages/` 自動路由感受 Nuxt 跟原生 Vue 的差異
5. 學完後能自行決定要不要繼續深入哪一個

---

## 目錄
- [一、TypeScript with Vue](#一typescript-with-vue)
- [二、Nuxt（Nuxt 3 / 4）](#二nuxtnuxt-3--4)
- [三、TS + Nuxt 一起用嗎？](#三ts--nuxt-一起用嗎)
- [課程到這裡：下一步建議](#課程到這裡下一步建議)

---

## 一、TypeScript with Vue

### 為什麼考慮 TS

- **大型專案**：100+ 個元件，prop 名稱拼錯靠肉眼會漏
- **重構**：把 `user.name` 改成 `user.fullName`，TS 立刻幫你列出所有要改的位置
- **IDE 體驗**：autocomplete、跳轉、hover 顯示型別 — Vue + TS 比純 JS 強很多
- **跟 backend 共享型別**：API response 形狀有保證

### 為什麼不一定要 TS

- 短週期 prototype / 黑客松：型別宣告反而拖節奏
- 一人專案 < 10 元件：肉眼看得完，TS 設定成本不划算
- 團隊沒共識：強加 TS 會變成 `as any` 大量出現的反效果

### `defineProps` 兩種寫法並排

**檔案**：[`ts-demo/src/components/UserCard.vue`](./ts-demo/src/components/UserCard.vue)

**JS 版（前面章節都用這個）**：

```vue
<script setup>
const props = defineProps({
  name:  { type: String, required: true },
  email: { type: String, required: true },
  role:  { type: String, default: 'user' },
})
</script>
```

**TS 版（推薦）**：

```vue
<script setup lang="ts">
type Role = 'admin' | 'user' | 'guest'

interface UserProps {
  name: string
  email: string
  role?: Role
}

const props = withDefaults(defineProps<UserProps>(), {
  role: 'user',
})
</script>
```

### 關鍵差別

| 比較點 | JS `defineProps({...})` | TS `defineProps<T>()` |
|---|---|---|
| 型別檢查發生時機 | runtime（瀏覽器執行才知道） | 編譯期（IDE 立刻紅字） |
| `role` 傳 `'wizard'` | 開發時不會擋，runtime 才警告 | TS 直接拒絕 |
| IDE autocomplete | 只看得到 prop 名 | 連 prop 值的字面型別都看得到 |
| 預設值寫法 | `default: 'user'` | 需要 `withDefaults(...)` 包一層 |

### 最小設定（ts-demo/）

```
ts-demo/
├── tsconfig.json         ← entry，references 兩個 sub-config
├── tsconfig.app.json     ← src/ 程式碼用，繼承 @vue/tsconfig
├── tsconfig.node.json    ← vite.config.ts 用，繼承 @tsconfig/node22
├── env.d.ts              ← Vite client 型別宣告
├── vite.config.ts        ← 副檔名變 .ts
└── src/
    ├── main.ts           ← 副檔名變 .ts
    ├── App.vue           ← <script setup lang="ts">
    └── components/
        └── UserCard.vue
```

**三個 tsconfig 的分工**：

- `tsconfig.app.json`：給 src/ 內的程式碼用，繼承 `@vue/tsconfig/tsconfig.dom.json`（含 DOM 型別 + Vue 設定）
- `tsconfig.node.json`：給 `vite.config.ts` 用，繼承 `@tsconfig/node22`（含 Node API 型別）
- `tsconfig.json`：本身不直接編譯，只 references 上面兩個

為什麼要分？因為 `vite.config.ts` 跑在 Node 環境（要 `fileURLToPath` 之類），但 `src/` 程式碼跑在瀏覽器（要 DOM、不要 Node 全域變數）。兩種環境型別不同。

### 跑起來

```sh
cd ts-demo
npm install
npm run dev          # vite dev server，TS 自動編譯
npm run type-check   # vue-tsc 全專案型別檢查
npm run build        # 先 type-check 再 build
```

### 試一個 type error

在 `src/App.vue` 把任一個 user 的 `role: 'admin'` 改成 `role: 'wizard'`，跑 `npm run type-check`：

```
src/App.vue:13:54 - error TS2322: Type '"wizard"' is not assignable
  to type '"admin" | "user" | "guest" | undefined'.
```

**這就是 TS 的價值**：早一個編譯週期抓到。

### 想繼續深入

- 把現有 JS 元件**逐一**改成 TS（不必一次全換）
- 跟 backend 約定型別：用 [Zod](https://zod.dev) schema 或 OpenAPI 自動產生
- 進階主題：Pinia typed store / Vue Router typed routes / template 內 typed events

> 另有獨立的 TypeScript 課程深入語法（泛型、Utility Types、Discriminated Unions 等），本章僅展示「Vue + TS 的最小可工作骨架」。

---

## 二、Nuxt（Nuxt 3 / 4）

### 為什麼考慮 Nuxt

原生 Vue SPA（前 20 章）的限制：

- **HTML 是空殼**，SEO 差（爬蟲拿不到內容）
- **首屏白屏久**（JS 全部下載並執行完才有東西）
- **沒有後端**，需要另起一個 Express / Fastify

Nuxt 全部補上：

- **SSR** (Server-Side Rendering)：請求進來在 server 上 render，瀏覽器收到的是有內容的 HTML
- **SSG** (Static Site Generation)：build 時 pre-render 所有路由成 .html，部署 CDN 飛快
- **Server routes / Nitro**：在同個專案寫 `/api/*` endpoint（不用另開 backend）
- **File-based routing**：`pages/` 自動變路由表
- **Auto-imports**：composables / components / utils 自動 import

### 為什麼不一定要 Nuxt

- **後台 / 儀表板 / 登入後才能用的工具**：SEO 不重要、首屏白屏 0.5 秒可接受 → 原生 Vue + Vite 更輕
- **已經有後端能 render HTML**（Rails、Django 等）→ 不需要 SSR
- **學習成本**：Nuxt 包了很多隱式行為，要花時間理解 directory 慣例與 auto-import 規則

### Nuxt 範例：nuxt-demo/

```
nuxt-demo/
├── package.json
├── nuxt.config.ts
├── app.vue              ← 整個 app 的 layout shell
└── pages/
    ├── index.vue        → /
    ├── about.vue        → /about
    └── users/
        └── [id].vue     → /users/:id
```

**重點觀察**：沒有 `src/router/index.js`。**檔案結構就是路由表**。要加新路由？在 `pages/` 加個 `.vue` 檔即可。

### 跟原生 Vue Router（第 19 章）對照

| 原生 Vue Router | Nuxt |
|---|---|
| `src/router/index.js` 設 `routes: [...]` | 不存在，看 `pages/` |
| `import HomeView from './views/HomeView.vue'` | 不存在，檔名即路由 |
| `<RouterLink to="/about">` | `<NuxtLink to="/about">` |
| `<RouterView>` | `<NuxtPage>` |
| `import { useRoute } from 'vue-router'` | `useRoute()`（auto-import，免 import） |
| 動態路由 `/user/:id` | 檔名 `[id].vue` |
| 巢狀路由 | 子資料夾 `users/[id]/posts/[postId].vue` |
| Lazy loading 要寫 `() => import(...)` | 預設就是 lazy |

### 跑起來

⚠️ Nuxt 加上 Nitro server runtime 會裝 200+ packages（約 500MB），本範本沒附 lock 檔，install 會跑一陣子。

```sh
cd nuxt-demo
npm install      # 第一次 install + nuxt prepare 約 1-2 分鐘
npm run dev      # http://localhost:3000
```

`postinstall` 會自動跑 `nuxt prepare`，產生 `.nuxt/` 內部資料夾。**這個是 Nuxt 必要的步驟**，沒跑型別會壞、auto-import 不會運作。

### 想繼續深入

- 把現有 Vue + Router 專案逐步遷移成 Nuxt（pages、components 結構）
- 把 client-side fetch 改用 `useFetch` / `useAsyncData`（SSR 時自動跑在 server）
- 探索 Nuxt modules 生態系：
  - `@nuxtjs/tailwindcss` — Tailwind CSS 整合
  - `@pinia/nuxt` — Pinia 整合
  - `@sidebase/nuxt-auth` — 認證
  - `@nuxtjs/i18n` — 多語系

> 另有獨立的 Nuxt 課程深入 Server Routes、Nitro、SEO 進階主題，本章僅給「Nuxt 跟 Vue 比起來有什麼不同」的感覺。

---

## 三、TS + Nuxt 一起用嗎？

可以也常見。**Nuxt 預設就支援 TS**（`nuxt.config.ts` 本身就是 .ts），任何 `.vue` 加 `<script setup lang="ts">` 即可。Nuxt 還會自動產生 **typed routes**（router push 跟 page params 都有型別），這是原生 Vue Router 沒有的。

實務上：團隊規模 + 專案週期 ≥ 3 個月 → 直接走 **Nuxt + TS** 的組合。

---

## 課程到這裡：下一步建議

學完 21 章你能寫一個 Vue 3 SPA 並部署上線。具體下一步看你的目標：

| 你想做的事 | 建議方向 |
|---|---|
| 把學到的東西做個自己的作品 | 馬上動手做小作品上線（履歷加分大於再學新東西） |
| 做 SaaS / 部落格 / 內容網站 | 學 **Nuxt** |
| 接 backend project / 跨團隊協作 | 學 **TypeScript** |
| 想要單元測試 / TDD | 走 **Vitest** 獨立課程 |
| 想做 mobile app | React Native / Capacitor / Tauri |
| 想做 Vue 元件庫 / 設計系統 | 深入 unplugin-vue-components / Storybook |
| 想理解 Vue 內部 | 看 Vue 原始碼、reactivity transform、Vapor mode |

最重要的一條：**先把學到的東西真的做個小東西上線**。理論再多沒有產出，雇主跟協作者看的都是「你做過什麼」。

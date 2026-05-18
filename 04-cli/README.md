# 04 — CLI / Vite 專案

> 從第 5 章開始所有範例都會用 Vite 工程化專案，這章是 CDN → 工程化的橋。學完這章你能自己 `npm create vue@latest` 開新案、看懂 `vite.config.js` 在做什麼、會用 alias / env / proxy 解決日常痛點。

## 章節目標

1. 用 `npm create vue@latest` 互動式 wizard 建專案，認得每個選項意義
2. 看懂 `vite.config.js` 的結構與啟動流程
3. 用 `@` alias 簡化 import 路徑
4. 用 `.env` 系列檔案管理環境變數，理解 dev / prod 的層級
5. 用 `server.proxy` 在開發時繞過 CORS 直連後端 API

---

## 目錄
- [1. 用 `npm create vue@latest` 建專案](#1-用-npm-create-vuelatest-建專案)
- [2. 對照範本：`demo/`](#2-對照範本demo)
- [3. `vite.config.js` 結構](#3-viteconfigjs-結構)
- [4. `@` Alias](#4--alias)
- [5. `import.meta.env` 與 `.env` 檔案](#5-importmetaenv-與-env-檔案)
- [6. `server.proxy` 練習](#6-serverproxy-練習)
- [7. dev vs build vs preview](#7-dev-vs-build-vs-preview)
- [常見錯誤](#常見錯誤)
- [練習題](#練習題)

---

## 1. 用 `npm create vue@latest` 建專案

```sh
npm create vue@latest
```

跑下去後 wizard 會逐題問你（Vue 3.5+ 官方 scaffolder）：

| 問題 | 建議 | 說明 |
|------|------|------|
| Project name | 自取 | 會建一個同名資料夾 |
| Add TypeScript? | **No** | 本課程用 JS。TS 在第 21 章橋接介紹 |
| Add JSX Support? | **No** | Vue 模板已經夠用 |
| Add Vue Router? | 視需求 | 學第 19 章前不必加 |
| Add Pinia? | 視需求 | 學第 18 章前不必加 |
| Add Vitest? | **No** | 單元測試另有獨立課程 |
| Add E2E Testing? | **No** | 同上 |
| Add ESLint? | **Yes** | 強烈建議，避免低級語法錯 |
| Add Prettier? | **Yes** | 跟 ESLint 整合，免手動排版 |
| Add Vue DevTools? | **Yes** | Vite 6 起官方推薦 |

`★ 重點：Wizard 跑出來的 ESLint + Prettier 已經整合好，不會互相打架。十年前要自己調 `eslint-config-prettier` 的痛苦時代已經過去了。`

跑完之後：

```sh
cd <你取的名字>
npm install     # 安裝 dependencies
npm run dev     # 啟 dev server，預設 http://localhost:5173
```

---

## 2. 對照範本：`demo/`

`04-cli/demo/` 是「**選 JS、不加 Router/Pinia/Test、加上 ESLint+Prettier+DevTools**」之後的最小結構，並且額外配好 alias / env / proxy 三項常用設定。

```
demo/
├── .env                    # 共用
├── .env.development        # npm run dev 時載入
├── .env.production         # npm run build 時載入
├── .gitignore
├── index.html              # 進入點 HTML
├── jsconfig.json           # IDE 認得 @ alias
├── package.json
├── vite.config.js          # 全部設定都在這
└── src/
    ├── App.vue
    └── main.js
```

跑起來：

```sh
cd 04-cli/demo
npm install
npm run dev
```

打開瀏覽器看到的兩個區塊：
- **import.meta.env**：列出環境變數內容
- **Proxy demo**：透過 `/api` 抓 JSONPlaceholder 的 users

---

## 3. `vite.config.js` 結構

```js
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: { alias: { /* ... */ } },
  server:  { proxy: { /* ... */ } },
})
```

最常動的三個區塊：

| 區塊 | 用途 |
|------|------|
| `plugins` | 註冊外掛（`@vitejs/plugin-vue` 處理 `.vue` SFC、vueDevTools 提供瀏覽器擴充） |
| `resolve.alias` | 路徑別名（避免 `../../../components/Foo`） |
| `server.proxy` | 開發時把指定路徑反向代理到後端，繞 CORS |

其他常見區塊（這章先不展開）：
- `build` — 輸出設定（產 dist/ 用）
- `define` — 編譯期常數替換
- `optimizeDeps` — 預打包設定

---

## 4. `@` Alias

**痛點**：深層元件 import 時要寫 `../../../components/UserCard.vue`，重構移動檔案會壞。

**解法**：用 `@` 代表 `src/`。

設定有兩個地方：

**a. `vite.config.js`**（給 Vite 編譯時用）

```js
import { fileURLToPath, URL } from 'node:url'

resolve: {
  alias: {
    '@': fileURLToPath(new URL('./src', import.meta.url)),
  },
},
```

**b. `jsconfig.json`**（給 IDE / VSCode 跳轉用）

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "exclude": ["node_modules", "dist"]
}
```

> ⚠️ 兩個都要設。少 a 會編譯失敗，少 b 是 VSCode 跳轉不到（程式還是會跑）。

**用起來**：

```js
// ❌ 不爽寫
import UserCard from '../../../components/UserCard.vue'

// ✅ 看得懂、移動檔案不會壞
import UserCard from '@/components/UserCard.vue'
```

本範本的 `src/main.js` 就有用：

```js
import App from '@/App.vue'
```

---

## 5. `import.meta.env` 與 `.env` 檔案

**問題**：API URL / 金鑰 / debug flag 等變數，在 dev / staging / prod 各不同，不該寫死在程式碼。

**Vite 規則**：

1. 專案根目錄放 `.env*` 檔案
2. **只有 `VITE_` 開頭的變數會被注入到前端程式碼**
3. 程式裡用 `import.meta.env.VITE_XXX` 讀

### 載入順序

| 模式 | 載入順序（後者覆蓋前者） |
|------|--------------------------|
| `npm run dev`     | `.env` → `.env.development` → `.env.local` → `.env.development.local` |
| `npm run build`   | `.env` → `.env.production`  → `.env.local` → `.env.production.local`  |

`*.local` 預設在 `.gitignore` 內，**個人 / 機密資料放這裡**（API key 之類）。

### 範本的設定

`.env`（共用）：
```
VITE_APP_TITLE=Vite CLI Demo
```

`.env.development`（dev 覆蓋）：
```
VITE_APP_TITLE=Vite CLI Demo (dev)
VITE_API_BASE=/api
```

`.env.production`（build 覆蓋）：
```
VITE_API_BASE=https://jsonplaceholder.typicode.com
```

跑 `npm run dev` 時 `VITE_APP_TITLE` 拿到的是 `Vite CLI Demo (dev)`，`VITE_API_BASE` 是 `/api`（為了下一節的 proxy）。
跑 `npm run build && npm run preview` 時 `VITE_API_BASE` 變成完整 URL（正式環境沒 dev server 沒 proxy）。

### Vite 內建變數

不用設定也能直接讀：

| 變數 | 型別 | 內容 |
|------|------|------|
| `import.meta.env.MODE` | string | `'development'` 或 `'production'` |
| `import.meta.env.DEV`  | boolean | dev 時為 true |
| `import.meta.env.PROD` | boolean | build 時為 true |
| `import.meta.env.BASE_URL` | string | 部署 base path，預設 `/` |

---

## 6. `server.proxy` 練習

**問題**：開發時 frontend 跑在 `http://localhost:5173`、API 在 `https://api.example.com`，瀏覽器會擋 CORS。

**正式環境的解法**：後端設 `Access-Control-Allow-Origin`。
**開發環境的解法**：用 Vite dev server 當「同源代理」轉發。前端打 `/api/users` 看起來像同源，背後 Vite 改寫成真實的 `https://api.example.com/users`，瀏覽器以為跟自己對話，CORS 不管。

### 本範本的設定（檔案：`demo/vite.config.js`）

```js
server: {
  proxy: {
    '/api': {
      target: 'https://jsonplaceholder.typicode.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
},
```

### 三個欄位分別在做什麼

| 欄位 | 作用 | 不設會怎樣 |
|------|------|------------|
| `target` | 真實的後端 URL（host 為止，不含 path） | 沒值無法轉發 |
| `changeOrigin: true` | 把 request 的 `Host` header 從 `localhost:5173` 改成 target 的 host | 外部 API 很可能 400/404/403 |
| `rewrite` | 對 path 做字串改寫的 function | 不改的話 fetch `/api/users` 會被轉成 `target/api/users`，多了 `/api` 前綴 |

### 為什麼 rewrite 用 `path.replace(/^\/api/, '')` 不用 `path.replace('/api', '')`？

`^` anchor 保證**只替換開頭**。沒 anchor 的話，若 endpoint 是 `/users/api-key` 之類，中間的 `/api` 也會被吃掉。Regex 在這裡值得。

### 對照觀察

**proxy 區塊空著時**（學員寫之前）：
- `fetch('/api/users')` 被 Vite 的 SPA fallback 攔截、回傳 `index.html`
- 前端 `res.json()` 解析 HTML 失敗 → `SyntaxError: Unexpected token <`
- App.vue 的 error 區塊出現

**proxy 區塊填完之後**：
- `fetch('/api/users')` 被 proxy 攔截
- Vite 改寫成 `GET https://jsonplaceholder.typicode.com/users`，加上正確 Host header
- 拿到 JSON 陣列，App.vue 渲染 5 位 user

---

## 7. dev vs build vs preview

| 指令 | 在做什麼 | 用什麼 env 檔 |
|------|----------|---------------|
| `npm run dev`     | 啟 Vite dev server，HMR、proxy、source map 全開 | `.env` + `.env.development` |
| `npm run build`   | 編譯打包到 `dist/`，minify、tree-shake、code split | `.env` + `.env.production` |
| `npm run preview` | 用簡易 server 預覽 `dist/`，**不過 proxy**，不是給正式部署用 | (與 build 一致) |

`★ 重點：preview 沒有 proxy。如果你的 prod 還靠 proxy = 設計錯了，正式環境的 CORS 要靠 server 端 `Access-Control-Allow-Origin` 處理。preview 只是讓你本地確認打包輸出能跑。`

---

## 常見錯誤

### 1. 在 `.env` 寫 `API_BASE=xxx`，前端 `import.meta.env.API_BASE` 拿到 `undefined`

漏了 `VITE_` 前綴。Vite 只注入 `VITE_*` 的變數，其他被視為 server 端、不會出現在 browser bundle。

### 2. 改了 `.env` 沒反應

env 是**啟動時**讀的，改完要 ctrl+c 重啟 dev server。

### 3. proxy 設好了還是 CORS

那不是 proxy 沒設 — 是你在程式裡寫了 `fetch('https://api.example.com/users')` 而不是 `fetch('/api/users')`。直接寫絕對 URL 跳過了 proxy。

### 4. VSCode 跳轉 `@/components/Foo` 失敗

漏了 `jsconfig.json`。Vite 編譯是 OK 的（因為它讀 `vite.config.js`），但 IDE 沒有 `jsconfig.json` 不知道 `@` 對應哪裡。

### 5. `npm run preview` 抓不到 API

對的，preview 沒有 proxy（見上面的表）。要嘛打絕對 URL（生產環境作法），要嘛繼續用 `npm run dev` 測試。

---

## 練習題

1. 在範本內新增 `.env.local`（記得 .gitignore 已經會擋），覆蓋 `VITE_APP_TITLE` 成你的名字。確認 `npm run dev` 顯示的標題是你的覆蓋值。
2. 把 proxy 的 path prefix 從 `/api` 改成 `/jsonph`，調整 `.env.development` 跟 `vite.config.js`，確認還能跑。**觀察：兩個檔案的常數要同步改，這就是為什麼一般專案會把 base 寫在 env 而不是寫死。**
3. （進階）多加一條 proxy 規則：`/gh` → `https://api.github.com`，並在 App.vue 加一段「抓你自己的 GitHub repo 列表」。注意 GitHub 未認證 API 有 60 req/hr 的 rate limit。
4. （進階）`npm run build && npm run preview` 觀察 `import.meta.env` 變化，思考為什麼 `MODE` 變成 `production` 而 `VITE_API_BASE` 變成完整 URL。

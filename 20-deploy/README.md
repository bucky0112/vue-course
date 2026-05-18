# 20 — 部署

> 把作品上線。本章涵蓋 `npm run build` 輸出說明、Vercel 部署三種方式、環境變數管理、以及 SPA 路由的 fallback 設定 — 也就是「本地能跑，部署 404」的最大原因。

## 章節目標

1. 看懂 `npm run build` 的輸出結構與檔案命名
2. 知道 Vercel 三種部署方式（Git 整合 / CLI / `--prebuilt`）何時用哪個
3. 在部署平台正確設定環境變數，區分 preview 與 production
4. 用 `vercel.json` 的 `rewrites` 解決 Vue Router history mode 的 SPA fallback 問題
5. 區分「本地 `vite preview` 能跑」與「線上實際部署能跑」的差別

---

## 目錄
- [1. `npm run build` 輸出說明](#1-npm-run-build-輸出說明)
- [2. 部署到 Vercel 的三種方式](#2-部署到-vercel-的三種方式)
- [3. 環境變數](#3-環境變數)
- [4. SPA Fallback — 本章最重要的一節](#4-spa-fallback--本章最重要的一節)
- [5. 自訂網域與 HTTPS](#5-自訂網域與-https)
- [常見錯誤](#常見錯誤)
- [練習題](#練習題)

---

## 1. `npm run build` 輸出說明

跑下去：

```sh
cd 20-deploy/demo
npm install
npm run build
```

會看到類似這樣的輸出：

```
vite v6.4.2 building for production...
✓ 34 modules transformed.
dist/index.html                         0.40 kB │ gzip:  0.28 kB
dist/assets/HomeView-YtAy7Zu3.css       0.06 kB │ gzip:  0.08 kB
dist/assets/AboutView-DGwgOUFk.css      0.17 kB │ gzip:  0.14 kB
dist/assets/NotFoundView-BfQ-1X_Q.css   0.21 kB │ gzip:  0.16 kB
dist/assets/index-BWTs1kgS.css          0.59 kB │ gzip:  0.30 kB
dist/assets/HomeView-C-k13BKg.js        0.50 kB │ gzip:  0.45 kB
dist/assets/NotFoundView-DiH3PknT.js    0.74 kB │ gzip:  0.59 kB
dist/assets/AboutView-B-pmL89f.js       0.84 kB │ gzip:  0.57 kB
dist/assets/index-BdkSw8Sv.js          90.20 kB │ gzip: 35.40 kB
✓ built in 391ms
```

### `dist/` 結構

```
dist/
├── index.html                          ← 唯一的 HTML，所有路由都載入它
└── assets/
    ├── index-BdkSw8Sv.js               ← 主 bundle（Vue runtime + router + App）
    ├── index-BWTs1kgS.css              ← 主 CSS
    ├── HomeView-C-k13BKg.js            ← 路由 lazy loading 切出來的 chunk
    ├── AboutView-B-pmL89f.js
    ├── NotFoundView-DiH3PknT.js
    └── *.css                            ← 每個 view 自己的 scoped CSS
```

### 為什麼檔名有亂碼？

`index-BdkSw8Sv.js` 中的 `BdkSw8Sv` 是**內容 hash**。

- 同一份內容 → 同一個 hash
- 改了任一行 → hash 就變

這讓 CDN / 瀏覽器可以**永久 cache**：檔名變了 = 新檔案，舊檔名繼續 cache 也沒關係。

### 為什麼 view 被切成多個 chunk？

因為 `src/router/index.js` 用了 lazy loading：

```js
component: () => import('@/views/HomeView.vue')
```

`() => import(...)` 是 dynamic import，Vite 會把這個檔案及其相依切成獨立 chunk。**使用者進首頁時只下載 `index.js` + `HomeView.js` ≈ 91KB；不會載 About / 404**。

跟同步 import 對照：

```js
// 同步 import → 全部塞進主 bundle，首頁就會載 100% 程式碼
import HomeView from '@/views/HomeView.vue'
```

### `index.html` 變成什麼樣

打開 `dist/index.html`：

```html
<!DOCTYPE html>
<html lang="zh-Hant">
  <head>
    <title>20 — Deploy Demo</title>
    <script type="module" crossorigin src="/assets/index-BdkSw8Sv.js"></script>
    <link rel="stylesheet" crossorigin href="/assets/index-BWTs1kgS.css">
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

Vite 把 `<script src="/src/main.js">` 換成編譯後的 hashed bundle。`<div id="app">` 完全空 — Vue 在 client 端執行後才把內容塞進去。

> ⚠️ 這就是 **SPA**：HTML 是空殼、所有渲染在 client 端 JS 執行後才發生。SEO 跟首屏速度是 SPA 的代價，要兼顧的話請用 Nuxt（第 21 章）。

---

## 2. 部署到 Vercel 的三種方式

### a. Git 整合（**最推薦**，95% 情況用這個）

1. push 程式碼到 GitHub
2. https://vercel.com → 「Add New Project」→ 選你的 repo
3. Vercel 自動偵測 Vite framework，build command / output dir 都已預設好
4. 點「Deploy」

之後**每次 push** 都會自動觸發部署：
- push 到 main → 觸發 production deploy
- push 到其他 branch / PR → 觸發 preview deploy，每次都有獨立 URL

> 為什麼推薦：零維運成本、有 PR 預覽、有 rollback 一鍵回上一版、有 build log。

### b. Vercel CLI

```sh
npm i -g vercel
vercel login
cd 你的專案
vercel              # preview deploy
vercel --prod       # production deploy
```

何時用：
- 一次性 demo 不想連 GitHub
- CI 流程要客製化
- 想在 terminal 看 build log

### c. `--prebuilt` + 自家 CI

```sh
npm run build       # 自家 CI 跑完 build
vercel --prebuilt   # 只上傳 dist/，不再讓 Vercel 跑 build
```

何時用：
- 你的 build 需要 Vercel 之外的服務（內部 npm registry、私有 dependency）
- 想把 build 跟 deploy 完全切開

> 對課堂專案而言，**(a) 才是常態**。其他兩個提一下知道存在即可。

---

## 3. 環境變數

### Vite 側（已在第 4 章教過）

開發：`.env.development`
建置：`.env.production`
個人 / 機密：`.env.local` 或 `.env.production.local`（gitignore）

### Vercel 側

Vercel UI → Project → Settings → Environment Variables

每個變數有三個環境可勾：
- **Production** — push 到主分支會觸發
- **Preview** — 其他分支、PR 部署會用
- **Development** — `vercel dev` 本地用

### 兩個常見問題

**Q1: 我 `.env.production` 寫了 `VITE_API_BASE=https://api.example.com`，要不要也加到 Vercel UI？**

要。`.env.production` **如果被 commit 進 git**，Vercel 確實會在 build 時讀到，但這只該放公開值。**祕密絕對不能 commit**，必須只在 Vercel UI 設、不在程式碼裡留任何痕跡。

**Q2: 我把同個 key 在 `.env.production` 跟 Vercel UI 都設了，誰贏？**

Vercel build 流程是：先讀 `.env.production` → Vercel UI 的環境變數會**覆蓋**同名 key。所以 Vercel UI 最大。

### 同步到本地

```sh
vercel link            # 本機 repo 連結到 Vercel 專案
vercel env pull        # 把 Vercel UI 的環境變數抓下來變成 .env.local
```

`.env.local` 預設在 `.gitignore` 裡，不會誤 commit。

---

## 4. SPA Fallback — 本章最重要的一節

### 痛點重現

本範本 (`20-deploy/demo`) 包含 3 條路由：`/`、`/about`、`/:pathMatch(.*)*`（404 catch-all）。

**本地 `npm run dev` 或 `npm run preview`**：
- 打 `/about` ✅ 顯示 About
- 重整 `/about` ✅ 還是 About
- 打 `/nope` ✅ 顯示自訂 404

**部署到 Vercel，沒設 vercel.json**：
- 打 `/about` ✅ 顯示 About
- 重整 `/about` ❌ **Vercel 預設 404 頁**

### 為什麼？

| 步驟 | 本地 vite preview | Vercel（沒 rewrites） |
|------|-------------------|-----------------------|
| 瀏覽器送 `GET /about` | vite preview 看不到 about.html，**fallback 回 index.html** | Vercel 看 `dist/` 沒有 about.html，**回 404** |
| 載 index.html、Vue 啟動 | OK | (沒機會) |
| Vue Router 看 URL 是 `/about` | 顯示 AboutView | (沒機會) |

關鍵差別：**vite preview 有 SPA fallback 預設行為，Vercel 沒有**。

> 為什麼 Vercel 不預設？因為它本身是泛用的 hosting，不知道你是 SPA。即使現在 Vercel 對 Vite framework 有偵測、實務上幾乎自動處理，**寫 `vercel.json` 仍然是最穩定的明示作法**。

### 解法：`vercel.json` rewrites

範本內就有：

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

意思：**所有路徑（regex `/(.*)`）的請求，都當作 `/` 處理** — Vercel 回 `index.html`，剩下交給 Vue Router。

### 三種 SPA fallback 寫法對照

| 寫法 | 設定 | 適用 |
|------|------|------|
| **rewrites（推薦）** | `vercel.json` 加 `rewrites` 規則 | 最明示、最穩定 |
| **框架偵測** | 不設任何檔案，靠 Vercel 自動辨識 Vite/Vue | 簡單但容易在升級時破功 |
| **手動 404 fallback** | `vercel.json` 加 `routes` + `dest: index.html` | Vercel 舊版語法，新專案不建議 |

### 為什麼不在 Vue Router 用 hash mode 來避免這個問題

```js
import { createWebHashHistory } from 'vue-router'
// 網址會變 /#/about
```

- ✅ 不需要 server 端設定，純靜態檔案 host 也能跑
- ❌ 網址醜（`/#/about`）
- ❌ SEO 差（爬蟲對 `#` 後面通常忽略）
- ❌ 跟現代瀏覽器體驗不一致

**幾乎所有 production SPA 都用 history mode + server 端 fallback**。

---

## 5. 自訂網域與 HTTPS

Vercel UI → Project → Settings → Domains → 加入你買的網域。

按指示在 DNS provider 設 CNAME 或 A record，等 DNS 生效（10 分鐘到 24 小時不等）。

HTTPS 由 Vercel 自動處理（Let's Encrypt），不用自己弄憑證。

---

## 常見錯誤

### 1. 部署成功但首頁空白，console 看到 404 抓不到 JS

`vite.config.js` 的 `base` 設錯了。Vercel 部署到根目錄 (`/`)，`base` 應該保持預設或設 `/`。如果部署到子路徑（GitHub Pages 之類），才需要設 `base: '/repo-name/'`。

### 2. `.env.production` 改了，部署沒生效

兩個可能：
- 沒 commit + push（Vercel 從 git 抓，本地改沒用）
- key 沒 `VITE_` 前綴（被視為 server 端、不會打進 client bundle）

### 3. 部署的網站打不到 API（CORS / 404）

開發環境靠 `vite.config.js` 的 `server.proxy` — **proxy 不會被部署**。生產環境的 API 必須：
- 後端設好 CORS（推薦），或
- 用同源（前後端部署在同個 Vercel 專案下，後端走 Vercel Functions）

### 4. PR preview deploy 看到的是 production env vars

Vercel UI 設環境變數時要勾「Preview」環境，否則 PR 部署只會拿到 Production 環境變數。建議：
- Production env：正式 API、正式金鑰
- Preview env：staging API、staging 金鑰
- Development env：本地、`vercel dev` 時

### 5. 學員回報「本地正常、部署 404」

99% 是 SPA fallback 沒設 — `vercel.json` 漏了，或框架偵測在某次升級後失效。叫他先補 `rewrites` 規則。

---

## 練習題

1. **基礎**：把 `20-deploy/demo` push 到一個你 GitHub 上的 repo，在 Vercel 連結，跑 production deploy，把 URL 貼出來。確認 `/`、`/about`、`/nope` 三條路由都正常運作。
2. **驗證 SPA fallback**：把 `vercel.json` 暫時改名成 `_vercel.json.bak`，重新 commit + push、等部署完成。直接打 `https://your-url/about`，觀察是否變成 Vercel 預設 404。改回來後再確認恢復。
3. **環境變數**：在 Vercel UI 設一個 `VITE_APP_TITLE = Hello from Vercel`，把 `.env.production` 同 key 改成別的值。部署後看頁面顯示哪個 — 驗證「Vercel UI 覆蓋 commit 進 git 的 .env」。
4. **PR Preview**：在本機開新 branch、改個顯眼的東西、push 後在 GitHub 開 PR。觀察 Vercel 自動產生的 preview URL，是不是有不同的 hash 子域名。
5. **進階**：把 `npm run build` 跑出來的 `dist/index-*.js` 檔案大小列出來，找出哪個檔案最大。如果未來要減少 bundle size，從哪個檔案先下手？

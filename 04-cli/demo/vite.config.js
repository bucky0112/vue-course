import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      // '@' 指向 ./src/，配合 jsconfig.json 讓 IDE 也認得
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      // ──────────────────────────────────────────────────────────
      // TODO（學員練習）：補完 '/api' 的反向代理規則
      //
      // 需求：前端 fetch('/api/users')
      //       → 由 vite dev server 攔截
      //       → 改寫成 https://jsonplaceholder.typicode.com/users
      //       → 轉發出去，把結果原封不動回傳給前端
      //
      // 三個關鍵欄位：
      //   target:       後端 URL（不含路徑）
      //   changeOrigin: 是否把 Host header 改成 target 的 host
      //                 連外部公開 API 幾乎一定要 true
      //   rewrite:      改寫 path 的 function；JSONPlaceholder 沒有
      //                 /api 前綴，要把它拿掉
      //
      // 練習：在下方填上 '/api': { ... }，跑 `npm run dev`，
      //       打開瀏覽器看 ProxyDemo 區塊有沒有出現 5 位使用者。
      // ──────────────────────────────────────────────────────────
      '/api': {
        target: 'https://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
  },
})

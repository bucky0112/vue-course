# Vue.js 教學專案

這是一個漸進式的 Vue.js 教學專案，從基礎 JavaScript 到 Vue.js 的各個重要概念都有涵蓋。

## 課程大綱

完整課程大綱請見 [SYLLABUS.md](./SYLLABUS.md)，內含 21 個章節的學習目標、內容、與設計理念。

簡要學習路徑：

1. **基礎準備** (`00-js` → `04-cli`)：JavaScript 基礎、關注點分離、Vue CDN 體驗、CLI/Vite 工程化
2. **模板與響應性** (`05-directives` → `09-lifecycle`)：指令、Composition API 基礎、Computed、Watch、生命週期
3. **元件系統** (`10-template-refs` → `13-advanced-components`)：Template Refs、元件基礎、`defineModel`、Teleport/Suspense/KeepAlive
4. **可重用邏輯** (`14-composables` → `15-vueuse`)：自訂 Composables、VueUse 生態系
5. **跨元件溝通與資料** (`16-provide` → `17-api`)：Provide/Inject、API 串接 pattern
6. **應用層** (`18-pinia` → `19-router`)：Pinia 狀態管理、Vue Router 路由
7. **上線與下一步** (`20-deploy` → `21-bridge`)：部署、TypeScript / Nuxt 橋接介紹

## 環境設定

請安裝 Node.js 版本至少在 18.3 或以上。

### 專案設定
每個子專案都可以獨立運行，進入對應資料夾後：

```bash
# 安裝依賴
npm install

# 開發環境運行
npm run dev

# 生產環境建置
npm run build
```

## 注意事項

1. **漸進式學習**：
   - 建議按照資料夾編號順序學習
   - 每個概念都建立在前面的基礎之上

2. **API 風格**：
   - 主軸採用 Composition API + `<script setup>`，與 Vue 3 官方推薦及業界主流一致
   - Options API 僅在第 9 章附錄以對照表形式介紹，目的是讓你能讀懂舊專案

3. **練習建議**：
   - 每個主題都包含了實作範例
   - 建議動手跟著範例練習
   - 可以嘗試修改範例來深入理解概念

4. **相依性管理**：
   - 較早期的範例使用 CDN 方式引入 Vue
   - 後面的範例使用 npm 套件管理
   - 請確保按照各專案的 README 說明安裝必要依賴

5. **開發工具**：
   - 建議安裝 [Vue DevTools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd?hl=en) 擴充功能
   - 使用 VSCode + [Vue - Offical](https://marketplace.visualstudio.com/items?itemName=Vue.volar) 獲得最佳開發體驗

## 學習資源

- [Vue 3 官方文件](https://vuejs.org/)
- [Vue Router 文件](https://router.vuejs.org/)
- [Pinia 文件](https://pinia.vuejs.org/)

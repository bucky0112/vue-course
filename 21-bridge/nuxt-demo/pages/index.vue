<template>
  <main>
    <h2>Home</h2>
    <p>這頁的檔名是 <code>pages/index.vue</code>，自動對應到 URL <code>/</code>。</p>
    <p>
      重點：<strong>沒有 src/router/index.js</strong>。檔名 / 資料夾就是路由表。
      只要在 <code>pages/</code> 加新 <code>.vue</code> 檔，URL 立刻出現。
    </p>
  </main>
</template>

<style scoped>
main {
  padding: 1rem 0;
}
code {
  background: #f6f8fa;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 0.9em;
}
</style>

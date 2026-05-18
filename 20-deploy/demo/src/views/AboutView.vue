<script setup>
</script>

<template>
  <section>
    <h2>About</h2>
    <p>這是 About 頁。<strong>關鍵測試</strong>：在這頁按 F5 重整。</p>
    <ul>
      <li>✅ 設好 vercel.json rewrites → 仍停留在 About，正常運作</li>
      <li>❌ 沒設 rewrites → 看到 Vercel 預設 404 頁</li>
    </ul>
    <p>原因：瀏覽器送 <code>GET /about</code> 到 Vercel，Vercel 看 dist/ 沒有 about.html，預設回 404。設了 rewrites 之後改回 index.html，Vue Router 接手才會看到 <code>/about</code> 這條 route。</p>
  </section>
</template>

<style scoped>
ul {
  padding-left: 1.5rem;
}
li {
  margin: 0.25rem 0;
}
code {
  background: #f6f8fa;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 0.875em;
}
</style>

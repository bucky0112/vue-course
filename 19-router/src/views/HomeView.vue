<script setup>
// HomeView 是預先 import 的（router 直接 import HomeView）——
// 因為首頁通常一定會被訪問，沒必要 lazy load
</script>

<template>
  <section>
    <h2>🏠 首頁</h2>
    <p>歡迎來到 Vue Router 教學。</p>
    <p class="hint">
      請對照 <code>README.md</code> 閱讀每個範例。點上方的 nav 切換到不同頁面，
      觀察網址列、瀏覽器返回鍵、跟頁面內容如何同步。
    </p>

    <h3>本章涵蓋</h3>
    <ul>
      <li>基本路由（這頁、About）</li>
      <li>Lazy Loading（About 等等都是）</li>
      <li>動態路由（/posts/:id）</li>
      <li>巢狀路由（/user/:id/profile、/settings）</li>
      <li>Navigation Guards + meta（/dashboard 需要登入）</li>
      <li>404 catch-all（試打一個不存在的網址）</li>
    </ul>
  </section>
</template>

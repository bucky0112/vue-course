<script setup>
// 這個元件透過 lazy loading 載入——
// 打開 DevTools Network 面板，切到 About 才會看到對應 chunk 下載
</script>

<template>
  <section>
    <h2>ℹ️ 關於</h2>
    <p>這頁示範 Lazy Loading（程式碼分割）。</p>
    <p class="hint">
      router/index.js 內這頁用 <code>component: () => import('@/views/AboutView.vue')</code> 寫法，
      Vite 編譯時會把這個元件切成獨立 chunk。
      打開 DevTools <strong>Network</strong> tab、清空、再切到本頁，會看到對應 .js 被下載。
    </p>
    <p class="hint">
      首頁（HomeView）沒這樣做——它是直接 import，跟 app 主程式打包在一起。
      這是「常用頁 vs 偶用頁」的取捨。
    </p>
  </section>
</template>

<template>
  <main>
    <h2>About</h2>
    <p>檔名 <code>pages/about.vue</code> → URL <code>/about</code>。</p>
    <p>對照原生 Vue Router 你要做的事：</p>
    <ol>
      <li>建立 <code>src/views/AboutView.vue</code></li>
      <li>在 <code>src/router/index.js</code> 加 <code>{ path: '/about', component: AboutView }</code></li>
      <li>如果想 lazy load 還要再改成 <code>() =&gt; import(...)</code></li>
    </ol>
    <p>Nuxt 全省。</p>
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
ol {
  padding-left: 1.5rem;
}
li {
  margin: 0.25rem 0;
}
</style>

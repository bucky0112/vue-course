<template>
  <div class="app">
    <header>
      <h1>Nuxt 範例</h1>
      <nav>
        <NuxtLink to="/">Home</NuxtLink>
        <NuxtLink to="/about">About</NuxtLink>
        <NuxtLink to="/users/1">User 1</NuxtLink>
        <NuxtLink to="/users/42">User 42</NuxtLink>
      </nav>
    </header>

    <!-- <NuxtPage> 是 Nuxt 版的 <RouterView>，自動載入對應 pages/ 內的元件 -->
    <NuxtPage />
  </div>
</template>

<style scoped>
.app {
  max-width: 640px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: system-ui, -apple-system, sans-serif;
}
header {
  border-bottom: 2px solid #00dc82;
  padding-bottom: 0.5rem;
}
nav {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}
nav a {
  text-decoration: none;
  color: #2c3e50;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}
nav a.router-link-active {
  background: #00dc82;
  color: white;
}
</style>

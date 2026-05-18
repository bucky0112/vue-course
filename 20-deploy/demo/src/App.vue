<script setup>
import { RouterLink, RouterView } from 'vue-router'

const appTitle = import.meta.env.VITE_APP_TITLE
const mode = import.meta.env.MODE
</script>

<template>
  <header>
    <h1>{{ appTitle }}</h1>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
      <RouterLink to="/nope">壞連結（測 404）</RouterLink>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>

  <footer>
    <span>build mode: <code>{{ mode }}</code></span>
  </footer>
</template>

<style scoped>
header,
main,
footer {
  max-width: 720px;
  margin: 0 auto;
  padding: 1rem;
}
header {
  border-bottom: 2px solid #42b883;
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
  background: #42b883;
  color: white;
}
footer {
  border-top: 1px solid #e1e4e8;
  margin-top: 2rem;
  font-size: 0.875rem;
  color: #6e7681;
}
code {
  background: #f6f8fa;
  padding: 1px 5px;
  border-radius: 3px;
  color: #d1242f;
}
</style>

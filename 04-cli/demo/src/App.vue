<script setup>
import { ref, onMounted } from 'vue'

const appTitle = import.meta.env.VITE_APP_TITLE
const apiBase = import.meta.env.VITE_API_BASE
const mode = import.meta.env.MODE
const isDev = import.meta.env.DEV

const status = ref('idle')
const users = ref([])
const error = ref('')

onMounted(async () => {
  status.value = 'loading'
  try {
    const res = await fetch(`${apiBase}/users`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    users.value = await res.json()
    status.value = 'success'
  } catch (e) {
    status.value = 'error'
    error.value = e.message
  }
})
</script>

<template>
  <main>
    <h1>{{ appTitle }}</h1>

    <section>
      <h2>import.meta.env</h2>
      <dl>
        <dt>MODE</dt><dd>{{ mode }}</dd>
        <dt>DEV</dt><dd>{{ isDev }}</dd>
        <dt>VITE_APP_TITLE</dt><dd>{{ appTitle }}</dd>
        <dt>VITE_API_BASE</dt><dd>{{ apiBase }}</dd>
      </dl>
    </section>

    <section>
      <h2>Proxy demo（fetch <code>{{ apiBase }}/users</code>）</h2>
      <p v-if="status === 'loading'">載入中…</p>
      <p v-else-if="status === 'error'" class="err">
        失敗：{{ error }}<br>
        <small>還沒填 vite.config.js 的 proxy？先補完後重啟 dev server。</small>
      </p>
      <ul v-else-if="status === 'success'">
        <li v-for="u in users.slice(0, 5)" :key="u.id">
          {{ u.name }} — {{ u.email }}
        </li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
main {
  max-width: 640px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: system-ui, -apple-system, sans-serif;
}
h1 {
  border-bottom: 2px solid #42b883;
  padding-bottom: 0.5rem;
}
section {
  margin: 2rem 0;
}
dl {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 0.25rem 1rem;
  padding: 1rem;
  background: #f6f8fa;
  border-radius: 4px;
  font: 0.875rem ui-monospace, SFMono-Regular, Menlo, monospace;
}
dt {
  color: #6e7681;
}
.err {
  color: #d1242f;
  background: #ffebe9;
  padding: 0.75rem;
  border-radius: 4px;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #e1e4e8;
}
code {
  background: #f6f8fa;
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
  font-size: 0.9em;
}
</style>

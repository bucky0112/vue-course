<script setup lang="ts">
import UserCard, { type Role } from '@/components/UserCard.vue'

interface User {
  id: number
  name: string
  email: string
  role: Role
}

const users: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin' },
  { id: 2, name: 'Bob', email: 'bob@example.com', role: 'user' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com', role: 'guest' },
]
</script>

<template>
  <main>
    <h1>Vue + TypeScript</h1>
    <p class="hint">
      每個 <code>UserCard</code> 的 props 由 <code>defineProps&lt;UserProps&gt;()</code>
      推斷。試著把 <code>role: 'admin'</code> 改成 <code>role: 'wizard'</code>，
      在 IDE 跟 <code>npm run type-check</code> 都會立刻紅字。
    </p>
    <div class="grid">
      <UserCard
        v-for="user in users"
        :key="user.id"
        :name="user.name"
        :email="user.email"
        :role="user.role"
      />
    </div>
  </main>
</template>

<style scoped>
main {
  max-width: 640px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: system-ui, -apple-system, sans-serif;
}
.hint {
  color: #6e7681;
  line-height: 1.6;
}
.grid {
  display: grid;
  gap: 1rem;
  margin-top: 1.5rem;
}
code {
  background: #f6f8fa;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 0.875em;
  color: #d1242f;
}
</style>

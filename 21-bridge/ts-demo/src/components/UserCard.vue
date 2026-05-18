<script setup lang="ts">
// 對照 JS 版（README 有並排）：
//   - lang="ts" 啟用 TS
//   - defineProps<T>() 用泛型推斷型別
//   - withDefaults 補預設值（泛型版沒辦法直接寫 default）
//   - 模板裡解構 props 仍然有型別（傳錯 role 會在編譯期報錯）

export type Role = 'admin' | 'user' | 'guest'

interface UserProps {
  name: string
  email: string
  role?: Role
}

const props = withDefaults(defineProps<UserProps>(), {
  role: 'user',
})

function badgeColor(role: Role): string {
  switch (role) {
    case 'admin':
      return '#d1242f'
    case 'guest':
      return '#6e7681'
    default:
      return '#0969da'
  }
}
</script>

<template>
  <article>
    <h3>{{ props.name }}</h3>
    <p>{{ props.email }}</p>
    <span class="badge" :style="{ background: badgeColor(props.role!) }">
      {{ props.role }}
    </span>
  </article>
</template>

<style scoped>
article {
  border: 1px solid #ccc;
  padding: 12px 16px;
  border-radius: 4px;
}
h3 {
  margin: 0 0 4px;
}
p {
  margin: 0 0 8px;
  color: #6e7681;
  font-size: 0.9rem;
}
.badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 999px;
  color: white;
  font-size: 0.8em;
  text-transform: uppercase;
}
</style>

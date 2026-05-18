<script setup>
import { ref } from 'vue'
import { useTodoList } from '@/composables/useTodoList'

// ✅ 業務邏輯抽進 composable，元件只關心呈現。
const { items, add, remove, toggle, remaining } = useTodoList()
const newText = ref('')

const submit = () => {
  add(newText.value)
  newText.value = ''
}
</script>

<template>
  <div class="card">
    <h3>✅ After A：用 useTodoList（一般列表呈現）</h3>

    <form @submit.prevent="submit">
      <input v-model="newText" placeholder="新增待辦…" />
      <button type="submit">新增</button>
    </form>

    <ul>
      <li v-for="item in items" :key="item.id">
        <input
          type="checkbox"
          :checked="item.done"
          @change="toggle(item.id)"
        />
        <span :class="{ done: item.done }">{{ item.text }}</span>
        <button @click="remove(item.id)">x</button>
      </li>
    </ul>

    <p>還有 <strong>{{ remaining }}</strong> 件未完成</p>
  </div>
</template>

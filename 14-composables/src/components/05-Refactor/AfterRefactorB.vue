<script setup>
import { ref, computed } from 'vue'
import { useTodoList } from '@/composables/useTodoList'

// ✅ 同一個 composable，這個元件選擇用「分組」呈現。
// 注意：這份 items 跟 AfterRefactorA 的 items 是兩份獨立狀態。
const { items, add, remove, toggle, total, remaining } = useTodoList()
const newText = ref('')

const submit = () => {
  add(newText.value)
  newText.value = ''
}

const pending = computed(() => items.value.filter((i) => !i.done))
const completed = computed(() => items.value.filter((i) => i.done))
</script>

<template>
  <div class="card">
    <h3>✅ After B：同一個 composable，分組呈現</h3>

    <form @submit.prevent="submit">
      <input v-model="newText" placeholder="新增待辦…" />
      <button type="submit">新增</button>
    </form>

    <h4>進行中 ({{ remaining }})</h4>
    <ul>
      <li v-for="item in pending" :key="item.id">
        <input
          type="checkbox"
          :checked="item.done"
          @change="toggle(item.id)"
        />
        <span>{{ item.text }}</span>
        <button @click="remove(item.id)">x</button>
      </li>
    </ul>

    <h4>已完成 ({{ total - remaining }})</h4>
    <ul>
      <li v-for="item in completed" :key="item.id">
        <input
          type="checkbox"
          :checked="item.done"
          @change="toggle(item.id)"
        />
        <span class="done">{{ item.text }}</span>
        <button @click="remove(item.id)">x</button>
      </li>
    </ul>
  </div>
</template>

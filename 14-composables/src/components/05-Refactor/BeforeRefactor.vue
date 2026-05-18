<script setup>
import { ref, computed } from 'vue'

// ❌ 邏輯全部寫在元件內。
// 如果另一個元件也需要同樣的待辦清單邏輯，整段都要複製貼上。
const items = ref([])
const newText = ref('')

const submit = () => {
  const trimmed = newText.value.trim()
  if (!trimmed) return
  items.value.push({
    id: Date.now() + Math.random(),
    text: trimmed,
    done: false,
  })
  newText.value = ''
}

const remove = (id) => {
  items.value = items.value.filter((i) => i.id !== id)
}

const toggle = (id) => {
  const item = items.value.find((i) => i.id === id)
  if (item) item.done = !item.done
}

const remaining = computed(() => items.value.filter((i) => !i.done).length)
</script>

<template>
  <div class="card">
    <h3>❌ Before：邏輯寫在元件裡</h3>

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
    <p class="hint">
      若有另一個元件也要這份邏輯，下面那段 script 全部得複製過去。
    </p>
  </div>
</template>

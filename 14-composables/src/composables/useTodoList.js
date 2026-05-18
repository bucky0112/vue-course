import { ref, computed } from 'vue'

// 抽出待辦清單的核心邏輯，讓多個元件能用同一份邏輯但呈現方式不同。
// 注意：每次呼叫 useTodoList() 都會建立獨立的 items——這是 composable 與
// 一般 store (Pinia) 最大的差別：前者是「邏輯重用」，後者是「狀態共享」。
export function useTodoList() {
  const items = ref([])

  const add = (text) => {
    const trimmed = (text ?? '').trim()
    if (!trimmed) return
    items.value.push({
      id: Date.now() + Math.random(), // 簡單 id，正式場合請用 uuid
      text: trimmed,
      done: false,
    })
  }

  const remove = (id) => {
    items.value = items.value.filter((item) => item.id !== id)
  }

  const toggle = (id) => {
    const item = items.value.find((item) => item.id === id)
    if (item) item.done = !item.done
  }

  const clear = () => {
    items.value = []
  }

  const total = computed(() => items.value.length)
  const remaining = computed(() => items.value.filter((i) => !i.done).length)

  return { items, add, remove, toggle, clear, total, remaining }
}

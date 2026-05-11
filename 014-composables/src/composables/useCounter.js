import { ref } from 'vue'

// 最簡單的 composable：用一個 ref 包裝狀態，回傳「狀態 + 操作狀態的函式」。
// 每次呼叫 useCounter() 都會建立一份全新的 count，互不干擾。
export function useCounter(initial = 0, step = 1) {
  const count = ref(initial)

  const increment = () => {
    count.value += step
  }

  const decrement = () => {
    count.value -= step
  }

  const reset = () => {
    count.value = initial
  }

  return { count, increment, decrement, reset }
}

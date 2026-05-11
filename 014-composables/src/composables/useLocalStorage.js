import { ref, watch } from 'vue'

// 用 watch 把 ref 的變動同步寫回 localStorage，達成「持久化的響應式狀態」。
// deep: true 是為了處理物件/陣列內部欄位變動（例如改了 settings.theme）。
export function useLocalStorage(key, defaultValue) {
  const stored = localStorage.getItem(key)
  const data = ref(stored !== null ? JSON.parse(stored) : defaultValue)

  watch(
    data,
    (value) => {
      localStorage.setItem(key, JSON.stringify(value))
    },
    { deep: true }
  )

  return data
}

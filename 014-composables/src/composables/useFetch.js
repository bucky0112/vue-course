import { ref } from 'vue'

// 非同步資料抓取的三態 pattern：loading / error / data。
// 為什麼 isLoading、error、data 三個都用 ref？
// 因為它們各自獨立變動，模板上常常要分別判斷顯示哪一塊，分開放最直覺。
//
// 注意：本章只示範 composable 的非同步寫法。
// 完整的 API 串接（重試、取消請求、競態處理）在第 17 章。
export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)
  const isLoading = ref(false)

  const execute = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      data.value = await response.json()
    } catch (e) {
      error.value = e
    } finally {
      isLoading.value = false
    }
  }

  // 預設一呼叫就執行——使用端通常希望「mount 就送出請求」
  execute()

  return { data, error, isLoading, refetch: execute }
}

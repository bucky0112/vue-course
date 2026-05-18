import { ref, onMounted, onUnmounted } from 'vue'

// 含副作用的 composable：把事件監聽器跟生命週期綁在一起。
// 元件 mount 時開始監聽、unmount 時自動移除——使用端只負責 `const { x, y } = useMouse()`。
export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  const update = (event) => {
    x.value = event.pageX
    y.value = event.pageY
  }

  onMounted(() => {
    window.addEventListener('mousemove', update)
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', update)
  })

  return { x, y }
}

// 假的 API helper —— 讓本章的 demo 可控（延遲、失敗率、AbortSignal 支援）
// 真實專案不會這樣寫，這只是為了示範教學用。
export function fakeFetch(key, { delay = 1000, signal, failRate = 0 } = {}) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'))
      return
    }

    const timer = setTimeout(() => {
      if (Math.random() < failRate) {
        reject(new Error(`Random failure for "${key}"`))
        return
      }
      resolve({
        key,
        value: `Result for "${key}"`,
        delay,
        receivedAt: new Date().toISOString(),
      })
    }, delay)

    signal?.addEventListener('abort', () => {
      clearTimeout(timer)
      reject(new DOMException('Aborted', 'AbortError'))
    })
  })
}

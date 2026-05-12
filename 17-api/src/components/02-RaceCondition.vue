<script setup>
import { ref, watch } from 'vue'
import { fakeFetch } from '@/api/fakeApi'

const buggyInput = ref('')
const buggyResult = ref(null)
const buggyLog = ref([])

const cleanInput = ref('')
const cleanResult = ref(null)
const cleanLog = ref([])

// 隨機延遲 200~1500ms：模擬不穩定的網路
const randomDelay = () => 200 + Math.random() * 1300

// ❌ 沒處理競態：每次輸入都 fire 一個 fetch，誰先回來誰決定畫面
let buggyId = 0
watch(buggyInput, async (value) => {
  if (!value) {
    buggyResult.value = null
    return
  }
  const id = ++buggyId
  const delay = Math.round(randomDelay())
  buggyLog.value.push(`#${id} 「${value}」 送出（delay ${delay}ms）`)
  try {
    const result = await fakeFetch(value, { delay })
    buggyLog.value.push(`#${id} 「${value}」 回來了，覆寫畫面`)
    buggyResult.value = { ...result, requestId: id }
  } catch (e) {
    buggyLog.value.push(`#${id} 失敗: ${e.message}`)
  }
})

// ✅ 用 AbortController：每次新請求前取消舊的
let abortController = null
let cleanId = 0
watch(cleanInput, async (value) => {
  abortController?.abort()
  abortController = new AbortController()

  if (!value) {
    cleanResult.value = null
    return
  }
  const id = ++cleanId
  const delay = Math.round(randomDelay())
  cleanLog.value.push(`#${id} 「${value}」 送出（delay ${delay}ms）`)
  try {
    const result = await fakeFetch(value, {
      delay,
      signal: abortController.signal,
    })
    cleanLog.value.push(`#${id} 「${value}」 回來了`)
    cleanResult.value = { ...result, requestId: id }
  } catch (e) {
    if (e.name === 'AbortError') {
      cleanLog.value.push(`#${id} 「${value}」 被取消了`)
    } else {
      cleanLog.value.push(`#${id} 失敗: ${e.message}`)
    }
  }
})
</script>

<template>
  <section>
    <h2>2. Race Condition + AbortController</h2>
    <p class="hint">
      競態（race condition）是 search-as-you-type 等場景的隱形 bug：
      使用者快速輸入時，<strong>較慢回來的舊請求會覆蓋掉新請求的結果</strong>，
      導致畫面顯示的資料跟輸入框不一致。
    </p>
    <p class="hint">
      請在下面兩個輸入框各打 <code>"abc"</code>（一個字母一個字母慢慢打）並觀察結果。
    </p>

    <div class="row">
      <div class="card">
        <h3>❌ 沒處理競態</h3>
        <input v-model="buggyInput" placeholder="慢慢打 abc..." />
        <p v-if="buggyResult">
          <strong>當前顯示：</strong>「{{ buggyResult.key }}」 (delay {{ buggyResult.delay }}ms)
        </p>
        <p v-else class="hint">尚無結果</p>
        <details>
          <summary>請求日誌</summary>
          <ul>
            <li v-for="(line, i) in buggyLog" :key="i">{{ line }}</li>
          </ul>
        </details>
        <p class="hint">
          可能會看到：你輸入框是 "abc"，但畫面卻顯示 "ab" 的結果——這就是 bug。
        </p>
      </div>

      <div class="card">
        <h3>✅ 用 AbortController</h3>
        <input v-model="cleanInput" placeholder="慢慢打 abc..." />
        <p v-if="cleanResult">
          <strong>當前顯示：</strong>「{{ cleanResult.key }}」 (delay {{ cleanResult.delay }}ms)
        </p>
        <p v-else class="hint">尚無結果</p>
        <details>
          <summary>請求日誌</summary>
          <ul>
            <li v-for="(line, i) in cleanLog" :key="i">{{ line }}</li>
          </ul>
        </details>
        <p class="hint">
          每打新字母前先取消上一個還在路上的請求——畫面結果一定對應最新輸入。
        </p>
      </div>
    </div>
  </section>
</template>

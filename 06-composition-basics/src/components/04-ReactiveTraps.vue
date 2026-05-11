<script setup>
import { reactive, toRefs, toRef } from 'vue'

// ❌ 反例：解構 reactive 物件，解構出來的變數失去響應性
const wrong = reactive({ count: 0, name: 'Alice' })
const { count: brokenCount, name: brokenName } = wrong

const bumpOriginal = () => {
  // 改原物件：原物件本身仍是響應式，畫面上「原物件」這行會更新
  wrong.count++
  wrong.name = wrong.name === 'Alice' ? 'Bob' : 'Alice'
  // 但 brokenCount / brokenName 因為已經被「拷貝成普通數字/字串」，畫面不會跟著動
}

// ✅ 解法 1：toRefs() 把整個物件每個欄位都包成 ref，解構出來都還是 ref
const good = reactive({ count: 0, name: 'Charlie' })
const { count: goodCount, name: goodName } = toRefs(good)

const bumpGood = () => {
  goodCount.value++
  goodName.value = goodName.value === 'Charlie' ? 'Dora' : 'Charlie'
}

// ✅ 解法 2：toRef() 只挑一個欄位轉成 ref
const single = reactive({ count: 0 })
const singleRef = toRef(single, 'count')

const bumpSingle = () => {
  singleRef.value++
}
</script>

<template>
  <section>
    <h2>4. reactive 的解構陷阱（最常見的踩雷）</h2>
    <p class="hint">
      這是學 Vue 3 最常犯的錯。解構 reactive 物件會「失去響應性」——
      因為解構等於把當下的值拷貝出來，跟原本的 Proxy 失聯了。
    </p>

    <div class="card">
      <h3>❌ 反例：直接解構 reactive</h3>
      <pre>const { count, name } = reactive({ count: 0, name: 'Alice' })</pre>
      <p>原物件：<strong>{{ wrong }}</strong>　← 響應式，畫面會更新</p>
      <p>解構的 count：<strong>{{ brokenCount }}</strong>　← 永遠不會更新</p>
      <p>解構的 name：<strong>{{ brokenName }}</strong>　← 永遠不會更新</p>
      <button @click="bumpOriginal">改原物件（wrong.count++、換 name）</button>
      <p class="hint">點下去後，「原物件」會跳、解構出來的兩行紋風不動。</p>
    </div>

    <div class="card">
      <h3>✅ 解法 1：用 <code>toRefs()</code> 整包轉</h3>
      <pre>const { count, name } = toRefs(reactive({ count: 0, name: 'Charlie' }))
// count 跟 name 都變成 ref，解構後仍保有響應性</pre>
      <p>count = <strong>{{ goodCount }}</strong>　name = <strong>{{ goodName }}</strong></p>
      <button @click="bumpGood">+1 並換名字</button>
    </div>

    <div class="card">
      <h3>✅ 解法 2：用 <code>toRef()</code> 只轉單一欄位</h3>
      <pre>const singleRef = toRef(single, 'count')</pre>
      <p>singleRef = <strong>{{ singleRef }}</strong></p>
      <button @click="bumpSingle">+1</button>
    </div>

    <p class="hint">
      <strong>業界經驗法則：能用 ref 就用 ref，避開解構陷阱問題。</strong>
      reactive 適合「整包物件不需要解構」的場景，例如 form 表單物件。
    </p>
  </section>
</template>

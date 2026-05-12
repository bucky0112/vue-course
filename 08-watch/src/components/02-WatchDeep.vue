<script setup>
import { ref, reactive, watch } from 'vue'

// 反例：物件預設不 deep watch
const shallowUser = reactive({ name: 'Alice', age: 30 })
const shallowLogs = ref([])
watch(shallowUser, (newVal, oldVal) => {
  shallowLogs.value.unshift(`觸發！newVal === oldVal? ${newVal === oldVal}`)
  if (shallowLogs.value.length > 5) shallowLogs.value.pop()
})

// 正例：加 deep: true 後可以偵測內部欄位變動
const deepUser = reactive({ name: 'Bob', age: 25 })
const deepLogs = ref([])
watch(
  deepUser,
  (newVal) => {
    deepLogs.value.unshift(`name=${newVal.name}, age=${newVal.age}`)
    if (deepLogs.value.length > 5) deepLogs.value.pop()
  },
  { deep: true }
)

// 另一個解法：用 getter，只看你關心的欄位
const getterUser = reactive({ name: 'Charlie', age: 40 })
const getterLogs = ref([])
watch(
  () => getterUser.name, // 只關心 name，不關心 age
  (newName, oldName) => {
    getterLogs.value.unshift(`name: ${oldName} → ${newName}`)
    if (getterLogs.value.length > 5) getterLogs.value.pop()
  }
)
</script>

<template>
  <section>
    <h2>2. <code>watch</code> — 深層監聽 (deep) 與 Getter</h2>
    <p class="hint">
      預設 watch 一個 reactive 物件時，<strong>不會</strong>偵測內部欄位變動，
      只有「整個物件被取代」才觸發。
      要嘛加 <code>{ deep: true }</code>，要嘛改用 getter 函式只看你關心的欄位。
    </p>

    <div class="row">
      <div class="card">
        <h3>❌ 不 deep（陷阱）</h3>
        <label>name: <input v-model="shallowUser.name" /></label>
        <label>age: <input type="number" v-model.number="shallowUser.age" /></label>
        <h4>變動紀錄</h4>
        <ul>
          <li v-for="(line, i) in shallowLogs" :key="i">{{ line }}</li>
        </ul>
        <p class="hint">
          輸入時不會觸發！因為 reactive 物件的「ref 本身」沒變，只有內部欄位變了。
        </p>
      </div>

      <div class="card">
        <h3>✅ <code>{ deep: true }</code></h3>
        <label>name: <input v-model="deepUser.name" /></label>
        <label>age: <input type="number" v-model.number="deepUser.age" /></label>
        <h4>變動紀錄</h4>
        <ul>
          <li v-for="(line, i) in deepLogs" :key="i">{{ line }}</li>
        </ul>
        <p class="hint">
          內部欄位變動會觸發。但 <code>newVal === oldVal</code>（都是同一個 proxy）。
        </p>
      </div>

      <div class="card">
        <h3>✅ Getter 函式（推薦）</h3>
        <label>name: <input v-model="getterUser.name" /></label>
        <label>
          age（不會觸發）：
          <input type="number" v-model.number="getterUser.age" />
        </label>
        <h4>變動紀錄</h4>
        <ul>
          <li v-for="(line, i) in getterLogs" :key="i">{{ line }}</li>
        </ul>
        <p class="hint">
          只看 <code>user.name</code>，改 age 不會觸發。
          <strong>比 deep 更精準、效能更好</strong>。
        </p>
      </div>
    </div>
  </section>
</template>

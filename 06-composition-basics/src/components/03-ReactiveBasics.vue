<script setup>
import { reactive } from 'vue'

// reactive() 包的是「物件」，內部用 Proxy 偵測欄位變動。
// 因為直接拿到 Proxy，取值/改值都不用 .value。
const user = reactive({
  name: 'Alice',
  age: 30,
})

const tasks = reactive([
  { id: 1, text: '寫程式', done: false },
  { id: 2, text: '吃午餐', done: false },
])

const birthday = () => {
  user.age++ // 不用 .value
}

const switchName = () => {
  user.name = user.name === 'Alice' ? 'Bob' : 'Alice'
}

const toggleFirst = () => {
  tasks[0].done = !tasks[0].done
}

const addTask = () => {
  tasks.push({
    id: Date.now(),
    text: `任務 #${tasks.length + 1}`,
    done: false,
  })
}
</script>

<template>
  <section>
    <h2>3. <code>reactive</code> — 物件/陣列的響應式包裝</h2>
    <p class="hint">
      <code>reactive()</code> 只能用在物件/陣列上（基本型別會丟錯誤）。
      取值改值都<strong>不用 <code>.value</code></strong>，比 ref 直覺——
      但有一個重大限制（下一段就會看到）。
    </p>

    <div class="card">
      <h3>物件</h3>
      <pre>{{ user }}</pre>
      <button @click="birthday">user.age++</button>
      <button @click="switchName">換名字</button>
    </div>

    <div class="card">
      <h3>陣列</h3>
      <ul>
        <li v-for="task in tasks" :key="task.id">
          <input type="checkbox" :checked="task.done" @change="task.done = !task.done" />
          <span :class="{ done: task.done }">{{ task.text }}</span>
        </li>
      </ul>
      <button @click="toggleFirst">toggle 第一項</button>
      <button @click="addTask">新增一個任務</button>
    </div>
  </section>
</template>

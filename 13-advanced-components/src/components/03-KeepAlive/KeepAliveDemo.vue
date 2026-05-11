<script setup>
import { ref, computed } from 'vue'
import CounterTab from './CounterTab.vue'
import InputTab from './InputTab.vue'

const tabs = [
  { id: 'counter', label: 'Counter', comp: CounterTab },
  { id: 'input', label: 'Input', comp: InputTab },
]

const noKeepAliveTab = ref('counter')
const withKeepAliveTab = ref('counter')

const noKeepAliveComp = computed(
  () => tabs.find((t) => t.id === noKeepAliveTab.value).comp
)
const withKeepAliveComp = computed(
  () => tabs.find((t) => t.id === withKeepAliveTab.value).comp
)
</script>

<template>
  <section>
    <h2>3. KeepAlive — 切換動態元件時保留狀態</h2>
    <p class="hint">
      預設情況下，<code>&lt;component :is&gt;</code> 動態切換時會把舊元件 destroy、新元件重新 mount，
      導致狀態消失。<code>&lt;KeepAlive&gt;</code> 把元件實例保留在記憶體裡，切回去還是原狀。
    </p>

    <div class="row">
      <div class="card">
        <h3>❌ 沒用 KeepAlive</h3>
        <div class="tab-bar">
          <button
            v-for="t in tabs"
            :key="t.id"
            @click="noKeepAliveTab = t.id"
            :class="{ active: noKeepAliveTab === t.id }"
          >
            {{ t.label }}
          </button>
        </div>
        <component :is="noKeepAliveComp" />
        <p class="hint">每次切換 tab，mount 次數會 +1，狀態歸零。</p>
      </div>

      <div class="card">
        <h3>✅ 用 KeepAlive</h3>
        <div class="tab-bar">
          <button
            v-for="t in tabs"
            :key="t.id"
            @click="withKeepAliveTab = t.id"
            :class="{ active: withKeepAliveTab === t.id }"
          >
            {{ t.label }}
          </button>
        </div>
        <KeepAlive>
          <component :is="withKeepAliveComp" />
        </KeepAlive>
        <p class="hint">
          mount 次數只 +1 一次；activated 次數會隨切換累加；count / 輸入內容會保留。
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tab-bar {
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
}
.tab-bar button.active {
  background: #42b983;
  color: white;
  border-color: #42b983;
}
</style>

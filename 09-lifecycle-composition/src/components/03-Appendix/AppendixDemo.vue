<script setup>
import { ref } from 'vue'
import OptionsApiChild from './OptionsApiChild.vue'

const isShow = ref(true)
</script>

<template>
  <section>
    <h2>📎 附錄：Options API 生命週期對照</h2>
    <p class="hint">
      <strong>這是附錄章節，僅為「讀懂舊程式碼」用</strong>。新專案一律用 Composition API。
      本節 10 分鐘看完即可，重點是這張對照表：
    </p>

    <div class="card">
      <h3>Options API ↔ Composition API 對照</h3>
      <table>
        <thead>
          <tr>
            <th>Options API</th>
            <th>Composition API</th>
            <th>說明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>beforeCreate</code></td>
            <td>—</td>
            <td>被 <code>&lt;script setup&gt;</code> 取代</td>
          </tr>
          <tr>
            <td><code>created</code></td>
            <td>—</td>
            <td>被 <code>&lt;script setup&gt;</code> 取代</td>
          </tr>
          <tr>
            <td><code>beforeMount</code></td>
            <td><code>onBeforeMount</code></td>
            <td>DOM 即將掛載</td>
          </tr>
          <tr>
            <td><code>mounted</code></td>
            <td><code>onMounted</code></td>
            <td>DOM 已掛載（最常用）</td>
          </tr>
          <tr>
            <td><code>beforeUpdate</code></td>
            <td><code>onBeforeUpdate</code></td>
            <td>DOM 即將更新</td>
          </tr>
          <tr>
            <td><code>updated</code></td>
            <td><code>onUpdated</code></td>
            <td>DOM 已更新</td>
          </tr>
          <tr>
            <td><code>beforeUnmount</code></td>
            <td><code>onBeforeUnmount</code></td>
            <td>元件即將卸載</td>
          </tr>
          <tr>
            <td><code>unmounted</code></td>
            <td><code>onUnmounted</code></td>
            <td>元件已卸載（清理用）</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <button @click="isShow = !isShow">
        {{ isShow ? '卸載 Options API 子元件' : '掛載 Options API 子元件' }}
      </button>
      <p class="hint">同樣的功能、Options API 寫法。看 console log 對照。</p>
    </div>

    <OptionsApiChild v-if="isShow" />
  </section>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin: 12px 0;
}
th,
td {
  text-align: left;
  padding: 8px 12px;
  border-bottom: 1px solid var(--border);
}
th {
  background: rgba(66, 185, 131, 0.08);
}
</style>

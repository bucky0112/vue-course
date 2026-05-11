<script setup>
import { useLocalStorage } from '@/composables/useLocalStorage'

const name = useLocalStorage('demo:name', '')
const settings = useLocalStorage('demo:settings', {
  theme: 'light',
  fontSize: 14,
})
</script>

<template>
  <section>
    <h2>3. useLocalStorage — composable 內部用 watch 同步狀態</h2>
    <p class="hint">
      編輯下方欄位，<strong>重新整理頁面後資料仍會保留</strong>。
      因為 <code>useLocalStorage</code> 在裡面用 <code>watch</code> 把值寫回 localStorage。
    </p>

    <div class="row">
      <div class="card">
        <h3>單純字串</h3>
        <label>
          姓名：
          <input v-model="name" placeholder="輸入名字…" />
        </label>
        <p>儲存值：「{{ name }}」</p>
      </div>

      <div class="card">
        <h3>物件（deep watch）</h3>
        <label>
          theme：<input v-model="settings.theme" />
        </label>
        <br />
        <label>
          fontSize：<input type="number" v-model.number="settings.fontSize" />
        </label>
        <pre>{{ settings }}</pre>
      </div>
    </div>
  </section>
</template>

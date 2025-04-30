<template>
  <div class="container">
    <!-- 基本監聽 -->
    <div class="demo-block">
      <h3>1. 基本監聽</h3>
      <div class="input-group">
        <input v-model="basicText" placeholder="輸入些文字試試">
      </div>
      <div class="result">
        <div v-for="(log, index) in basicLogs" :key="index" class="log">
          {{ log }}
        </div>
      </div>
    </div>

    <!-- 深度監聽 -->
    <div class="demo-block">
      <h3>2. 深度監聽（deep）</h3>
      <div class="input-group">
        <h4>使用者資料：</h4>
        <input v-model="user.name" placeholder="名稱">
        <input v-model="user.email" placeholder="信箱">
        <button @click="user.contacts.push(Date.now())">新增聯絡方式</button>
      </div>
      <div class="result">
        <div v-for="(log, index) in deepLogs" :key="index" class="log">
          {{ log }}
        </div>
      </div>
    </div>

    <!-- 立即監聽 -->
    <div class="demo-block">
      <h3>3. 立即監聽（immediate）</h3>
      <div class="input-group">
        <input type="number" v-model="immediateValue" placeholder="輸入數字">
      </div>
      <div class="result">
        <div v-for="(log, index) in immediateLogs" :key="index" class="log">
          {{ log }}
        </div>
      </div>
    </div>

    <!-- 監聽多個來源 -->
    <div class="demo-block">
      <h3>4. 監聽多個來源</h3>
      <div class="input-group">
        <input v-model="multiWatch.field1" placeholder="欄位 1">
        <input v-model="multiWatch.field2" placeholder="欄位 2">
      </div>
      <div class="result">
        <div v-for="(log, index) in multiWatchLogs" :key="index" class="log">
          {{ log }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 基本監聽
      basicText: '',
      basicLogs: [],

      // 深度監聽
      user: {
        name: '',
        email: '',
        contacts: []
      },
      deepLogs: [],

      // 立即監聽
      immediateValue: 0,
      immediateLogs: [],

      // 監聽多個來源
      multiWatch: {
        field1: '',
        field2: ''
      },
      multiWatchLogs: []
    }
  },
  watch: {
    // 1. 基本監聽
    basicText (newVal, oldVal) {
      // console.log('基本監聽：', newVal, oldVal)
      this.basicLogs.unshift(`值改變：${oldVal} -> ${newVal}`)
      if (this.basicLogs.length > 3) this.basicLogs.pop()
    },

    // 2. 深度監聽
    user: {
      handler (newVal, oldVal) {
        // console.log('深度監聽：', newVal, oldVal)
        this.deepLogs.unshift(`使用者資料更新：${JSON.stringify(newVal)}`)
        if (this.deepLogs.length > 3) this.deepLogs.pop()
      },
      deep: true // 啟用深度監聽
    },

    // 3. 立即監聽
    immediateValue: {
      handler (newVal, oldVal) {
        console.log('立即監聽：', newVal, oldVal)
        this.immediateLogs.unshift(`數值更新：${oldVal} -> ${newVal}`)
        if (this.immediateLogs.length > 3) this.immediateLogs.pop()
      },
      immediate: true  // 立即執行一次
    },

    // 4. 監聽多個來源
    'multiWatch.field1' (newVal) {
      this.multiWatchLogs.unshift(`欄位 1 更新：${newVal}`)
      if (this.multiWatchLogs.length > 3) this.multiWatchLogs.pop()
    },
    'multiWatch.field2' (newVal) {
      this.multiWatchLogs.unshift(`欄位 2 更新：${newVal}`)
      if (this.multiWatchLogs.length > 3) this.multiWatchLogs.pop()
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
}

.demo-block {
  margin-bottom: 30px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 5px;
}

.input-group {
  margin: 10px 0;
}

.result {
  margin-top: 10px;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 4px;
}

.log {
  margin: 5px 0;
  color: #666;
}
</style>// 
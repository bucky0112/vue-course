<template>
  <div id="app" class="container">
    <!-- 基本的 getter/setter -->
    <h3>完整姓名（Getter/Setter）</h3>
    <div class="input-group">
      <input v-model="fullName" placeholder="請輸入完整姓名">
      <p class="info">試著輸入 "王小明" 看看，姓和名會自動分開</p>
    </div>
    <div class="result">
      <p>姓：{{ lastName }}</p>
      <p>名：{{ firstName }}</p>
      <p>{{ fullName }}</p>
    </div>

    <!-- 溫度轉換 -->
    <h3>溫度轉換（Getter/Setter）</h3>
    <div class="input-group">
      <label>攝氏溫度：</label>
      <input type="number" v-model="celsius">
      <p class="info">可以直接修改攝氏或華氏溫度，另一個會自動轉換</p>
    </div>
    <div class="input-group">
      <label>華氏溫度：</label>
      <input type="number" v-model="fahrenheit">
    </div>

    <!-- 價格範圍 -->
    <h3>價格範圍（Getter/Setter）</h3>
    <div class="input-group">
      <label>價格範圍：</label>
      <input v-model="priceRange" placeholder="例如：100-500">
      <p class="info">試著輸入價格範圍（如：100-500），最小和最大值會自動更新</p>
    </div>
    <div class="result">
      <p>最小值：{{ minPrice }}</p>
      <p>最大值：{{ maxPrice }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      firstName: '',
      lastName: '',
      celsiusValue: 0,
      minPrice: 0,
      maxPrice: 0
    }
  },
  computed: {
    // 完整姓名的 getter 和 setter
    fullName: {
      // 當讀取 fullName 時調用
      get () {
        console.log("來自 get")
        // console.log("來自 get", this.lastName, this.firstName)
        return this.lastName + this.firstName
      },
      // 當設置 fullName 時調用
      set (newValue) {
        console.log("來自 set", newValue)
        // console.log("來自 set", 'set fullName', newValue)
        // 假設姓名格式為「姓名」，姓一個字，名可能多個字
        this.lastName = newValue.substring(0, 1)
        this.firstName = newValue.substring(1)
      }
    },

    // 溫度轉換的 getter 和 setter
    celsius: {
      get () {
        return this.celsiusValue
      },
      set (value) {
        this.celsiusValue = Number(value)
      }
    },
    fahrenheit: {
      get () {
        return (this.celsiusValue * 9 / 5) + 32
      },
      set (value) {
        this.celsiusValue = (Number(value) - 32) * 5 / 9
      }
    },

    // 價格範圍的 getter 和 setter
    priceRange: {
      get () {
        return `${this.minPrice}-${this.maxPrice}`
      },
      set (value) {
        // 解析輸入的價格範圍（格式：最小值-最大值）
        const [min, max] = value.split('-').map(Number)
        if (!isNaN(min) && !isNaN(max)) {
          this.minPrice = min
          this.maxPrice = max
        }
      }
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

.input-group {
  margin: 15px 0;
}

.result {
  margin-top: 20px;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 5px;
}

.info {
  color: #666;
  font-size: 0.9em;
  margin-top: 5px;
}
</style>
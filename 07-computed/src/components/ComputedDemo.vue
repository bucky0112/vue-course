<template>
  <h2>Computed 計算屬性</h2>

  <!-- 購物車範例 -->
  <div>
    <h3>購物車</h3>
    <div class="input-group" v-for="(item, index) in items" :key="index">
      <label>{{ item.name }}</label>
      <input type="number" v-model="item.quantity" min="0">
      單價：{{ item.price }} 元
    </div>

    <div class="result">
      <p>商品總數：{{ totalQuantity }}</p>
      <p>總金額：{{ totalPrice }} 元</p>
      <p>折扣後金額（滿1000打9折）：{{ discountedPrice }} 元</p>
    </div>
  </div>

  <!-- 搜尋過濾範例 -->
  <div style="margin-top: 30px;">
    <h3>商品搜尋</h3>
    <div class="input-group">
      <input type="text" v-model="searchText" placeholder="請輸入搜尋關鍵字">
    </div>
    <div class="result">
      <p>搜尋結果：</p>
      <ul>
        <li v-for="item in filteredItems" :key="item.name">
          {{ item.name }} - {{ item.price }} 元
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      items: [
        { name: '商品1', price: 100, quantity: null },
        { name: '商品2', price: 200, quantity: null },
        { name: '商品3', price: 300, quantity: null }
      ],
      searchText: ''
    };
  },
  computed: {
    // 計算商品總數
    // totalQuantity () {
    //   return this.items.reduce((sum, item) => sum + Number(item.quantity), 0)
    // },
    totalQuantity: {
      get () {
        return this.items.reduce((sum, item) => sum + Number(item.quantity), 0)
      }
    },
    // 計算總金額
    totalPrice () {
      return this.items.reduce((sum, item) => {
        return sum + (item.price * item.quantity)
      }, 0)
    },
    // 計算折扣後金額
    discountedPrice () {
      const total = this.totalPrice
      return total >= 1000 ? total * 0.9 : total
    },
    // 搜尋過濾
    filteredItems () {
      return this.items.filter(item =>
        item.name.toLowerCase().includes(this.searchText.toLowerCase().trim())
      )
    }
  }
};
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
</style>

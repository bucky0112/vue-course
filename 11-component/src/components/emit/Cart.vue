<script setup>
import { ref } from 'vue'
import QuantityAdjuster from './QuantityAdjuster.vue'
import productImage from '../../assets/ps5pro.jpg'

const currentQuantity = ref(1)

// 8. 實作處理數量更新的函式

</script>

<template>
  <div class="container">
    <h2>購物車商品</h2>
    <div class="product">
      <div class="product-image">
        <img :src="productImage" alt="商品圖片">
      </div>
      <div class="product-info">
        <h3>測試商品</h3>
        <p>單價：$30000</p>
        <!-- 9. 加入 QuantityAdjuster 元件 -->

        <!-- 10. 顯示總金額 -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 50rem;
  margin: 0 auto;
  padding: 20px;
}

.product {
  display: flex;
  gap: 16px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.product-image {
  width: 30rem;
}

.product-image img {
  width: 100%;
  object-fit: cover;
}

.product-info {
  flex: 1;
}

h3 {
  margin: 0 0 8px 0;
}

p {
  margin: 8px 0;
}
</style>
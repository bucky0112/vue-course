<script setup>
import { ref } from 'vue'
import QuantityAdjuster from './QuantityAdjuster.vue'
import productImage from '../../assets/ps5pro.jpg'
import FavoriteButton from './FavoriteButton.vue'

const currentQuantity = ref(1)
const minQty = ref(1)
const maxQty = ref(10)
const isFavorite = ref(false)

const price = 30000

// 8. 實作處理數量更新的函式
const handleQuantityUpdate = (qty) => {
  currentQuantity.value = qty
}

const handleToggleFavorite = () => {
  isFavorite.value = !isFavorite.value
}

</script>

<template>
  <div class="container">
    <h2>購物車商品</h2>
    <div class="product">
      <div class="product-image">
        <img :src="productImage" alt="商品圖片">
      </div>
      <div class="product-info">
        <div>
          <h3>測試商品</h3>
          <FavoriteButton
            :is-favorite="isFavorite"
            @toggle-favorite="handleToggleFavorite"
          />
        </div>
        <p>單價：$30000</p>
        <!-- 9. 加入 QuantityAdjuster 元件 -->
        <QuantityAdjuster
          :initial-qty="currentQuantity"
          :min-qty="minQty"
          :max-qty="maxQty"
          @update-quantity="handleQuantityUpdate"
        />

        <!-- 10. 顯示總金額 -->
        <p>總金額：{{ currentQuantity * price }}</p>
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
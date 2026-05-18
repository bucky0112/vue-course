<script setup>
import { storeToRefs } from 'pinia'
import { useProductStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'

const productStore = useProductStore()
const cartStore = useCartStore()

const { availableProducts } = storeToRefs(productStore)
</script>

<template>
  <div class="products">
    <h2>商品列表</h2>
    <div class="product-grid">
      <div v-for="product in availableProducts" :key="product.id" class="product-card">
        <h3>{{ product.name }}</h3>
        <p class="price">NT$ {{ product.price }}</p>
        <p class="inventory">庫存: {{ product.inventory }}</p>
        <button @click="cartStore.addToCart(product)" :disabled="product.inventory === 0">
          加入購物車
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.products {
  flex: 1;
  border: 1px solid #000;
  padding: 20px;
}

.product-grid {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 20px;
}

.product-card {
  border: 1px solid #000;
  padding: 20px;
}
</style>

<script setup>
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
const { items, total, totalItems } = storeToRefs(cartStore)
</script>

<template>
  <div class="shopping-cart">
    <h2>購物車 ({{ totalItems }})</h2>
    <div v-if="items.length === 0" class="empty-cart">
      購物車是空的
    </div>
    <div v-else>
      <div v-for="item in items" :key="item.id" class="cart-item">
        <div class="item-info">
          <h3>{{ item.name }}</h3>
          <p>單價: NT$ {{ item.price }}</p>
        </div>
        <div class="item-controls">
          <input type="number" v-model.number="item.quantity" min="1"
            @change="cartStore.updateQuantity(item.id, item.quantity)">
          <button @click="cartStore.removeFromCart(item.id)">
            移除
          </button>
        </div>
      </div>
      <div class="cart-footer">
        <p class="total">總計: NT$ {{ total }}</p>
        <button @click="cartStore.clearCart()">清空購物車</button>
        <button class="checkout">結帳</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shopping-cart {
  flex: 1;
  border: 1px solid #000;
  padding: 20px;
}

.empty-cart {
  text-align: center;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  border: 1px solid #000;
  padding: 20px;
  margin-bottom: 20px;
}
</style>

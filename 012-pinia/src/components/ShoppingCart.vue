<script setup>
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/stores/cart'
import { useProductStore } from '@/stores/products'

const cartStore = useCartStore()
const productStore = useProductStore()
const { items, total, totalItems } = storeToRefs(cartStore)

// 處理數量變更
function handleQuantityChange (item, event) {
  const newQuantity = parseInt(event.target.value) || 1
  cartStore.updateQuantity(item.id, newQuantity)

  // 強制更新輸入框的值，確保顯示正確的數量
  event.target.value = cartStore.items.find(i => i.id === item.id)?.quantity || 1
}

// 處理結帳
function handleCheckout() {
  alert(`總計: NT$ ${total.value}`)
}
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
          <!-- <input type="number" v-model.number="item.quantity" min="1"
            @change="cartStore.updateQuantity(item.id, item.quantity)"> -->
          <input type="number" :value="item.quantity" min="1" :max="cartStore.getAvailableStock(item.id)"
            @input="handleQuantityChange(item, $event)">
          <button @click="cartStore.removeFromCart(item.id)">
            移除
          </button>
        </div>
      </div>
      <div class="cart-footer">
        <p class="total">總計: NT$ {{ total }}</p>
        <button @click="cartStore.clearCart()">清空購物車</button>
        <button class="checkout" @click="handleCheckout">結帳</button>
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

.item-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.item-controls input {
  width: 50px;
}
</style>

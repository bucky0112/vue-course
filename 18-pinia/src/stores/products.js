import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useProductStore = defineStore('products', () => {
  // 商品列表
  const products = ref([
    { id: 1, name: '機械鍵盤', price: 2999, inventory: 5 },
    { id: 2, name: '滑鼠', price: 1299, inventory: 8 },
    { id: 3, name: '耳機', price: 799, inventory: 3 }
  ])

  // 取得所有可購買商品（庫存 > 0）
  const availableProducts = computed(() => {
    return products.value.filter((product) => product.inventory > 0)
  })

  // 減少商品庫存
  function decreaseInventory(productId) {
    const product = products.value.find((p) => p.id === productId)
    if (product && product.inventory > 0) {
      product.inventory--
    }
  }

  // 增加商品庫存（當購物車商品被移除時）
  function increaseInventory(productId) {
    const product = products.value.find((p) => p.id === productId)
    if (product) {
      product.inventory++
    }
  }

  return {
    products,
    availableProducts,
    decreaseInventory,
    increaseInventory
  }
})

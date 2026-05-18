import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useProductStore } from './products' // 來自商品列表的 store

export const useCartStore = defineStore('cart', () => {
  const productStore = useProductStore() // 來自商品列表的 store

  // 購物車項目
  const items = ref([])

  // items 預計的資料架構
  // { id: 1, name: '機械鍵盤', price: 2999, quantity: 1 }

  // 計算購物車總金額
  const total = computed(() => {
    return items.value.reduce((sum, item) => {
      return sum + item.price * item.quantity
    }, 0)
  })

  // 計算購物車商品總數
  const totalItems = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  // 加入商品到購物車
  function addToCart(product) {
    const existingItem = items.value.find((item) => item.id === product.id)

    if (existingItem) {
      existingItem.quantity++
    } else {
      items.value.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1
      })
    }

    // 更新商品庫存
    productStore.decreaseInventory(product.id)
  }

  // 從購物車移除商品
  function removeFromCart(productId) {
    const index = items.value.findIndex((item) => item.id === productId)
    if (index > -1) {
      const item = items.value[index]
      // 恢復商品庫存
      for (let i = 0; i < item.quantity; i++) {
        productStore.increaseInventory(productId)
      }
      items.value.splice(index, 1)
    }
  }

  // 更新購物車商品數量
  function updateQuantity(productId, quantity) {
    const item = items.value.find((item) => item.id === productId)
    if (item) {
      const diff = quantity - item.quantity
      item.quantity = quantity

      // 根據數量變化更新庫存
      if (diff > 0) {
        for (let i = 0; i < diff; i++) {
          productStore.decreaseInventory(productId)
        }
      } else {
        for (let i = 0; i < -diff; i++) {
          productStore.increaseInventory(productId)
        }
      }
    }
  }

  // 清空購物車
  function clearCart() {
    // 恢復所有商品庫存
    items.value.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        productStore.increaseInventory(item.id)
      }
    })
    items.value = []
  }

  return {
    items,
    total,
    totalItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  }
})

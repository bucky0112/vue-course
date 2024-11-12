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

    // if (existingItem) {
    //   existingItem.quantity++
    // } else {
    //   items.value.push({
    //     id: product.id,
    //     name: product.name,
    //     price: product.price,
    //     quantity: 1
    //   })
    // }

    // // 更新商品庫存
    // productStore.decreaseInventory(product.id)

    if (existingItem) {
      // 檢查是否超過庫存
      if (existingItem.quantity < getAvailableStock(product.id)) {
        existingItem.quantity++
        productStore.decreaseInventory(product.id)
      }
    } else {
      items.value.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1
      })
      productStore.decreaseInventory(product.id)
    }
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
  // function updateQuantity(productId, quantity) {
  //   const item = items.value.find((item) => item.id === productId)
  //   if (item) {
  //     const diff = quantity - item.quantity
  //     item.quantity = quantity

  //     // 根據數量變化更新庫存
  //     if (diff > 0) {
  //       for (let i = 0; i < diff; i++) {
  //         productStore.decreaseInventory(productId)
  //       }
  //     } else {
  //       for (let i = 0; i < -diff; i++) {
  //         productStore.increaseInventory(productId)
  //       }
  //     }
  //   }
  // }

  // 檢查商品的可用庫存
  function getAvailableStock(productId) {
    const product = productStore.products.find((p) => p.id === productId)
    const cartItem = items.value.find((item) => item.id === productId)
    const currentQuantity = cartItem ? cartItem.quantity : 0
    return product ? product.inventory + currentQuantity : 0
  }

  function updateQuantity(productId, newQuantity) {
    const item = items.value.find((item) => item.id === productId)
    if (!item) return

    // 確保數量為正整數
    newQuantity = Math.max(1, Math.floor(newQuantity))

    // 檢查是否超過可用庫存
    const availableStock = getAvailableStock(productId)
    newQuantity = Math.min(newQuantity, availableStock)

    // 計算差異並更新庫存
    const diff = newQuantity - item.quantity
    item.quantity = newQuantity

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
    clearCart,
    getAvailableStock
  }
})

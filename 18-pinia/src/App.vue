<script setup>
import Counter from './components/Counter.vue'
import ProductList from './components/ProductList.vue'
import ShoppingCart from './components/ShoppingCart.vue'
</script>

<template>
  <main>
    <Counter />
    <!-- <div class="cart">
      <ProductList />
      <ShoppingCart />
    </div> -->
  </main>
</template>

<style scoped>
main {
  width: 100%;
  display: flex;
  justify-content: center;
}

.cart {
  width: 100%;
  display: flex;
  gap: 20px;
}
</style>

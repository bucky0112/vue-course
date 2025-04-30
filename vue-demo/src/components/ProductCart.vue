<script setup>
import { ref, computed } from "vue"

const title = ref("精美筆記本")
const description = ref("這是筆記本")
const price = ref(100)
const quantity = ref(0)

const totalPrice = computed(() => price.value * quantity.value)

const add = () => {
  quantity.value++
}

const minus = () => {
  quantity.value--
}

</script>

<template>
  <div>
    <h2>{{ title }}</h2>
    <span>{{ description }}</span>
    <div>
      <p>單價:$ {{ price }}</p>
      <p>數量: {{ quantity }}</p>
      <p>總價:$ {{ totalPrice }}</p>
    </div>
    <div>
      <button @click="minus">-</button>
      <input type="number" v-model="quantity">
      <button @click="add">+</button>
    </div>
  </div>
</template>
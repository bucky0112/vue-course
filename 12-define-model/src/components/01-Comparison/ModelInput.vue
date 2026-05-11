<script setup>
// 新式寫法（Vue 3.4+）：
// defineModel() 把上面那一整段 props + emit + 手動接線一行搞定。
// 回傳的 model 是一個 ref，可以直接在 template 上用 v-model 雙向綁定。
const model = defineModel({ default: '' })
</script>

<template>
  <input v-model="model" placeholder="ModelInput（defineModel）" />
</template>

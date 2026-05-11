<script setup>
// 自訂修飾子寫法（Vue 3.4+）：
// defineModel 解構成 [model, modifiers]，
// 用 set transformer 攔截「值寫回父元件」這個動作，
// 根據 modifiers 決定要不要轉換。
//
// 父元件用法：<CapitalizeInput v-model.capitalize="text" />
const [model, modifiers] = defineModel({
  default: '',
  set(value) {
    if (modifiers.capitalize && typeof value === 'string' && value.length > 0) {
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
    return value
  },
})
</script>

<template>
  <input v-model="model" placeholder="輸入文字..." />
</template>

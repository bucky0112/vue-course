<script setup>
// 舊式寫法（Vue 3.0 – 3.3）：
// 1. 用 defineProps 接收名為 modelValue 的 prop
// 2. 用 defineEmits 宣告 update:modelValue 事件
// 3. 把 :value 跟 @input 手動接起來
defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    placeholder="ManualInput（舊式）"
  />
</template>

<script setup>
defineProps(['isFavorite'])

const emit = defineEmits(['toggle-favorite'])
</script>

<template>
  <button @click="emit('toggle-favorite')">
    <span>{{ isFavorite ? "❤️" : "🤍" }}</span>
  </button>
</template>
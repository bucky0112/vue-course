<script setup>
const emit = defineEmits(['submit'])

const handleSubmit = (event) => {
  event.preventDefault()
  const formData = new FormData(event.target)
  const userData = {
    name: formData.get('name'),
    email: formData.get('email')
  }
  const emitData = "emitData"
  emit('submit', userData, emitData) // 發送事件，並傳遞 userData 和 emitData 多個參數
}
</script>

<template>
  <form @submit="handleSubmit">
    <div>
      <label for="name">姓名：</label>
      <input type="text" id="name" name="name" required>
    </div>
    <div>
      <label for="email">信箱：</label>
      <input type="email" id="email" name="email" required>
    </div>
    <button type="submit">送出</button>
  </form>
</template>
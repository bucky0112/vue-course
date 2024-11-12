<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const fakeUserId = ref(123)

const goToUserProfile = () => {
  router.push({ name: 'user-profile', params: { id: fakeUserId.value } })
}
</script>

<template>
  <div>
    <h1>This is info page</h1>
    <button @click="goToUserProfile">前往用戶頁面</button>
  </div>
</template>

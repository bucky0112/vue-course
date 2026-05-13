<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="card">
    <h3>Profile</h3>
    <p>User ID：<strong>{{ route.params.id }}</strong></p>
    <p>這裡會放使用者的基本資料、頭像、自介等。</p>
  </div>
</template>

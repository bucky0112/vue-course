<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="card">
    <h3>Settings</h3>
    <p>User ID：<strong>{{ route.params.id }}</strong></p>
    <p>這裡會放帳號設定、密碼修改、通知偏好等。</p>
  </div>
</template>

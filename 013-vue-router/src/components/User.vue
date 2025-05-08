<script setup>
import { useRoute, RouterView, RouterLink } from 'vue-router'

const route = useRoute()
const id = route.params.id
</script>

<template>
  <div>
    <!-- <h1>User {{ id }}</h1> -->
     <h1>User {{ $route.params.id }}</h1>
     <RouterLink to="/user/123/profile">Profile</RouterLink>
     <Router-view />
  </div>
</template>

<script setup>
// 多個 defineModel — 用字串名稱對應 v-model:name 的 name 部分
// 父元件用法：<NameForm v-model:firstName="..." v-model:lastName="..." />
const firstName = defineModel('firstName', { default: '' })
const lastName = defineModel('lastName', { default: '' })
</script>

<template>
  <div class="card">
    <h3>姓名表單（子元件）</h3>
    <label>
      First name：
      <input v-model="firstName" />
    </label>
    <br />
    <label>
      Last name：
      <input v-model="lastName" />
    </label>
  </div>
</template>

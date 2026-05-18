<script setup>
import Layout from './Layout.vue'

const pageTitle = '我的網站'
const currentUser = { name: '小明' }
</script>

<template>
  <Layout :title="pageTitle" :user="currentUser">
    <!-- 自訂標題區域 -->
    <template #header="{ user }">
      <div class="custom-header">
        <h1>{{ pageTitle }}</h1>
        <p>您好，{{ user.name }}</p>
        <div class="user-actions">
          <button>設定</button>
          <button>登出</button>
        </div>
      </div>
    </template>

    <!-- 自訂 nav -->
    <template #navigation>
      <nav>
        <a href="/">首頁</a>
        <a href="/about">關於</a>
      </nav>
    </template>

    <!-- 主要內容 -->
    <div class="main-content">
      <h2>歡迎使用我們的網站</h2>
      <p>這是主要內容區域</p>
    </div>

    <!-- 自訂 footer -->
    <template #footer>
      <footer class="custom-footer">
        <p>© 2024 我的網站</p>
        <div class="social-links">
          <a href="#">Facebook</a>
          <a href="#">Twitter</a>
        </div>
      </footer>
    </template>
  </Layout>
</template>

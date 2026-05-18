<script setup>
defineProps({
  title: String,
  user: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="layout">
    <header>
      <slot name="header" :user="user">
        <h1>{{ title }}</h1>
        <p>歡迎, {{ user.name }}</p>
      </slot>
    </header>

    <nav>
      <slot name="navigation" />
    </nav>

    <main>
      <slot />
    </main>

    <footer>
      <slot name="footer">
        <p>© 2024</p>
      </slot>
    </footer>
  </div>
</template>

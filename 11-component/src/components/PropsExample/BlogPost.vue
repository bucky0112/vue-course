<script setup>
// ===== 定義 props 第一種寫法  =====
// defineProps(['preview', 'title', 'author', 'date'])

// ===== 定義 props 第二種寫法  =====
// const props = defineProps(['title', 'preview', 'date', 'author'])

// ===== 定義 props 第三種寫法  =====
const props = defineProps({
  title: {
    type: String,
    default: "預設標題",
    required: true,
  },
  preview: {
    type: String,
    default: "預設預覽",
    required: true,
    validator(value) {
      return value.length > 10
    }
  },
  date: {
    type: String,
    default: "預設日期",
    required: true
  },
  author: {
    type: String,
    default: "預設作者",
    required: true
  }
})
</script>

<template>
  <article class="blog-post">
    <h2 class="title">{{ title }}</h2>
    <p class="preview">{{ preview }}</p>
    <div class="metadata">
      <span class="date">{{ date }}</span>
      <span class="author">作者：{{ author }}</span>
    </div>
  </article>
</template>

<style scoped>
.blog-post {
  border: 1px solid #eee;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
}

.title {
  color: #333;
  margin-bottom: 10px;
}

.preview {
  color: #666;
  line-height: 1.6;
}

.metadata {
  margin-top: 15px;
  color: #999;
  font-size: 0.9em;
}

.author {
  margin-left: 15px;
}
</style>
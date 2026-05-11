<script setup>
import { useTemplateRef } from 'vue'

const topRef = useTemplateRef('section-top')
const middleRef = useTemplateRef('section-middle')
const bottomRef = useTemplateRef('section-bottom')

const scrollTo = (el) => {
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <section>
    <h2>2. Scroll To — 程式化捲動到指定區塊</h2>
    <p class="hint">
      實務常見場景：表單驗證失敗時捲到第一個錯誤欄位、點目錄跳到對應段落等。
    </p>

    <div class="card">
      <div class="scroll-controls">
        <button @click="scrollTo(topRef)">⬆ 捲到頂部</button>
        <button @click="scrollTo(middleRef)">▶ 捲到中段</button>
        <button @click="scrollTo(bottomRef)">⬇ 捲到底部</button>
      </div>

      <div class="scroll-container">
        <div ref="section-top" class="scroll-section">
          <h3>📍 頂部區塊</h3>
          <p>這是頂部。捲動到這裡會出現在容器最上方。</p>
        </div>

        <div class="scroll-spacer">填充內容 A...</div>
        <div class="scroll-spacer">填充內容 B...</div>

        <div ref="section-middle" class="scroll-section">
          <h3>📍 中段區塊</h3>
          <p>這是中段。</p>
        </div>

        <div class="scroll-spacer">填充內容 C...</div>
        <div class="scroll-spacer">填充內容 D...</div>

        <div ref="section-bottom" class="scroll-section">
          <h3>📍 底部區塊</h3>
          <p>這是底部。</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.scroll-controls {
  margin-bottom: 12px;
}
.scroll-container {
  height: 220px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px;
  background: #fff;
}
.scroll-section {
  padding: 12px;
  background: #eef7ff;
  border-radius: 4px;
  margin: 8px 0;
}
.scroll-section h3 {
  margin: 0 0 4px 0;
}
.scroll-spacer {
  padding: 50px 12px;
  background: #fafafa;
  color: #aaa;
  text-align: center;
  margin: 8px 0;
  border-radius: 4px;
}
</style>

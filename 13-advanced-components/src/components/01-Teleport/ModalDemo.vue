<script setup>
import { ref } from 'vue'

const useTeleport = ref(true)
const open = ref(false)

const openModal = () => {
  open.value = true
}
const closeModal = () => {
  open.value = false
}
</script>

<template>
  <section>
    <h2>1. Teleport — 把元素「傳送」到 DOM 樹的別處</h2>
    <p class="hint">
      最常見用途：modal、toast、tooltip——它們在邏輯上屬於某個元件，
      但需要渲染在 <code>&lt;body&gt;</code> 底下才能正確覆蓋整個 viewport，
      避開父元素 <code>overflow</code>、<code>transform</code>、<code>z-index</code> 等限制。
    </p>

    <div class="card">
      <label>
        <input type="checkbox" v-model="useTeleport" />
        使用 <code>&lt;Teleport to="body"&gt;</code>
      </label>
      <p class="hint">
        勾選 = 開啟 Teleport（modal 飛到 body）；
        取消 = modal 留在父元素內（被父容器裁切）。
      </p>
    </div>

    <div class="clip-parent">
      <p>📦 父元素：<code>overflow: hidden</code> + 固定高度</p>
      <button @click="openModal">開啟 Modal</button>

      <!-- 沒用 Teleport：modal 留在父元素內，被 overflow:hidden 裁切 -->
      <div v-if="!useTeleport && open" class="modal-overlay" @click.self="closeModal">
        <div class="modal-box">
          <h3>❌ 沒用 Teleport</h3>
          <p>遮罩跟內容都被父元素的 <code>overflow: hidden</code> 裁切。</p>
          <button @click="closeModal">關閉</button>
        </div>
      </div>

      <!-- 用 Teleport：直接渲染到 body -->
      <Teleport to="body">
        <div v-if="useTeleport && open" class="modal-overlay teleported" @click.self="closeModal">
          <div class="modal-box">
            <h3>✅ 用 Teleport</h3>
            <p>渲染在 <code>&lt;body&gt;</code> 底下，覆蓋整個 viewport。</p>
            <p class="hint">
              打開 DevTools 看 DOM 結構，modal 不在父元件裡，而是在 <code>&lt;body&gt;</code> 最後面。
            </p>
            <button @click="closeModal">關閉</button>
          </div>
        </div>
      </Teleport>
    </div>
  </section>
</template>

<style scoped>
.clip-parent {
  position: relative;
  overflow: hidden;
  height: 200px;
  margin-top: 12px;
  padding: 16px;
  background: #f5f5f5;
  border: 2px dashed #888;
  border-radius: 6px;
}

.modal-overlay {
  position: absolute; /* relative to .clip-parent — 會被裁切 */
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

/* 有 teleport 時，已經跑到 body 底下了，用 fixed 對 viewport 定位 */
.modal-overlay.teleported {
  position: fixed;
}

.modal-box {
  background: white;
  padding: 24px;
  border-radius: 8px;
  min-width: 320px;
  max-width: 500px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.modal-box h3 {
  margin-top: 0;
}
</style>

<script setup>
// 1. 定義接收的 props：
// - initialQty (數字，預設值為 1)
// - minQty (數字，預設值為 1)
// - maxQty (數字，預設值為 10)

// 2. 定義要發送的事件：
// - update-quantity：當數量變更時發送

// 3. 實作增加數量的函式

// 4. 實作減少數量的函式

</script>

<template>
  <div class="quantity-adjuster">
    <!-- 5. 加入減少按鈕 -->

    <!-- 6. 顯示目前數量 -->

    <!-- 7. 加入增加按鈕 -->
  </div>
</template>

<style scoped>
.quantity-adjuster {
  display: flex;
  align-items: center;
  gap: 8px;
}

button {
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
}

button:hover {
  background-color: #f0f0f0;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
<template>
  <div class="card">
    <div class="card-header">
      <slot name="header">
        <!-- 預設內容 -->
        <h2>預設標題</h2>
      </slot>
    </div>

    <div class="card-body">
      <!-- 預設 slot（沒有名字的 slot） -->
      <slot>
        <p>預設內容</p>
      </slot>
    </div>

    <div class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>
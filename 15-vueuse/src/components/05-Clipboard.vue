<script setup>
import { ref } from 'vue'
import { useClipboard } from '@vueuse/core'

const sourceText = ref('Hello, VueUse!')

// useClipboard 回傳 { text, copy, copied, isSupported }
// - copy(value?)：呼叫複製（可以指定要複製的值，不指定則用 source）
// - copied：剛剛複製過嗎？（1.5 秒後自動回 false）
// - isSupported：瀏覽器支不支援 Clipboard API
const { copy, copied, isSupported } = useClipboard({ source: sourceText })

const snippets = [
  'npm install @vueuse/core',
  'import { useMouse } from "@vueuse/core"',
  'const isDark = useDark()',
]
</script>

<template>
  <section>
    <h2>5. <code>useClipboard</code> — 複製到剪貼簿</h2>
    <p class="hint">
      包裝瀏覽器原生 <code>Clipboard API</code>，外加「剛剛複製過」狀態提示（1.5 秒自動消失）。
      多數人在「複製連結 / 程式碼片段」按鈕都會用上。
    </p>

    <div class="row">
      <div class="card">
        <h3>用 source 綁定</h3>
        <label>內容：<input v-model="sourceText" /></label>
        <p>
          <button v-if="isSupported" @click="copy()">
            {{ copied ? '✅ 已複製！' : '📋 複製' }}
          </button>
          <span v-else class="hint">瀏覽器不支援 Clipboard API</span>
        </p>
        <p class="hint">點按鈕後 paste 到任何地方驗證。</p>
      </div>

      <div class="card">
        <h3>每按鈕複製不同內容</h3>
        <ul>
          <li v-for="s in snippets" :key="s">
            <code>{{ s }}</code>
            <button @click="copy(s)">複製</button>
          </li>
        </ul>
        <p class="hint">copy() 也可以直接傳值，不一定要用 source。</p>
      </div>
    </div>
  </section>
</template>

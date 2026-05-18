import { defineStore } from 'pinia'

// 與 stores/counter.js 對照：同樣功能，但用 Options API 寫法
// 重點觀察兩者差異：
//   - state 從 ref() 變成回傳物件的 function
//   - getter 從 computed() 變成物件方法，可拿 (state)
//   - action 從一般 function 變成物件方法，用 this.xxx
export const useCounterOptionsStore = defineStore('counterOptions', {
  state: () => ({
    count: 0,
  }),
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++
    },
  },
})

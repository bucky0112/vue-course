Vue.createApp({
  data () {
    return {
      count: 1
    }
  },
  methods: {
    add () {
      // this.count++
      this.count += 2
    },
    minus () {
      this.count--
    }
  }
}).mount('#app')
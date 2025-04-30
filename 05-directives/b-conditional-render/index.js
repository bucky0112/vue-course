Vue.createApp({
  data() {
    return {
      isBoxOpen: false,
      isBoxVisible: true,
      magicPower: 50
    }
  },
  methods: {
    toggleBox() {
      this.isBoxOpen = !this.isBoxOpen
      this.isBoxVisible = !this.isBoxVisible
    }
  }
}).mount('#conditional')

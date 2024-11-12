<script setup>
import { ref } from "vue"
import BlogList from './components/PropsExample/BlogList.vue';
import CardContainer from './components/SlotExample/CardContainer.vue';
import UseItemList from './components/ScopedSlotExample/UseItemList.vue';
import UseLayout from './components/ScopedSlotExample/UseLayout.vue';
import Message from './components/practice_props/Message.vue';
import CollapsePanel from './components/practice_slot/CollapsePanel.vue';
import Counter from './components/emit/Counter.vue';
import FormParent from './components/emit/FormParent.vue';
import Cart from './components/emit/Cart.vue';
import SearchContainer from './components/emit/SearchContainer.vue';

const success = ref("success")
</script>

<template>
  <main>
    <!-- <BlogList /> -->
    <!-- <div>
      <Message type="success" title="成功" content="資料已成功儲存" />
      <Message type="warning" title="注意" content="請確認輸入資料是否正確" />
      <Message type="error" title="錯誤" content="無法連接到伺服器" />
    </div> -->
    <!-- <CardContainer /> -->
    <!-- <UseItemList /> -->
    <!-- <UseLayout /> -->
    <!-- <Counter /> -->
    <!-- <FormParent /> -->
    <!-- <Cart /> -->
    <SearchContainer />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>

<script setup lang="ts">
import Item from "../Item.vue";
import ArrowItem from "../ArrowItem.vue";
import { eventNames } from "node:process";
</script>
<script lang="ts">
export default {
  props: {
    craftable: Object,
    name: String,
  },
  computed: {
    sourceItems(): any[] {
      return this.$props.craftable.sourceItems.map((item: any) => {
        return {
          name: item.name || item,
          requiredAmount: item.requiredAmount || 1,
        };
      });
    },
  },
  methods: {
    craftItem(itemName: string) {
      const ev = new CustomEvent("craft", { detail: itemName });
      dispatchEvent(ev);
    },
  },
};
</script>

<template>
  <div class="crafting-possibility">
    <Item :imageSource="name" imageType="ITEM" @click="craftItem(name)" />
    <ArrowItem />
    <Item
      v-for="item in sourceItems"
      :imageSource="item.name"
      imageType="ITEM"
      :stackSize="item.requiredAmount"
    />
  </div>
</template>
<style scoped>
.crafting-possibility div {
  display: inline-block;
}
</style>

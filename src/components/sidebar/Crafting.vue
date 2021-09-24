<script setup lang="ts">
import { defineComponent } from "@vue/runtime-core";
import CraftingPossibility from "./CraftingPossibility.vue";
</script>
<script lang="ts">
export default defineComponent({
  computed: {
    panel(): string {
      return this.$store.state.panel;
    },
    itemDefinitions(): any {
      return this.$store.state.itemDefinitions.filter((def) => def.craftable);
    },
  },
});
</script>
<template>
  <div v-if="panel === 'crafting'" class="crafting">
    <h1>Crafting</h1>
    <div class="crafting-possibilities">
      <CraftingPossibility v-for="item in itemDefinitions" v-bind="item" />
    </div>
  </div>
</template>

<style scoped>
.crafting {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  padding-right: 17px; /*Increase/decrease this value for cross-browser compatibility */
  box-sizing: content-box; /* So the width will be 100% + 17px */
}
.crafting-possibilities {
  display: flex;
  flex-flow: row wrap;
}

h1 {
  margin: auto;
  text-align: center;
}
</style>

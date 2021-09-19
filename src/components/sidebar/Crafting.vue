<script setup lang="ts">
import CraftingPossibility from "./CraftingPossibility.vue";
</script>
<script lang="ts">
export default {
  computed: {
    panel(): string {
      return this.$store.state.panel;
    },
    itemDefinitions(): any {
      return this.$store.state.itemDefinitions.filter((def) => def.craftable);
    },
  },
};
</script>
<template>
  <div v-if="panel === 'crafting'" class="crafting">
    <div class="crafting-possibilities">
      <CraftingPossibility v-for="item in itemDefinitions" v-bind="item" />
    </div>
  </div>
</template>

<style scoped>
.crafting {
  overflow: auto;
  width: 100vw;
  height: 100%;
}
</style>

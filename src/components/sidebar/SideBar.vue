<script setup lang="ts">
import Controls from "./Controls.vue";
import Building from "./Building.vue";
import Crafting from "./Crafting.vue";
import Inventory from "./Inventory.vue";
import { defineComponent } from "@vue/runtime-core";
import Options from "./Options.vue";
</script>

<script lang="ts">
export default defineComponent({});
</script>

<template>
  <div class="container">
    <Inventory></Inventory>
    <Crafting></Crafting>
    <Building></Building>
    <Options></Options>
  </div>
</template>

<style scoped>
.container div {
  position: relative;
}
.container {
  grid-area: container;
  overflow: hidden;
}
</style>

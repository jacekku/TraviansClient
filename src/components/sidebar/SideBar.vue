<script setup lang="ts">
import Controls from "./Controls.vue";
import Building from "./Building.vue";
import Crafting from "./Crafting.vue";
import Inventory from "./Inventory.vue";
</script>

<template>
  <div class="container">
    <Controls></Controls>
    <Inventory></Inventory>
    <Crafting></Crafting>
    <Building></Building>
  </div>
</template>

<style scoped>
.container div {
  position: absolute;
}
.container {
  grid-area: container;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>

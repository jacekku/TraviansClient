<script setup lang="ts">
import { defineComponent } from "@vue/runtime-core";
import BuildingPossibility from "./BuildingPossibility.vue";
</script>

<script lang="ts">
export default defineComponent({
  computed: {
    panel(): string {
      return this.$store.state.panel;
    },
    buildingDefinitions(): any {
      return this.$store.state.buildingDefinitions;
    },
  },
});
</script>
<template>
  <div v-if="panel === 'building'" class="building">
    <div class="building-possibilities">
      <BuildingPossibility
        v-for="building in buildingDefinitions"
        v-bind="building"
      />
    </div>
  </div>
</template>
<style scoped>
.building {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  padding-right: 17px; /*Increase/decrease this value for cross-browser compatibility */
  box-sizing: content-box; /* So the width will be 100% + 17px */
}
.building-possibilities {
  display: flex;
  flex-wrap: wrap;
}
</style>

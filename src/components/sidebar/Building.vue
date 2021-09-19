<script setup lang="ts">
import BuildingPossibility from "./BuildingPossibility.vue";
</script>

<script lang="ts">
export default {
  computed: {
    panel(): string {
      return this.$store.state.panel;
    },
    buildingDefinitions(): any {
      return this.$store.state.buildingDefinitions;
    },
  },
};
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

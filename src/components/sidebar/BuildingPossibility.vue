<script setup lang="ts">
import Item from "../Item.vue";
import ArrowItem from "../ArrowItem.vue";
</script>

<script lang="ts">
export default {
  props: {
    buildable: Object,
    name: String,
    level: Number,
    craftingFacilities: Object,
    upgrade: Object,
  },
  computed: {
    baseBuilding() {
      const definitions = (this as any).$store.state.buildingDefinitions;
      const upgradedFrom = definitions
        .filter((def: any) => def.upgrade)
        .filter((def: any) => {
          if (def.upgrade.name === this.$props.name) {
            return def;
          }
        });
      return upgradedFrom[0]?.name;
    },
    sourceItems(): any[] {
      return this.$props.buildable.sourceItems.map((item: any) => {
        return {
          name: item.name || item,
          requiredAmount: item.requiredAmount || 1,
        };
      });
    },
  },
};
</script>

<template>
  <div class="building-possibility">
    <Item :imageSource="name" imageType="BUILDING" />
    <div v-if="baseBuilding">
      <ArrowItem />
      <Item :imageSource="baseBuilding" imageType="BUILDING" />
    </div>
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
.building-possibility div {
  display: inline-block;
}
</style>

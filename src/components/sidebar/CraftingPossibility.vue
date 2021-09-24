<script setup lang="ts">
import Item from "../Item.vue";
import { defineComponent } from "@vue/runtime-core";
import {
  Building,
  BuildingDefinition,
  CraftingFacility,
  ItemDefinition,
  Player,
} from "../../model/Models";
import Utilities from "../../Utilities";
</script>
<script lang="ts">
export default defineComponent({
  props: {
    craftable: Object,
    name: String,
  },
  computed: {
    sourceItems(): typeof Item[] {
      return this.$props.craftable.sourceItems.map((item: ItemDefinition) => {
        return {
          name: item.name || item,
          requiredAmount: item.requiredAmount || 1,
        };
      });
    },
    facilitiesNearPlayer(): string[] {
      const buildings: Building[] = this.$store.state.buildings;
      const player: Player = this.$store.state.player;
      return buildings
        .filter((building) => Utilities.objectNearEachOther(building, player))
        .map((building) => building.name);
    },
    collapsedInventory() {
      const items = this.$store.state.items;
      const collapsed: Map<string, number> = new Map();
      items.filter(Boolean).forEach((item) => {
        collapsed.has(item.name)
          ? collapsed.set(item.name, collapsed.get(item.name) + item.stackSize)
          : collapsed.set(item.name, item.stackSize);
      });
      return collapsed;
    },
    facilities(): string[] {
      return this.$store.state.buildingDefinitions
        .filter((building: BuildingDefinition) => building.craftingFacilities)
        .map((building: BuildingDefinition) => {
          return {
            name: building.name,
            craftingFacilities: building.craftingFacilities,
          };
        })
        .filter((building: any) => {
          return building.craftingFacilities.filter(
            (facility: CraftingFacility) =>
              this.craftable.facility.find((f: string) => f == facility.name)
          ).length;
        })
        .map((building: any) => building.name);
    },
  },
  methods: {
    craftItem(itemName: string) {
      const ev = new CustomEvent("craft", { detail: itemName });
      dispatchEvent(ev);
    },
  },
});
</script>

<template>
  <div class="crafting-possibility">
    {{ name }}
    <Item :imageSource="name" imageType="ITEM" @click="craftItem(name)" />
    source items:
    <div class="source-items">
      <Item
        v-for="item in sourceItems"
        :imageSource="item.name"
        imageType="ITEM"
        :stackSize="item.requiredAmount"
        :class="
          collapsedInventory.get(item.name) >= item.requiredAmount
            ? ''
            : 'inactive'
        "
      />
    </div>
    facilities:
    <div class="facilities">
      <Item
        v-for="facility in facilities"
        :imageSource="facility"
        imageType="BUILDING"
        :class="facilitiesNearPlayer.includes(facility) ? '' : 'inactive'"
      />
    </div>
  </div>
</template>
<style scoped>
.crafting-possibility {
  border: 1px solid black;
  width: 33%;
}
.source-items,
.facilities {
  display: flex;
  flex-flow: row wrap;
}

.crafting-possibility:hover {
  background-color: rgba(0, 0, 0, 0.2);
}
</style>

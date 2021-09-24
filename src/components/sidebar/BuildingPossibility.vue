<script setup lang="ts">
import Item from "../Item.vue";
import ArrowItem from "../ArrowItem.vue";
import { Building, Player, PlayerState } from "../../model/Models";
import Utilities from "../../Utilities";
import { defineComponent } from "@vue/runtime-core";
import { MUTATION_TYPE } from "../../types";
</script>

<script lang="ts">
export default defineComponent({
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
  },
  methods: {
    build(buildingName: string) {
      this.$store.commit(MUTATION_TYPE.setPlayerState, {
        state: "building",
        detail: { building: buildingName },
      } as PlayerState);
    },
  },
});
</script>

<template>
  <div class="building-possibility">
    {{ name }}
    <Item :imageSource="name" imageType="BUILDING" @click="build(name)" />
    <div v-if="baseBuilding">
      upgrade from:
      <Item
        :imageSource="baseBuilding"
        imageType="BUILDING"
        :class="facilitiesNearPlayer.includes(baseBuilding) ? '' : 'inactive'"
      />
    </div>
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
  </div>
</template>

<style scoped>
.building-possibility {
  border: 1px solid black;
  width: 33%;
}
.source-items {
  display: flex;
}
</style>

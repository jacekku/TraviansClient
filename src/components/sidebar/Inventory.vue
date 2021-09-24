<script setup lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { getImage, ImageType } from "../../imageUtils";
import { Equiped } from "../../model/Models";
import Item from "../Item.vue";
</script>

<script lang="ts">
export default defineComponent({
  data() {
    return {
      equiped: {
        chest: {},
        legs: {},
        pauldrons: {},
        head: {},
        gauntlets: {},
        cape: {},
        shirt: {},
        boots: {},
        mainhand: {},
        offhand: {},
        trinket: {},
        ring: {},
      },
      items: Array.from({ length: 16 }, () => {
        return { name: "blank" };
      }),
      selectedItem: { item: { name: "", equipable: {} }, type: "" },
    };
  },
  computed: {
    panel(): string {
      return this.$store.state.panel;
    },
    playerItems() {
      return this.$store.state.items || (this.$data as any).items;
    },
    playerEquiped(): any {
      return this.$store.state.equiped || (this.$data as any).equiped;
    },
  },
  methods: {
    imagePath(name: string) {
      return getImage(name, "placeholder" as ImageType);
    },
    selectItem(item: any, type: "item" | "equipment") {
      this.selectedItem = {
        item,
        type,
      };
    },
    emitEvent(event: string, detail: any) {
      const ev = new CustomEvent(event, { detail });
      dispatchEvent(ev);
    },
  },
});
</script>
<template>
  <div v-if="panel === 'inventory'" class="inventory">
    <div class="character">
      <Item
        v-for="type in Object.keys(playerEquiped)"
        :className="type"
        :imageSource="playerEquiped[type].name || type"
        :imageType="playerEquiped[type].name ? 'items' : 'placeholder'"
        @click="selectItem(playerEquiped[type], 'equipment')"
      ></Item>
    </div>
    <div class="items">
      <Item
        v-for="(item, index) in playerItems"
        :imageSource="item?.name || 'blank'"
        :id="index.toString()"
        :stackSize="item?.stackSize || 0"
        imageType="items"
        @click="selectItem(item, 'item')"
      ></Item>
    </div>
    <div v-if="selectedItem?.item?.name" class="item-details">
      <p>{{ selectedItem.item.name }}</p>
      <p>{{ selectedItem.type }}</p>
      <button
        v-if="selectedItem.item.equipable && selectedItem.type == 'item'"
        @click="emitEvent('equip', selectedItem.item.name)"
      >
        EQUIP
      </button>
      <button
        v-if="selectedItem.item.equipable && selectedItem.type == 'equipment'"
        @click="emitEvent('unequip', selectedItem.item.name)"
      >
        UNEQUIP
      </button>
    </div>
  </div>
</template>

<style scoped>
.craft-possibility {
  border: 1px solid gray;
  display: flex;
}

.crafting {
  width: inherit;
  height: inherit;
  overflow: hidden;
}
.items {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  gap: 0px 0px;
  grid-template-areas:
    ". . . ."
    ". . . ."
    ". . . ."
    ". . . .";
}

.character {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  gap: 0px 0px;
  grid-auto-flow: row;
  grid-template-areas:
    "pauldrons head gauntlets"
    "cape chest shirt"
    "boots legs ring"
    "trinket mainhand offhand";
  grid-area: character;
}

.inventory {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0px 0px;
  grid-auto-flow: row;
  grid-template-areas: "character" "items" "item-details";
}
.item-details {
  grid-area: item-details;
}

.character div {
  border: 1px solid red;
}

.items {
  grid-area: items;
}

.chest {
  grid-area: chest;
}

.legs {
  grid-area: legs;
}

.mainhand {
  grid-area: mainhand;
}

.pauldrons {
  grid-area: pauldrons;
}

.head {
  grid-area: head;
}

.gauntlets {
  grid-area: gauntlets;
}

.cape {
  grid-area: cape;
}

.shirt {
  grid-area: shirt;
}

.boots {
  grid-area: boots;
}

.offhand {
  grid-area: offhand;
}

.trinket {
  grid-area: trinket;
}

.ring {
  grid-area: ring;
}
</style>

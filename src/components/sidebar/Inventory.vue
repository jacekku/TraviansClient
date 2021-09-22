<script setup lang="ts">
import Item from "../Item.vue";
</script>

<script lang="ts">
export default {
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
    };
  },

  computed: {
    panel(): string {
      return this.$store.state.panel;
    },
    playerItems() {
      return this.$store.state.player?.inventory?.items || this.$data.items;
    },
    playerEquiped() {
      return this.$store.state.player?.inventory?.equiped || this.$data.equiped;
    },
  },
  methods: {
    imagePath(name: string) {
      return `src/assets/items/placeholder/${name}.png`;
    },
  },
};
</script>
<template>
  <div v-if="panel === 'inventory'" class="inventory">
    <div class="character">
      <Item
        v-for="type in Object.keys(playerEquiped)"
        :className="type"
        :imageSource="playerEquiped[type]?.name || type"
        :imageType="playerEquiped[type].name ? 'ITEM' : 'PLACEHOLDER'"
      ></Item>
    </div>
    <div class="items">
      <Item
        v-for="(item, index) in playerItems"
        :imageSource="item?.name || 'blank'"
        :id="index"
        :stackSize="item?.stackSize || 0"
        imageType="ITEM"
      ></Item>
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
  grid-template-areas: "character" "items";
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

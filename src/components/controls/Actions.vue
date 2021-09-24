<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { Directions } from "../../model/Models";
import { MUTATION_TYPE } from "../../types";
import Utilities from "../../Utilities";

export default defineComponent({
  data() {
    return {
      directions: [
        { direction: "left", method: () => this.selectBlock("left") },
        { direction: "right", method: () => this.selectBlock("right") },
        { direction: "up", method: () => this.selectBlock("up") },
        { direction: "down", method: () => this.selectBlock("down") },
        { direction: "up-left", method: () => this.selectBlock("up-left") },
        { direction: "up-right", method: () => this.selectBlock("up-right") },
        {
          direction: "down-left",
          method: () => this.selectBlock("down-left"),
        },
        {
          direction: "down-right",
          method: () => this.selectBlock("down-right"),
        },
      ],
    };
  },
  methods: {
    selectBlock(direction: Directions) {
      const player = this.$store.state.player;
      const chunks = this.$store.state.chunks;
      const terrain = this.$store.state.terrain;
      const buildings = this.$store.state.buildings;
      const { block, building } = Utilities.selectBlock(
        player,
        terrain,
        chunks,
        buildings,
        direction
      );
      this.$store.commit(MUTATION_TYPE.setSelectedBlock, block);
      this.$store.commit(MUTATION_TYPE.setSelectedBuilding, building);
    },
  },
});
</script>

<template>
  <div class="actions">
    <div
      v-for="dir in directions"
      v-bind:class="dir.direction"
      @click="dir.method"
    >
      <img src="src/assets/movement-cardinal.png" />
    </div>
  </div>
</template>

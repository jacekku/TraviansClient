<script lang="ts">
import { MUTATION_TYPE } from "../../types";

export default {
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
    findBlockByXY(blockX: number, blockY: number, terrain: any, chunks: any[]) {
      const chunkX = Math.floor(blockX / terrain.chunkSize) * terrain.chunkSize;
      const chunkY = Math.floor(blockY / terrain.chunkSize) * terrain.chunkSize;
      const chunk = chunks.find((ch) => ch.x === chunkX && ch.y === chunkY);
      return chunk.blocks.find(
        (block: any) => block.x === blockX && block.y === blockY
      );
    },

    findBuilding(blockX: number, blockY: number, buildings: any[]) {
      return buildings.find(
        (building) => building.x == blockX && building.y == blockY
      );
    },

    selectBlock(direction: string) {
      let { x, y } = this.$store.state.player;
      const chunks = this.$store.state.chunks;
      const terrain = this.$store.state.terrain;
      const nMap = {
        "up-left": [-1, -1],
        up: [0, -1],
        "up-right": [1, -1],
        left: [-1, 0],
        right: [1, 0],
        "down-left": [-1, 1],
        down: [0, 1],
        "down-right": [1, 1],
      };
      const dir = nMap[direction];
      if (!dir) return;
      x += dir[0];
      y += dir[1];
      const block = this.findBlockByXY(x, y, terrain, chunks);
      this.$store.commit(MUTATION_TYPE.setSelectedBlock, block);
      const buildings = this.$store.state.buildings;
      const building = this.findBuilding(x, y, buildings);
      this.$store.commit(MUTATION_TYPE.setSelectedBuilding, building);
    },
  },
};
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
